// src/index.ts
import { gcm } from "@noble/ciphers/aes.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes as nobleRandomBytes } from "@noble/hashes/utils.js";
import { client as createXmppClient, xml } from "@xmpp/client";
import { customAlphabet } from "nanoid/non-secure";
import saslMechanisms from "saslmechanisms";
var XMPP_CHAT_NS = "urn:lula:defy:chat:1";
var XMPP_RECEIPTS_NS = "urn:xmpp:receipts";
var XMPP_CHAT_MARKERS_NS = "urn:xmpp:chat-markers:0";
var XMPP_CHATSTATES_NS = "http://jabber.org/protocol/chatstates";
var XMPP_HTTP_UPLOAD_NS = "urn:xmpp:http:upload:0";
var XMPP_CARBONS_NS = "urn:xmpp:carbons:2";
var XMPP_FORWARD_NS = "urn:xmpp:forward:0";
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
var OMEMO_IQ_TIMEOUT_MS = 5e3;
var OMEMO_IQ_MAX_ATTEMPTS = 3;
var OMEMO_IQ_RETRY_DELAY_MS = 250;
var DEFAULT_TYPING_AUTO_PAUSE_MS = 1e4;
var DEFAULT_OMEMO_STATE_KEY_PREFIX = "chat_sdk_omemo_state";
var DEFAULT_XMPP_WEBSOCKET_PATH = "/chat/websocket";
var CHAT_LOG_LEVEL_WEIGHT = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4
};
var createRuntimeIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);
var createDeviceIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);
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
function createDeviceId(options = {}) {
  const prefix = normalizeDeviceIdSegment(options.prefix) ?? "";
  return `${prefix}${createDeviceIdSuffix()}`;
}
function getChatAddress(input) {
  const domain = normalizeXmppDomain(input.xmppDomain);
  if (!domain) throw new Error("chat_xmpp_domain_required");
  const userId = normalizeUserIdSegment(input.userId);
  if (!userId) throw new Error("chat_user_id_required");
  const localDeviceId = normalizeDeviceIdSegment(input.deviceId);
  if (!localDeviceId) throw new Error("chat_device_id_required");
  const resource = normalizeResourceSegment(localDeviceId);
  const localpart = buildXmppUserLocalpart(userId);
  const raw = buildXmppUserResourceAddress(userId, domain, resource);
  const address = buildXmppUserAddress(userId, domain);
  return {
    raw,
    address,
    userId,
    deviceId: localDeviceId,
    localpart,
    domain
  };
}
function getChatUserId(input) {
  const domain = normalizeXmppDomain(input.domain);
  if (!domain) throw new Error("chat_xmpp_domain_required");
  const userId = normalizeUserIdSegment(input.username);
  if (!userId) throw new Error("chat_user_id_required");
  return buildXmppUserAddress(userId, domain);
}
function getChatDeviceId(input) {
  const bareUserJid = getChatUserId(input);
  const resource = normalizeResourceSegment(input.deviceId ?? input.deviceName ?? "");
  return `${bareUserJid}/${resource}`;
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
      const cachedDeviceIds = normalizeTransportAddressList([
        ...cached?.peerDeviceIds ?? [],
        ...cached?.ownDeviceIds ?? []
      ]);
      if (cachedDeviceIds.length) return cachedDeviceIds;
      if (!options.getRoom) return [];
      const room = normalizeChatRoomResponse(await options.getRoom(normalizedRoomId), options);
      return deriveFanoutDeviceIds(room);
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
    this.log("debug", "chat_connect_requested", {
      status: this.status,
      deviceId: this.config.localDeviceId,
      domain: this.config.domain
    });
    this.connectPromise = this.connectFresh();
    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }
  async stop() {
    this.log("info", "chat_stop_requested", { status: this.status });
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
    this.log("info", "chat_stopped");
  }
  async getPeerDeviceIds(roomId) {
    const deviceIds = await this.resolveRoomDeviceIds(roomId);
    this.log("debug", "chat_peer_device_ids_resolved", {
      roomId,
      deviceCount: deviceIds.length
    });
    return deviceIds;
  }
  async getOrCreateRoom(inputOrUserId, metadata) {
    const input = typeof inputOrUserId === "string" ? { userId: inputOrUserId, metadata } : inputOrUserId;
    const room = await this.resolveRoomForUserId(input);
    this.log("debug", "chat_room_resolved_for_user", {
      userId: input.userId,
      roomId: room.roomId
    });
    return room;
  }
  async sendChatMessage(inputOrRoomId, body, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, body: body ?? "" } : inputOrRoomId;
    const metadata = buildChatMessageMetadata({
      ...input,
      displayName: this.config.displayName
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...input,
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId
      },
      "user"
    );
  }
  async sendFormSubmission(input) {
    const metadata = buildFormSubmissionMetadata({
      ...input,
      displayName: this.config.displayName
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...pickMessageTargetInput(input),
        body: JSON.stringify(input.payload, null, input.pretty ? 2 : void 0),
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId
      },
      "user"
    );
  }
  async uploadAttachment(inputOrRoomId, attachment) {
    const input = typeof inputOrRoomId === "string" ? { roomId: inputOrRoomId, attachment } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.attachment) throw new Error("chat_attachment_required");
    if (!this.config.attachmentService?.upload) {
      throw new Error("chat_attachment_service_required");
    }
    await this.connect();
    const uploaded = await this.config.attachmentService.upload(
      input.attachment,
      this.getAttachmentUploadContext(roomId)
    );
    return normalizeRequiredAttachment(uploaded);
  }
  async sendAttachment(inputOrRoomId, attachment, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, attachment } : inputOrRoomId;
    const roomId = input.roomId?.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const uploaded = await this.uploadAttachment({ roomId, attachment: input.attachment });
    const metadata = buildChatMessageMetadata({
      ...input,
      roomId,
      metadata: {
        ...input.metadata ?? {},
        attachment: true,
        ...uploaded.mimeType ? { mimeType: uploaded.mimeType } : {},
        ...typeof uploaded.size === "number" ? { size: uploaded.size } : {}
      },
      displayName: this.config.displayName
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...input,
        roomId,
        body: input.body ?? "",
        attachments: [uploaded],
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? roomId
      },
      "user"
    );
  }
  async sendMessage(inputOrRoomId, body, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, body: body ?? "" } : inputOrRoomId;
    return this.sendMessageInput(input, "resource");
  }
  async sendMessageInput(input, defaultTargetScope) {
    const messageBody = input.body ?? "";
    const attachments = normalizeAttachmentPayload(input.attachments);
    if (!messageBody.trim() && !attachments?.length) throw new Error("chat_body_required");
    const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");
    await this.connect();
    const xmpp = this.requireXmpp();
    const id = input.id || generateMessageId();
    const roomId = input.roomId?.trim();
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetScope = input.targetScope ?? defaultTargetScope;
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId: targetRoomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    this.log("debug", "chat_message_send_started", {
      id,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length,
      targetDeviceIds,
      hasAttachments: Boolean(attachments?.length),
      messageType: metadata.messageType
    });
    await this.sendToTargets(targetDeviceIds, async (toDeviceId) => {
      const encodedPayload = await this.encodePayload({
        toDeviceId,
        body: messageBody,
        metadata,
        attachments
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
    this.log("info", "chat_message_sent", {
      id,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length,
      messageType: metadata.messageType
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
    const targetScope = input.targetScope ?? "user";
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    this.log("debug", "chat_typing_send_started", {
      roomId,
      isTyping,
      targetScope,
      targetCount: targetDeviceIds.length
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
    this.log("debug", "chat_typing_sent", {
      roomId,
      isTyping,
      targetCount: targetDeviceIds.length
    });
  }
  async markRead(inputOrRoomId, messageId, options) {
    const input = typeof inputOrRoomId === "string" ? { ...options ?? {}, roomId: inputOrRoomId, messageId: messageId ?? "" } : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.messageId.trim()) throw new Error("chat_message_id_required");
    const targetScope = input.targetScope ?? "user";
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
      targetScope
    });
    this.log("debug", "chat_read_marker_send_started", {
      roomId,
      messageId: input.messageId,
      targetScope,
      targetCount: targetDeviceIds.length
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
    this.log("debug", "chat_read_marker_sent", {
      roomId,
      messageId: input.messageId,
      targetCount: targetDeviceIds.length
    });
  }
  async resolveAttachment(attachment) {
    const normalized = normalizeRequiredAttachment(attachment);
    if (this.config.attachmentService?.resolve) {
      const resolved = await this.config.attachmentService.resolve(
        normalized,
        this.getAttachmentResolveContext()
      );
      if (typeof resolved === "string" && resolved.trim()) return resolved.trim();
    }
    return defaultAttachmentSource(normalized);
  }
  onMessage(listener) {
    return addListener(this.messageListeners, listener);
  }
  onChatMessage(listener) {
    return this.onMessage((message) => {
      if (isFormSubmissionMessage(message)) return;
      if (isAttachmentMessage(message)) return;
      listener(toChatTextMessage(message));
    });
  }
  onAttachmentMessage(listener) {
    return this.onMessage((message) => {
      if (!isAttachmentMessage(message)) return;
      listener(toChatAttachmentMessage(message));
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
  getAddress() {
    return this.getChatAddressObject().address;
  }
  getChatAddressObject() {
    const raw = this.getDeviceId() ?? this.config.deviceId;
    return {
      raw,
      address: normalizeBareDeviceId(raw) || this.config.deviceId,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      localpart: this.config.username,
      domain: this.config.domain
    };
  }
  getDomain() {
    return this.config.domain;
  }
  getUserId() {
    return this.config.userId;
  }
  async connectFresh() {
    this.setStatus("connecting");
    this.log("info", "chat_connect_started", {
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      authType: this.config.authType
    });
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
      this.log("error", "chat_connect_failed", { error });
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
      this.log("info", "chat_online", {
        deviceId: this.onlineDeviceId,
        bareDeviceId: this.getBareDeviceId()
      });
      await xmpp.send(xml("presence"));
      try {
        await this.enableMessageCarbons();
        this.log("debug", "chat_carbons_enabled", {
          deviceId: this.onlineDeviceId
        });
      } catch (error) {
        this.log("warn", "chat_carbons_enable_failed", { error });
      }
      try {
        await this.config.encryption?.onConnect?.(this.getEncryptionContext());
        this.log("debug", "chat_encryption_connected", {
          deviceId: this.getBareDeviceId()
        });
      } catch (error) {
        this.log("error", "chat_encryption_connect_failed", { error });
        this.emit(this.errorListeners, { error });
      }
    });
    xmpp.on("offline", () => {
      this.setStatus("offline");
      this.onlineDeviceId = void 0;
      this.log("warn", "chat_offline");
      this.rejectPendingIq(new Error("chat_iq_offline"));
    });
    xmpp.on("error", (error) => {
      this.log("error", "chat_xmpp_error", { error });
      this.emit(this.errorListeners, { error });
      this.setStatus("error", error);
    });
    xmpp.on("stanza", (stanza) => {
      this.handleStanza(stanza).catch((error) => {
        this.emit(this.errorListeners, { error, raw: stanza });
      });
    });
  }
  async enableMessageCarbons() {
    await this.sendIq({
      type: "set",
      payload: xml("enable", { xmlns: XMPP_CARBONS_NS })
    });
  }
  unwrapCarbonMessage(stanza) {
    const sent = stanza.getChild?.("sent", XMPP_CARBONS_NS);
    const received = stanza.getChild?.("received", XMPP_CARBONS_NS);
    const carbon = sent ?? received;
    const direction = sent ? "sent" : received ? "received" : void 0;
    const forwarded = carbon?.getChild?.("forwarded", XMPP_FORWARD_NS);
    const message = forwarded?.getChild?.("message", "jabber:client") ?? forwarded?.getChild?.("message");
    if (!direction || !message) return null;
    return { direction, message };
  }
  async handleStanza(stanza) {
    this.resolvePendingIq(stanza);
    if (!stanza.is?.("message")) return;
    const carbon = this.unwrapCarbonMessage(stanza);
    const messageStanza = carbon?.message ?? stanza;
    const attrs = messageStanza.attrs ?? {};
    const fromFullAddress = normalizeTransportAddress(addressToString(attrs.from));
    const fromDeviceId = fromFullAddress || normalizeBareDeviceId(addressToString(attrs.from));
    const fromUserId = getUserIdFromChatAddress(fromFullAddress) || "";
    const toDeviceId = attrs.to ? normalizeTransportAddress(addressToString(attrs.to)) || addressToString(attrs.to) : this.getDeviceId();
    const roomId = trimToUndefined(messageStanza.getChildText?.("thread") ?? void 0);
    this.rememberRoomPeer(roomId, carbon?.direction === "sent" ? toDeviceId : fromDeviceId);
    this.log("debug", "chat_message_stanza_received", {
      id: attrs.id,
      type: attrs.type,
      fromDeviceId,
      toDeviceId,
      roomId,
      carbonDirection: carbon?.direction
    });
    const receipt = messageStanza.getChild?.("received", XMPP_RECEIPTS_NS);
    const markerReceived = messageStanza.getChild?.("received", XMPP_CHAT_MARKERS_NS);
    const displayed = messageStanza.getChild?.("displayed", XMPP_CHAT_MARKERS_NS);
    const receiptId = receipt?.attrs?.id ?? markerReceived?.attrs?.id;
    if (receiptId) {
      if (roomId) {
        this.emit(this.deliveryListeners, {
          id: receiptId,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          status: "delivered",
          raw: messageStanza
        });
        this.log("debug", "chat_delivery_received", {
          id: receiptId,
          roomId,
          status: "delivered",
          fromDeviceId
        });
      } else {
        this.log("debug", "chat_delivery_ignored_missing_room", {
          id: receiptId,
          fromDeviceId
        });
      }
      return;
    }
    if (displayed?.attrs?.id) {
      if (roomId) {
        this.emit(this.deliveryListeners, {
          id: displayed.attrs.id,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          status: "read",
          raw: messageStanza
        });
        this.log("debug", "chat_delivery_received", {
          id: displayed.attrs.id,
          roomId,
          status: "read",
          fromDeviceId
        });
      } else {
        this.log("debug", "chat_read_marker_ignored_missing_room", {
          id: displayed.attrs.id,
          fromDeviceId
        });
      }
      return;
    }
    if (attrs.type === "error") {
      const errorEvent = parseStanzaError(messageStanza);
      this.log("warn", "chat_message_error_stanza_received", {
        id: attrs.id,
        roomId,
        condition: errorEvent.condition,
        text: errorEvent.text
      });
      this.emit(this.errorListeners, {
        ...errorEvent,
        id: attrs.id,
        fromUserId: fromUserId || void 0,
        fromFullAddress: fromFullAddress || void 0,
        fromDeviceId,
        toDeviceId,
        roomId,
        raw: messageStanza
      });
      return;
    }
    const composing = messageStanza.getChild?.("composing", XMPP_CHATSTATES_NS);
    const paused = messageStanza.getChild?.("paused", XMPP_CHATSTATES_NS);
    if ((composing || paused) && roomId) {
      this.emit(this.typingListeners, {
        fromUserId,
        fromFullAddress,
        fromDeviceId,
        toDeviceId,
        roomId,
        isTyping: Boolean(composing),
        raw: messageStanza
      });
      this.log("debug", "chat_typing_received", {
        roomId,
        fromDeviceId,
        isTyping: Boolean(composing)
      });
    }
    const decoded = await this.decodePayload(messageStanza);
    const body = decoded.body;
    const attachments = normalizeAttachmentPayload(decoded.attachments);
    if (!body.trim() && !attachments?.length) {
      this.log("debug", "chat_message_ignored_empty", {
        id: attrs.id,
        fromDeviceId,
        roomId
      });
      return;
    }
    if (!roomId || !toDeviceId) {
      this.log("debug", "chat_message_ignored_missing_target_context", {
        id: attrs.id,
        fromDeviceId,
        roomId,
        hasToDeviceId: Boolean(toDeviceId)
      });
      return;
    }
    const metadata = normalizeMessageMetadata(
      decoded.metadata,
      inferMessageType(decoded.metadata, body)
    );
    const emittedMessageId = attrs.id || generateMessageId();
    this.emit(this.messageListeners, {
      id: emittedMessageId,
      fromUserId,
      fromFullAddress,
      fromDeviceId,
      toDeviceId,
      roomId,
      body,
      timestamp: parseDelayTimestamp(messageStanza) ?? parseMetadataTimestamp(metadata) ?? Date.now(),
      metadata,
      ...attachments?.length ? { attachments } : {},
      raw: messageStanza
    });
    this.log("debug", "chat_message_received", {
      id: emittedMessageId,
      roomId,
      fromDeviceId,
      messageType: metadata.messageType,
      hasAttachments: Boolean(attachments?.length)
    });
    const receiptRequest = messageStanza.getChild?.("request", XMPP_RECEIPTS_NS);
    if (!carbon && attrs.id && receiptRequest && fromDeviceId) {
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
  getAttachmentUploadContext(roomId) {
    return {
      roomId,
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      requestSlot: (input) => this.requestAttachmentUploadSlot(input),
      logger: this.config.logger
    };
  }
  getAttachmentResolveContext() {
    return {
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      logger: this.config.logger
    };
  }
  rememberRoomPeer(roomId, peerDeviceId) {
    const normalizedRoomId = roomId?.trim();
    const normalizedPeerDeviceId = normalizeTransportAddress(peerDeviceId);
    if (!normalizedRoomId || !normalizedPeerDeviceId) return;
    if (isOwnTransportTarget(normalizedPeerDeviceId, this.getDeviceId(), this.getBareDeviceId())) return;
    const peers = this.roomPeers.get(normalizedRoomId) ?? /* @__PURE__ */ new Set();
    const previousSize = peers.size;
    peers.add(normalizedPeerDeviceId);
    this.roomPeers.set(normalizedRoomId, peers);
    if (peers.size !== previousSize) {
      this.log("debug", "chat_room_peer_remembered", {
        roomId: normalizedRoomId,
        peerDeviceId: normalizedPeerDeviceId,
        peerCount: peers.size
      });
    }
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
    this.rememberRoomPeers(
      normalizedRoomId,
      deriveFanoutDeviceIds(room)
    );
    return { ...room, roomId: normalizedRoomId };
  }
  async resolveRoomTargets(input) {
    const explicit = normalizeTargetAddressList(
      input.explicitDeviceIds ?? [],
      input.targetScope
    );
    if (input.roomId) this.rememberRoomPeers(input.roomId, explicit);
    const resolverDeviceIds = input.roomId ? await this.getPeerDeviceIds(input.roomId) : [];
    const cachedDeviceIds = input.roomId ? this.getCachedRoomPeers(input.roomId) : [];
    const ownTransportAddress = normalizeTransportAddress(this.getDeviceId());
    const ownBareAddress = this.getBareDeviceId();
    const targets = normalizeTargetAddressList(
      [...explicit, ...resolverDeviceIds, ...cachedDeviceIds],
      input.targetScope
    ).filter((target) => !isOwnTransportTarget(target, ownTransportAddress, ownBareAddress));
    this.log("debug", "chat_room_targets_resolved", {
      roomId: input.roomId,
      targetScope: input.targetScope,
      explicitCount: explicit.length,
      resolverCount: resolverDeviceIds.length,
      cachedCount: cachedDeviceIds.length,
      targetCount: targets.length
    });
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
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_directory_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length
      });
      return normalized;
    }
    if (this.config.resolveRoomDeviceIds) {
      const resolved = await this.config.resolveRoomDeviceIds(normalizedRoomId);
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_fallback_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length
      });
      return normalized;
    }
    this.log("debug", "chat_room_peer_devices_unresolved", { roomId: normalizedRoomId });
    return [];
  }
  async sendToTargets(targetDeviceIds, send) {
    const targets = normalizeTransportAddressList(targetDeviceIds);
    if (!targets.length) throw new Error("chat_targets_required");
    const results = await Promise.all(
      targets.map(async (targetDeviceId) => {
        try {
          await send(targetDeviceId);
          return { ok: true };
        } catch (error) {
          this.log("warn", "chat_target_send_failed", { targetDeviceId, error });
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
    if (Array.isArray(encrypted)) {
      this.log("debug", "chat_payload_encoded_encrypted_array", {
        messageType: input.metadata.messageType,
        childCount: encrypted.length
      });
      return { body: input.body, children: encrypted };
    }
    if (encrypted) {
      this.log("debug", "chat_payload_encoded_encrypted", {
        messageType: input.metadata.messageType,
        childCount: encrypted.children?.length ?? 0
      });
      return {
        body: encrypted.body ?? input.body,
        children: encrypted.children ?? []
      };
    }
    this.log("debug", "chat_payload_encoded_plain", {
      messageType: input.metadata.messageType,
      hasAttachments: Boolean(input.attachments?.length)
    });
    return {
      body: input.body,
      children: [
        xml(
          "lula",
          { xmlns: XMPP_CHAT_NS },
          encodeJsonBase64({
            metadata: input.metadata,
            ...input.attachments?.length ? { attachments: serializeAttachmentsForWire(input.attachments) } : {}
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
    if (decrypted) {
      this.log("debug", "chat_payload_decoded_encrypted", {
        hasBody: Boolean(decrypted.body?.trim()),
        hasAttachments: Boolean(decrypted.attachments?.length)
      });
      return decrypted;
    }
    const body = stanza.getChildText?.("body") ?? "";
    const encodedMetadata = stanza.getChild?.("lula", XMPP_CHAT_NS)?.getText?.();
    const metadataPayload = encodedMetadata ? decodeJsonBase64(encodedMetadata) : null;
    const metadata = metadataPayload && typeof metadataPayload === "object" && !Array.isArray(metadataPayload) && isRecord(metadataPayload.metadata) ? metadataPayload.metadata : void 0;
    const attachments = metadataPayload && typeof metadataPayload === "object" && !Array.isArray(metadataPayload) ? normalizeAttachmentPayload(metadataPayload.attachments) : void 0;
    this.log("debug", "chat_payload_decoded_plain", {
      hasBody: Boolean(body.trim()),
      hasMetadata: Boolean(metadata),
      hasAttachments: Boolean(attachments?.length)
    });
    return { body, metadata, attachments };
  }
  setStatus(status, error) {
    this.status = status;
    this.log(status === "error" ? "error" : "debug", "chat_status_changed", {
      status,
      deviceId: this.onlineDeviceId,
      ...error ? { error } : {}
    });
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
  async requestAttachmentUploadSlot(input) {
    const stanza = await this.sendIq({
      type: "get",
      to: this.config.uploadService,
      payload: xml("request", {
        xmlns: XMPP_HTTP_UPLOAD_NS,
        filename: input.name,
        size: String(Math.max(1, Math.floor(input.size))),
        "content-type": input.mimeType
      })
    });
    return parseUploadSlotResponse(stanza);
  }
  emit(listeners, event) {
    for (const listener of Array.from(listeners)) {
      try {
        listener(event);
      } catch (error) {
        this.log("error", "chat_listener_error", { error });
      }
    }
  }
  log(level, message, data) {
    const logger = this.config.logger;
    if (!logger) return;
    if (CHAT_LOG_LEVEL_WEIGHT[this.config.logLevel] < CHAT_LOG_LEVEL_WEIGHT[level]) return;
    logger[level]?.(message, data);
  }
};
function createOmemoEncryption(options = {}) {
  const storage = options.storage ?? createInMemoryKeyValueStore();
  const stateKeyPrefix = options.stateKeyPrefix ?? DEFAULT_OMEMO_STATE_KEY_PREFIX;
  let cachedState = null;
  let publishedBareJid = null;
  let identityPublishPromise = null;
  const stateKey = (bareJid) => `${stateKeyPrefix}:${bareJid}`;
  const sendOmemoIq = async (context, input, operation) => {
    let lastError;
    for (let attempt = 1; attempt <= OMEMO_IQ_MAX_ATTEMPTS; attempt += 1) {
      try {
        return await context.sendIq({
          ...input,
          timeoutMs: OMEMO_IQ_TIMEOUT_MS
        });
      } catch (error) {
        lastError = error;
        if (attempt === OMEMO_IQ_MAX_ATTEMPTS) break;
        context.logger?.warn?.("chat_omemo_iq_retry", {
          operation,
          attempt,
          to: input.to,
          error
        });
        await new Promise((resolve) => {
          setTimeout(resolve, OMEMO_IQ_RETRY_DELAY_MS * attempt);
        });
      }
    }
    throw lastError instanceof Error ? lastError : new Error(`chat_omemo_iq_failed:${operation}`);
  };
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
    const privateKey = nobleRandomBytes(32);
    const publicKey = x25519.getPublicKey(privateKey);
    const nextState = {
      bareJid,
      omemoDeviceId: Math.max(1, bytesToUint32(nobleRandomBytes(4))),
      identityPrivateKey: bytesToBase64(privateKey),
      identityPublicKey: bytesToBase64(publicKey)
    };
    await storage.setItem(stateKey(bareJid), JSON.stringify(nextState));
    cachedState = nextState;
    return nextState;
  };
  const fetchDeviceIds = async (context, address) => {
    const bareJid = normalizeBareDeviceId(address);
    if (!bareJid) throw new Error("xmpp_omemo_bare_jid_required");
    context.logger?.debug?.("chat_omemo_device_discovery_started", {
      bareJid,
      node: OMEMO_DEVICELIST_NODE
    });
    let stanza;
    try {
      stanza = await sendOmemoIq(
        context,
        {
          type: "get",
          to: bareJid,
          payload: xml(
            "pubsub",
            { xmlns: PUBSUB_NS },
            xml("items", { node: OMEMO_DEVICELIST_NODE, max_items: "1" })
          )
        },
        "discover-devices"
      );
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        context.logger?.debug?.("chat_omemo_devices_discovered", {
          bareJid,
          deviceIds: []
        });
        return [];
      }
      context.logger?.warn?.("chat_omemo_device_discovery_failed", {
        bareJid,
        error
      });
      throw error;
    }
    const deviceIds = /* @__PURE__ */ new Set();
    const pubsub = stanza.getChild?.("pubsub", PUBSUB_NS) ?? stanza.getChild?.("pubsub");
    const items = pubsub?.getChild?.("items");
    const itemElements = items?.getChildren?.("item") ?? [];
    for (const item of itemElements) {
      const list = item.getChild?.("list", OMEMO_NS) ?? item.getChild?.("list");
      const devices = list?.getChildren?.("device") ?? [];
      for (const device of devices) {
        const parsed = Number(device.attrs?.id ?? "0");
        if (Number.isSafeInteger(parsed) && parsed > 0) {
          deviceIds.add(parsed);
        }
      }
    }
    const discovered = Array.from(deviceIds);
    context.logger?.debug?.("chat_omemo_devices_discovered", {
      bareJid,
      deviceIds: discovered
    });
    return discovered;
  };
  const fetchIdentityKey = async (context, bareJid, deviceId) => {
    const bundleNode = `${OMEMO_BUNDLE_NODE_PREFIX}${deviceId}`;
    let stanza;
    try {
      stanza = await sendOmemoIq(
        context,
        {
          type: "get",
          to: bareJid,
          payload: xml(
            "pubsub",
            { xmlns: PUBSUB_NS },
            xml("items", { node: bundleNode, max_items: "1" })
          )
        },
        "fetch-identity"
      );
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
    const finalDeviceIds = Array.from(/* @__PURE__ */ new Set([state.omemoDeviceId, ...existingIds])).filter(
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
    await sendOmemoIq(
      context,
      {
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
      },
      "publish-devices"
    );
    await sendOmemoIq(
      context,
      {
        type: "set",
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml(
            "publish",
            { node: `${OMEMO_BUNDLE_NODE_PREFIX}${state.omemoDeviceId}` },
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
      },
      "publish-identity"
    );
    publishedBareJid = bareJid;
    context.logger?.debug?.("chat_omemo_identity_published", {
      bareJid,
      deviceId: state.omemoDeviceId,
      deviceIds: finalDeviceIds
    });
  };
  const startIdentityPublish = (context) => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid || publishedBareJid === bareJid) return Promise.resolve();
    if (identityPublishPromise) return identityPublishPromise;
    identityPublishPromise = publishIdentity(context).catch((error) => {
      context.logger?.warn?.("chat_omemo_identity_publish_failed", {
        bareJid,
        error
      });
    }).finally(() => {
      identityPublishPromise = null;
    });
    return identityPublishPromise;
  };
  const establishPeerSessions = async (context, toDeviceId) => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid) {
      throw new Error("xmpp_omemo_state_missing");
    }
    const state = await loadOrCreateState(bareJid);
    const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
    const peerBareJid = normalizeBareDeviceId(toDeviceId);
    const peerDeviceIds = await fetchDeviceIds(context, peerBareJid);
    if (!peerDeviceIds.length) {
      throw new Error("xmpp_omemo_peer_device_not_found");
    }
    const sessions = [];
    for (const peerDeviceId of peerDeviceIds) {
      try {
        const peerPublicKey = await fetchIdentityKey(
          context,
          peerBareJid,
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
      await startIdentityPublish(context);
    },
    encrypt: async (input, context) => {
      const bareJid = context.getBareDeviceId();
      if (!bareJid) {
        throw new Error("xmpp_omemo_state_missing");
      }
      if (publishedBareJid !== bareJid) {
        void startIdentityPublish(context);
      }
      const state = await loadOrCreateState(bareJid);
      const recipientBareJid = normalizeBareDeviceId(input.toDeviceId);
      const recipientSessions = await establishPeerSessions(context, recipientBareJid);
      const senderSessions = recipientBareJid === bareJid ? [] : await establishPeerSessions(context, bareJid);
      const sessions = [...recipientSessions, ...senderSessions];
      const iv = nobleRandomBytes(12);
      const contentKey = nobleRandomBytes(OMEMO_AES_KEY_BYTES);
      const plaintext = new TextEncoder().encode(
        JSON.stringify({
          body: input.body,
          ...input.metadata ? { metadata: input.metadata } : {},
          ...input.attachments?.length ? { attachments: serializeAttachmentsForWire(input.attachments) } : {}
        })
      );
      const ciphertext = gcm(contentKey, iv).encrypt(plaintext);
      const keyElements = sessions.map((session) => {
        const wrapSalt = nobleRandomBytes(OMEMO_KEY_WRAP_BYTES);
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
              { sid: String(state.omemoDeviceId) },
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
        if (rid !== state.omemoDeviceId) continue;
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
          metadata: isRecord(parsed.metadata) ? parsed.metadata : void 0,
          attachments: normalizeAttachmentPayload(parsed.attachments)
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
  const resource = normalizeResourceSegment(localDeviceId);
  const username = buildXmppUserLocalpart(userId);
  const deviceId = buildXmppUserResourceAddress(userId, domain, resource);
  return {
    service: buildXmppWebSocketUrl(domain, config.xmppWebSocketPath),
    uploadService: trimToUndefined(config.xmppUploadService) ?? `upload.${domain}`,
    apiKey: trimToUndefined(config.apiKey) ?? "",
    userId,
    localDeviceId,
    username,
    deviceId,
    displayName: trimToUndefined(config.displayName),
    password: config.authType === "x-oauth2" ? trimToUndefined(config.accessToken) : trimToUndefined(config.password),
    authType: config.authType ?? "password",
    domain,
    resource,
    connectTimeoutMs: config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    roomDirectory: config.roomDirectory,
    resolveRoomDeviceIds: config.resolveRoomDeviceIds,
    logger: config.logger,
    logLevel: normalizeLogLevel(config.logLevel, config.logger),
    encryption: config.encryption,
    attachmentService: config.attachmentService
  };
}
function extractProviderDirectMessageRoomId(metadata) {
  if (!metadata) return void 0;
  const lulaPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.providerDirectMessageRoomId,
    lulaPayload?.providerDirectMessageRoomId,
    lulaSubmission?.providerDirectMessageRoomId
  );
}
function extractSubmissionId(metadata) {
  if (!metadata) return void 0;
  const lulaPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.correlationId,
    lulaPayload?.correlationId,
    lulaSubmission?.correlationId
  );
}
function extractSubmissionRoomId(metadata) {
  if (!metadata) return void 0;
  const lulaPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : void 0;
  const lulaSubmission = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : void 0;
  return firstString(
    metadata.submissionRoomId,
    lulaPayload?.submissionRoomId,
    lulaSubmission?.submissionRoomId
  );
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
function normalizeMessageMetadata(metadata, fallbackType) {
  return {
    ...metadata ?? {},
    messageType: extractMessageType(metadata) ?? fallbackType
  };
}
function inferMessageType(metadata, body) {
  const metadataType = extractMessageType(metadata);
  if (metadataType) return metadataType;
  if (isRecord(metadata?.lulaPayload)) return "FORM_SUBMISSION";
  const payload = parseJsonRecord(body);
  if (payload?.type === "form_submission") return "FORM_SUBMISSION";
  if (payload && (isRecord(payload.readable) || isRecord(payload.raw))) return "FORM_SUBMISSION";
  return "CHAT_MESSAGE";
}
function buildChatMessageMetadata(input) {
  const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");
  const providerDirectMessageRoomId = firstString(
    input.context?.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata),
    input.roomId
  );
  if (providerDirectMessageRoomId) {
    metadata.providerDirectMessageRoomId = providerDirectMessageRoomId;
  }
  const submissionRoomId = firstString(
    input.context?.submissionRoomId,
    extractSubmissionRoomId(metadata)
  );
  if (submissionRoomId) {
    metadata.submissionRoomId = submissionRoomId;
  }
  const correlationId = firstString(
    input.context?.correlationId,
    extractSubmissionId(metadata)
  );
  if (correlationId) {
    metadata.correlationId = correlationId;
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
  const shouldWriteSubmissionContext = context && (typeof context.submissionRoomId === "string" || typeof context.correlationId === "string" || typeof context.senderName === "string" || typeof context.displayName === "string");
  if (shouldWriteSubmissionContext) {
    const existing = isRecord(metadata.lulaSubmission) ? metadata.lulaSubmission : {};
    const { providerDirectMessageRoomId: _providerDirectMessageRoomId, ...rest } = context;
    metadata.lulaSubmission = removeUndefinedValues({
      ...existing,
      ...rest,
      ...submissionRoomId ? { submissionRoomId } : {},
      ...correlationId ? { correlationId } : {},
      ...displayName ? { displayName } : {},
      ...providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}
    });
  }
  return metadata;
}
function buildFormSubmissionMetadata(input) {
  const metadata = normalizeMessageMetadata(input.metadata, "FORM_SUBMISSION");
  const providerDirectMessageRoomId = firstString(
    input.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata)
  );
  const submissionRoomId = firstString(
    input.submissionRoomId,
    extractSubmissionRoomId(metadata),
    input.roomId
  );
  const correlationId = firstString(
    input.correlationId,
    extractSubmissionId(metadata)
  );
  const existingPayload = isRecord(metadata.lulaPayload) ? metadata.lulaPayload : {};
  if (providerDirectMessageRoomId) {
    metadata.providerDirectMessageRoomId = providerDirectMessageRoomId;
  }
  if (submissionRoomId) {
    metadata.submissionRoomId = submissionRoomId;
  }
  if (correlationId) {
    metadata.correlationId = correlationId;
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
    submissionRoomId,
    correlationId,
    formId: input.formId,
    providerUserId: input.providerUserId,
    recordId: input.recordId,
    formVersion: input.formVersion,
    providerDirectMessageRoomId,
    submittedAt: input.submittedAt ?? (typeof existingPayload.submittedAt === "string" ? existingPayload.submittedAt : (/* @__PURE__ */ new Date()).toISOString())
  });
  return metadata;
}
function collectTargetDeviceIds(input) {
  return normalizeTransportAddressList([
    input.toDeviceId,
    input.peerDeviceId,
    ...input.toDeviceIds ?? [],
    ...input.peerDeviceIds ?? []
  ]);
}
function normalizeTransportAddress(value) {
  return addressToString(value)?.trim() ?? "";
}
function normalizeTransportAddressList(values) {
  const normalized = values.map((value) => normalizeTransportAddress(value)).filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}
function normalizeTargetAddressList(values, targetScope) {
  return targetScope === "user" ? normalizeDeviceIdList(values) : normalizeTransportAddressList(values);
}
function isOwnTransportTarget(target, ownTransportAddress, ownBareAddress) {
  const normalized = normalizeTransportAddress(target);
  if (!normalized) return true;
  if (ownTransportAddress && normalized === ownTransportAddress) return true;
  if (ownBareAddress && normalized === ownBareAddress) return true;
  return false;
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
    attachments: input.attachments,
    roomId: input.roomId,
    targetRoomId: input.targetRoomId,
    targetScope: input.targetScope,
    id: input.id,
    requestReceipt: input.requestReceipt
  };
}
function toChatTextMessage(message) {
  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata) ?? message.fromUserId;
  const lulaSubmission = isRecord(metadata?.lulaSubmission) ? metadata?.lulaSubmission : void 0;
  const context = removeUndefinedValues({
    ...lulaSubmission ?? {},
    ...providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {},
    ...submissionRoomId ? { submissionRoomId } : {},
    ...correlationId ? { correlationId } : {},
    ...displayName ? { displayName } : {}
  });
  return {
    ...message,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...submissionRoomId ? { submissionRoomId } : {},
    correlationId,
    displayName,
    ...Object.keys(context).length > 0 ? { context } : {}
  };
}
function toChatAttachmentMessage(message) {
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) {
    throw new Error("chat_attachment_message_missing_attachments");
  }
  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const lulaSubmission = isRecord(metadata?.lulaSubmission) ? metadata?.lulaSubmission : void 0;
  const context = removeUndefinedValues({
    ...lulaSubmission ?? {},
    ...providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {},
    ...submissionRoomId ? { submissionRoomId } : {},
    ...correlationId ? { correlationId } : {},
    ...displayName ? { displayName } : {}
  });
  return {
    ...message,
    attachments,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...submissionRoomId ? { submissionRoomId } : {},
    correlationId,
    ...displayName ? { displayName } : {},
    ...Object.keys(context).length > 0 ? { context } : {}
  };
}
function isFormSubmissionMessage(message) {
  const metadataType = extractMessageType(message.metadata);
  if (metadataType === "FORM_SUBMISSION") return true;
  return Boolean(parseFormSubmissionMessage(message));
}
function isAttachmentMessage(message) {
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) return false;
  if (message.metadata.attachment === true) return true;
  const metadataType = extractMessageType(message.metadata);
  return metadataType === "CHAT_MESSAGE";
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
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const normalizedFormPayload = normalizeFormSubmissionPayload(payload);
  return {
    ...message,
    metadata: normalizeMessageMetadata(metadata, "FORM_SUBMISSION"),
    answers: normalizedFormPayload.answers,
    fields: normalizedFormPayload.fields,
    payload,
    providerDirectMessageRoomId,
    ...submissionRoomId ? { submissionRoomId } : {},
    ...correlationId ? { correlationId } : {},
    formId: firstString(lulaPayload?.formId, payload.formId),
    providerUserId: firstString(lulaPayload?.providerUserId, payload.providerUserId),
    recordId: firstString(lulaPayload?.recordId, payload.recordId),
    formVersion: typeof lulaPayload?.formVersion === "number" ? lulaPayload.formVersion : typeof payload.formVersion === "number" ? payload.formVersion : void 0,
    submittedAt: firstString(lulaPayload?.submittedAt, payload.submittedAt),
    ...displayName ? { displayName } : {}
  };
}
function normalizeFormSubmissionPayload(payload) {
  const readable = isRecord(payload.readable) ? payload.readable : {};
  const raw = isRecord(payload.raw) ? payload.raw : {};
  const keys = Array.from(/* @__PURE__ */ new Set([...Object.keys(raw), ...Object.keys(readable)]));
  const answers = {};
  const fields = keys.map((key) => {
    const readableEntry = isRecord(readable[key]) ? readable[key] : void 0;
    const rawValue = raw[key];
    const value = readableEntry && "value" in readableEntry ? readableEntry.value : rawValue;
    answers[key] = stringifyAnswerValue(value);
    return {
      id: firstString(readableEntry?.id, readableEntry?.fieldId, key) ?? key,
      label: firstString(readableEntry?.label, key) ?? key,
      type: firstString(readableEntry?.type, readableEntry?.fieldType) ?? inferFieldType(value),
      required: readableEntry?.required === true
    };
  });
  return { answers, fields };
}
function stringifyAnswerValue(value) {
  if (value === void 0 || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}
function inferFieldType(value) {
  if (Array.isArray(value)) return "array";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (isRecord(value)) return "object";
  return "text";
}
function parseJsonRecord(input) {
  try {
    const parsed = JSON.parse(input);
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}
function serializeAttachmentsForWire(attachments) {
  return attachments.map((attachment) => {
    const normalized = normalizeRequiredAttachment(attachment);
    const { localUri: _localUri, ...rest } = normalized;
    return rest;
  });
}
function normalizeAttachmentPayload(value) {
  if (!Array.isArray(value)) return void 0;
  const attachments = value.map((entry) => normalizeAttachment(entry)).filter((entry) => Boolean(entry));
  return attachments.length ? attachments : void 0;
}
function normalizeRequiredAttachment(value) {
  const attachment = normalizeAttachment(value);
  if (!attachment) throw new Error("chat_attachment_invalid");
  return attachment;
}
function normalizeAttachment(value) {
  if (!isRecord(value)) return null;
  const id = firstString(value.id, value.url, value.localUri, value.thumbnailUrl);
  if (!id) return null;
  const type = normalizeAttachmentType(value);
  const metadata = isRecord(value.metadata) ? value.metadata : void 0;
  return removeUndefinedValues({
    id,
    type,
    name: firstString(value.name),
    mimeType: firstString(value.mimeType),
    size: typeof value.size === "number" && Number.isFinite(value.size) ? Math.max(0, Math.floor(value.size)) : void 0,
    url: firstString(value.url),
    thumbnailUrl: firstString(value.thumbnailUrl),
    localUri: firstString(value.localUri),
    width: typeof value.width === "number" && Number.isFinite(value.width) ? Math.max(0, Math.floor(value.width)) : void 0,
    height: typeof value.height === "number" && Number.isFinite(value.height) ? Math.max(0, Math.floor(value.height)) : void 0,
    metadata
  });
}
function normalizeAttachmentType(value) {
  const explicit = firstString(value.type)?.toLowerCase();
  if (explicit === "image" || explicit === "file") return explicit;
  const mimeType = firstString(value.mimeType)?.toLowerCase();
  if (mimeType?.startsWith("image/")) return "image";
  return "file";
}
function defaultAttachmentSource(attachment) {
  const direct = firstString(attachment.localUri, attachment.url);
  if (direct) return direct;
  const id = firstString(attachment.id);
  if (id && /^(https?:|file:)/i.test(id)) return id;
  return null;
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
  return `msg-${Date.now()}-${createRuntimeIdSuffix()}`;
}
function generateIqId() {
  return `iq-${Date.now()}-${createRuntimeIdSuffix()}`;
}
function parseUploadSlotResponse(stanza) {
  const raw = toRawXmlString(stanza);
  const putMatch = raw.match(/<put\b([^>]*)>([\s\S]*?)<\/put>/) ?? raw.match(/<put\b([^>]*)\/>/);
  const getMatch = raw.match(/<get\b([^>]*)\/>/) ?? raw.match(/<get\b([^>]*)>(?:[\s\S]*?)<\/get>/);
  if (!putMatch?.[1] || !getMatch?.[1]) {
    throw new Error("chat_attachment_upload_slot_invalid");
  }
  const putAttrs = parseXmlAttributes(putMatch[1]);
  const getAttrs = parseXmlAttributes(getMatch[1]);
  const putUrl = putAttrs.url?.trim();
  const getUrl = getAttrs.url?.trim();
  if (!putUrl || !getUrl) {
    throw new Error("chat_attachment_upload_slot_invalid");
  }
  const headers = {};
  const headerRegex = /<header\b([^>]*)>([\s\S]*?)<\/header>/g;
  let headerMatch = null;
  while ((headerMatch = headerRegex.exec(putMatch[2] ?? "")) !== null) {
    const attrs = parseXmlAttributes(headerMatch[1] ?? "");
    const name = attrs.name?.trim();
    const value = decodeXmlEntities((headerMatch[2] ?? "").trim());
    if (name && value) headers[name] = value;
  }
  return { putUrl, getUrl, headers };
}
function buildXmppUserLocalpart(userId) {
  return `i.${userId}`;
}
function buildXmppUserAddress(userId, xmppDomain) {
  return `${buildXmppUserLocalpart(userId)}@${xmppDomain}`;
}
function buildXmppUserResourceAddress(userId, xmppDomain, resource) {
  return `${buildXmppUserAddress(userId, xmppDomain)}/${resource}`;
}
function buildXmppWebSocketUrl(xmppDomain, path) {
  const fullUrl = trimToUndefined(path);
  if (fullUrl && /^wss?:\/\//i.test(fullUrl)) {
    return fullUrl;
  }
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
function getUserIdFromChatAddress(value) {
  const localpart = normalizeBareDeviceId(value).split("@")[0]?.trim();
  if (!localpart) return void 0;
  const withoutPrefix = localpart.startsWith("i.") ? localpart.slice(2) : localpart;
  const deviceMarker = withoutPrefix.indexOf(".d.");
  return (deviceMarker >= 0 ? withoutPrefix.slice(0, deviceMarker) : withoutPrefix) || void 0;
}
function normalizeDeviceIdSegment(value) {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return void 0;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const deviceMarker = localpart?.indexOf(".d.") ?? -1;
  return deviceMarker >= 0 ? localpart?.slice(deviceMarker + 3) || void 0 : localpart;
}
function normalizeBareDeviceId(deviceId) {
  return addressToString(deviceId)?.trim().split("/")[0] ?? "";
}
function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : void 0;
}
function normalizeResourceSegment(value) {
  const resource = value.trim().replace(/\s+/g, "-").replace(/\//g, "-");
  if (!resource) throw new Error("chat_resource_invalid");
  return resource;
}
function normalizeLogLevel(level, logger) {
  if (!logger) return "silent";
  if (!level) return "error";
  if (level in CHAT_LOG_LEVEL_WEIGHT) return level;
  throw new Error(`chat_log_level_invalid:${level}`);
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
    roomRecord.providerDirectMessageRoomId,
    roomRecord.id,
    roomRecord._id
  );
  if (!roomId) throw new Error("chat_room_id_required");
  const id = firstString(roomRecord.id, roomRecord._id);
  const peerDeviceIds = collectPeerDeviceIdsFromRoom(roomRecord, options);
  const ownDeviceIds = collectOwnDeviceIdsFromRoom(roomRecord, options);
  return {
    ...id ? { id } : {},
    roomId,
    ...peerDeviceIds.length ? { peerDeviceIds } : {},
    ...ownDeviceIds.length ? { ownDeviceIds } : {},
    raw: response
  };
}
function deriveFanoutDeviceIds(room) {
  return normalizeTransportAddressList([...room.peerDeviceIds ?? [], ...room.ownDeviceIds ?? []]);
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
  return normalizeTransportAddressList(candidates);
}
function collectOwnDeviceIdsFromRoom(room, options) {
  const candidates = [];
  const domain = normalizeXmppDomain(options.xmppDomain);
  const current = normalizeUserName(options.currentUserId);
  if (!current) {
    return [];
  }
  pushDeviceIdCandidates(candidates, room.selfDeviceId, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfDeviceIds, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfChatUserId, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfChatUserIds, domain, options.currentUserId);
  const userMetadata = Array.isArray(room.userMetadata) ? room.userMetadata : [];
  for (const entry of userMetadata) {
    if (!isRecord(entry)) continue;
    const entryNames = collectStringValues(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId
    ).map(normalizeUserName);
    if (!entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, options.currentUserId);
  }
  return normalizeTransportAddressList(candidates);
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
  const domain = normalizeXmppDomain(xmppDomain);
  const targetDomain = normalizeXmppDomain(trimmed.includes("@") ? trimmed.split("@")[1]?.split("/")[0] : void 0) ?? domain;
  const normalizedUserId = normalizeUserIdSegment(userId) ?? normalizeUserIdSegment(trimmed);
  if (normalizedUserId && targetDomain) {
    return getChatUserId({ username: normalizedUserId, domain: targetDomain });
  }
  if (trimmed.includes("@")) return normalizeBareDeviceId(trimmed);
  return domain ? getChatUserId({ username: trimmed, domain }) : trimmed;
}
function isValidOmemoState(value) {
  if (!isRecord(value)) return false;
  return typeof value.bareJid === "string" && value.bareJid.length > 0 && typeof value.omemoDeviceId === "number" && Number.isFinite(value.omemoDeviceId) && value.omemoDeviceId > 0 && typeof value.identityPrivateKey === "string" && value.identityPrivateKey.length > 0 && typeof value.identityPublicKey === "string" && value.identityPublicKey.length > 0;
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
function parseXmlAttributes(input) {
  const attributes = {};
  const pattern = /([a-zA-Z_:][\w:.-]*)\s*=\s*(['"])([\s\S]*?)\2/g;
  let match = null;
  while ((match = pattern.exec(input)) !== null) {
    const name = match[1]?.trim();
    const value = decodeXmlEntities(match[3] ?? "");
    if (name) attributes[name] = value;
  }
  return attributes;
}
function decodeXmlEntities(input) {
  return input.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&");
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
  createChatClient,
  createDeviceId,
  createIndexDbStorageBackend,
  createMemoryStorageBackend,
  createMongoDbStorageBackend,
  createOmemoEncryption,
  createRoomDirectory,
  extractDisplayName,
  extractProviderDirectMessageRoomId,
  extractSubmissionId,
  extractSubmissionRoomId,
  getChatAddress,
  getChatDeviceId,
  getChatUserId,
  init,
  storageBackends
};
//# sourceMappingURL=index.mjs.map