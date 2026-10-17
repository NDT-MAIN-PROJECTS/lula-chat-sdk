/** Public discovery data. Private keys and shared secrets stay outside this store. */
export type OmemoDiscoverySnapshot = {
    fetchedAt: number;
    devices: Array<{
        deviceId: number;
        identityKey: string;
    }>;
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
export declare function createInMemoryOmemoDiscoveryCache(): OmemoDiscoveryCacheStore;
export declare function createStoredOmemoDiscoveryCache(storage: KeyValueStore, prefix: string, onError: (error: unknown) => void): OmemoDiscoveryCacheStore;
/** Coalesce complete refreshes and discard responses superseded by change events. */
export declare function createOmemoDiscoveryReader(store: OmemoDiscoveryCacheStore, options: {
    refreshAfterMs: number;
    maxAgeMs: number;
}): {
    refresh: (owner: string, peer: string, fetch: () => Promise<OmemoDiscoverySnapshot>) => Promise<OmemoDiscoverySnapshot>;
    get(owner: string, peer: string, fetch: () => Promise<OmemoDiscoverySnapshot>, onRefreshError: (error: unknown) => void): Promise<OmemoDiscoverySnapshot>;
    invalidate(owner: string, peer: string): boolean;
    reset(): void;
};
export {};
//# sourceMappingURL=omemoDiscoveryCache.d.ts.map