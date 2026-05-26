// src/index.ts
import { gcm } from "@noble/ciphers/aes.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { client as createXmppClient, xml } from "@xmpp/client";
import saslMechanisms from "saslmechanisms";
var chatResources = [
  "server-client",
  "ios-primary-client",
  "android-primary-client",
  "ios-secondary-client",
  "android-secondary-client"
];
var XMPP_CHAT_NS = "urn:lula:defy:chat:1";
var XMPP_RECEIPTS_NS = "urn:xmpp:receipts";
var XMPP_CHAT_MARKERS_NS = "urn:xmpp:chat-markers:0";
var XMPP_CHATSTATES_NS = "http://jabber.org/protocol/chatstates";
var OMEMO_NS = "eu.siacs.conversations.axolotl";
var OMEMO_DEVICELIST_NODE = "eu.siacs.conversations.axolotl.devicelist";
var OMEMO_BUNDLE_NODE_PREFIX = "eu.siacs.conversations.axolotl.bundles:";
var OMEMO_AES_KEY_BYTES = 16;
var OMEMO_KEY_WRAP_BYTES = 16;
var OMEMO_KEY_WRAP_BUNDLE_BYTES = OMEMO_KEY_WRAP_BYTES * 2;
var OMEMO_INFO = new TextEncoder().encode("lula-defy-omemo-v1");
var OMEMO_WRAP_INFO = new TextEncoder().encode("lula-defy-omemo-wrap-v1");
var PUBSUB_NS = "http://jabber.org/protocol/pubsub";
var XDATA_NS = "jabber:x:data";
var DEFAULT_CONNECT_TIMEOUT_MS = 15e3;
var DEFAULT_IQ_TIMEOUT_MS = 15e3;
var DEFAULT_TYPING_AUTO_PAUSE_MS = 1e4;
var DEFAULT_OMEMO_STATE_KEY_PREFIX = "chat_sdk_omemo_state";
var DEFAULT_XMPP_WEBSOCKET_PATH = "/chat/websocket";
var XOauth2Mechanism = class {
  name = "X-OAUTH2";
  clientFirst = true;
  response({
    username,
    password
  }) {
    return `\0${String(username || "")}\0${String(password || "")}`;
  }
  challenge() {
    return this;
  }
};
var xOAuth2Registered = false;
function registerXOAuth2Preference() {
  if (xOAuth2Registered) return;
  const moduleValue = saslMechanisms;
  const Factory = moduleValue.Factory ?? moduleValue.default?.Factory;
  const prototype = Factory?.prototype;
  const originalUse = prototype?.use;
  if (!prototype || typeof originalUse !== "function") return;
  prototype.use = function patchedUse() {
    const result = originalUse.apply(this, arguments);
    const index = this._mechs?.findIndex(
      (entry) => String(entry?.name || "").toUpperCase() === "X-OAUTH2"
    );
    if (typeof index === "number" && index > 0) {
      const [entry] = this._mechs.splice(index, 1);
      if (entry) this._mechs.unshift(entry);
    }
    return result;
  };
  xOAuth2Registered = true;
}
function init(config) {
  return new LulaChatClient(config);
}
function createChatClient(config) {
  return init(config);
}
function createRoomDirectory(options) {
  const roomCache = /* @__PURE__ */ new Map();
  const rememberRoom = (room) => {
    roomCache.set(room.roomId, room);
    if (room.id) roomCache.set(room.id, room);
    return room;
  };
  return {
    getPeerDeviceIds: async (roomId) => {
      const normalizedRoomId = roomId.trim();
      if (!normalizedRoomId) return [];
      const cached = roomCache.get(normalizedRoomId);
      if (cached?.peerDeviceIds?.length) return cached.peerDeviceIds;
      if (!options.getRoom) return [];
      const room = normalizeChatRoomResponse(await options.getRoom(normalizedRoomId), options);
      return rememberRoom(room).peerDeviceIds ?? [];
    },
    getOrCreateRoom: options.getOrCreateRoom ? async (input) => {
      const room = normalizeChatRoomResponse(await options.getOrCreateRoom(input), options);
      return rememberRoom(room);
    } : void 0
  };
}
var LulaChatClient = class {
  config;
  messageListeners = /* @__PURE__ */ new Set();
  typingListeners = /* @__PURE__ */ new Set();
  deliveryListeners = /* @__PURE__ */ new Set();
  errorListeners = /* @__PURE__ */ new Set();
  statusListeners = /* @__PURE__ */ new Set();
  xmpp = null;
  status = "idle";
  connectPromise = null;
  pendingIqMap = /* @__PURE__ */ new Map();
  onlineDeviceId;
  roomPeers = /* @__PURE__ */ new Map();
  typingAutoPauseTimers = /* @__PURE__ */ new Map();
  constructor(config) {
    this.config = normalizeConfig(config);
  }
  async connect() {
    if (this.status === "online" && this.xmpp) return;
    if (this.connectPromise) return this.connectPromise;
    this.connectPromise = this.connectFresh();
    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }
  async stop() {
    this.setStatus("stopping");
    for (const timer of this.typingAutoPauseTimers.values()) {
      clearTimeout(timer);
    }
    this.typingAutoPauseTimers.clear();
    const current = this.xmpp;
    this.xmpp = null;
    this.onlineDeviceId = void 0;
    if (current) {
      await current.stop();
    }
    this.setStatus("offline");
  }
  async getPeerDeviceIds(roomId) {
    return this.resolveRoomDeviceIds(roomId);
  }
  async getOrCreateRoom(inputOrUserId, metadata) {
    const input = typeof inputOrUserId === "string" ? { userId: inputOrUserId, metadata } : inputOrUserId;
    return this.resolveRoomForUserId(input);
  }
  async sendChatMessage(inputOrRoomId, body, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, body: body ?? "" } : inputOrRoomId;
    const metadata = buildChatMessageMetadata({
      ...input,
      displayName: this.config.displayName
    });
    const providerChatRoomId = extractProviderChatRoomId(metadata);
    return this.sendMessage({
      ...input,
      metadata,
      targetRoomId: input.targetRoomId ?? providerChatRoomId ?? input.roomId
    });
  }
  async sendFormSubmission(input) {
    const metadata = buildFormSubmissionMetadata({
      ...input,
      displayName: this.config.displayName
    });
    const providerChatRoomId = extractProviderChatRoomId(metadata);
    return this.sendMessage({
      ...pickMessageTargetInput(input),
      body: JSON.stringify(input.payload, null, input.pretty ? 2 : void 0),
      metadata,
      targetRoomId: input.targetRoomId ?? providerChatRoomId ?? input.roomId
    });
  }
  async sendMessage(inputOrRoomId, body, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, body: body ?? "" } : inputOrRoomId;
    const messageBody = input.body ?? "";
    if (!messageBody.trim()) throw new Error("chat_body_required");
    await this.connect();
    const xmpp = this.requireXmpp();
    const id = input.id || generateMessageId();
    const roomId = input.roomId?.trim();
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId: targetRoomId,
      explicitDeviceIds: collectTargetDeviceIds(input)
    });
    await this.sendToTargets(targetDeviceIds, async (toDeviceId) => {
      const encodedPayload = await this.encodePayload({
        toDeviceId,
        body: messageBody,
        metadata: input.metadata
      });
      const children = [
        xml("body", {}, encodedPayload.body ?? messageBody),
        ...encodedPayload.children
      ];
      if (roomId) children.push(xml("thread", {}, roomId));
      if (input.requestReceipt !== false) {
        children.push(xml("request", { xmlns: XMPP_RECEIPTS_NS }));
        children.push(xml("markable", { xmlns: XMPP_CHAT_MARKERS_NS }));
      }
      await xmpp.send(xml("message", { to: toDeviceId, type: "chat", id }, ...children));
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId && targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
    }
    return id;
  }
  async sendTyping(inputOrRoomId, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const isTyping = input.isTyping ?? true;
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input)
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    this.clearTypingAutoPause(roomId);
    await this.connect();
    const children = [];
    children.push(xml("thread", {}, roomId));
    children.push(xml(isTyping ? "composing" : "paused", { xmlns: XMPP_CHATSTATES_NS }));
    await this.sendToTargets(
      targetDeviceIds,
      (toDeviceId) => this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: "chat",
          id: input.id || `typing-${Date.now()}`
        }, ...children)
      )
    );
    if (isTyping) {
      this.scheduleTypingAutoPause(roomId, input.autoPauseMs ?? DEFAULT_TYPING_AUTO_PAUSE_MS);
    }
  }
  async sendDisplayed(inputOrRoomId, messageId, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, messageId: messageId ?? "" } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.messageId.trim()) throw new Error("chat_message_id_required");
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input)
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    await this.connect();
    const children = [
      xml("displayed", { xmlns: XMPP_CHAT_MARKERS_NS, id: input.messageId })
    ];
    children.unshift(xml("thread", {}, roomId));
    await this.sendToTargets(
      targetDeviceIds,
      (toDeviceId) => this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: "chat",
          id: input.id || `displayed-${Date.now()}`
        }, ...children)
      )
    );
  }
  markRead(inputOrRoomId, messageId, options) {
    return typeof inputOrRoomId === "string" ? this.sendDisplayed(inputOrRoomId, messageId ?? "", options) : this.sendDisplayed(inputOrRoomId);
  }
  onMessage(listener) {
    return addListener(this.messageListeners, listener);
  }
  onChatMessage(listener) {
    return this.onMessage((message) => {
      if (isFormSubmissionMessage(message)) return;
      listener(toChatTextMessage(message));
    });
  }
  onFormSubmission(listener) {
    return this.onMessage((message) => {
      const parsed = parseFormSubmissionMessage(message);
      if (parsed) listener(parsed);
    });
  }
  onTyping(listener) {
    return addListener(this.typingListeners, listener);
  }
  onDelivery(listener) {
    return addListener(this.deliveryListeners, listener);
  }
  onError(listener) {
    return addListener(this.errorListeners, listener);
  }
  onStatus(listener) {
    const unsubscribe = addListener(this.statusListeners, listener);
    listener({
      status: this.status,
      deviceId: this.onlineDeviceId
    });
    return unsubscribe;
  }
  getStatus() {
    return this.status;
  }
  getDeviceId() {
    return this.onlineDeviceId ?? this.config.deviceId;
  }
  getBareDeviceId() {
    return normalizeBareDeviceId(this.getDeviceId());
  }
  async connectFresh() {
    this.setStatus("connecting");
    if (this.config.authType === "x-oauth2") {
      registerXOAuth2Preference();
    }
    const xmpp = createXmppClient({
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      credentials: this.createCredentials()
    });
    this.xmpp = xmpp;
    if (this.config.authType === "x-oauth2") {
      registerXOAuth2OnClient(xmpp);
    }
    this.bindXmppEvents(xmpp);
    try {
      await withTimeout(
        xmpp.start(),
        this.config.connectTimeoutMs,
        "chat_connect_timeout"
      );
    } catch (error) {
      this.xmpp = null;
      this.setStatus("error", error);
      await safeStop(xmpp);
      throw error;
    }
  }
  createCredentials() {
    const username = this.config.username;
    const secret = this.config.password;
    if (!secret) return { username };
    if (this.config.authType === "x-oauth2") {
      return async (authenticate, mechanisms) => {
        const picked = pickMechanism(mechanisms, ["X-OAUTH2"]);
        if (!picked) {
          throw new Error(`chat_no_usable_auth_mechanism:${mechanisms.join(",")}`);
        }
        await authenticate(
          { username, password: secret },
          picked,
          xml("user-agent", { id: "lulafi-chat-sdk" })
        );
      };
    }
    return async (authenticate, mechanisms, _fast, _entity) => {
      const preferred = ["SCRAM-SHA-1", "ANONYMOUS"];
      const picked = pickMechanism(mechanisms, preferred);
      if (!picked) {
        throw new Error(`chat_no_usable_auth_mechanism:${mechanisms.join(",")}`);
      }
      await authenticate(
        { username, password: secret },
        picked,
        xml("user-agent", { id: "lulafi-chat-sdk" })
      );
    };
  }
  bindXmppEvents(xmpp) {
    xmpp.on("online", async (address) => {
      this.onlineDeviceId = addressToString(address) ?? this.config.deviceId;
      this.setStatus("online");
      await xmpp.send(xml("presence"));
      try {
        await this.config.encryption?.onConnect?.(this.getEncryptionContext());
      } catch (error) {
        this.emit(this.errorListeners, { error });
      }
    });
    xmpp.on("offline", () => {
      this.setStatus("offline");
      this.onlineDeviceId = void 0;
      this.rejectPendingIq(new Error("chat_iq_offline"));
    });
    xmpp.on("error", (error) => {
      this.emit(this.errorListeners, { error });
      this.setStatus("error", error);
    });
    xmpp.on("stanza", (stanza) => {
      this.handleStanza(stanza).catch((error) => {
        this.emit(this.errorListeners, { error, raw: stanza });
      });
    });
  }
  async handleStanza(stanza) {
    this.resolvePendingIq(stanza);
    if (!stanza.is?.("message")) return;
    const attrs = stanza.attrs ?? {};
    const fromDeviceId = normalizeBareDeviceId(attrs.from) || attrs.from || "";
    const toDeviceId = attrs.to ? normalizeBareDeviceId(attrs.to) || attrs.to : void 0;
    const roomId = trimToUndefined(stanza.getChildText?.("thread") ?? void 0);
    this.rememberRoomPeer(roomId, fromDeviceId);
    const receipt = stanza.getChild?.("received", XMPP_RECEIPTS_NS);
    const markerReceived = stanza.getChild?.("received", XMPP_CHAT_MARKERS_NS);
    const displayed = stanza.getChild?.("displayed", XMPP_CHAT_MARKERS_NS);
    const receiptId = receipt?.attrs?.id ?? markerReceived?.attrs?.id;
    if (receiptId) {
      this.emit(this.deliveryListeners, {
        id: receiptId,
        fromDeviceId,
        toDeviceId,
        roomId,
        status: "delivered",
        raw: stanza
      });
      return;
    }
    if (displayed?.attrs?.id) {
      this.emit(this.deliveryListeners, {
        id: displayed.attrs.id,
        fromDeviceId,
        toDeviceId,
        roomId,
        status: "read",
        raw: stanza
      });
      return;
    }
    if (attrs.type === "error") {
      const errorEvent = parseStanzaError(stanza);
      this.emit(this.errorListeners, {
        ...errorEvent,
        id: attrs.id,
        fromDeviceId,
        toDeviceId,
        roomId,
        raw: stanza
      });
      return;
    }
    const composing = stanza.getChild?.("composing", XMPP_CHATSTATES_NS);
    const paused = stanza.getChild?.("paused", XMPP_CHATSTATES_NS);
    if (composing || paused) {
      this.emit(this.typingListeners, {
        fromDeviceId,
        toDeviceId,
        roomId,
        isTyping: Boolean(composing),
        raw: stanza
      });
    }
    const decoded = await this.decodePayload(stanza);
    const body = decoded.body;
    if (!body.trim()) return;
    this.emit(this.messageListeners, {
      id: attrs.id || generateMessageId(),
      fromDeviceId,
      toDeviceId,
      roomId,
      body,
      timestamp: parseDelayTimestamp(stanza) ?? parseMetadataTimestamp(decoded.metadata) ?? Date.now(),
      metadata: decoded.metadata,
      raw: stanza
    });
    const receiptRequest = stanza.getChild?.("request", XMPP_RECEIPTS_NS);
    if (attrs.id && receiptRequest && fromDeviceId) {
      await this.sendReceipt({ toDeviceId: fromDeviceId, roomId, messageId: attrs.id });
    }
  }
  async sendReceipt(input) {
    const children = [
      xml("received", { xmlns: XMPP_RECEIPTS_NS, id: input.messageId })
    ];
    if (input.roomId) children.unshift(xml("thread", {}, input.roomId));
    await this.requireXmpp().send(
      xml("message", {
        to: input.toDeviceId,
        type: "chat",
        id: `rcpt-${Date.now()}`
      }, ...children)
    );
  }
  getEncryptionContext() {
    return {
      getDeviceId: () => this.getDeviceId(),
      getBareDeviceId: () => this.getBareDeviceId(),
      sendIq: (input) => this.sendIq(input),
      logger: this.config.logger
    };
  }
  rememberRoomPeer(roomId, peerDeviceId) {
    const normalizedRoomId = roomId?.trim();
    const normalizedPeerDeviceId = normalizeBareDeviceId(peerDeviceId);
    if (!normalizedRoomId || !normalizedPeerDeviceId) return;
    if (normalizedPeerDeviceId === this.getBareDeviceId()) return;
    const peers = this.roomPeers.get(normalizedRoomId) ?? /* @__PURE__ */ new Set();
    peers.add(normalizedPeerDeviceId);
    this.roomPeers.set(normalizedRoomId, peers);
  }
  rememberRoomPeers(roomId, peerDeviceIds) {
    peerDeviceIds?.forEach((peerDeviceId) => this.rememberRoomPeer(roomId, peerDeviceId));
  }
  async resolveRoomForUserId(input) {
    const userId = input.userId.trim();
    if (!userId) throw new Error("chat_user_id_required");
    const provider = this.config.roomDirectory?.getOrCreateRoom;
    if (!provider) throw new Error("chat_room_directory_get_or_create_required");
    const room = await provider({ userId, metadata: input.metadata });
    const normalizedRoomId = room.roomId.trim();
    if (!normalizedRoomId) throw new Error("chat_room_id_required");
    this.rememberRoomPeers(normalizedRoomId, room.peerDeviceIds);
    return { ...room, roomId: normalizedRoomId };
  }
  async resolveRoomTargets(input) {
    const explicit = normalizeDeviceIdList(input.explicitDeviceIds ?? []);
    if (input.roomId) this.rememberRoomPeers(input.roomId, explicit);
    const resolverDeviceIds = input.roomId ? await this.getPeerDeviceIds(input.roomId) : [];
    const cachedDeviceIds = input.roomId ? this.getCachedRoomPeers(input.roomId) : [];
    const targets = normalizeDeviceIdList([
      ...explicit,
      ...resolverDeviceIds,
      ...cachedDeviceIds
    ]).filter(
      (deviceId) => deviceId !== this.getBareDeviceId()
    );
    if (!targets.length) {
      const suffix = input.roomId ? `:${input.roomId}` : "";
      throw new Error(`chat_room_peer_unknown${suffix}`);
    }
    return targets;
  }
  getCachedRoomPeers(roomId) {
    return Array.from(this.roomPeers.get(roomId.trim()) ?? []);
  }
  async resolveRoomDeviceIds(roomId) {
    const normalizedRoomId = roomId.trim();
    if (!normalizedRoomId) return [];
    if (this.config.roomDirectory?.getPeerDeviceIds) {
      const resolved = await this.config.roomDirectory.getPeerDeviceIds(normalizedRoomId);
      return normalizeDeviceIdList(resolved);
    }
    if (this.config.resolveRoomDeviceIds) {
      const resolved = await this.config.resolveRoomDeviceIds(normalizedRoomId);
      return normalizeDeviceIdList(resolved);
    }
    return [];
  }
  async sendToTargets(targetDeviceIds, send) {
    const targets = normalizeDeviceIdList(targetDeviceIds);
    if (!targets.length) throw new Error("chat_targets_required");
    const results = await Promise.all(
      targets.map(async (targetDeviceId) => {
        try {
          await send(targetDeviceId);
          return { ok: true };
        } catch (error) {
          return { ok: false, error };
        }
      })
    );
    if (results.some((result) => result.ok)) return;
    throw results.find((result) => !result.ok)?.error ?? new Error("chat_send_failed");
  }
  clearTypingAutoPause(roomId) {
    const timer = this.typingAutoPauseTimers.get(roomId);
    if (!timer) return;
    clearTimeout(timer);
    this.typingAutoPauseTimers.delete(roomId);
  }
  scheduleTypingAutoPause(roomId, delayMs) {
    if (!Number.isFinite(delayMs) || delayMs <= 0) return;
    const timer = setTimeout(() => {
      this.typingAutoPauseTimers.delete(roomId);
      this.sendTyping({ roomId, isTyping: false }).catch((error) => {
        this.emit(this.errorListeners, { error, roomId });
      });
    }, delayMs);
    this.typingAutoPauseTimers.set(roomId, timer);
  }
  async encodePayload(input) {
    const encrypted = await this.config.encryption?.encrypt?.(input, this.getEncryptionContext());
    if (Array.isArray(encrypted)) return { body: input.body, children: encrypted };
    if (encrypted) {
      return {
        body: encrypted.body ?? input.body,
        children: encrypted.children ?? []
      };
    }
    if (!input.metadata) return { body: input.body, children: [] };
    return {
      body: input.body,
      children: [
        xml(
          "lula",
          { xmlns: XMPP_CHAT_NS },
          encodeJsonBase64({
            metadata: input.metadata
          })
        )
      ]
    };
  }
  async decodePayload(stanza) {
    const decrypted = await this.config.encryption?.decrypt?.(
      { stanza },
      this.getEncryptionContext()
    );
    if (decrypted) return decrypted;
    const body = stanza.getChildText?.("body") ?? "";
    const encodedMetadata = stanza.getChild?.("lula", XMPP_CHAT_NS)?.getText?.();
    const metadataPayload = encodedMetadata ? decodeJsonBase64(encodedMetadata) : null;
    const metadata = metadataPayload && typeof metadataPayload === "object" && !Array.isArray(metadataPayload) && isRecord(metadataPayload.metadata) ? metadataPayload.metadata : void 0;
    return { body, metadata };
  }
  setStatus(status, error) {
    this.status = status;
    this.emit(this.statusListeners, {
      status,
      deviceId: this.onlineDeviceId,
      error
    });
  }
  requireXmpp() {
    if (!this.xmpp) throw new Error("chat_client_not_connected");
    return this.xmpp;
  }
  resolvePendingIq(stanza) {
    if (!stanza.is?.("iq")) return;
    const id = stanza.attrs?.id;
    if (!id) return;
    const pending = this.pendingIqMap.get(id);
    if (!pending) return;
    this.pendingIqMap.delete(id);
    clearTimeout(pending.timeout);
    if (stanza.attrs?.type === "error") {
      pending.reject(new Error(`chat_iq_error:${toRawXmlString(stanza) || id}`));
      return;
    }
    pending.resolve(stanza);
  }
  rejectPendingIq(error) {
    const entries = Array.from(this.pendingIqMap.values());
    this.pendingIqMap.clear();
    for (const entry of entries) {
      clearTimeout(entry.timeout);
      entry.reject(error);
    }
  }
  async sendIq(input) {
    const xmpp = this.requireXmpp();
    const id = generateIqId();
    const timeoutMs = input.timeoutMs ?? DEFAULT_IQ_TIMEOUT_MS;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingIqMap.delete(id);
        reject(new Error(`chat_iq_timeout:${id}`));
      }, timeoutMs);
      this.pendingIqMap.set(id, { resolve, reject, timeout });
      const attrs = input.to ? { type: input.type, id, to: input.to } : { type: input.type, id };
      void xmpp.send(xml("iq", attrs, input.payload)).catch((error) => {
        clearTimeout(timeout);
        this.pendingIqMap.delete(id);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }
  emit(listeners, event) {
    for (const listener of Array.from(listeners)) {
      try {
        listener(event);
      } catch (error) {
        this.config.logger?.error?.("chat_listener_error", { error });
      }
    }
  }
};
function createOmemoEncryption(options = {}) {
  const storage = options.storage ?? createInMemoryKeyValueStore();
  const stateKeyPrefix = options.stateKeyPrefix ?? DEFAULT_OMEMO_STATE_KEY_PREFIX;
  let cachedState = null;
  let publishedBareJid = null;
  const stateKey = (bareJid) => `${stateKeyPrefix}:${bareJid}`;
  const loadOrCreateState = async (bareJid) => {
    if (cachedState?.bareJid === bareJid) return cachedState;
    const raw = await storage.getItem(stateKey(bareJid));
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (isValidOmemoState(parsed) && parsed.bareJid === bareJid) {
          cachedState = parsed;
          return parsed;
        }
      } catch {
      }
    }
    const privateKey = getRandomBytes(32);
    const publicKey = x25519.getPublicKey(privateKey);
    const nextState = {
      bareJid,
      deviceId: Math.max(1, bytesToUint32(getRandomBytes(4))),
      identityPrivateKey: bytesToBase64(privateKey),
      identityPublicKey: bytesToBase64(publicKey)
    };
    await storage.setItem(stateKey(bareJid), JSON.stringify(nextState));
    cachedState = nextState;
    return nextState;
  };
  const fetchDeviceIds = async (context, bareJid) => {
    let stanza;
    try {
      stanza = await context.sendIq({
        type: "get",
        to: bareJid,
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml("items", { node: OMEMO_DEVICELIST_NODE, max_items: "1" })
        )
      });
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        return [];
      }
      throw error;
    }
    const raw = toRawXmlString(stanza);
    const deviceIds = /* @__PURE__ */ new Set();
    const deviceRegex = /<device\b[^>]*id=(['"])(\d+)\1/g;
    let match = null;
    while ((match = deviceRegex.exec(raw)) !== null) {
      const parsed = Number(match[2]);
      if (Number.isFinite(parsed) && parsed > 0) {
        deviceIds.add(Math.floor(parsed));
      }
    }
    return Array.from(deviceIds);
  };
  const fetchIdentityKey = async (context, bareJid, deviceId) => {
    const bundleNode = `${OMEMO_BUNDLE_NODE_PREFIX}${deviceId}`;
    let stanza;
    try {
      stanza = await context.sendIq({
        type: "get",
        to: bareJid,
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml("items", { node: bundleNode, max_items: "1" })
        )
      });
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        throw new Error("xmpp_omemo_peer_identity_key_missing");
      }
      throw error;
    }
    const raw = toRawXmlString(stanza);
    const match = raw.match(/<identityKey>([\s\S]*?)<\/identityKey>/);
    const identityKeyBase64 = match?.[1]?.trim() ?? "";
    if (!identityKeyBase64) {
      throw new Error("xmpp_omemo_peer_identity_key_missing");
    }
    return base64ToBytes(identityKeyBase64);
  };
  const publishIdentity = async (context) => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid) return;
    const state = await loadOrCreateState(bareJid);
    const existingIds = await fetchDeviceIds(context, bareJid).catch(() => []);
    const finalDeviceIds = Array.from(/* @__PURE__ */ new Set([state.deviceId, ...existingIds])).filter(
      (value) => Number.isFinite(value) && value > 0
    );
    const publishOptions = xml(
      "publish-options",
      {},
      xml(
        "x",
        { xmlns: XDATA_NS, type: "submit" },
        xml(
          "field",
          { var: "FORM_TYPE", type: "hidden" },
          xml("value", {}, "http://jabber.org/protocol/pubsub#publish-options")
        ),
        xml("field", { var: "pubsub#access_model" }, xml("value", {}, "open")),
        xml("field", { var: "pubsub#persist_items" }, xml("value", {}, "true"))
      )
    );
    await context.sendIq({
      type: "set",
      payload: xml(
        "pubsub",
        { xmlns: PUBSUB_NS },
        xml(
          "publish",
          { node: OMEMO_DEVICELIST_NODE },
          xml(
            "item",
            { id: "current" },
            xml(
              "list",
              { xmlns: OMEMO_NS },
              ...finalDeviceIds.map((deviceId) => xml("device", { id: String(deviceId) }))
            )
          )
        ),
        publishOptions
      )
    });
    await context.sendIq({
      type: "set",
      payload: xml(
        "pubsub",
        { xmlns: PUBSUB_NS },
        xml(
          "publish",
          { node: `${OMEMO_BUNDLE_NODE_PREFIX}${state.deviceId}` },
          xml(
            "item",
            { id: "current" },
            xml(
              "bundle",
              { xmlns: OMEMO_NS },
              xml("identityKey", {}, state.identityPublicKey)
            )
          )
        ),
        publishOptions
      )
    });
    publishedBareJid = bareJid;
  };
  const establishPeerSessions = async (context, toDeviceId) => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid) {
      throw new Error("xmpp_omemo_state_missing");
    }
    const state = await loadOrCreateState(bareJid);
    const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
    const peerDeviceIds = await fetchDeviceIds(context, normalizeBareDeviceId(toDeviceId));
    if (!peerDeviceIds.length) {
      throw new Error("xmpp_omemo_peer_device_not_found");
    }
    const sessions = [];
    for (const peerDeviceId of peerDeviceIds) {
      try {
        const peerPublicKey = await fetchIdentityKey(
          context,
          normalizeBareDeviceId(toDeviceId),
          peerDeviceId
        );
        sessions.push({
          peerDeviceId,
          sharedSecret: x25519.getSharedSecret(ownPrivateKey, peerPublicKey)
        });
      } catch {
      }
    }
    if (!sessions.length) {
      throw new Error("xmpp_omemo_peer_identity_key_missing");
    }
    return sessions;
  };
  return {
    onConnect: async (context) => {
      const bareJid = context.getBareDeviceId();
      if (!bareJid || publishedBareJid === bareJid) return;
      await publishIdentity(context);
    },
    encrypt: async (input, context) => {
      const bareJid = context.getBareDeviceId();
      if (!bareJid) {
        throw new Error("xmpp_omemo_state_missing");
      }
      if (publishedBareJid !== bareJid) {
        await publishIdentity(context);
      }
      const state = await loadOrCreateState(bareJid);
      const sessions = await establishPeerSessions(context, input.toDeviceId);
      const iv = getRandomBytes(12);
      const contentKey = getRandomBytes(OMEMO_AES_KEY_BYTES);
      const plaintext = new TextEncoder().encode(
        JSON.stringify({
          body: input.body,
          ...input.metadata ? { metadata: input.metadata } : {}
        })
      );
      const ciphertext = gcm(contentKey, iv).encrypt(plaintext);
      const keyElements = sessions.map((session) => {
        const wrapSalt = getRandomBytes(OMEMO_KEY_WRAP_BYTES);
        const wrapMask = hkdf(
          sha256,
          session.sharedSecret,
          wrapSalt,
          OMEMO_WRAP_INFO,
          OMEMO_AES_KEY_BYTES
        );
        const wrappedKey = xorBytes(contentKey, wrapMask);
        const wrappedBundle = concatBytes(wrapSalt, wrappedKey);
        return xml(
          "key",
          {
            rid: String(session.peerDeviceId),
            kex: "x25519-hkdf-sha256-aesgcm"
          },
          bytesToBase64(wrappedBundle)
        );
      });
      return {
        body: "[encrypted]",
        children: [
          xml(
            "encrypted",
            { xmlns: OMEMO_NS },
            xml(
              "header",
              { sid: String(state.deviceId) },
              ...keyElements,
              xml("iv", {}, bytesToBase64(iv)),
              xml("identity", {}, state.identityPublicKey)
            ),
            xml("payload", {}, bytesToBase64(ciphertext))
          )
        ]
      };
    },
    decrypt: async ({ stanza }, context) => {
      const encrypted = stanza.getChild?.("encrypted", OMEMO_NS);
      if (!encrypted) return null;
      const bareJid = context.getBareDeviceId();
      if (!bareJid) return { body: "", metadata: void 0 };
      const state = await loadOrCreateState(bareJid);
      const header = encrypted.getChild?.("header");
      const payloadBase64 = encrypted.getChildText?.("payload")?.trim();
      if (!header || !payloadBase64) {
        return { body: "", metadata: void 0 };
      }
      const keys = header.getChildren?.("key") ?? [];
      let selectedKeyBase64 = "";
      for (const keyElement of keys) {
        const rid = Number(keyElement.attrs?.rid ?? "0");
        if (rid !== state.deviceId) continue;
        selectedKeyBase64 = keyElement.getText?.().trim() || "";
        if (selectedKeyBase64) break;
      }
      if (!selectedKeyBase64) {
        return { body: "", metadata: void 0 };
      }
      const ivBase64 = header.getChildText?.("iv")?.trim();
      const senderIdentityBase64 = header.getChildText?.("identity")?.trim();
      if (!ivBase64 || !senderIdentityBase64) {
        return { body: "", metadata: void 0 };
      }
      try {
        const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
        const senderPublicKey = base64ToBytes(senderIdentityBase64);
        const keyMaterial = base64ToBytes(selectedKeyBase64);
        const iv = base64ToBytes(ivBase64);
        const ciphertext = base64ToBytes(payloadBase64);
        const sharedSecret = x25519.getSharedSecret(ownPrivateKey, senderPublicKey);
        let contentKey;
        if (keyMaterial.length === OMEMO_KEY_WRAP_BYTES) {
          contentKey = hkdf(
            sha256,
            sharedSecret,
            keyMaterial,
            OMEMO_INFO,
            OMEMO_AES_KEY_BYTES
          );
        } else if (keyMaterial.length === OMEMO_KEY_WRAP_BUNDLE_BYTES) {
          const wrapSalt = keyMaterial.slice(0, OMEMO_KEY_WRAP_BYTES);
          const wrappedKey = keyMaterial.slice(OMEMO_KEY_WRAP_BYTES);
          const wrapMask = hkdf(
            sha256,
            sharedSecret,
            wrapSalt,
            OMEMO_WRAP_INFO,
            OMEMO_AES_KEY_BYTES
          );
          contentKey = xorBytes(wrappedKey, wrapMask);
        } else {
          return { body: "", metadata: void 0 };
        }
        const plaintext = gcm(contentKey, iv).decrypt(ciphertext);
        const parsed = JSON.parse(new TextDecoder().decode(plaintext));
        if (!isRecord(parsed)) {
          return { body: "", metadata: void 0 };
        }
        return {
          body: typeof parsed.body === "string" ? parsed.body : "",
          metadata: isRecord(parsed.metadata) ? parsed.metadata : void 0
        };
      } catch {
        return { body: "", metadata: void 0 };
      }
    }
  };
}
function normalizeConfig(config) {
  const domain = normalizeXmppDomain(config.xmppDomain);
  if (!domain) throw new Error("chat_xmpp_domain_required");
  const userId = normalizeUserIdSegment(config.userId);
  if (!userId) throw new Error("chat_user_id_required");
  const localDeviceId = normalizeDeviceIdSegment(config.deviceId);
  if (!localDeviceId) throw new Error("chat_device_id_required");
  const username = buildXmppLocalpart(userId, localDeviceId);
  const deviceId = buildXmppDeviceAddress(userId, localDeviceId, domain);
  return {
    service: buildXmppWebSocketUrl(domain, config.xmppWebSocketPath),
    username,
    deviceId,
    displayName: trimToUndefined(config.displayName),
    password: config.authType === "x-oauth2" ? trimToUndefined(config.accessToken) : trimToUndefined(config.password),
    authType: config.authType ?? "password",
    domain,
    resource: normalizeResource(config.resource),
    connectTimeoutMs: config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    roomDirectory: config.roomDirectory,
    resolveRoomDeviceIds: config.resolveRoomDeviceIds,
    logger: config.logger,
    encryption: config.encryption
  };
}
function extractProviderChatRoomId(metadata) {
  if (!metadata) return void 0;
  const lulaPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.providerChatRoomId,
    lulaPayload?.providerChatRoomId,
    lulaSubmission?.providerChatRoomId
  );
}
function extractSubmissionId(metadata) {
  if (!metadata) return void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(metadata.submissionId, lulaSubmission?.submissionId);
}
function extractDisplayName(metadata) {
  if (!metadata) return void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.displayName,
    metadata.senderDisplayName,
    lulaSubmission?.displayName,
    lulaSubmission?.senderName
  );
}
function extractMessageType(metadata) {
  const rawType = firstString(metadata?.messageType, metadata?.type);
  if (rawType === "CHAT_MESSAGE" || rawType === "FORM_SUBMISSION") return rawType;
  return void 0;
}
function buildChatMessageMetadata(input) {
  const metadata = { ...input.metadata ?? {} };
  metadata.messageType = "CHAT_MESSAGE";
  const providerChatRoomId = firstString(
    input.context?.providerChatRoomId,
    extractProviderChatRoomId(metadata),
    input.roomId
  );
  if (providerChatRoomId) {
    metadata.providerChatRoomId = providerChatRoomId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }
  const context = input.context;
  const displayName = firstString(
    metadata.displayName,
    context?.displayName,
    context?.senderName,
    input.displayName
  );
  if (displayName) {
    metadata.displayName = displayName;
  }
  const shouldWriteSubmissionContext = context && (context.type === "form_thread" || typeof context.submissionId === "string" || typeof context.senderName === "string" || typeof context.displayName === "string");
  if (shouldWriteSubmissionContext) {
    const existing = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : {};
    const { providerChatRoomId: _providerChatRoomId, type: _type, ...rest } = context;
    metadata.lulaSubmission = removeUndefinedValues({
      ...existing,
      ...rest,
      ...displayName ? { displayName } : {},
      ...providerChatRoomId ? { providerChatRoomId } : {}
    });
  }
  return Object.keys(metadata).length > 0 ? metadata : void 0;
}
function buildFormSubmissionMetadata(input) {
  const metadata = { ...input.metadata ?? {} };
  metadata.messageType = "FORM_SUBMISSION";
  const providerChatRoomId = firstString(
    input.providerChatRoomId,
    extractProviderChatRoomId(metadata)
  );
  const existingPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : {};
  if (providerChatRoomId) {
    metadata.providerChatRoomId = providerChatRoomId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }
  const displayName = firstString(metadata.displayName, input.displayName);
  if (displayName) {
    metadata.displayName = displayName;
  }
  metadata.lulaPayload = removeUndefinedValues({
    ...existingPayload,
    submissionRoomId: input.roomId,
    formId: input.formId,
    providerUserId: input.providerUserId,
    recordId: input.recordId,
    formVersion: input.formVersion,
    providerChatRoomId,
    submittedAt: input.submittedAt ?? (typeof existingPayload.submittedAt === "string" ? existingPayload.submittedAt : (/* @__PURE__ */ new Date()).toISOString())
  });
  return metadata;
}
function collectTargetDeviceIds(input) {
  return normalizeDeviceIdList([
    input.toDeviceId,
    input.peerDeviceId,
    ...input.toDeviceIds ?? [],
    ...input.peerDeviceIds ?? []
  ]);
}
function normalizeDeviceIdList(values) {
  const normalized = values.map((value) => normalizeBareDeviceId(value)).filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}
function pickMessageTargetInput(input) {
  return {
    toDeviceId: input.toDeviceId,
    toDeviceIds: input.toDeviceIds,
    peerDeviceId: input.peerDeviceId,
    peerDeviceIds: input.peerDeviceIds,
    roomId: input.roomId,
    targetRoomId: input.targetRoomId,
    id: input.id,
    requestReceipt: input.requestReceipt
  };
}
function toChatTextMessage(message) {
  const metadata = message.metadata;
  const providerChatRoomId = extractProviderChatRoomId(metadata) ?? message.roomId;
  const submissionId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const lulaSubmission = isRecord(metadata?.lulaSubmission) ? metadata?.lulaSubmission : void 0;
  const context = removeUndefinedValues({
    ...lulaSubmission ?? {},
    ...providerChatRoomId ? { providerChatRoomId } : {},
    ...submissionId ? { submissionId } : {},
    ...displayName ? { displayName } : {},
    ...lulaSubmission ? { type: "form_thread" } : {}
  });
  return {
    ...message,
    providerChatRoomId,
    submissionId,
    ...displayName ? { displayName } : {},
    ...Object.keys(context).length > 0 ? { context } : {}
  };
}
function isFormSubmissionMessage(message) {
  const metadataType = extractMessageType(message.metadata);
  if (metadataType === "FORM_SUBMISSION") return true;
  return Boolean(parseFormSubmissionMessage(message));
}
function parseFormSubmissionMessage(message) {
  const payload = parseJsonRecord(message.body);
  if (!payload) return null;
  const metadata = message.metadata;
  const metadataType = extractMessageType(metadata);
  const lulaPayload = isRecord(metadata?.lulaPayload) ? metadata?.lulaPayload : void 0;
  const isExplicitFormPayload = payload.type === "form_submission";
  const isReadableSubmissionPayload = isRecord(payload.readable) || isRecord(payload.raw);
  if (metadataType !== "FORM_SUBMISSION" && !lulaPayload && !isExplicitFormPayload && !isReadableSubmissionPayload) {
    return null;
  }
  const providerChatRoomId = extractProviderChatRoomId(metadata) ?? message.roomId;
  return {
    ...message,
    payload,
    providerChatRoomId,
    formId: firstString(lulaPayload?.formId, payload.formId),
    providerUserId: firstString(lulaPayload?.providerUserId, payload.providerUserId),
    recordId: firstString(lulaPayload?.recordId, payload.recordId),
    formVersion: typeof lulaPayload?.formVersion === "number" ? lulaPayload.formVersion : typeof payload.formVersion === "number" ? payload.formVersion : void 0,
    submittedAt: firstString(lulaPayload?.submittedAt, payload.submittedAt)
  };
}
function parseJsonRecord(input) {
  try {
    const parsed = JSON.parse(input);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function removeUndefinedValues(input) {
  const output = {};
  for (const [key, value] of Object.entries(input)) {
    if (value !== void 0) {
      output[key] = value;
    }
  }
  return output;
}
function registerXOAuth2OnClient(xmpp) {
  const candidate = xmpp;
  candidate.saslFactory?.use?.("X-OAUTH2", XOauth2Mechanism);
  candidate.sasl?.use?.("X-OAUTH2", XOauth2Mechanism);
}
function pickMechanism(mechanisms, preferred) {
  const offered = new Set(mechanisms.map((mechanism) => mechanism.toUpperCase()));
  return preferred.find((mechanism) => offered.has(mechanism));
}
function addListener(listeners, listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
async function withTimeout(promise, ms, errorCode) {
  let timeout;
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timeout = setTimeout(() => reject(new Error(errorCode)), ms);
      })
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}
async function safeStop(xmpp) {
  try {
    await xmpp.stop();
  } catch {
  }
}
function parseStanzaError(stanza) {
  const error = stanza.getChild?.("error");
  if (!error) return {};
  const text = error.getChildText?.("text");
  const raw = error.toString?.() ?? "";
  const match = raw.match(/<([a-z0-9-]+)\s+xmlns=["']urn:ietf:params:xml:ns:xmpp-stanzas["']/i);
  return {
    condition: match?.[1],
    text: text ?? void 0
  };
}
function parseDelayTimestamp(stanza) {
  const delay = stanza.getChild?.("delay", "urn:xmpp:delay");
  const stamp = delay?.attrs?.stamp;
  if (!stamp) return void 0;
  const parsed = Date.parse(stamp);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function parseMetadataTimestamp(metadata) {
  const sentAtMs = metadata?.sentAtMs;
  if (typeof sentAtMs === "number" && Number.isFinite(sentAtMs)) return sentAtMs;
  const createdAt = metadata?.createdAt;
  if (typeof createdAt !== "string") return void 0;
  const parsed = Date.parse(createdAt);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function generateMessageId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function generateIqId() {
  return `iq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
function buildXmppLocalpart(userId, deviceId) {
  return `i.${userId}.d.${deviceId}`;
}
function buildXmppDeviceAddress(userId, deviceId, xmppDomain) {
  return `${buildXmppLocalpart(userId, deviceId)}@${xmppDomain}`;
}
function buildXmppWebSocketUrl(xmppDomain, path) {
  const normalizedPath = normalizeXmppWebSocketPath(path);
  return `wss://${xmppDomain}${normalizedPath}`;
}
function normalizeXmppWebSocketPath(path) {
  const trimmed = trimToUndefined(path) ?? DEFAULT_XMPP_WEBSOCKET_PATH;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
function normalizeXmppDomain(domain) {
  const trimmed = trimToUndefined(domain);
  if (!trimmed) return void 0;
  return trimmed.replace(/^wss?:\/\//i, "").replace(/\/.*$/, "").trim();
}
function normalizeUserIdSegment(value) {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return void 0;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const withoutPrefix = localpart?.replace(/^i\./, "");
  return withoutPrefix?.replace(/\.d\..*$/, "") || void 0;
}
function normalizeDeviceIdSegment(value) {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return void 0;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const deviceMarker = localpart?.indexOf(".d.") ?? -1;
  return deviceMarker >= 0 ? localpart?.slice(deviceMarker + 3) || void 0 : localpart;
}
function normalizeBareDeviceId(deviceId) {
  return deviceId?.trim().split("/")[0] ?? "";
}
function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function normalizeResource(value) {
  const resource = trimToUndefined(value);
  if (!resource) return void 0;
  if (chatResources.includes(resource)) return resource;
  throw new Error(`chat_resource_invalid:${resource}`);
}
function addressToString(address) {
  if (typeof address === "string") return address;
  if (address && typeof address === "object" && "toString" in address) {
    const value = String(address);
    return value === "[object Object]" ? void 0 : value;
  }
  return void 0;
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function normalizeChatRoomResponse(response, options = {}) {
  const roomRecord = unwrapRoomRecord(response);
  const roomId = firstString(
    roomRecord.roomId,
    roomRecord.providerChatRoomId,
    roomRecord.id,
    roomRecord._id
  );
  if (!roomId) throw new Error("chat_room_id_required");
  const id = firstString(roomRecord.id, roomRecord._id);
  const peerDeviceIds = collectPeerDeviceIdsFromRoom(roomRecord, options);
  return {
    ...id ? { id } : {},
    roomId,
    peerDeviceIds,
    raw: response
  };
}
function unwrapRoomRecord(response) {
  if (!isRecord(response)) throw new Error("chat_room_response_invalid");
  if (isRecord(response.data)) return response.data;
  if (isRecord(response.room)) return response.room;
  return response;
}
function collectPeerDeviceIdsFromRoom(room, options) {
  const candidates = [];
  const domain = normalizeXmppDomain(options.xmppDomain);
  const roomUserId = firstString(
    room.peerUserId,
    room.peerAppUserId,
    room.userId,
    room.appUserId,
    room.providerUserId,
    room.peerProviderUserId
  );
  pushDeviceIdCandidates(candidates, room.peerDeviceId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.peerDeviceIds, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.deviceId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.deviceIds, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.chatUserId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.chatUserIds, domain, roomUserId);
  const current = normalizeUserName(options.currentUserId);
  const userMetadata = Array.isArray(room.userMetadata) ? room.userMetadata : [];
  for (const entry of userMetadata) {
    if (!isRecord(entry)) continue;
    const entryUserId = firstString(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId
    );
    const entryNames = collectStringValues(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId,
      entry.deviceId,
      entry.deviceIds,
      entry.chatUserId,
      entry.chatUserIds
    ).map(normalizeUserName);
    if (current && entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, entryUserId);
  }
  return normalizeDeviceIdList(candidates);
}
function collectStringValues(...values) {
  const strings = [];
  values.forEach((value) => pushStrings(strings, value));
  return strings;
}
function pushStrings(target, value) {
  if (typeof value === "string" && value.trim()) {
    target.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => pushStrings(target, entry));
  }
}
function pushDeviceIdCandidates(target, value, xmppDomain, userId) {
  const values = [];
  pushStrings(values, value);
  values.map((entry) => expandDeviceIdCandidate(entry, xmppDomain, userId)).filter((entry) => Boolean(entry)).forEach((entry) => target.push(entry));
}
function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return void 0;
}
function normalizeUserName(value) {
  const normalized = normalizeBareDeviceId(value);
  if (!normalized) return void 0;
  return normalizeUserIdSegment(normalized) ?? normalized.split("@")[0] ?? normalized;
}
function expandDeviceIdCandidate(value, xmppDomain, userId) {
  const trimmed = value.trim();
  if (!trimmed) return void 0;
  if (trimmed.includes("@")) return trimmed;
  const domain = normalizeXmppDomain(xmppDomain);
  if (!domain) return trimmed;
  if (trimmed.startsWith("i.") && trimmed.includes(".d.")) return `${trimmed}@${domain}`;
  const normalizedUserId = normalizeUserIdSegment(userId);
  if (normalizedUserId) {
    return buildXmppDeviceAddress(normalizedUserId, normalizeDeviceIdSegment(trimmed) ?? trimmed, domain);
  }
  return `${trimmed}@${domain}`;
}
function isValidOmemoState(value) {
  if (!isRecord(value)) return false;
  return typeof value.bareJid === "string" && value.bareJid.length > 0 && typeof value.deviceId === "number" && Number.isFinite(value.deviceId) && value.deviceId > 0 && typeof value.identityPrivateKey === "string" && value.identityPrivateKey.length > 0 && typeof value.identityPublicKey === "string" && value.identityPublicKey.length > 0;
}
function createInMemoryKeyValueStore() {
  const map = /* @__PURE__ */ new Map();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    }
  };
}
function createMemoryStorageBackend() {
  return createInMemoryKeyValueStore();
}
function createIndexDbStorageBackend(options = {}) {
  const dbName = options.dbName ?? "lulafi-chat-sdk";
  const storeName = options.storeName ?? "keyValue";
  let dbPromise = null;
  const getDb = () => {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      if (!globalThis.indexedDB) {
        reject(new Error("chat_indexeddb_unavailable"));
        return;
      }
      const request = globalThis.indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      request.onerror = () => {
        reject(request.error ?? new Error("chat_indexeddb_open_failed"));
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
    return dbPromise;
  };
  const withStore = async (mode, run) => {
    const db = await getDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = run(store);
      request.onerror = () => {
        reject(request.error ?? new Error("chat_indexeddb_request_failed"));
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      transaction.onerror = () => {
        reject(transaction.error ?? new Error("chat_indexeddb_transaction_failed"));
      };
    });
  };
  return {
    getItem: async (key) => {
      const value = await withStore("readonly", (store) => store.get(key));
      return typeof value === "string" ? value : null;
    },
    setItem: async (key, value) => {
      await withStore("readwrite", (store) => store.put(value, key));
    },
    removeItem: async (key) => {
      await withStore("readwrite", (store) => store.delete(key));
    }
  };
}
function createMongoDbStorageBackend(options) {
  const { collection } = options;
  const keyField = options.keyField ?? "_id";
  const valueField = options.valueField ?? "value";
  const updatedAtField = options.updatedAtField ?? "updatedAt";
  return {
    getItem: async (key) => {
      const document = await collection.findOne({ [keyField]: key });
      const value = document?.[valueField];
      return typeof value === "string" ? value : null;
    },
    setItem: async (key, value) => {
      const setFields = {
        [valueField]: value,
        [updatedAtField]: /* @__PURE__ */ new Date()
      };
      if (keyField !== "_id") {
        setFields[keyField] = key;
      }
      await collection.updateOne(
        { [keyField]: key },
        { $set: setFields },
        { upsert: true }
      );
    },
    removeItem: async (key) => {
      await collection.deleteOne({ [keyField]: key });
    }
  };
}
var storageBackends = {
  memory: createMemoryStorageBackend(),
  indexDb: createIndexDbStorageBackend(),
  mongoDb: createMongoDbStorageBackend,
  createMemory: createMemoryStorageBackend,
  createIndexDb: createIndexDbStorageBackend,
  createMongoDb: createMongoDbStorageBackend
};
function getRandomBytes(length) {
  const cryptoObject = globalThis.crypto;
  if (!cryptoObject?.getRandomValues) {
    throw new Error("chat_random_values_unavailable");
  }
  return cryptoObject.getRandomValues(new Uint8Array(length));
}
function bytesToBase64(bytes) {
  const globalWithBuffer = globalThis;
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function base64ToBytes(value) {
  const globalWithBuffer = globalThis;
  if (globalWithBuffer.Buffer) {
    return new Uint8Array(globalWithBuffer.Buffer.from(value, "base64"));
  }
  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}
function bytesToUint32(bytes) {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(0, false);
}
function xorBytes(left, right) {
  const output = new Uint8Array(Math.min(left.length, right.length));
  for (let i = 0; i < output.length; i += 1) {
    output[i] = left[i] ^ right[i];
  }
  return output;
}
function concatBytes(first, second) {
  const output = new Uint8Array(first.length + second.length);
  output.set(first, 0);
  output.set(second, first.length);
  return output;
}
function toRawXmlString(value) {
  if (!value) return "";
  const withToString = value;
  try {
    if (typeof withToString.toString === "function") {
      return withToString.toString();
    }
  } catch {
    return "";
  }
  return "";
}
function encodeJsonBase64(value) {
  const json = JSON.stringify(value);
  const globalWithBuffer = globalThis;
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(json, "utf8").toString("base64");
  }
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}
function decodeJsonBase64(value) {
  try {
    const globalWithBuffer = globalThis;
    if (globalWithBuffer.Buffer) {
      return JSON.parse(globalWithBuffer.Buffer.from(value, "base64").toString("utf8"));
    }
    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
export {
  buildChatMessageMetadata,
  buildFormSubmissionMetadata,
  chatResources,
  createChatClient,
  createIndexDbStorageBackend,
  createMemoryStorageBackend,
  createMongoDbStorageBackend,
  createOmemoEncryption,
  createRoomDirectory,
  extractDisplayName,
  extractProviderChatRoomId,
  extractSubmissionId,
  init,
  storageBackends
};
//# sourceMappingURL=index.mjs.map