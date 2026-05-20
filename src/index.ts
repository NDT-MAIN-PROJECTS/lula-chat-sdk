import { gcm } from "@noble/ciphers/aes.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { client as createXmppClient, xml } from "@xmpp/client";
import saslMechanisms from "saslmechanisms";

export type Unsubscribe = () => void;

export type ChatStatus =
  | "idle"
  | "connecting"
  | "online"
  | "offline"
  | "stopping"
  | "error";

export type ChatDeliveryStatus = "delivered" | "read";

export const chatResources = [
  "server-client",
  "ios-primary-client",
  "android-primary-client",
  "ios-secondary-client",
  "android-secondary-client",
] as const;

export type ChatResource = (typeof chatResources)[number];

export type ChatLogger = {
  debug?: (message: string, data?: Record<string, unknown>) => void;
  info?: (message: string, data?: Record<string, unknown>) => void;
  warn?: (message: string, data?: Record<string, unknown>) => void;
  error?: (message: string, data?: Record<string, unknown>) => void;
};

export type ChatRoomLookupInput = {
  userName: string;
  metadata?: Record<string, unknown>;
};

export type ChatRoom = {
  id?: string;
  roomId: string;
  peerJids?: string[];
  raw?: unknown;
};

export type ChatRoomDirectoryOptions = {
  currentUserName?: string;
  jidDomain?: string;
  getOrCreateRoom?: (input: ChatRoomLookupInput) => Promise<unknown> | unknown;
  getRoom?: (roomId: string) => Promise<unknown> | unknown;
};

export type ChatRoomDirectory = {
  getPeerJids: (roomId: string) => Promise<string[]> | string[];
  getOrCreateRoom?: (input: ChatRoomLookupInput) => Promise<ChatRoom> | ChatRoom;
};

export type ChatKeyValueStore = {
  getItem: (key: string) => Promise<string | null | undefined> | string | null | undefined;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem?: (key: string) => Promise<void> | void;
};

export type IndexDbStorageOptions = {
  dbName?: string;
  storeName?: string;
};

export type MongoDbStorageDocument = Record<string, unknown>;

export type MongoDbStorageCollection = {
  findOne: (
    filter: Record<string, unknown>,
  ) => Promise<MongoDbStorageDocument | null> | MongoDbStorageDocument | null;
  updateOne: (
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
  deleteOne: (filter: Record<string, unknown>) => Promise<unknown> | unknown;
};

export type MongoDbStorageOptions = {
  collection: MongoDbStorageCollection;
  keyField?: string;
  valueField?: string;
  updatedAtField?: string;
};

export type ChatClientConfig = {
  xmppServer?: string;
  service?: string;
  userName?: string;
  username?: string;
  JID?: string;
  jid?: string;
  password?: string;
  accessToken?: string;
  token?: string;
  authType?: "password" | "x-oauth2";
  domain?: string;
  resource?: ChatResource;
  autoReconnect?: boolean;
  connectTimeoutMs?: number;
  roomDirectory?: ChatRoomDirectory;
  resolveRoomJids?: (roomId: string) => Promise<string[]> | string[];
  logger?: ChatLogger;
  encryption?: ChatEncryption;
};

export type ChatMessage = {
  id: string;
  fromJid: string;
  toJid?: string;
  roomId?: string;
  body: string;
  timestamp: number;
  metadata?: Record<string, unknown>;
  raw?: unknown;
};

export type ChatMessageContext = {
  type?: "direct" | "form_thread" | string;
  providerChatRoomId?: string;
  submissionId?: string;
  senderName?: string;
  [key: string]: unknown;
};

export type ChatMessageInput = {
  toJid?: string;
  toJids?: string[];
  peerJid?: string;
  peerJids?: string[];
  body: string;
  roomId?: string;
  targetRoomId?: string;
  metadata?: Record<string, unknown>;
  id?: string;
  requestReceipt?: boolean;
};

export type ChatTextMessageInput = Omit<ChatMessageInput, "metadata"> & {
  metadata?: Record<string, unknown>;
  context?: ChatMessageContext;
};

export type ChatTextMessage = ChatMessage & {
  context?: ChatMessageContext;
  providerChatRoomId?: string;
  submissionId?: string;
};

export type ChatFormSubmissionInput = Omit<ChatMessageInput, "body" | "metadata"> & {
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  formId?: string;
  providerUserId?: string;
  recordId?: string;
  formVersion?: number;
  providerChatRoomId?: string;
  submittedAt?: string;
  pretty?: boolean;
};

export type ChatFormSubmissionMessage = ChatMessage & {
  payload: Record<string, unknown>;
  providerChatRoomId?: string;
  formId?: string;
  providerUserId?: string;
  recordId?: string;
  formVersion?: number;
  submittedAt?: string;
};

export type ChatTypingInput = {
  roomId: string;
  peerJid?: string;
  peerJids?: string[];
  toJid?: string;
  toJids?: string[];
  isTyping?: boolean;
  autoPauseMs?: number;
  id?: string;
};

export type ChatDisplayedInput = {
  roomId: string;
  messageId: string;
  peerJid?: string;
  peerJids?: string[];
  toJid?: string;
  toJids?: string[];
  id?: string;
};

export type ChatTypingEvent = {
  fromJid: string;
  toJid?: string;
  roomId?: string;
  isTyping: boolean;
  raw?: unknown;
};

export type ChatDeliveryEvent = {
  id: string;
  fromJid: string;
  toJid?: string;
  roomId?: string;
  status: ChatDeliveryStatus;
  raw?: unknown;
};

export type ChatErrorEvent = {
  id?: string;
  fromJid?: string;
  toJid?: string;
  roomId?: string;
  condition?: string;
  text?: string;
  error?: unknown;
  raw?: unknown;
};

export type ChatStatusEvent = {
  status: ChatStatus;
  jid?: string;
  error?: unknown;
};

export type ChatEncryptInput = {
  toJid: string;
  body: string;
  metadata?: Record<string, unknown>;
};

export type ChatEncodedPayload = {
  body?: string;
  children?: XmppChild[];
};

export type ChatDecryptInput = {
  stanza: XmppElementLike;
};

export type ChatDecryptedMessage = {
  body: string;
  metadata?: Record<string, unknown>;
};

export type ChatEncryptionContext = {
  getBareJid: () => string | undefined;
  getJid: () => string | undefined;
  sendIq: (input: {
    type: "get" | "set";
    payload: XmppChild;
    to?: string;
    timeoutMs?: number;
  }) => Promise<XmppElementLike>;
  logger?: ChatLogger;
};

export type ChatEncryption = {
  onConnect?: (context: ChatEncryptionContext) => Promise<void> | void;
  encrypt: (
    input: ChatEncryptInput,
    context: ChatEncryptionContext,
  ) => Promise<ChatEncodedPayload | XmppChild[]> | ChatEncodedPayload | XmppChild[];
  decrypt: (
    input: ChatDecryptInput,
    context: ChatEncryptionContext,
  ) => Promise<ChatDecryptedMessage | null> | ChatDecryptedMessage | null;
};

export type OmemoEncryptionOptions = {
  storage?: ChatKeyValueStore;
  stateKeyPrefix?: string;
};

export type ChatClient = {
  connect: () => Promise<void>;
  stop: () => Promise<void>;
  getOrCreateRoom: {
    (userName: string, metadata?: Record<string, unknown>): Promise<ChatRoom>;
    (input: ChatRoomLookupInput): Promise<ChatRoom>;
  };
  getPeerJids: (roomId: string) => Promise<string[]>;
  sendChatMessage: {
    (message: ChatTextMessageInput): Promise<string>;
    (
      roomId: string,
      body: string,
      options?: Omit<ChatTextMessageInput, "roomId" | "body">,
    ): Promise<string>;
  };
  sendFormSubmission: (message: ChatFormSubmissionInput) => Promise<string>;
  sendMessage: {
    (message: ChatMessageInput): Promise<string>;
    (
      roomId: string,
      body: string,
      options?: Omit<ChatMessageInput, "roomId" | "body">,
    ): Promise<string>;
  };
  sendTyping: {
    (roomId: string, options?: Omit<ChatTypingInput, "roomId">): Promise<void>;
    (input: ChatTypingInput): Promise<void>;
  };
  sendDisplayed: {
    (roomId: string, messageId: string, options?: Omit<ChatDisplayedInput, "roomId" | "messageId">): Promise<void>;
    (input: ChatDisplayedInput): Promise<void>;
  };
  markRead: {
    (roomId: string, messageId: string, options?: Omit<ChatDisplayedInput, "roomId" | "messageId">): Promise<void>;
    (input: ChatDisplayedInput): Promise<void>;
  };
  onMessage: (listener: (message: ChatMessage) => void) => Unsubscribe;
  onChatMessage: (listener: (message: ChatTextMessage) => void) => Unsubscribe;
  onFormSubmission: (listener: (message: ChatFormSubmissionMessage) => void) => Unsubscribe;
  onTyping: (listener: (event: ChatTypingEvent) => void) => Unsubscribe;
  onDelivery: (listener: (event: ChatDeliveryEvent) => void) => Unsubscribe;
  onError: (listener: (event: ChatErrorEvent) => void) => Unsubscribe;
  onStatus: (listener: (event: ChatStatusEvent) => void) => Unsubscribe;
  getStatus: () => ChatStatus;
  getJid: () => string | undefined;
  getBareJid: () => string | undefined;
};

type XmppClientLike = ReturnType<typeof createXmppClient>;
type XmppChild = ReturnType<typeof xml>;

type XmppElementLike = {
  attrs?: Record<string, string>;
  is?: (name: string, ns?: string) => boolean;
  getChild?: (name: string, ns?: string) => XmppElementLike | null | undefined;
  getChildren?: (name: string, ns?: string) => XmppElementLike[];
  getChildText?: (name: string, ns?: string) => string | null | undefined;
  getText?: () => string;
  toString?: () => string;
};

type PendingIq = {
  resolve: (stanza: XmppElementLike) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
};

const XMPP_CHAT_NS = "urn:lula:defy:chat:1";
const XMPP_RECEIPTS_NS = "urn:xmpp:receipts";
const XMPP_CHAT_MARKERS_NS = "urn:xmpp:chat-markers:0";
const XMPP_CHATSTATES_NS = "http://jabber.org/protocol/chatstates";
const OMEMO_NS = "eu.siacs.conversations.axolotl";
const OMEMO_DEVICELIST_NODE = "eu.siacs.conversations.axolotl.devicelist";
const OMEMO_BUNDLE_NODE_PREFIX = "eu.siacs.conversations.axolotl.bundles:";
const OMEMO_AES_KEY_BYTES = 16;
const OMEMO_KEY_WRAP_BYTES = 16;
const OMEMO_KEY_WRAP_BUNDLE_BYTES = OMEMO_KEY_WRAP_BYTES * 2;
const OMEMO_INFO = new TextEncoder().encode("lula-defy-omemo-v1");
const OMEMO_WRAP_INFO = new TextEncoder().encode("lula-defy-omemo-wrap-v1");
const PUBSUB_NS = "http://jabber.org/protocol/pubsub";
const XDATA_NS = "jabber:x:data";
const DEFAULT_CONNECT_TIMEOUT_MS = 15000;
const DEFAULT_IQ_TIMEOUT_MS = 15000;
const DEFAULT_TYPING_AUTO_PAUSE_MS = 10000;
const DEFAULT_OMEMO_STATE_KEY_PREFIX = "chat_sdk_omemo_state";

class XOauth2Mechanism {
  public name = "X-OAUTH2";

  public clientFirst = true;

  public response({
    username,
    password,
  }: {
    username?: string | null;
    password?: string | null;
  }): string {
    return `\u0000${String(username || "")}\u0000${String(password || "")}`;
  }

  public challenge(): this {
    return this;
  }
}

let xOAuth2Registered = false;

function registerXOAuth2Preference(): void {
  if (xOAuth2Registered) return;

  const moduleValue = saslMechanisms as {
    Factory?: { prototype?: { use?: (...args: unknown[]) => unknown } };
    default?: { Factory?: { prototype?: { use?: (...args: unknown[]) => unknown } } };
  };
  const Factory = moduleValue.Factory ?? moduleValue.default?.Factory;
  const prototype = Factory?.prototype;
  const originalUse = prototype?.use;
  if (!prototype || typeof originalUse !== "function") return;

  prototype.use = function patchedUse(this: { _mechs?: { name?: string }[] }) {
    const result = originalUse.apply(this, arguments as unknown as Parameters<typeof originalUse>);
    const index = this._mechs?.findIndex(
      (entry) => String(entry?.name || "").toUpperCase() === "X-OAUTH2",
    );
    if (typeof index === "number" && index > 0) {
      const [entry] = this._mechs!.splice(index, 1);
      if (entry) this._mechs!.unshift(entry);
    }
    return result;
  };

  xOAuth2Registered = true;
}

export function init(config: ChatClientConfig): ChatClient {
  return new LulaChatClient(config);
}

export function createChatClient(config: ChatClientConfig): ChatClient {
  return init(config);
}

export function createRoomDirectory(options: ChatRoomDirectoryOptions): ChatRoomDirectory {
  const roomCache = new Map<string, ChatRoom>();

  const rememberRoom = (room: ChatRoom) => {
    roomCache.set(room.roomId, room);
    if (room.id) roomCache.set(room.id, room);
    return room;
  };

  return {
    getPeerJids: async (roomId) => {
      const normalizedRoomId = roomId.trim();
      if (!normalizedRoomId) return [];

      const cached = roomCache.get(normalizedRoomId);
      if (cached?.peerJids?.length) return cached.peerJids;

      if (!options.getRoom) return [];
      const room = normalizeChatRoomResponse(await options.getRoom(normalizedRoomId), options);
      return rememberRoom(room).peerJids ?? [];
    },
    getOrCreateRoom: options.getOrCreateRoom
      ? async (input) => {
          const room = normalizeChatRoomResponse(await options.getOrCreateRoom!(input), options);
          return rememberRoom(room);
        }
      : undefined,
  };
}

class LulaChatClient implements ChatClient {
  private readonly config: NormalizedConfig;

  private readonly messageListeners = new Set<(message: ChatMessage) => void>();

  private readonly typingListeners = new Set<(event: ChatTypingEvent) => void>();

  private readonly deliveryListeners = new Set<(event: ChatDeliveryEvent) => void>();

  private readonly errorListeners = new Set<(event: ChatErrorEvent) => void>();

  private readonly statusListeners = new Set<(event: ChatStatusEvent) => void>();

  private xmpp: XmppClientLike | null = null;

  private status: ChatStatus = "idle";

  private connectPromise: Promise<void> | null = null;

  private readonly pendingIqMap = new Map<string, PendingIq>();

  private onlineJid?: string;

  private readonly roomPeers = new Map<string, Set<string>>();

  private readonly typingAutoPauseTimers = new Map<string, ReturnType<typeof setTimeout>>();

  public constructor(config: ChatClientConfig) {
    this.config = normalizeConfig(config);
  }

  public async connect(): Promise<void> {
    if (this.status === "online" && this.xmpp) return;
    if (this.connectPromise) return this.connectPromise;

    this.connectPromise = this.connectFresh();
    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }

  public async stop(): Promise<void> {
    this.setStatus("stopping");
    for (const timer of this.typingAutoPauseTimers.values()) {
      clearTimeout(timer);
    }
    this.typingAutoPauseTimers.clear();
    const current = this.xmpp;
    this.xmpp = null;
    this.onlineJid = undefined;
    if (current) {
      await current.stop();
    }
    this.setStatus("offline");
  }

  public async getPeerJids(roomId: string): Promise<string[]> {
    return this.resolveRoomJids(roomId);
  }

  public async getOrCreateRoom(
    inputOrUserName: ChatRoomLookupInput | string,
    metadata?: Record<string, unknown>,
  ): Promise<ChatRoom> {
    const input =
      typeof inputOrUserName === "string"
        ? { userName: inputOrUserName, metadata }
        : inputOrUserName;
    return this.resolveRoomForUserName(input);
  }

  public async sendChatMessage(
    inputOrRoomId: ChatTextMessageInput | string,
    body?: string,
    options?: Omit<ChatTextMessageInput, "roomId" | "body">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, body: body ?? "" }
        : inputOrRoomId;
    const metadata = buildChatMessageMetadata(input);
    const providerChatRoomId = extractProviderChatRoomId(metadata);
    return this.sendMessage({
      ...input,
      metadata,
      targetRoomId: input.targetRoomId ?? providerChatRoomId ?? input.roomId,
    });
  }

  public async sendFormSubmission(input: ChatFormSubmissionInput): Promise<string> {
    const metadata = buildFormSubmissionMetadata(input);
    const providerChatRoomId = extractProviderChatRoomId(metadata);
    return this.sendMessage({
      ...pickMessageTargetInput(input),
      body: JSON.stringify(input.payload, null, input.pretty ? 2 : undefined),
      metadata,
      targetRoomId: input.targetRoomId ?? providerChatRoomId ?? input.roomId,
    });
  }

  public async sendMessage(
    inputOrToJid: ChatMessageInput | string,
    body?: string,
    options?: Omit<ChatMessageInput, "roomId" | "body">,
  ): Promise<string> {
    const input =
      typeof inputOrToJid === "string"
        ? { ...(options ?? {}), roomId: inputOrToJid, body: body ?? "" }
        : inputOrToJid;
    const messageBody = input.body ?? "";
    if (!messageBody.trim()) throw new Error("chat_body_required");

    await this.connect();
    const xmpp = this.requireXmpp();
    const id = input.id || generateMessageId();
    const roomId = input.roomId?.trim();
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetJids = await this.resolveRoomTargets({
      roomId: targetRoomId,
      explicitJids: collectTargetJids(input),
    });

    await this.sendToTargets(targetJids, async (toJid) => {
      const encodedPayload = await this.encodePayload({
        toJid,
        body: messageBody,
        metadata: input.metadata,
      });
      const children: XmppChild[] = [
        xml("body", {}, encodedPayload.body ?? messageBody),
        ...encodedPayload.children,
      ];

      if (roomId) children.push(xml("thread", {}, roomId));
      if (input.requestReceipt !== false) {
        children.push(xml("request", { xmlns: XMPP_RECEIPTS_NS }));
        children.push(xml("markable", { xmlns: XMPP_CHAT_MARKERS_NS }));
      }

      await xmpp.send(xml("message", { to: toJid, type: "chat", id }, ...children));
    });
    this.rememberRoomPeers(roomId, targetJids);
    if (targetRoomId && targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetJids);
    }
    return id;
  }

  public async sendTyping(
    inputOrRoomId: ChatTypingInput | string,
    options?: Omit<ChatTypingInput, "roomId">,
  ): Promise<void> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId }
        : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const isTyping = input.isTyping ?? true;
    const targetJids = await this.resolveRoomTargets({
      roomId,
      explicitJids: collectTargetJids(input),
    });

    this.rememberRoomPeers(roomId, targetJids);
    this.clearTypingAutoPause(roomId);
    await this.connect();
    const children: XmppChild[] = [];
    children.push(xml("thread", {}, roomId));
    children.push(xml(isTyping ? "composing" : "paused", { xmlns: XMPP_CHATSTATES_NS }));
    await this.sendToTargets(targetJids, (toJid) =>
      this.requireXmpp().send(
        xml("message", {
          to: toJid,
          type: "chat",
          id: input.id || `typing-${Date.now()}`,
        }, ...children),
      ),
    );

    if (isTyping) {
      this.scheduleTypingAutoPause(roomId, input.autoPauseMs ?? DEFAULT_TYPING_AUTO_PAUSE_MS);
    }
  }

  public async sendDisplayed(
    inputOrRoomId: ChatDisplayedInput | string,
    messageId?: string,
    options?: Omit<ChatDisplayedInput, "roomId" | "messageId">,
  ): Promise<void> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, messageId: messageId ?? "" }
        : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.messageId.trim()) throw new Error("chat_message_id_required");
    const targetJids = await this.resolveRoomTargets({
      roomId,
      explicitJids: collectTargetJids(input),
    });

    this.rememberRoomPeers(roomId, targetJids);
    await this.connect();
    const children: XmppChild[] = [
      xml("displayed", { xmlns: XMPP_CHAT_MARKERS_NS, id: input.messageId }),
    ];
    children.unshift(xml("thread", {}, roomId));
    await this.sendToTargets(targetJids, (toJid) =>
      this.requireXmpp().send(
        xml("message", {
          to: toJid,
          type: "chat",
          id: input.id || `displayed-${Date.now()}`,
        }, ...children),
      ),
    );
  }

  public markRead(
    inputOrRoomId: ChatDisplayedInput | string,
    messageId?: string,
    options?: Omit<ChatDisplayedInput, "roomId" | "messageId">,
  ): Promise<void> {
    return typeof inputOrRoomId === "string"
      ? this.sendDisplayed(inputOrRoomId, messageId ?? "", options)
      : this.sendDisplayed(inputOrRoomId);
  }

  public onMessage(listener: (message: ChatMessage) => void): Unsubscribe {
    return addListener(this.messageListeners, listener);
  }

  public onChatMessage(listener: (message: ChatTextMessage) => void): Unsubscribe {
    return this.onMessage((message) => {
      if (parseFormSubmissionMessage(message)) return;
      listener(toChatTextMessage(message));
    });
  }

  public onFormSubmission(listener: (message: ChatFormSubmissionMessage) => void): Unsubscribe {
    return this.onMessage((message) => {
      const parsed = parseFormSubmissionMessage(message);
      if (parsed) listener(parsed);
    });
  }

  public onTyping(listener: (event: ChatTypingEvent) => void): Unsubscribe {
    return addListener(this.typingListeners, listener);
  }

  public onDelivery(listener: (event: ChatDeliveryEvent) => void): Unsubscribe {
    return addListener(this.deliveryListeners, listener);
  }

  public onError(listener: (event: ChatErrorEvent) => void): Unsubscribe {
    return addListener(this.errorListeners, listener);
  }

  public onStatus(listener: (event: ChatStatusEvent) => void): Unsubscribe {
    const unsubscribe = addListener(this.statusListeners, listener);
    listener({ status: this.status, jid: this.onlineJid });
    return unsubscribe;
  }

  public getStatus(): ChatStatus {
    return this.status;
  }

  public getJid(): string | undefined {
    return this.onlineJid ?? this.config.jid;
  }

  public getBareJid(): string | undefined {
    return normalizeBareJid(this.getJid());
  }

  private async connectFresh(): Promise<void> {
    this.setStatus("connecting");
    registerXOAuth2Preference();
    const xmpp = createXmppClient({
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      credentials: this.createCredentials() as never,
    });

    this.xmpp = xmpp;
    registerXOAuth2OnClient(xmpp);
    this.bindXmppEvents(xmpp);

    try {
      await withTimeout(
        xmpp.start(),
        this.config.connectTimeoutMs,
        "chat_connect_timeout",
      );
    } catch (error) {
      this.xmpp = null;
      this.setStatus("error", error);
      await safeStop(xmpp);
      throw error;
    }
  }

  private createCredentials(): unknown {
    const username = this.config.username;
    const secret = this.config.password;
    if (!secret) return { username };

    if (this.config.authType === "x-oauth2") {
      return async (
        authenticate: (
          credentials: { username?: string; password?: string },
          mechanism: string,
          userAgent?: unknown,
        ) => Promise<void>,
        mechanisms: string[],
      ) => {
        const picked = pickMechanism(mechanisms, ["X-OAUTH2", "PLAIN"]);
        if (!picked) {
          throw new Error(`chat_no_usable_auth_mechanism:${mechanisms.join(",")}`);
        }
        await authenticate(
          { username, password: secret },
          picked,
          xml("user-agent", { id: "lulafi-chat-sdk" }),
        );
      };
    }

    return { username, password: secret };
  }

  private bindXmppEvents(xmpp: XmppClientLike): void {
    xmpp.on("online", async (address: unknown) => {
      this.onlineJid = addressToString(address) ?? this.config.jid;
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
      this.onlineJid = undefined;
      this.rejectPendingIq(new Error("chat_iq_offline"));
    });

    xmpp.on("error", (error: unknown) => {
      this.emit(this.errorListeners, { error });
      this.setStatus("error", error);
    });

    xmpp.on("stanza", (stanza: XmppElementLike) => {
      this.handleStanza(stanza).catch((error: unknown) => {
        this.emit(this.errorListeners, { error, raw: stanza });
      });
    });
  }

  private async handleStanza(stanza: XmppElementLike): Promise<void> {
    this.resolvePendingIq(stanza);
    if (!stanza.is?.("message")) return;

    const attrs = stanza.attrs ?? {};
    const fromJid = normalizeBareJid(attrs.from) || attrs.from || "";
    const roomId = trimToUndefined(stanza.getChildText?.("thread") ?? undefined);
    this.rememberRoomPeer(roomId, fromJid);

    const receipt = stanza.getChild?.("received", XMPP_RECEIPTS_NS);
    const markerReceived = stanza.getChild?.("received", XMPP_CHAT_MARKERS_NS);
    const displayed = stanza.getChild?.("displayed", XMPP_CHAT_MARKERS_NS);
    const receiptId = receipt?.attrs?.id ?? markerReceived?.attrs?.id;
    if (receiptId) {
      this.emit(this.deliveryListeners, {
        id: receiptId,
        fromJid,
        toJid: attrs.to,
        roomId,
        status: "delivered",
        raw: stanza,
      });
      return;
    }

    if (displayed?.attrs?.id) {
      this.emit(this.deliveryListeners, {
        id: displayed.attrs.id,
        fromJid,
        toJid: attrs.to,
        roomId,
        status: "read",
        raw: stanza,
      });
      return;
    }

    if (attrs.type === "error") {
      const errorEvent = parseStanzaError(stanza);
      this.emit(this.errorListeners, {
        ...errorEvent,
        id: attrs.id,
        fromJid,
        toJid: attrs.to,
        roomId,
        raw: stanza,
      });
      return;
    }

    const composing = stanza.getChild?.("composing", XMPP_CHATSTATES_NS);
    const paused = stanza.getChild?.("paused", XMPP_CHATSTATES_NS);
    if (composing || paused) {
      this.emit(this.typingListeners, {
        fromJid,
        toJid: attrs.to,
        roomId,
        isTyping: Boolean(composing),
        raw: stanza,
      });
    }

    const decoded = await this.decodePayload(stanza);
    const body = decoded.body;
    if (!body.trim()) return;

    this.emit(this.messageListeners, {
      id: attrs.id || generateMessageId(),
      fromJid,
      toJid: attrs.to,
      roomId,
      body,
      timestamp: parseDelayTimestamp(stanza) ?? parseMetadataTimestamp(decoded.metadata) ?? Date.now(),
      metadata: decoded.metadata,
      raw: stanza,
    });

    const receiptRequest = stanza.getChild?.("request", XMPP_RECEIPTS_NS);
    if (attrs.id && receiptRequest && fromJid) {
      await this.sendReceipt({ toJid: fromJid, roomId, messageId: attrs.id });
    }
  }

  private async sendReceipt(input: {
    toJid: string;
    roomId?: string;
    messageId: string;
  }): Promise<void> {
    const children: XmppChild[] = [
      xml("received", { xmlns: XMPP_RECEIPTS_NS, id: input.messageId }),
    ];
    if (input.roomId) children.unshift(xml("thread", {}, input.roomId));
    await this.requireXmpp().send(
      xml("message", {
        to: input.toJid,
        type: "chat",
        id: `rcpt-${Date.now()}`,
      }, ...children),
    );
  }

  private getEncryptionContext(): ChatEncryptionContext {
    return {
      getBareJid: () => this.getBareJid(),
      getJid: () => this.getJid(),
      sendIq: (input) => this.sendIq(input),
      logger: this.config.logger,
    };
  }

  private rememberRoomPeer(roomId?: string, peerJid?: string): void {
    const normalizedRoomId = roomId?.trim();
    const normalizedPeerJid = normalizeBareJid(peerJid);
    if (!normalizedRoomId || !normalizedPeerJid) return;
    if (normalizedPeerJid === this.getBareJid()) return;
    const peers = this.roomPeers.get(normalizedRoomId) ?? new Set<string>();
    peers.add(normalizedPeerJid);
    this.roomPeers.set(normalizedRoomId, peers);
  }

  private rememberRoomPeers(roomId?: string, peerJids?: string[]): void {
    peerJids?.forEach((peerJid) => this.rememberRoomPeer(roomId, peerJid));
  }

  private async resolveRoomForUserName(input: ChatRoomLookupInput): Promise<ChatRoom> {
    const userName = input.userName.trim();
    if (!userName) throw new Error("chat_username_required");
    const provider = this.config.roomDirectory?.getOrCreateRoom;
    if (!provider) throw new Error("chat_room_directory_get_or_create_required");
    const room = await provider({ userName, metadata: input.metadata });
    const normalizedRoomId = room.roomId.trim();
    if (!normalizedRoomId) throw new Error("chat_room_id_required");
    this.rememberRoomPeers(normalizedRoomId, room.peerJids);
    return { ...room, roomId: normalizedRoomId };
  }

  private async resolveRoomTargets(input: {
    roomId?: string;
    explicitJids?: string[];
  }): Promise<string[]> {
    const explicit = normalizeJidList(input.explicitJids ?? []);
    if (input.roomId) this.rememberRoomPeers(input.roomId, explicit);
    const resolverJids = input.roomId ? await this.getPeerJids(input.roomId) : [];
    const cachedJids = input.roomId ? this.getCachedRoomPeers(input.roomId) : [];
    const targets = normalizeJidList([...explicit, ...resolverJids, ...cachedJids]).filter(
      (jid) => jid !== this.getBareJid(),
    );
    if (!targets.length) {
      const suffix = input.roomId ? `:${input.roomId}` : "";
      throw new Error(`chat_room_peer_unknown${suffix}`);
    }
    return targets;
  }

  private getCachedRoomPeers(roomId: string): string[] {
    return Array.from(this.roomPeers.get(roomId.trim()) ?? []);
  }

  private async resolveRoomJids(roomId: string): Promise<string[]> {
    const normalizedRoomId = roomId.trim();
    if (!normalizedRoomId) return [];
    if (this.config.roomDirectory?.getPeerJids) {
      const resolved = await this.config.roomDirectory.getPeerJids(normalizedRoomId);
      return normalizeJidList(resolved);
    }
    if (!this.config.resolveRoomJids) return [];
    const resolved = await this.config.resolveRoomJids(normalizedRoomId);
    return normalizeJidList(resolved);
  }

  private async sendToTargets(
    targetJids: string[],
    send: (targetJid: string) => Promise<unknown>,
  ): Promise<void> {
    const targets = normalizeJidList(targetJids);
    if (!targets.length) throw new Error("chat_targets_required");

    const results = await Promise.all(
      targets.map(async (targetJid) => {
        try {
          await send(targetJid);
          return { ok: true as const };
        } catch (error) {
          return { ok: false as const, error };
        }
      }),
    );
    if (results.some((result) => result.ok)) return;
    throw results.find((result) => !result.ok)?.error ?? new Error("chat_send_failed");
  }

  private clearTypingAutoPause(roomId: string): void {
    const timer = this.typingAutoPauseTimers.get(roomId);
    if (!timer) return;
    clearTimeout(timer);
    this.typingAutoPauseTimers.delete(roomId);
  }

  private scheduleTypingAutoPause(roomId: string, delayMs: number): void {
    if (!Number.isFinite(delayMs) || delayMs <= 0) return;
    const timer = setTimeout(() => {
      this.typingAutoPauseTimers.delete(roomId);
      this.sendTyping({ roomId, isTyping: false }).catch((error: unknown) => {
        this.emit(this.errorListeners, { error, roomId });
      });
    }, delayMs);
    this.typingAutoPauseTimers.set(roomId, timer);
  }

  private async encodePayload(
    input: ChatEncryptInput,
  ): Promise<Required<ChatEncodedPayload>> {
    const encrypted = await this.config.encryption?.encrypt?.(input, this.getEncryptionContext());
    if (Array.isArray(encrypted)) return { body: input.body, children: encrypted };
    if (encrypted) {
      return {
        body: encrypted.body ?? input.body,
        children: encrypted.children ?? [],
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
            metadata: input.metadata,
          }),
        ),
      ],
    };
  }

  private async decodePayload(stanza: XmppElementLike): Promise<ChatDecryptedMessage> {
    const decrypted = await this.config.encryption?.decrypt?.(
      { stanza },
      this.getEncryptionContext(),
    );
    if (decrypted) return decrypted;

    const body = stanza.getChildText?.("body") ?? "";
    const encodedMetadata = stanza.getChild?.("lula", XMPP_CHAT_NS)?.getText?.();
    const metadataPayload = encodedMetadata ? decodeJsonBase64(encodedMetadata) : null;
    const metadata =
      metadataPayload &&
      typeof metadataPayload === "object" &&
      !Array.isArray(metadataPayload) &&
      isRecord((metadataPayload as Record<string, unknown>).metadata)
        ? (metadataPayload as { metadata: Record<string, unknown> }).metadata
        : undefined;

    return { body, metadata };
  }

  private setStatus(status: ChatStatus, error?: unknown): void {
    this.status = status;
    this.emit(this.statusListeners, { status, jid: this.onlineJid, error });
  }

  private requireXmpp(): XmppClientLike {
    if (!this.xmpp) throw new Error("chat_client_not_connected");
    return this.xmpp;
  }

  private resolvePendingIq(stanza: XmppElementLike): void {
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

  private rejectPendingIq(error: Error): void {
    const entries = Array.from(this.pendingIqMap.values());
    this.pendingIqMap.clear();
    for (const entry of entries) {
      clearTimeout(entry.timeout);
      entry.reject(error);
    }
  }

  private async sendIq(input: {
    type: "get" | "set";
    payload: XmppChild;
    to?: string;
    timeoutMs?: number;
  }): Promise<XmppElementLike> {
    const xmpp = this.requireXmpp();
    const id = generateIqId();
    const timeoutMs = input.timeoutMs ?? DEFAULT_IQ_TIMEOUT_MS;

    return new Promise<XmppElementLike>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingIqMap.delete(id);
        reject(new Error(`chat_iq_timeout:${id}`));
      }, timeoutMs);

      this.pendingIqMap.set(id, { resolve, reject, timeout });
      const attrs = input.to
        ? { type: input.type, id, to: input.to }
        : { type: input.type, id };

      void xmpp.send(xml("iq", attrs, input.payload)).catch((error: unknown) => {
        clearTimeout(timeout);
        this.pendingIqMap.delete(id);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }

  private emit<T>(listeners: Set<(event: T) => void>, event: T): void {
    for (const listener of Array.from(listeners)) {
      try {
        listener(event);
      } catch (error) {
        this.config.logger?.error?.("chat_listener_error", { error });
      }
    }
  }
}

type OmemoState = {
  bareJid: string;
  deviceId: number;
  identityPrivateKey: string;
  identityPublicKey: string;
};

type OmemoPeerSession = {
  peerDeviceId: number;
  sharedSecret: Uint8Array;
};

export function createOmemoEncryption(
  options: OmemoEncryptionOptions = {},
): ChatEncryption {
  const storage = options.storage ?? createInMemoryKeyValueStore();
  const stateKeyPrefix = options.stateKeyPrefix ?? DEFAULT_OMEMO_STATE_KEY_PREFIX;
  let cachedState: OmemoState | null = null;
  let publishedBareJid: string | null = null;

  const stateKey = (bareJid: string) => `${stateKeyPrefix}:${bareJid}`;

  const loadOrCreateState = async (bareJid: string): Promise<OmemoState> => {
    if (cachedState?.bareJid === bareJid) return cachedState;
    const raw = await storage.getItem(stateKey(bareJid));
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as OmemoState;
        if (isValidOmemoState(parsed) && parsed.bareJid === bareJid) {
          cachedState = parsed;
          return parsed;
        }
      } catch {
        // Fall through to regeneration.
      }
    }

    const privateKey = getRandomBytes(32);
    const publicKey = x25519.getPublicKey(privateKey);
    const nextState: OmemoState = {
      bareJid,
      deviceId: Math.max(1, bytesToUint32(getRandomBytes(4))),
      identityPrivateKey: bytesToBase64(privateKey),
      identityPublicKey: bytesToBase64(publicKey),
    };
    await storage.setItem(stateKey(bareJid), JSON.stringify(nextState));
    cachedState = nextState;
    return nextState;
  };

  const fetchDeviceIds = async (
    context: ChatEncryptionContext,
    bareJid: string,
  ): Promise<number[]> => {
    let stanza: XmppElementLike;
    try {
      stanza = await context.sendIq({
        type: "get",
        to: bareJid,
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml("items", { node: OMEMO_DEVICELIST_NODE, max_items: "1" }),
        ),
      });
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        return [];
      }
      throw error;
    }

    const raw = toRawXmlString(stanza);
    const deviceIds = new Set<number>();
    const deviceRegex = /<device\b[^>]*id=(['"])(\d+)\1/g;
    let match: RegExpExecArray | null = null;
    while ((match = deviceRegex.exec(raw)) !== null) {
      const parsed = Number(match[2]);
      if (Number.isFinite(parsed) && parsed > 0) {
        deviceIds.add(Math.floor(parsed));
      }
    }
    return Array.from(deviceIds);
  };

  const fetchIdentityKey = async (
    context: ChatEncryptionContext,
    bareJid: string,
    deviceId: number,
  ): Promise<Uint8Array> => {
    const bundleNode = `${OMEMO_BUNDLE_NODE_PREFIX}${deviceId}`;
    let stanza: XmppElementLike;
    try {
      stanza = await context.sendIq({
        type: "get",
        to: bareJid,
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml("items", { node: bundleNode, max_items: "1" }),
        ),
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

  const publishIdentity = async (context: ChatEncryptionContext): Promise<void> => {
    const bareJid = context.getBareJid();
    if (!bareJid) return;

    const state = await loadOrCreateState(bareJid);
    const existingIds = await fetchDeviceIds(context, bareJid).catch(() => []);
    const finalDeviceIds = Array.from(new Set([state.deviceId, ...existingIds])).filter(
      (value) => Number.isFinite(value) && value > 0,
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
          xml("value", {}, "http://jabber.org/protocol/pubsub#publish-options"),
        ),
        xml("field", { var: "pubsub#access_model" }, xml("value", {}, "open")),
        xml("field", { var: "pubsub#persist_items" }, xml("value", {}, "true")),
      ),
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
              ...finalDeviceIds.map((deviceId) => xml("device", { id: String(deviceId) })),
            ),
          ),
        ),
        publishOptions,
      ),
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
              xml("identityKey", {}, state.identityPublicKey),
            ),
          ),
        ),
        publishOptions,
      ),
    });

    publishedBareJid = bareJid;
  };

  const establishPeerSessions = async (
    context: ChatEncryptionContext,
    toJid: string,
  ): Promise<OmemoPeerSession[]> => {
    const bareJid = context.getBareJid();
    if (!bareJid) {
      throw new Error("xmpp_omemo_state_missing");
    }

    const state = await loadOrCreateState(bareJid);
    const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
    const peerDeviceIds = await fetchDeviceIds(context, normalizeBareJid(toJid));
    if (!peerDeviceIds.length) {
      throw new Error("xmpp_omemo_peer_device_not_found");
    }

    const sessions: OmemoPeerSession[] = [];
    for (const peerDeviceId of peerDeviceIds) {
      try {
        const peerPublicKey = await fetchIdentityKey(
          context,
          normalizeBareJid(toJid),
          peerDeviceId,
        );
        sessions.push({
          peerDeviceId,
          sharedSecret: x25519.getSharedSecret(ownPrivateKey, peerPublicKey),
        });
      } catch {
        // Skip stale peer devices with no identity bundle.
      }
    }

    if (!sessions.length) {
      throw new Error("xmpp_omemo_peer_identity_key_missing");
    }

    return sessions;
  };

  return {
    onConnect: async (context) => {
      const bareJid = context.getBareJid();
      if (!bareJid || publishedBareJid === bareJid) return;
      await publishIdentity(context);
    },
    encrypt: async (input, context) => {
      const bareJid = context.getBareJid();
      if (!bareJid) {
        throw new Error("xmpp_omemo_state_missing");
      }

      if (publishedBareJid !== bareJid) {
        await publishIdentity(context);
      }

      const state = await loadOrCreateState(bareJid);
      const sessions = await establishPeerSessions(context, input.toJid);
      const iv = getRandomBytes(12);
      const contentKey = getRandomBytes(OMEMO_AES_KEY_BYTES);
      const plaintext = new TextEncoder().encode(
        JSON.stringify({
          body: input.body,
          ...(input.metadata ? { metadata: input.metadata } : {}),
        }),
      );
      const ciphertext = gcm(contentKey, iv).encrypt(plaintext);

      const keyElements = sessions.map((session) => {
        const wrapSalt = getRandomBytes(OMEMO_KEY_WRAP_BYTES);
        const wrapMask = hkdf(
          sha256,
          session.sharedSecret,
          wrapSalt,
          OMEMO_WRAP_INFO,
          OMEMO_AES_KEY_BYTES,
        );
        const wrappedKey = xorBytes(contentKey, wrapMask);
        const wrappedBundle = concatBytes(wrapSalt, wrappedKey);
        return xml(
          "key",
          {
            rid: String(session.peerDeviceId),
            kex: "x25519-hkdf-sha256-aesgcm",
          },
          bytesToBase64(wrappedBundle),
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
              xml("identity", {}, state.identityPublicKey),
            ),
            xml("payload", {}, bytesToBase64(ciphertext)),
          ),
        ],
      };
    },
    decrypt: async ({ stanza }, context) => {
      const encrypted = stanza.getChild?.("encrypted", OMEMO_NS);
      if (!encrypted) return null;

      const bareJid = context.getBareJid();
      if (!bareJid) return { body: "", metadata: undefined };

      const state = await loadOrCreateState(bareJid);
      const header = encrypted.getChild?.("header");
      const payloadBase64 = encrypted.getChildText?.("payload")?.trim();
      if (!header || !payloadBase64) {
        return { body: "", metadata: undefined };
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
        return { body: "", metadata: undefined };
      }

      const ivBase64 = header.getChildText?.("iv")?.trim();
      const senderIdentityBase64 = header.getChildText?.("identity")?.trim();
      if (!ivBase64 || !senderIdentityBase64) {
        return { body: "", metadata: undefined };
      }

      try {
        const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
        const senderPublicKey = base64ToBytes(senderIdentityBase64);
        const keyMaterial = base64ToBytes(selectedKeyBase64);
        const iv = base64ToBytes(ivBase64);
        const ciphertext = base64ToBytes(payloadBase64);
        const sharedSecret = x25519.getSharedSecret(ownPrivateKey, senderPublicKey);

        let contentKey: Uint8Array;
        if (keyMaterial.length === OMEMO_KEY_WRAP_BYTES) {
          contentKey = hkdf(
            sha256,
            sharedSecret,
            keyMaterial,
            OMEMO_INFO,
            OMEMO_AES_KEY_BYTES,
          );
        } else if (keyMaterial.length === OMEMO_KEY_WRAP_BUNDLE_BYTES) {
          const wrapSalt = keyMaterial.slice(0, OMEMO_KEY_WRAP_BYTES);
          const wrappedKey = keyMaterial.slice(OMEMO_KEY_WRAP_BYTES);
          const wrapMask = hkdf(
            sha256,
            sharedSecret,
            wrapSalt,
            OMEMO_WRAP_INFO,
            OMEMO_AES_KEY_BYTES,
          );
          contentKey = xorBytes(wrappedKey, wrapMask);
        } else {
          return { body: "", metadata: undefined };
        }

        const plaintext = gcm(contentKey, iv).decrypt(ciphertext);
        const parsed = JSON.parse(new TextDecoder().decode(plaintext)) as unknown;
        if (!isRecord(parsed)) {
          return { body: "", metadata: undefined };
        }

        return {
          body: typeof parsed.body === "string" ? parsed.body : "",
          metadata: isRecord(parsed.metadata)
            ? (parsed.metadata as Record<string, unknown>)
            : undefined,
        };
      } catch {
        return { body: "", metadata: undefined };
      }
    },
  };
}

type NormalizedConfig = {
  service: string;
  username: string;
  jid?: string;
  password?: string;
  authType: "password" | "x-oauth2";
  domain?: string;
  resource?: ChatResource;
  connectTimeoutMs: number;
  roomDirectory?: ChatRoomDirectory;
  resolveRoomJids?: (roomId: string) => Promise<string[]> | string[];
  logger?: ChatLogger;
  encryption?: ChatEncryption;
};

function normalizeConfig(config: ChatClientConfig): NormalizedConfig {
  const service = trimToUndefined(config.xmppServer) ?? trimToUndefined(config.service);
  if (!service) throw new Error("chat_xmpp_server_required");

  const jid = trimToUndefined(config.JID) ?? trimToUndefined(config.jid);
  const username =
    trimToUndefined(config.userName) ??
    trimToUndefined(config.username) ??
    parseLocalpart(jid);
  if (!username) throw new Error("chat_username_required");

  return {
    service,
    username,
    jid,
    password:
      trimToUndefined(config.password) ??
      trimToUndefined(config.accessToken) ??
      trimToUndefined(config.token),
    authType: config.authType ?? (config.accessToken || config.token ? "x-oauth2" : "password"),
    domain: trimToUndefined(config.domain) ?? parseDomain(jid),
    resource: normalizeResource(config.resource),
    connectTimeoutMs: config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    roomDirectory: config.roomDirectory,
    resolveRoomJids: config.resolveRoomJids,
    logger: config.logger,
    encryption: config.encryption,
  };
}

export function extractProviderChatRoomId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : undefined;
  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.providerChatRoomId,
    lulaPayload?.providerChatRoomId,
    lulaSubmission?.providerChatRoomId,
  );
}

export function extractSubmissionId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(metadata.submissionId, lulaSubmission?.submissionId);
}

export function buildChatMessageMetadata(input: {
  roomId?: string;
  metadata?: Record<string, unknown>;
  context?: ChatMessageContext;
}): Record<string, unknown> | undefined {
  const metadata: Record<string, unknown> = { ...(input.metadata ?? {}) };
  const providerChatRoomId = firstString(
    input.context?.providerChatRoomId,
    extractProviderChatRoomId(metadata),
    input.roomId,
  );

  if (providerChatRoomId) {
    metadata.providerChatRoomId = providerChatRoomId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }

  const context = input.context;
  const shouldWriteSubmissionContext =
    context &&
    (context.type === "form_thread" ||
      typeof context.submissionId === "string" ||
      typeof context.senderName === "string");

  if (shouldWriteSubmissionContext) {
    const existing = isRecord(metadata.lulaSubmission)
      ? (metadata.lulaSubmission as Record<string, unknown>)
      : {};
    const { providerChatRoomId: _providerChatRoomId, type: _type, ...rest } = context;
    metadata.lulaSubmission = removeUndefinedValues({
      ...existing,
      ...rest,
      ...(providerChatRoomId ? { providerChatRoomId } : {}),
    });
  }

  return Object.keys(metadata).length > 0 ? metadata : undefined;
}

export function buildFormSubmissionMetadata(
  input: Pick<
    ChatFormSubmissionInput,
    | "roomId"
    | "metadata"
    | "formId"
    | "providerUserId"
    | "recordId"
    | "formVersion"
    | "providerChatRoomId"
    | "submittedAt"
  >,
): Record<string, unknown> {
  const metadata: Record<string, unknown> = { ...(input.metadata ?? {}) };
  const providerChatRoomId = firstString(
    input.providerChatRoomId,
    extractProviderChatRoomId(metadata),
  );
  const existingPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : {};

  if (providerChatRoomId) {
    metadata.providerChatRoomId = providerChatRoomId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }

  metadata.lulaPayload = removeUndefinedValues({
    ...existingPayload,
    submissionRoomId: input.roomId,
    formId: input.formId,
    providerUserId: input.providerUserId,
    recordId: input.recordId,
    formVersion: input.formVersion,
    providerChatRoomId,
    submittedAt:
      input.submittedAt ??
      (typeof existingPayload.submittedAt === "string"
        ? existingPayload.submittedAt
        : new Date().toISOString()),
  });

  return metadata;
}

function collectTargetJids(input: {
  toJid?: string;
  toJids?: string[];
  peerJid?: string;
  peerJids?: string[];
}): string[] {
  return normalizeJidList([
    input.toJid,
    input.peerJid,
    ...(input.toJids ?? []),
    ...(input.peerJids ?? []),
  ]);
}

function normalizeJidList(values: Array<string | undefined>): string[] {
  const normalized = values
    .map((value) => normalizeBareJid(value))
    .filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}

function pickMessageTargetInput(input: ChatFormSubmissionInput): Omit<ChatMessageInput, "body" | "metadata"> {
  return {
    toJid: input.toJid,
    toJids: input.toJids,
    peerJid: input.peerJid,
    peerJids: input.peerJids,
    roomId: input.roomId,
    targetRoomId: input.targetRoomId,
    id: input.id,
    requestReceipt: input.requestReceipt,
  };
}

function toChatTextMessage(message: ChatMessage): ChatTextMessage {
  const metadata = message.metadata;
  const providerChatRoomId = extractProviderChatRoomId(metadata) ?? message.roomId;
  const submissionId = extractSubmissionId(metadata);
  const lulaSubmission = isRecord(metadata?.lulaSubmission)
    ? (metadata?.lulaSubmission as Record<string, unknown>)
    : undefined;
  const context = removeUndefinedValues({
    ...(lulaSubmission ?? {}),
    ...(providerChatRoomId ? { providerChatRoomId } : {}),
    ...(submissionId ? { submissionId } : {}),
    ...(lulaSubmission ? { type: "form_thread" } : {}),
  }) as ChatMessageContext;

  return {
    ...message,
    providerChatRoomId,
    submissionId,
    ...(Object.keys(context).length > 0 ? { context } : {}),
  };
}

function parseFormSubmissionMessage(message: ChatMessage): ChatFormSubmissionMessage | null {
  const payload = parseJsonRecord(message.body);
  if (!payload) return null;

  const metadata = message.metadata;
  const lulaPayload = isRecord(metadata?.lulaPayload)
    ? (metadata?.lulaPayload as Record<string, unknown>)
    : undefined;
  const isExplicitFormPayload = payload.type === "form_submission";
  const isReadableSubmissionPayload = isRecord(payload.readable) || isRecord(payload.raw);
  if (!lulaPayload && !isExplicitFormPayload && !isReadableSubmissionPayload) {
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
    formVersion:
      typeof lulaPayload?.formVersion === "number"
        ? lulaPayload.formVersion
        : typeof payload.formVersion === "number"
          ? payload.formVersion
          : undefined,
    submittedAt: firstString(lulaPayload?.submittedAt, payload.submittedAt),
  };
}

function parseJsonRecord(input: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(input) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function removeUndefinedValues<T extends Record<string, unknown>>(input: T): Partial<T> {
  const output: Partial<T> = {};
  for (const [key, value] of Object.entries(input) as Array<[keyof T, T[keyof T]]>) {
    if (value !== undefined) {
      output[key] = value;
    }
  }
  return output;
}

function registerXOAuth2OnClient(xmpp: XmppClientLike): void {
  const candidate = xmpp as unknown as {
    saslFactory?: { use?: (name: string, mechanism: typeof XOauth2Mechanism) => void };
    sasl?: { use?: (name: string, mechanism: typeof XOauth2Mechanism) => void };
  };
  candidate.saslFactory?.use?.("X-OAUTH2", XOauth2Mechanism);
  candidate.sasl?.use?.("X-OAUTH2", XOauth2Mechanism);
}

function pickMechanism(mechanisms: string[], preferred: string[]): string | undefined {
  const offered = new Set(mechanisms.map((mechanism) => mechanism.toUpperCase()));
  return preferred.find((mechanism) => offered.has(mechanism));
}

function addListener<T>(listeners: Set<(event: T) => void>, listener: (event: T) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function withTimeout<T>(promise: Promise<T>, ms: number, errorCode: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(errorCode)), ms);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function safeStop(xmpp: XmppClientLike): Promise<void> {
  try {
    await xmpp.stop();
  } catch {
    // The caller already has the connection failure.
  }
}

function parseStanzaError(stanza: XmppElementLike): Pick<ChatErrorEvent, "condition" | "text"> {
  const error = stanza.getChild?.("error");
  if (!error) return {};
  const text = error.getChildText?.("text");
  const raw = error.toString?.() ?? "";
  const match = raw.match(/<([a-z0-9-]+)\s+xmlns=["']urn:ietf:params:xml:ns:xmpp-stanzas["']/i);
  return {
    condition: match?.[1],
    text: text ?? undefined,
  };
}

function parseDelayTimestamp(stanza: XmppElementLike): number | undefined {
  const delay = stanza.getChild?.("delay", "urn:xmpp:delay");
  const stamp = delay?.attrs?.stamp;
  if (!stamp) return undefined;
  const parsed = Date.parse(stamp);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function parseMetadataTimestamp(metadata?: Record<string, unknown>): number | undefined {
  const sentAtMs = metadata?.sentAtMs;
  if (typeof sentAtMs === "number" && Number.isFinite(sentAtMs)) return sentAtMs;
  const createdAt = metadata?.createdAt;
  if (typeof createdAt !== "string") return undefined;
  const parsed = Date.parse(createdAt);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function generateIqId(): string {
  return `iq-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeBareJid(jid?: string | null): string {
  return jid?.trim().split("/")[0] ?? "";
}

function parseLocalpart(jid?: string): string | undefined {
  const bare = normalizeBareJid(jid);
  const localpart = bare.split("@")[0]?.trim();
  return localpart || undefined;
}

function parseDomain(jid?: string): string | undefined {
  const bare = normalizeBareJid(jid);
  const domain = bare.split("@")[1]?.trim();
  return domain || undefined;
}

function trimToUndefined(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeResource(value?: ChatResource): ChatResource | undefined {
  const resource = trimToUndefined(value);
  if (!resource) return undefined;
  if ((chatResources as readonly string[]).includes(resource)) return resource as ChatResource;
  throw new Error(`chat_resource_invalid:${resource}`);
}

function addressToString(address: unknown): string | undefined {
  if (typeof address === "string") return address;
  if (address && typeof address === "object" && "toString" in address) {
    const value = String(address);
    return value === "[object Object]" ? undefined : value;
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeChatRoomResponse(
  response: unknown,
  options: Pick<ChatRoomDirectoryOptions, "currentUserName" | "jidDomain"> = {},
): ChatRoom {
  const roomRecord = unwrapRoomRecord(response);
  const roomId = firstString(
    roomRecord.roomId,
    roomRecord.providerChatRoomId,
    roomRecord.id,
    roomRecord._id,
  );
  if (!roomId) throw new Error("chat_room_id_required");

  const id = firstString(roomRecord.id, roomRecord._id);
  const peerJids = collectPeerJidsFromRoom(roomRecord, options);
  return {
    ...(id ? { id } : {}),
    roomId,
    peerJids,
    raw: response,
  };
}

function unwrapRoomRecord(response: unknown): Record<string, unknown> {
  if (!isRecord(response)) throw new Error("chat_room_response_invalid");
  if (isRecord(response.data)) return response.data;
  if (isRecord(response.room)) return response.room;
  return response;
}

function collectPeerJidsFromRoom(
  room: Record<string, unknown>,
  options: Pick<ChatRoomDirectoryOptions, "currentUserName" | "jidDomain">,
): string[] {
  const candidates: string[] = [];
  pushStrings(candidates, room.peerJid);
  pushStrings(candidates, room.peerJids);
  pushStrings(candidates, room.chatUserId);
  pushStrings(candidates, room.chatUserIds);

  const current = normalizeUserName(options.currentUserName);
  const userMetadata = Array.isArray(room.userMetadata) ? room.userMetadata : [];
  for (const entry of userMetadata) {
    if (!isRecord(entry)) continue;
    const entryNames = collectStringValues(entry.id, entry.chatUserId, entry.chatUserIds).map(
      normalizeUserName,
    );
    if (current && entryNames.includes(current)) continue;
    pushStrings(candidates, entry.chatUserId);
    pushStrings(candidates, entry.chatUserIds);
  }

  return normalizeJidList(
    candidates
      .map((candidate) => expandJidCandidate(candidate, options.jidDomain))
      .filter((candidate): candidate is string => Boolean(candidate)),
  );
}

function collectStringValues(...values: unknown[]): string[] {
  const strings: string[] = [];
  values.forEach((value) => pushStrings(strings, value));
  return strings;
}

function pushStrings(target: string[], value: unknown): void {
  if (typeof value === "string" && value.trim()) {
    target.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => pushStrings(target, entry));
  }
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function normalizeUserName(value?: string): string | undefined {
  const normalized = normalizeBareJid(value);
  if (!normalized) return undefined;
  return normalized.split("@")[0] || normalized;
}

function expandJidCandidate(value: string, jidDomain?: string): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.includes("@")) return trimmed;
  const domain = jidDomain?.trim();
  return domain ? `${trimmed}@${domain}` : trimmed;
}

function isValidOmemoState(value: unknown): value is OmemoState {
  if (!isRecord(value)) return false;
  return (
    typeof value.bareJid === "string" &&
    value.bareJid.length > 0 &&
    typeof value.deviceId === "number" &&
    Number.isFinite(value.deviceId) &&
    value.deviceId > 0 &&
    typeof value.identityPrivateKey === "string" &&
    value.identityPrivateKey.length > 0 &&
    typeof value.identityPublicKey === "string" &&
    value.identityPublicKey.length > 0
  );
}

function createInMemoryKeyValueStore(): ChatKeyValueStore {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

export function createMemoryStorageBackend(): ChatKeyValueStore {
  return createInMemoryKeyValueStore();
}

export function createIndexDbStorageBackend(
  options: IndexDbStorageOptions = {},
): ChatKeyValueStore {
  const dbName = options.dbName ?? "lulafi-chat-sdk";
  const storeName = options.storeName ?? "keyValue";
  let dbPromise: Promise<IDBDatabase> | null = null;

  const getDb = (): Promise<IDBDatabase> => {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
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

  const withStore = async <T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> => {
    const db = await getDb();
    return new Promise<T>((resolve, reject) => {
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
    },
  };
}

export function createMongoDbStorageBackend(
  options: MongoDbStorageOptions,
): ChatKeyValueStore {
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
      const setFields: Record<string, unknown> = {
        [valueField]: value,
        [updatedAtField]: new Date(),
      };

      if (keyField !== "_id") {
        setFields[keyField] = key;
      }

      await collection.updateOne(
        { [keyField]: key },
        { $set: setFields },
        { upsert: true },
      );
    },
    removeItem: async (key) => {
      await collection.deleteOne({ [keyField]: key });
    },
  };
}

export const storageBackends = {
  memory: createMemoryStorageBackend(),
  indexDb: createIndexDbStorageBackend(),
  mongoDb: createMongoDbStorageBackend,
  createMemory: createMemoryStorageBackend,
  createIndexDb: createIndexDbStorageBackend,
  createMongoDb: createMongoDbStorageBackend,
};

function getRandomBytes(length: number): Uint8Array {
  const cryptoObject = globalThis.crypto;
  if (!cryptoObject?.getRandomValues) {
    throw new Error("chat_random_values_unavailable");
  }
  return cryptoObject.getRandomValues(new Uint8Array(length));
}

function bytesToBase64(bytes: Uint8Array): string {
  const globalWithBuffer = globalThis as typeof globalThis & {
    Buffer?: {
      from: (input: Uint8Array | ArrayBuffer | string, encoding?: string) => {
        toString: (encoding: string) => string;
      };
    };
  };
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const globalWithBuffer = globalThis as typeof globalThis & {
    Buffer?: {
      from: (input: string, encoding: string) => Uint8Array;
    };
  };
  if (globalWithBuffer.Buffer) {
    return new Uint8Array(globalWithBuffer.Buffer.from(value, "base64"));
  }

  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToUint32(bytes: Uint8Array): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(0, false);
}

function xorBytes(left: Uint8Array, right: Uint8Array): Uint8Array {
  const output = new Uint8Array(Math.min(left.length, right.length));
  for (let i = 0; i < output.length; i += 1) {
    output[i] = left[i]! ^ right[i]!;
  }
  return output;
}

function concatBytes(first: Uint8Array, second: Uint8Array): Uint8Array {
  const output = new Uint8Array(first.length + second.length);
  output.set(first, 0);
  output.set(second, first.length);
  return output;
}

function toRawXmlString(value: unknown): string {
  if (!value) return "";
  const withToString = value as { toString?: () => string };
  try {
    if (typeof withToString.toString === "function") {
      return withToString.toString();
    }
  } catch {
    return "";
  }
  return "";
}

function encodeJsonBase64(value: unknown): string {
  const json = JSON.stringify(value);
  const globalWithBuffer = globalThis as typeof globalThis & {
    Buffer?: { from: (input: string, encoding: string) => { toString: (encoding: string) => string } };
  };
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(json, "utf8").toString("base64");
  }

  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeJsonBase64(value: string): unknown {
  try {
    const globalWithBuffer = globalThis as typeof globalThis & {
      Buffer?: { from: (input: string, encoding: string) => { toString: (encoding: string) => string } };
    };
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
