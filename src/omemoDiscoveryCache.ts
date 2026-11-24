/** Public discovery data. Private keys and shared secrets stay outside this store. */
export type OmemoDiscoverySnapshot = {
  fetchedAt: number;
  devices: Array<{ deviceId: number; identityKey: string }>;
};

export type OmemoDiscoveryCacheStore = {
  get(owner: string, peer: string): OmemoDiscoverySnapshot | undefined;
  set(owner: string, peer: string, snapshot: OmemoDiscoverySnapshot): void;
  remove(owner: string, peer: string): void;
  clear(owner?: string): void;
  load?: (owner: string) => Promise<void>;
  peers?: (owner: string) => string[];
};

type KeyValueStore = {
  getItem(key: string): Promise<string | null | undefined> | string | null | undefined;
  setItem(key: string, value: string): Promise<void> | void;
};

const MAX_CACHE_ENTRIES = 128;

export function createInMemoryOmemoDiscoveryCache(): OmemoDiscoveryCacheStore {
  const entries = new Map<string, { owner: string; peer: string; snapshot: OmemoDiscoverySnapshot }>();
  const key = (owner: string, peer: string) => JSON.stringify([owner, peer]);
  return {
    get: (owner, peer) => entries.get(key(owner, peer))?.snapshot,
    set(owner, peer, snapshot) {
      const entryKey = key(owner, peer);
      entries.delete(entryKey);
      entries.set(entryKey, { owner, peer, snapshot });
      if (entries.size > MAX_CACHE_ENTRIES) entries.delete(entries.keys().next().value!);
    },
    remove: (owner, peer) => { entries.delete(key(owner, peer)); },
    clear(owner) {
      if (owner === undefined) entries.clear();
      else for (const [entryKey, entry] of entries) {
        if (entry.owner === owner) entries.delete(entryKey);
      }
    },
    peers: (owner) => Array.from(entries.values()).filter((entry) => entry.owner === owner).map((entry) => entry.peer),
  };
}

export function createStoredOmemoDiscoveryCache(
  storage: KeyValueStore,
  prefix: string,
  onError: (error: unknown) => void,
): OmemoDiscoveryCacheStore {
  const memory = createInMemoryOmemoDiscoveryCache();
  const loads = new Map<string, Promise<void>>();
  const writes = new Map<string, Promise<void>>();
  const storageKey = (owner: string) => `${prefix}:discovery:${owner}`;
  const persist = (owner: string) => {
    const entries = memory.peers!(owner).map((peer) => [peer, memory.get(owner, peer)]);
    const value = JSON.stringify({ version: 1, entries });
    const write = (writes.get(owner) ?? Promise.resolve())
      .then(() => storage.setItem(storageKey(owner), value))
      .catch(onError)
      .finally(() => { if (writes.get(owner) === write) writes.delete(owner); });
    writes.set(owner, write);
  };
  return {
    ...memory,
    load(owner) {
      const existing = loads.get(owner);
      if (existing) return existing;
      const load = (async () => {
        const raw = await storage.getItem(storageKey(owner));
        if (!raw || raw.length > 2_000_000) return;
        const parsed = JSON.parse(raw);
        if (parsed?.version !== 1 || !Array.isArray(parsed.entries)) return;
        for (const entry of parsed.entries.slice(-MAX_CACHE_ENTRIES)) {
          if (!Array.isArray(entry) || entry.length !== 2) continue;
          const [peer, snapshot] = entry;
          if (typeof peer !== "string" || peer.length > 1024 || !peer.includes("@")) continue;
          if (!snapshot || !Number.isFinite(snapshot.fetchedAt) || !Array.isArray(snapshot.devices)) continue;
          if (!snapshot.devices.length || snapshot.devices.length > 128) continue;
          if (!snapshot.devices.every((device: OmemoDiscoverySnapshot["devices"][number]) =>
            device && Number.isSafeInteger(device.deviceId) && device.deviceId > 0 &&
            typeof device.identityKey === "string" && /^[A-Za-z0-9+/]{43}=$/.test(device.identityKey))) continue;
          memory.set(owner, peer, snapshot);
        }
      })().catch(onError);
      loads.set(owner, load);
      return load;
    },
    set(owner, peer, snapshot) { memory.set(owner, peer, snapshot); persist(owner); },
    remove(owner, peer) { memory.remove(owner, peer); persist(owner); },
    clear(owner) {
      const owners = owner === undefined ? Array.from(loads.keys()) : [owner];
      memory.clear(owner);
      for (const account of owners) persist(account);
    },
  };
}

/** Coalesce complete refreshes and discard responses superseded by change events. */
export function createOmemoDiscoveryReader(
  store: OmemoDiscoveryCacheStore,
  options: { refreshAfterMs: number; maxAgeMs: number },
) {
  const flights = new Map<string, Promise<OmemoDiscoverySnapshot>>();
  const versions = new Map<string, number>();
  const verified = new Set<string>();
  let epoch = 0;
  const key = (owner: string, peer: string) => JSON.stringify([owner, peer]);

  const refresh = (
    owner: string,
    peer: string,
    fetch: () => Promise<OmemoDiscoverySnapshot>,
  ): Promise<OmemoDiscoverySnapshot> => {
    const entryKey = key(owner, peer);
    const existing = flights.get(entryKey);
    if (existing) return existing;
    const startedEpoch = epoch;
    const flight = (async () => {
      await store.load?.(owner);
      for (let attempt = 0; attempt < 3; attempt += 1) {
        if (startedEpoch !== epoch) throw new Error("xmpp_omemo_cache_reset");
        const version = versions.get(entryKey) ?? 0;
        const snapshot = await fetch();
        if (startedEpoch !== epoch) throw new Error("xmpp_omemo_cache_reset");
        if (version !== (versions.get(entryKey) ?? 0)) continue;
        store.set(owner, peer, snapshot);
        verified.add(entryKey);
        versions.delete(entryKey);
        return snapshot;
      }
      throw new Error("xmpp_omemo_devices_changed_during_discovery");
    })().finally(() => {
      if (flights.get(entryKey) === flight) {
        flights.delete(entryKey);
        versions.delete(entryKey);
      }
    });
    flights.set(entryKey, flight);
    return flight;
  };

  return {
    refresh,
    async get(
      owner: string,
      peer: string,
      fetch: () => Promise<OmemoDiscoverySnapshot>,
      onRefreshError: (error: unknown) => void,
    ): Promise<OmemoDiscoverySnapshot> {
      await store.load?.(owner);
      const snapshot = store.get(owner, peer);
      const age = snapshot ? Date.now() - snapshot.fetchedAt : Infinity;
      if (snapshot && verified.has(key(owner, peer)) && age >= 0 && age < options.maxAgeMs) {
        if (age >= options.refreshAfterMs) void refresh(owner, peer, fetch).catch(onRefreshError);
        return snapshot;
      }
      return refresh(owner, peer, fetch);
    },
    invalidate(owner: string, peer: string): boolean {
      const entryKey = key(owner, peer);
      const cached = Boolean(store.get(owner, peer));
      verified.delete(entryKey);
      if (!cached && !flights.has(entryKey)) return false;
      if (cached) store.remove(owner, peer);
      if (flights.has(entryKey)) versions.set(entryKey, (versions.get(entryKey) ?? 0) + 1);
      return true;
    },
    reset() {
      epoch += 1;
      flights.clear();
      versions.clear();
      verified.clear();
    },
  };
}
