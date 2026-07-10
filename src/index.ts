import { gcm } from "@noble/ciphers/aes.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes as nobleRandomBytes } from "@noble/hashes/utils.js";
import { client as createXmppClient, xml } from "@xmpp/client";
import { customAlphabet } from "nanoid/non-secure";
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

export type DeviceId = string;

type ChatMessageType = "CHAT_MESSAGE" | "FORM_SUBMISSION";

export type ChatMessageMetadata = Record<string, unknown> & {
  messageType: "CHAT_MESSAGE" | "FORM_SUBMISSION";
};

export type ChatLogLevel = "silent" | "error" | "warn" | "info" | "debug";

export type ChatLogger = {
  debug?: (message: string, data?: Record<string, unknown>) => void;
  info?: (message: string, data?: Record<string, unknown>) => void;
  warn?: (message: string, data?: Record<string, unknown>) => void;
  error?: (message: string, data?: Record<string, unknown>) => void;
};

export type ChatRoomLookupInput = {
  userId: string;
  metadata?: Record<string, unknown>;
};

export type ChatRoom = {
  id?: string;
  roomId: string;
  peerDeviceIds?: DeviceId[];
  ownDeviceIds?: DeviceId[];
  raw?: unknown;
};

export type ChatRoomDirectoryOptions = {
  currentUserId?: string;
  xmppDomain?: string;
  getOrCreateRoom?: (input: ChatRoomLookupInput) => Promise<unknown> | unknown;
  getRoom?: (roomId: string) => Promise<unknown> | unknown;
};

export type ChatRoomDirectory = {
  getPeerDeviceIds: (roomId: string) => Promise<DeviceId[]> | DeviceId[];
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

export type ChatAttachment = {
  id: string;
  type: "image" | "file";
  name?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  thumbnailUrl?: string;
  localUri?: string;
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>;
};

export type ChatAttachmentUpload = {
  uri?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  data?: ArrayBuffer | Uint8Array;
  metadata?: Record<string, unknown>;
  raw?: unknown;
};

export type ChatAttachmentUploadSlotRequest = {
  name: string;
  mimeType: string;
  size: number;
};

export type ChatAttachmentUploadSlot = {
  putUrl: string;
  getUrl: string;
  headers: Record<string, string>;
};

export type ChatAttachmentUploadContext = {
  roomId: string;
  apiKey: string;
  xmppDomain: string;
  userId: string;
  deviceId: DeviceId;
  requestSlot: (
    input: ChatAttachmentUploadSlotRequest,
  ) => Promise<ChatAttachmentUploadSlot>;
  logger?: ChatLogger;
};

export type ChatAttachmentResolveContext = {
  apiKey: string;
  xmppDomain: string;
  userId: string;
  deviceId: DeviceId;
  logger?: ChatLogger;
};

export type ChatAttachmentService = {
  upload: (
    input: ChatAttachmentUpload,
    context: ChatAttachmentUploadContext,
  ) => Promise<ChatAttachment> | ChatAttachment;
  resolve?: (
    attachment: ChatAttachment,
    context: ChatAttachmentResolveContext,
  ) => Promise<string | null | undefined> | string | null | undefined;
};

export type ChatClientBaseConfig = {
  /** API key for app access to the chat service. */
  apiKey: string;

  /** WebSocket path on the chat domain, or a full ws(s) URL. Defaults to "/chat/websocket". */
  xmppWebSocketPath?: string;

  /** Chat service domain, for example "api.dev.lulafi.co". */
  xmppDomain: string;

  /** XMPP upload service JID. Defaults to "upload.<xmppDomain>". */
  xmppUploadService?: string;

  /** Current app user id. The SDK uses it to derive the transport address. */
  userId: string;

  /** Current device id token, for example "d0eb68ad2ff10ee7". */
  deviceId: DeviceId;

  /** Display name written to outgoing message metadata. */
  displayName?: string;

  /** Reconnect after transient connection loss. */
  autoReconnect?: boolean;

  /** Connection timeout in milliseconds. Defaults to 15000. */
  connectTimeoutMs?: number;

  /** Room lookup provider used to resolve peer devices for fanout. */
  roomDirectory?: ChatRoomDirectory;

  /** Fallback resolver for older room fanout call sites. Prefer roomDirectory. */
  resolveRoomDeviceIds?: (roomId: string) => Promise<DeviceId[]> | DeviceId[];

  /** Optional logger for connection, encryption, and stanza errors. */
  logger?: ChatLogger;

  /** Logger verbosity. Defaults to "error" when a logger is provided. */
  logLevel?: ChatLogLevel;

  /** Message encryption adapter. Pass createOmemoEncryption(...) for built-in OMEMO. */
  encryption: ChatEncryption;

  /** Attachment upload and resolve adapter for file and image messages. */
  attachmentService?: ChatAttachmentService;
};

export type ChatPasswordAuthConfig = ChatClientBaseConfig & {
  /** Password auth is the default when authType is omitted. */
  authType?: "password";

  /** Password for password auth. Required for the default auth mode. */
  password: string;

  /** Access tokens are only valid with authType "x-oauth2". */
  accessToken?: never;
};

export type ChatXOAuth2Config = ChatClientBaseConfig & {
  /** Use X-OAUTH2 auth with an access token. */
  authType: "x-oauth2";

  /** Access token for X-OAUTH2 auth. Required when authType is "x-oauth2". */
  accessToken: string;

  /** Passwords are only valid with password auth. */
  password?: never;
};

export type ChatClientConfig = ChatPasswordAuthConfig | ChatXOAuth2Config;

export type ChatMessage = {
  id: string;
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId: DeviceId;
  roomId: string;
  body: string;
  timestamp: number;
  metadata: ChatMessageMetadata;
  attachments?: ChatAttachment[];
  raw?: unknown;
};

export type ChatMessageContext = {
  providerDirectMessageRoomId?: string;
  submissionRoomId?: string;
  correlationId?: string;
  senderName?: string;
  displayName?: string;
  [key: string]: unknown;
};

export type ChatMessageInput = {
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
  body: string;
  attachments?: ChatAttachment[];
  roomId?: string;
  targetRoomId?: string;
  /** Any additional metadata for the text message. */
  metadata?: Record<string, unknown>;
  id?: string;
  requestReceipt?: boolean;
};

export type ChatTextMessageInput = Omit<ChatMessageInput, "metadata"> & {
  /** Any additional metadata for the text message. */
  metadata?: Record<string, unknown>;
  context?: ChatMessageContext;
};

export type ChatTextMessage = ChatMessage & {
  context?: ChatMessageContext;
  providerDirectMessageRoomId: string;
  submissionRoomId?: string;
  correlationId?: string;
  displayName: string;
};

export type ChatAttachmentMessage = ChatMessage & {
  attachments: ChatAttachment[];
  context?: ChatMessageContext;
  /* The room ID of the provider direct message. */
  providerDirectMessageRoomId?: string;
  /** The room ID where the submission was made. */
  submissionRoomId?: string;
  /** The ID of the submission. */
  correlationId?: string;
  displayName?: string;
};

export type ChatFormSubmissionField = {
  id: string;
  label: string;
  type: string;
  required: boolean;
};

export type ChatFormSubmissionInput = Omit<ChatMessageInput, "body" | "metadata"> & {
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  formId?: string;
  providerUserId?: string;
  recordId?: string;
  formVersion?: number;
  providerDirectMessageRoomId: string;
  submissionRoomId: string;
  correlationId: string;
  submittedAt?: string;
  pretty?: boolean;
};

export type ChatFormSubmissionMessage = ChatMessage & {
  answers: Record<string, string>;
  fields: ChatFormSubmissionField[];
  payload: Record<string, unknown>;
  providerDirectMessageRoomId?: string;
  submissionRoomId?: string;
  correlationId?: string;
  formId?: string;
  providerUserId?: string;
  recordId?: string;
  formVersion?: number;
  submittedAt?: string;
  displayName?: string;
};

export type ChatAttachmentMessageInput = Omit<
  ChatTextMessageInput,
  "body" | "attachments"
> & {
  attachment: ChatAttachmentUpload;
  body?: string;
};

export type ChatTypingInput = {
  roomId: string;
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  isTyping?: boolean;
  autoPauseMs?: number;
  id?: string;
};

export type ChatDisplayedInput = {
  roomId: string;
  messageId: string;
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  id?: string;
};

export type ChatTypingEvent = {
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId?: DeviceId;
  roomId: string;
  isTyping: boolean;
  raw?: unknown;
};

export type ChatDeliveryEvent = {
  id: string;
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId?: DeviceId;
  roomId: string;
  status: ChatDeliveryStatus;
  raw?: unknown;
};

export type ChatErrorEvent = {
  id?: string;
  fromUserId?: string;
  fromFullAddress?: string;
  fromDeviceId?: DeviceId;
  toDeviceId?: DeviceId;
  roomId?: string;
  condition?: string;
  text?: string;
  error?: unknown;
  raw?: unknown;
};

export type ChatStatusEvent = {
  status: ChatStatus;
  deviceId?: DeviceId;
  error?: unknown;
};

export type ChatAddress = {
  raw: string;
  address: DeviceId;
  userId: string;
  deviceId: DeviceId;
  localpart: string;
  domain: string;
};

export type ChatAddressInput = {
  xmppDomain: string;
  userId: string;
  deviceId: DeviceId;
};

export type ChatUserIdInput = {
  username: string;
  domain: string;
};

export type ChatDeviceIdInput = ChatUserIdInput & {
  deviceId?: DeviceId;
  deviceName?: DeviceId;
};

export type CreateDeviceIdOptions = {
  prefix?: string;
};

export type ChatEncryptInput = {
  toDeviceId: DeviceId;
  body: string;
  metadata: ChatMessageMetadata;
  attachments?: ChatAttachment[];
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
  attachments?: ChatAttachment[];
};

export type ChatEncryptionContext = {
  getDeviceId: () => DeviceId | undefined;
  getBareDeviceId: () => DeviceId | undefined;
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
    (userId: string, metadata?: Record<string, unknown>): Promise<ChatRoom>;
    (input: ChatRoomLookupInput): Promise<ChatRoom>;
  };
  getPeerDeviceIds: (roomId: string) => Promise<DeviceId[]>;
  sendChatMessage: {
    (message: ChatTextMessageInput): Promise<string>;
    (
      roomId: string,
      body: string,
      options?: Omit<ChatTextMessageInput, "roomId" | "body">,
    ): Promise<string>;
  };
  sendFormSubmission: (message: ChatFormSubmissionInput) => Promise<string>;
  uploadAttachment: {
    (roomId: string, attachment: ChatAttachmentUpload): Promise<ChatAttachment>;
    (input: { roomId: string; attachment: ChatAttachmentUpload }): Promise<ChatAttachment>;
  };
  sendAttachment: {
    (message: ChatAttachmentMessageInput): Promise<string>;
    (
      roomId: string,
      attachment: ChatAttachmentUpload,
      options?: Omit<ChatAttachmentMessageInput, "roomId" | "attachment">,
    ): Promise<string>;
  };
  /**
   * @deprecated Prefer sendChatMessage or sendFormSubmission for typed payloads.
   */
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
  markRead: {
    (roomId: string, messageId: string, options?: Omit<ChatDisplayedInput, "roomId" | "messageId">): Promise<void>;
    (input: ChatDisplayedInput): Promise<void>;
  };
  /**
   * @deprecated Prefer onChatMessage or onFormSubmission for typed message payloads.
   */
  onMessage: (listener: (message: ChatMessage) => void) => Unsubscribe;
  onChatMessage: (listener: (message: ChatTextMessage) => void) => Unsubscribe;
  onAttachmentMessage: (listener: (message: ChatAttachmentMessage) => void) => Unsubscribe;
  onFormSubmission: (listener: (message: ChatFormSubmissionMessage) => void) => Unsubscribe;
  onTyping: (listener: (event: ChatTypingEvent) => void) => Unsubscribe;
  onDelivery: (listener: (event: ChatDeliveryEvent) => void) => Unsubscribe;
  onError: (listener: (event: ChatErrorEvent) => void) => Unsubscribe;
  onStatus: (listener: (event: ChatStatusEvent) => void) => Unsubscribe;
  resolveAttachment: (attachment: ChatAttachment) => Promise<string | null>;
  getStatus: () => ChatStatus;
  getDeviceId: () => DeviceId | undefined;
  getBareDeviceId: () => DeviceId | undefined;
  getAddress: () => DeviceId;
  getChatAddressObject: () => ChatAddress;
  getDomain: () => string;
  getUserId: () => string;
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

type CarbonForwardedMessage = {
  direction: "sent" | "received";
  message: XmppElementLike;
};

const XMPP_CHAT_NS = "urn:lula:defy:chat:1";
const XMPP_RECEIPTS_NS = "urn:xmpp:receipts";
const XMPP_CHAT_MARKERS_NS = "urn:xmpp:chat-markers:0";
const XMPP_CHATSTATES_NS = "http://jabber.org/protocol/chatstates";
const XMPP_HTTP_UPLOAD_NS = "urn:xmpp:http:upload:0";
const XMPP_CARBONS_NS = "urn:xmpp:carbons:2";
const XMPP_FORWARD_NS = "urn:xmpp:forward:0";
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
const DEFAULT_XMPP_WEBSOCKET_PATH = "/chat/websocket";
const CHAT_LOG_LEVEL_WEIGHT: Record<ChatLogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};
const createRuntimeIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);
const createDeviceIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);

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

export function createDeviceId(options: CreateDeviceIdOptions = {}): DeviceId {
  const prefix = normalizeDeviceIdSegment(options.prefix) ?? "";
  return `${prefix}${createDeviceIdSuffix()}`;
}

export function getChatAddress(input: ChatAddressInput): ChatAddress {
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
    domain,
  };
}

export function getChatUserId(input: ChatUserIdInput): DeviceId {
  const domain = normalizeXmppDomain(input.domain);
  if (!domain) throw new Error("chat_xmpp_domain_required");

  const userId = normalizeUserIdSegment(input.username);
  if (!userId) throw new Error("chat_user_id_required");

  return buildXmppUserAddress(userId, domain);
}

export function getChatDeviceId(input: ChatDeviceIdInput): DeviceId {
  const bareUserJid = getChatUserId(input);
  const resource = normalizeResourceSegment(input.deviceId ?? input.deviceName ?? "");
  return `${bareUserJid}/${resource}`;
}

export function createRoomDirectory(options: ChatRoomDirectoryOptions): ChatRoomDirectory {
  const roomCache = new Map<string, ChatRoom>();

  const rememberRoom = (room: ChatRoom) => {
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
        ...(cached?.peerDeviceIds ?? []),
        ...(cached?.ownDeviceIds ?? []),
      ]);
      if (cachedDeviceIds.length) return cachedDeviceIds;

      if (!options.getRoom) return [];
      const room = normalizeChatRoomResponse(await options.getRoom(normalizedRoomId), options);
      return deriveFanoutDeviceIds(room);
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

  private onlineDeviceId?: DeviceId;

  private readonly roomPeers = new Map<string, Set<string>>();

  private readonly typingAutoPauseTimers = new Map<string, ReturnType<typeof setTimeout>>();

  public constructor(config: ChatClientConfig) {
    this.config = normalizeConfig(config);
  }

  public async connect(): Promise<void> {
    if (this.status === "online" && this.xmpp) return;
    if (this.connectPromise) return this.connectPromise;

    this.log("debug", "chat_connect_requested", {
      status: this.status,
      deviceId: this.config.localDeviceId,
      domain: this.config.domain,
    });
    this.connectPromise = this.connectFresh();
    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }

  public async stop(): Promise<void> {
    this.log("info", "chat_stop_requested", { status: this.status });
    this.setStatus("stopping");
    for (const timer of this.typingAutoPauseTimers.values()) {
      clearTimeout(timer);
    }
    this.typingAutoPauseTimers.clear();
    const current = this.xmpp;
    this.xmpp = null;
    this.onlineDeviceId = undefined;
    if (current) {
      await current.stop();
    }
    this.setStatus("offline");
    this.log("info", "chat_stopped");
  }

  public async getPeerDeviceIds(roomId: string): Promise<DeviceId[]> {
    const deviceIds = await this.resolveRoomDeviceIds(roomId);
    this.log("debug", "chat_peer_device_ids_resolved", {
      roomId,
      deviceCount: deviceIds.length,
    });
    return deviceIds;
  }

  public async getOrCreateRoom(
    inputOrUserId: ChatRoomLookupInput | string,
    metadata?: Record<string, unknown>,
  ): Promise<ChatRoom> {
    const input =
      typeof inputOrUserId === "string"
        ? { userId: inputOrUserId, metadata }
        : inputOrUserId;
    const room = await this.resolveRoomForUserId(input);
    this.log("debug", "chat_room_resolved_for_user", {
      userId: input.userId,
      roomId: room.roomId,
    });
    return room;
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
    const metadata = buildChatMessageMetadata({
      ...input,
      displayName: this.config.displayName,
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessage({
      ...input,
      metadata,
      targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId,
    });
  }

  public async sendFormSubmission(input: ChatFormSubmissionInput): Promise<string> {
    const metadata = buildFormSubmissionMetadata({
      ...input,
      displayName: this.config.displayName,
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessage({
      ...pickMessageTargetInput(input),
      body: JSON.stringify(input.payload, null, input.pretty ? 2 : undefined),
      metadata,
      targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId,
    });
  }

  public async uploadAttachment(
    inputOrRoomId: { roomId: string; attachment: ChatAttachmentUpload } | string,
    attachment?: ChatAttachmentUpload,
  ): Promise<ChatAttachment> {
    const input =
      typeof inputOrRoomId === "string"
        ? { roomId: inputOrRoomId, attachment: attachment as ChatAttachmentUpload }
        : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.attachment) throw new Error("chat_attachment_required");
    if (!this.config.attachmentService?.upload) {
      throw new Error("chat_attachment_service_required");
    }
    await this.connect();
    const uploaded = await this.config.attachmentService.upload(
      input.attachment,
      this.getAttachmentUploadContext(roomId),
    );
    return normalizeRequiredAttachment(uploaded);
  }

  public async sendAttachment(
    inputOrRoomId: ChatAttachmentMessageInput | string,
    attachment?: ChatAttachmentUpload,
    options?: Omit<ChatAttachmentMessageInput, "roomId" | "attachment">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, attachment: attachment as ChatAttachmentUpload }
        : inputOrRoomId;
    const roomId = input.roomId?.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const uploaded = await this.uploadAttachment({ roomId, attachment: input.attachment });
    const metadata = buildChatMessageMetadata({
      ...input,
      roomId,
      metadata: {
        ...(input.metadata ?? {}),
        attachment: true,
        ...(uploaded.mimeType ? { mimeType: uploaded.mimeType } : {}),
        ...(typeof uploaded.size === "number" ? { size: uploaded.size } : {}),
      },
      displayName: this.config.displayName,
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessage({
      ...input,
      roomId,
      body: input.body ?? "",
      attachments: [uploaded],
      metadata,
      targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? roomId,
    });
  }

  public async sendMessage(
    inputOrRoomId: ChatMessageInput | string,
    body?: string,
    options?: Omit<ChatMessageInput, "roomId" | "body">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, body: body ?? "" }
        : inputOrRoomId;
    const messageBody = input.body ?? "";
    const attachments = normalizeAttachmentPayload(input.attachments);
    if (!messageBody.trim() && !attachments?.length) throw new Error("chat_body_required");
    const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");

    await this.connect();
    const xmpp = this.requireXmpp();
    const id = input.id || generateMessageId();
    const roomId = input.roomId?.trim();
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId: targetRoomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
    });
    this.log("debug", "chat_message_send_started", {
      id,
      roomId,
      targetRoomId,
      targetCount: targetDeviceIds.length,
      hasAttachments: Boolean(attachments?.length),
      messageType: metadata.messageType,
    });

    await this.sendToTargets(targetDeviceIds, async (toDeviceId) => {
      const encodedPayload = await this.encodePayload({
        toDeviceId,
        body: messageBody,
        metadata,
        attachments,
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

      await xmpp.send(xml("message", { to: toDeviceId, type: "chat", id }, ...children));
    });
    this.log("info", "chat_message_sent", {
      id,
      roomId,
      targetRoomId,
      targetCount: targetDeviceIds.length,
      messageType: metadata.messageType,
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId && targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
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
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
    });

    this.log("debug", "chat_typing_send_started", {
      roomId,
      isTyping,
      targetCount: targetDeviceIds.length,
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    this.clearTypingAutoPause(roomId);
    await this.connect();
    const children: XmppChild[] = [];
    children.push(xml("thread", {}, roomId));
    children.push(xml(isTyping ? "composing" : "paused", { xmlns: XMPP_CHATSTATES_NS }));
    await this.sendToTargets(targetDeviceIds, (toDeviceId) =>
      this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: "chat",
          id: input.id || `typing-${Date.now()}`,
        }, ...children),
      ),
    );

    if (isTyping) {
      this.scheduleTypingAutoPause(roomId, input.autoPauseMs ?? DEFAULT_TYPING_AUTO_PAUSE_MS);
    }
    this.log("debug", "chat_typing_sent", {
      roomId,
      isTyping,
      targetCount: targetDeviceIds.length,
    });
  }

  public async markRead(
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
    const targetDeviceIds = await this.resolveRoomTargets({
      roomId,
      explicitDeviceIds: collectTargetDeviceIds(input),
    });

    this.log("debug", "chat_read_marker_send_started", {
      roomId,
      messageId: input.messageId,
      targetCount: targetDeviceIds.length,
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    await this.connect();
    const children: XmppChild[] = [
      xml("displayed", { xmlns: XMPP_CHAT_MARKERS_NS, id: input.messageId }),
    ];
    children.unshift(xml("thread", {}, roomId));
    await this.sendToTargets(targetDeviceIds, (toDeviceId) =>
      this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: "chat",
          id: input.id || `displayed-${Date.now()}`,
        }, ...children),
      ),
    );
    this.log("debug", "chat_read_marker_sent", {
      roomId,
      messageId: input.messageId,
      targetCount: targetDeviceIds.length,
    });
  }

  public async resolveAttachment(attachment: ChatAttachment): Promise<string | null> {
    const normalized = normalizeRequiredAttachment(attachment);
    if (this.config.attachmentService?.resolve) {
      const resolved = await this.config.attachmentService.resolve(
        normalized,
        this.getAttachmentResolveContext(),
      );
      if (typeof resolved === "string" && resolved.trim()) return resolved.trim();
    }
    return defaultAttachmentSource(normalized);
  }

  public onMessage(listener: (message: ChatMessage) => void): Unsubscribe {
    return addListener(this.messageListeners, listener);
  }

  public onChatMessage(listener: (message: ChatTextMessage) => void): Unsubscribe {
    return this.onMessage((message) => {
      if (isFormSubmissionMessage(message)) return;
      if (isAttachmentMessage(message)) return;
      listener(toChatTextMessage(message));
    });
  }

  public onAttachmentMessage(listener: (message: ChatAttachmentMessage) => void): Unsubscribe {
    return this.onMessage((message) => {
      if (!isAttachmentMessage(message)) return;
      listener(toChatAttachmentMessage(message));
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
    listener({
      status: this.status,
      deviceId: this.onlineDeviceId,
    });
    return unsubscribe;
  }

  public getStatus(): ChatStatus {
    return this.status;
  }

  public getDeviceId(): DeviceId | undefined {
    return this.onlineDeviceId ?? this.config.deviceId;
  }

  public getBareDeviceId(): DeviceId | undefined {
    return normalizeBareDeviceId(this.getDeviceId());
  }

  public getAddress(): DeviceId {
    return this.getChatAddressObject().address;
  }

  public getChatAddressObject(): ChatAddress {
    const raw = this.getDeviceId() ?? this.config.deviceId;
    return {
      raw,
      address: normalizeBareDeviceId(raw) || this.config.deviceId,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      localpart: this.config.username,
      domain: this.config.domain,
    };
  }

  public getDomain(): string {
    return this.config.domain;
  }

  public getUserId(): string {
    return this.config.userId;
  }

  private async connectFresh(): Promise<void> {
    this.setStatus("connecting");
    this.log("info", "chat_connect_started", {
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      authType: this.config.authType,
    });
    if (this.config.authType === "x-oauth2") {
      registerXOAuth2Preference();
    }
    const xmpp = createXmppClient({
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      credentials: this.createCredentials() as never,
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
        "chat_connect_timeout",
      );
    } catch (error) {
      this.xmpp = null;
      this.setStatus("error", error);
      this.log("error", "chat_connect_failed", { error });
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
        const picked = pickMechanism(mechanisms, ["X-OAUTH2"]);
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

    return async (
      authenticate: (
        credentials: { username?: string; password?: string },
        mechanism: string,
        userAgent?: unknown,
      ) => Promise<void>,
      mechanisms: string[],
      _fast: unknown,
      _entity: { isSecure?: () => boolean },
    ) => {
      const preferred = ["SCRAM-SHA-1", "ANONYMOUS"];
      const picked = pickMechanism(mechanisms, preferred);
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

  private bindXmppEvents(xmpp: XmppClientLike): void {
    xmpp.on("online", async (address: unknown) => {
      this.onlineDeviceId = addressToString(address) ?? this.config.deviceId;
      this.setStatus("online");
      this.log("info", "chat_online", {
        deviceId: this.onlineDeviceId,
        bareDeviceId: this.getBareDeviceId(),
      });
      await xmpp.send(xml("presence"));
      try {
        await this.enableMessageCarbons();
        this.log("debug", "chat_carbons_enabled", {
          deviceId: this.onlineDeviceId,
        });
      } catch (error) {
        this.log("warn", "chat_carbons_enable_failed", { error });
      }
      try {
        await this.config.encryption?.onConnect?.(this.getEncryptionContext());
        this.log("debug", "chat_encryption_connected", {
          deviceId: this.getBareDeviceId(),
        });
      } catch (error) {
        this.log("error", "chat_encryption_connect_failed", { error });
        this.emit(this.errorListeners, { error });
      }
    });

    xmpp.on("offline", () => {
      this.setStatus("offline");
      this.onlineDeviceId = undefined;
      this.log("warn", "chat_offline");
      this.rejectPendingIq(new Error("chat_iq_offline"));
    });

    xmpp.on("error", (error: unknown) => {
      this.log("error", "chat_xmpp_error", { error });
      this.emit(this.errorListeners, { error });
      this.setStatus("error", error);
    });

    xmpp.on("stanza", (stanza: XmppElementLike) => {
      this.handleStanza(stanza).catch((error: unknown) => {
        this.emit(this.errorListeners, { error, raw: stanza });
      });
    });
  }

  private async enableMessageCarbons(): Promise<void> {
    await this.sendIq({
      type: "set",
      payload: xml("enable", { xmlns: XMPP_CARBONS_NS }),
    });
  }

  private unwrapCarbonMessage(stanza: XmppElementLike): CarbonForwardedMessage | null {
    const sent = stanza.getChild?.("sent", XMPP_CARBONS_NS);
    const received = stanza.getChild?.("received", XMPP_CARBONS_NS);
    const carbon = sent ?? received;
    const direction = sent ? "sent" : received ? "received" : undefined;
    const forwarded = carbon?.getChild?.("forwarded", XMPP_FORWARD_NS);
    const message =
      forwarded?.getChild?.("message", "jabber:client") ??
      forwarded?.getChild?.("message");
    if (!direction || !message) return null;
    return { direction, message };
  }

  private async handleStanza(stanza: XmppElementLike): Promise<void> {
    this.resolvePendingIq(stanza);
    if (!stanza.is?.("message")) return;

    const carbon = this.unwrapCarbonMessage(stanza);
    const messageStanza = carbon?.message ?? stanza;
    const attrs = messageStanza.attrs ?? {};
    const fromFullAddress = normalizeTransportAddress(addressToString(attrs.from));
    const fromDeviceId = fromFullAddress || normalizeBareDeviceId(addressToString(attrs.from));
    const fromUserId = getUserIdFromChatAddress(fromFullAddress) || "";
    const toDeviceId = attrs.to
      ? normalizeTransportAddress(addressToString(attrs.to)) || addressToString(attrs.to)
      : this.getDeviceId();
    const roomId = trimToUndefined(messageStanza.getChildText?.("thread") ?? undefined);
    this.rememberRoomPeer(roomId, carbon?.direction === "sent" ? toDeviceId : fromDeviceId);
    this.log("debug", "chat_message_stanza_received", {
      id: attrs.id,
      type: attrs.type,
      fromDeviceId,
      toDeviceId,
      roomId,
      carbonDirection: carbon?.direction,
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
          raw: messageStanza,
        });
        this.log("debug", "chat_delivery_received", {
          id: receiptId,
          roomId,
          status: "delivered",
          fromDeviceId,
        });
      } else {
        this.log("debug", "chat_delivery_ignored_missing_room", {
          id: receiptId,
          fromDeviceId,
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
          raw: messageStanza,
        });
        this.log("debug", "chat_delivery_received", {
          id: displayed.attrs.id,
          roomId,
          status: "read",
          fromDeviceId,
        });
      } else {
        this.log("debug", "chat_read_marker_ignored_missing_room", {
          id: displayed.attrs.id,
          fromDeviceId,
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
        text: errorEvent.text,
      });
      this.emit(this.errorListeners, {
        ...errorEvent,
        id: attrs.id,
        fromUserId: fromUserId || undefined,
        fromFullAddress: fromFullAddress || undefined,
        fromDeviceId,
        toDeviceId,
        roomId,
        raw: messageStanza,
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
        raw: messageStanza,
      });
      this.log("debug", "chat_typing_received", {
        roomId,
        fromDeviceId,
        isTyping: Boolean(composing),
      });
    }

    const decoded = await this.decodePayload(messageStanza);
    const body = decoded.body;
    const attachments = normalizeAttachmentPayload(decoded.attachments);
    if (!body.trim() && !attachments?.length) {
      this.log("debug", "chat_message_ignored_empty", {
        id: attrs.id,
        fromDeviceId,
        roomId,
      });
      return;
    }
    if (!roomId || !toDeviceId) {
      this.log("debug", "chat_message_ignored_missing_target_context", {
        id: attrs.id,
        fromDeviceId,
        roomId,
        hasToDeviceId: Boolean(toDeviceId),
      });
      return;
    }
    const metadata = normalizeMessageMetadata(
      decoded.metadata,
      inferMessageType(decoded.metadata, body),
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
      ...(attachments?.length ? { attachments } : {}),
      raw: messageStanza,
    });
    this.log("debug", "chat_message_received", {
      id: emittedMessageId,
      roomId,
      fromDeviceId,
      messageType: metadata.messageType,
      hasAttachments: Boolean(attachments?.length),
    });

    const receiptRequest = messageStanza.getChild?.("request", XMPP_RECEIPTS_NS);
    if (!carbon && attrs.id && receiptRequest && fromDeviceId) {
      await this.sendReceipt({ toDeviceId: fromDeviceId, roomId, messageId: attrs.id });
    }
  }

  private async sendReceipt(input: {
    toDeviceId: DeviceId;
    roomId?: string;
    messageId: string;
  }): Promise<void> {
    const children: XmppChild[] = [
      xml("received", { xmlns: XMPP_RECEIPTS_NS, id: input.messageId }),
    ];
    if (input.roomId) children.unshift(xml("thread", {}, input.roomId));
    await this.requireXmpp().send(
      xml("message", {
        to: input.toDeviceId,
        type: "chat",
        id: `rcpt-${Date.now()}`,
      }, ...children),
    );
  }

  private getEncryptionContext(): ChatEncryptionContext {
    return {
      getDeviceId: () => this.getDeviceId(),
      getBareDeviceId: () => this.getBareDeviceId(),
      sendIq: (input) => this.sendIq(input),
      logger: this.config.logger,
    };
  }

  private getAttachmentUploadContext(roomId: string): ChatAttachmentUploadContext {
    return {
      roomId,
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      requestSlot: (input) => this.requestAttachmentUploadSlot(input),
      logger: this.config.logger,
    };
  }

  private getAttachmentResolveContext(): ChatAttachmentResolveContext {
    return {
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      logger: this.config.logger,
    };
  }

  private rememberRoomPeer(roomId?: string, peerDeviceId?: string): void {
    const normalizedRoomId = roomId?.trim();
    const normalizedPeerDeviceId = normalizeTransportAddress(peerDeviceId);
    if (!normalizedRoomId || !normalizedPeerDeviceId) return;
    if (isOwnTransportTarget(normalizedPeerDeviceId, this.getDeviceId(), this.getBareDeviceId())) return;
    const peers = this.roomPeers.get(normalizedRoomId) ?? new Set<string>();
    const previousSize = peers.size;
    peers.add(normalizedPeerDeviceId);
    this.roomPeers.set(normalizedRoomId, peers);
    if (peers.size !== previousSize) {
      this.log("debug", "chat_room_peer_remembered", {
        roomId: normalizedRoomId,
        peerDeviceId: normalizedPeerDeviceId,
        peerCount: peers.size,
      });
    }
  }

  private rememberRoomPeers(roomId?: string, peerDeviceIds?: string[]): void {
    peerDeviceIds?.forEach((peerDeviceId) => this.rememberRoomPeer(roomId, peerDeviceId));
  }

  private async resolveRoomForUserId(input: ChatRoomLookupInput): Promise<ChatRoom> {
    const userId = input.userId.trim();
    if (!userId) throw new Error("chat_user_id_required");
    const provider = this.config.roomDirectory?.getOrCreateRoom;
    if (!provider) throw new Error("chat_room_directory_get_or_create_required");
    const room = await provider({ userId, metadata: input.metadata });
    const normalizedRoomId = room.roomId.trim();
    if (!normalizedRoomId) throw new Error("chat_room_id_required");
    this.rememberRoomPeers(
      normalizedRoomId,
      deriveFanoutDeviceIds(room),
    );
    return { ...room, roomId: normalizedRoomId };
  }

  private async resolveRoomTargets(input: {
    roomId?: string;
    explicitDeviceIds?: string[];
  }): Promise<string[]> {
    const explicit = normalizeTransportAddressList(input.explicitDeviceIds ?? []);
    if (input.roomId) this.rememberRoomPeers(input.roomId, explicit);
    const resolverDeviceIds = input.roomId ? await this.getPeerDeviceIds(input.roomId) : [];
    const cachedDeviceIds = input.roomId ? this.getCachedRoomPeers(input.roomId) : [];
    const ownTransportAddress = normalizeTransportAddress(this.getDeviceId());
    const ownBareAddress = this.getBareDeviceId();
    const targets = normalizeTransportAddressList([
      ...explicit,
      ...resolverDeviceIds,
      ...cachedDeviceIds,
    ]).filter(
      (target) => !isOwnTransportTarget(target, ownTransportAddress, ownBareAddress),
    );
    this.log("debug", "chat_room_targets_resolved", {
      roomId: input.roomId,
      explicitCount: explicit.length,
      resolverCount: resolverDeviceIds.length,
      cachedCount: cachedDeviceIds.length,
      targetCount: targets.length,
    });
    if (!targets.length) {
      const suffix = input.roomId ? `:${input.roomId}` : "";
      throw new Error(`chat_room_peer_unknown${suffix}`);
    }
    return targets;
  }

  private getCachedRoomPeers(roomId: string): string[] {
    return Array.from(this.roomPeers.get(roomId.trim()) ?? []);
  }

  private async resolveRoomDeviceIds(roomId: string): Promise<DeviceId[]> {
    const normalizedRoomId = roomId.trim();
    if (!normalizedRoomId) return [];
    if (this.config.roomDirectory?.getPeerDeviceIds) {
      const resolved = await this.config.roomDirectory.getPeerDeviceIds(normalizedRoomId);
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_directory_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length,
      });
      return normalized;
    }
    if (this.config.resolveRoomDeviceIds) {
      const resolved = await this.config.resolveRoomDeviceIds(normalizedRoomId);
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_fallback_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length,
      });
      return normalized;
    }
    this.log("debug", "chat_room_peer_devices_unresolved", { roomId: normalizedRoomId });
    return [];
  }

  private async sendToTargets(
    targetDeviceIds: string[],
    send: (targetDeviceId: string) => Promise<unknown>,
  ): Promise<void> {
    const targets = normalizeTransportAddressList(targetDeviceIds);
    if (!targets.length) throw new Error("chat_targets_required");

    const results = await Promise.all(
      targets.map(async (targetDeviceId) => {
        try {
          await send(targetDeviceId);
          return { ok: true as const };
        } catch (error) {
          this.log("warn", "chat_target_send_failed", { targetDeviceId, error });
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
    if (Array.isArray(encrypted)) {
      this.log("debug", "chat_payload_encoded_encrypted_array", {
        messageType: input.metadata.messageType,
        childCount: encrypted.length,
      });
      return { body: input.body, children: encrypted };
    }
    if (encrypted) {
      this.log("debug", "chat_payload_encoded_encrypted", {
        messageType: input.metadata.messageType,
        childCount: encrypted.children?.length ?? 0,
      });
      return {
        body: encrypted.body ?? input.body,
        children: encrypted.children ?? [],
      };
    }

    this.log("debug", "chat_payload_encoded_plain", {
      messageType: input.metadata.messageType,
      hasAttachments: Boolean(input.attachments?.length),
    });
    return {
      body: input.body,
      children: [
        xml(
          "lula",
          { xmlns: XMPP_CHAT_NS },
          encodeJsonBase64({
            metadata: input.metadata,
            ...(input.attachments?.length
              ? { attachments: serializeAttachmentsForWire(input.attachments) }
              : {}),
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
    if (decrypted) {
      this.log("debug", "chat_payload_decoded_encrypted", {
        hasBody: Boolean(decrypted.body?.trim()),
        hasAttachments: Boolean(decrypted.attachments?.length),
      });
      return decrypted;
    }

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
    const attachments =
      metadataPayload && typeof metadataPayload === "object" && !Array.isArray(metadataPayload)
        ? normalizeAttachmentPayload((metadataPayload as Record<string, unknown>).attachments)
        : undefined;

    this.log("debug", "chat_payload_decoded_plain", {
      hasBody: Boolean(body.trim()),
      hasMetadata: Boolean(metadata),
      hasAttachments: Boolean(attachments?.length),
    });
    return { body, metadata, attachments };
  }

  private setStatus(status: ChatStatus, error?: unknown): void {
    this.status = status;
    this.log(status === "error" ? "error" : "debug", "chat_status_changed", {
      status,
      deviceId: this.onlineDeviceId,
      ...(error ? { error } : {}),
    });
    this.emit(this.statusListeners, {
      status,
      deviceId: this.onlineDeviceId,
      error,
    });
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

  private async requestAttachmentUploadSlot(
    input: ChatAttachmentUploadSlotRequest,
  ): Promise<ChatAttachmentUploadSlot> {
    const stanza = await this.sendIq({
      type: "get",
      to: this.config.uploadService,
      payload: xml("request", {
        xmlns: XMPP_HTTP_UPLOAD_NS,
        filename: input.name,
        size: String(Math.max(1, Math.floor(input.size))),
        "content-type": input.mimeType,
      }),
    });
    return parseUploadSlotResponse(stanza);
  }

  private emit<T>(listeners: Set<(event: T) => void>, event: T): void {
    for (const listener of Array.from(listeners)) {
      try {
        listener(event);
      } catch (error) {
        this.log("error", "chat_listener_error", { error });
      }
    }
  }

  private log(
    level: Exclude<ChatLogLevel, "silent">,
    message: string,
    data?: Record<string, unknown>,
  ): void {
    const logger = this.config.logger;
    if (!logger) return;
    if (CHAT_LOG_LEVEL_WEIGHT[this.config.logLevel] < CHAT_LOG_LEVEL_WEIGHT[level]) return;
    logger[level]?.(message, data);
  }
}

type OmemoState = {
  bareJid: string;
  omemoDeviceId: number;
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

    const privateKey = nobleRandomBytes(32);
    const publicKey = x25519.getPublicKey(privateKey);
    const nextState: OmemoState = {
      bareJid,
      omemoDeviceId: Math.max(1, bytesToUint32(nobleRandomBytes(4))),
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
    const bareJid = context.getBareDeviceId();
    if (!bareJid) return;

    const state = await loadOrCreateState(bareJid);
    const existingIds = await fetchDeviceIds(context, bareJid).catch(() => []);
    const finalDeviceIds = Array.from(new Set([state.omemoDeviceId, ...existingIds])).filter(
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
          { node: `${OMEMO_BUNDLE_NODE_PREFIX}${state.omemoDeviceId}` },
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
    toDeviceId: DeviceId,
  ): Promise<OmemoPeerSession[]> => {
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

    const sessions: OmemoPeerSession[] = [];
    for (const peerDeviceId of peerDeviceIds) {
      try {
        const peerPublicKey = await fetchIdentityKey(
          context,
          normalizeBareDeviceId(toDeviceId),
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
      const iv = nobleRandomBytes(12);
      const contentKey = nobleRandomBytes(OMEMO_AES_KEY_BYTES);
      const plaintext = new TextEncoder().encode(
        JSON.stringify({
          body: input.body,
          ...(input.metadata ? { metadata: input.metadata } : {}),
          ...(input.attachments?.length
            ? { attachments: serializeAttachmentsForWire(input.attachments) }
            : {}),
        }),
      );
      const ciphertext = gcm(contentKey, iv).encrypt(plaintext);

      const keyElements = sessions.map((session) => {
        const wrapSalt = nobleRandomBytes(OMEMO_KEY_WRAP_BYTES);
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
              { sid: String(state.omemoDeviceId) },
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

      const bareJid = context.getBareDeviceId();
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
        if (rid !== state.omemoDeviceId) continue;
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
          attachments: normalizeAttachmentPayload(parsed.attachments),
        };
      } catch {
        return { body: "", metadata: undefined };
      }
    },
  };
}

type NormalizedConfig = {
  service: string;
  uploadService: string;
  apiKey: string;
  userId: string;
  localDeviceId: DeviceId;
  username: string;
  deviceId: DeviceId;
  displayName?: string;
  password?: string;
  authType: "password" | "x-oauth2";
  domain: string;
  resource: string;
  connectTimeoutMs: number;
  roomDirectory?: ChatRoomDirectory;
  resolveRoomDeviceIds?: (roomId: string) => Promise<DeviceId[]> | DeviceId[];
  logger?: ChatLogger;
  logLevel: ChatLogLevel;
  encryption?: ChatEncryption;
  attachmentService?: ChatAttachmentService;
};

function normalizeConfig(config: ChatClientConfig): NormalizedConfig {
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
    password:
      config.authType === "x-oauth2"
        ? trimToUndefined(config.accessToken)
        : trimToUndefined(config.password),
    authType: config.authType ?? "password",
    domain,
    resource,
    connectTimeoutMs: config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    roomDirectory: config.roomDirectory,
    resolveRoomDeviceIds: config.resolveRoomDeviceIds,
    logger: config.logger,
    logLevel: normalizeLogLevel(config.logLevel, config.logger),
    encryption: config.encryption,
    attachmentService: config.attachmentService,
  };
}

export function extractProviderDirectMessageRoomId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : undefined;
  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.providerDirectMessageRoomId,
    lulaPayload?.providerDirectMessageRoomId,
    lulaSubmission?.providerDirectMessageRoomId,
  );
}

export function extractSubmissionId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : undefined;
  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.correlationId,
    lulaPayload?.correlationId,
    lulaSubmission?.correlationId,
  );
}

export function extractSubmissionRoomId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : undefined;
  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.submissionRoomId,
    lulaPayload?.submissionRoomId,
    lulaSubmission?.submissionRoomId,
  );
}

export function extractDisplayName(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.displayName,
    metadata.senderDisplayName,
    lulaSubmission?.displayName,
    lulaSubmission?.senderName,
  );
}

function extractMessageType(metadata?: Record<string, unknown>): ChatMessageType | undefined {
  const rawType = firstString(metadata?.messageType, metadata?.type);
  if (rawType === "CHAT_MESSAGE" || rawType === "FORM_SUBMISSION") return rawType;
  return undefined;
}

function normalizeMessageMetadata(
  metadata: Record<string, unknown> | undefined,
  fallbackType: ChatMessageType,
): ChatMessageMetadata {
  return {
    ...(metadata ?? {}),
    messageType: extractMessageType(metadata) ?? fallbackType,
  } as ChatMessageMetadata;
}

function inferMessageType(metadata: Record<string, unknown> | undefined, body: string): ChatMessageType {
  const metadataType = extractMessageType(metadata);
  if (metadataType) return metadataType;
  if (isRecord(metadata?.lulaPayload)) return "FORM_SUBMISSION";

  const payload = parseJsonRecord(body);
  if (payload?.type === "form_submission") return "FORM_SUBMISSION";
  if (payload && (isRecord(payload.readable) || isRecord(payload.raw))) return "FORM_SUBMISSION";
  return "CHAT_MESSAGE";
}

export function buildChatMessageMetadata(input: {
  roomId?: string;
  metadata?: Record<string, unknown>;
  context?: ChatMessageContext;
  displayName?: string;
}): ChatMessageMetadata {
  const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");
  const providerDirectMessageRoomId = firstString(
    input.context?.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata),
    input.roomId,
  );

  if (providerDirectMessageRoomId) {
    metadata.providerDirectMessageRoomId = providerDirectMessageRoomId;
  }
  const submissionRoomId = firstString(
    input.context?.submissionRoomId,
    extractSubmissionRoomId(metadata),
  );
  if (submissionRoomId) {
    metadata.submissionRoomId = submissionRoomId;
  }
  const correlationId = firstString(
    input.context?.correlationId,
    extractSubmissionId(metadata),
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
    input.displayName,
  );
  if (displayName) {
    metadata.displayName = displayName;
  }

  const shouldWriteSubmissionContext =
    context &&
    (typeof context.submissionRoomId === "string" ||
      typeof context.correlationId === "string" ||
      typeof context.senderName === "string" ||
      typeof context.displayName === "string");

  if (shouldWriteSubmissionContext) {
    const existing = isRecord(metadata.lulaSubmission)
      ? (metadata.lulaSubmission as Record<string, unknown>)
      : {};
    const { providerDirectMessageRoomId: _providerDirectMessageRoomId, ...rest } = context;
    metadata.lulaSubmission = removeUndefinedValues({
      ...existing,
      ...rest,
      ...(submissionRoomId ? { submissionRoomId } : {}),
      ...(correlationId ? { correlationId } : {}),
      ...(displayName ? { displayName } : {}),
      ...(providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}),
    });
  }

  return metadata;
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
    | "providerDirectMessageRoomId"
    | "submissionRoomId"
    | "correlationId"
    | "submittedAt"
  > & { displayName?: string },
): ChatMessageMetadata {
  const metadata = normalizeMessageMetadata(input.metadata, "FORM_SUBMISSION");
  const providerDirectMessageRoomId = firstString(
    input.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata),
  );
  const submissionRoomId = firstString(
    input.submissionRoomId,
    extractSubmissionRoomId(metadata),
    input.roomId,
  );
  const correlationId = firstString(
    input.correlationId,
    extractSubmissionId(metadata),
  );
  const existingPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : {};

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
    submittedAt:
      input.submittedAt ??
      (typeof existingPayload.submittedAt === "string"
        ? existingPayload.submittedAt
        : new Date().toISOString()),
  });

  return metadata;
}

function collectTargetDeviceIds(input: {
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
}): string[] {
  return normalizeTransportAddressList([
    input.toDeviceId,
    input.peerDeviceId,
    ...(input.toDeviceIds ?? []),
    ...(input.peerDeviceIds ?? []),
  ]);
}

function normalizeTransportAddress(value?: string | null): DeviceId {
  return addressToString(value)?.trim() ?? "";
}

function normalizeTransportAddressList(values: Array<string | undefined>): DeviceId[] {
  const normalized = values
    .map((value) => normalizeTransportAddress(value))
    .filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}

function isOwnTransportTarget(
  target: string,
  ownTransportAddress?: string,
  ownBareAddress?: string,
): boolean {
  const normalized = normalizeTransportAddress(target);
  if (!normalized) return true;
  if (ownTransportAddress && normalized === ownTransportAddress) return true;
  if (ownBareAddress && normalized === ownBareAddress) return true;
  return false;
}

function normalizeDeviceIdList(values: Array<string | undefined>): DeviceId[] {
  const normalized = values
    .map((value) => normalizeBareDeviceId(value))
    .filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}

function pickMessageTargetInput(input: ChatFormSubmissionInput): Omit<ChatMessageInput, "body" | "metadata"> {
  return {
    toDeviceId: input.toDeviceId,
    toDeviceIds: input.toDeviceIds,
    peerDeviceId: input.peerDeviceId,
    peerDeviceIds: input.peerDeviceIds,
    attachments: input.attachments,
    roomId: input.roomId,
    targetRoomId: input.targetRoomId,
    id: input.id,
    requestReceipt: input.requestReceipt,
  };
}

function toChatTextMessage(message: ChatMessage): ChatTextMessage {
  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata) ?? message.fromUserId;
  const lulaSubmission = isRecord(metadata?.lulaSubmission)
    ? (metadata?.lulaSubmission as Record<string, unknown>)
    : undefined;
  const context = removeUndefinedValues({
    ...(lulaSubmission ?? {}),
    ...(providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}),
    ...(submissionRoomId ? { submissionRoomId } : {}),
    ...(correlationId ? { correlationId } : {}),
    ...(displayName ? { displayName } : {}),
  }) as ChatMessageContext;

  return {
    ...message,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...(submissionRoomId ? { submissionRoomId } : {}),
    correlationId,
    displayName,
    ...(Object.keys(context).length > 0 ? { context } : {}),
  };
}

function toChatAttachmentMessage(message: ChatMessage): ChatAttachmentMessage {
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) {
    throw new Error("chat_attachment_message_missing_attachments");
  }

  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const lulaSubmission = isRecord(metadata?.lulaSubmission)
    ? (metadata?.lulaSubmission as Record<string, unknown>)
    : undefined;
  const context = removeUndefinedValues({
    ...(lulaSubmission ?? {}),
    ...(providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}),
    ...(submissionRoomId ? { submissionRoomId } : {}),
    ...(correlationId ? { correlationId } : {}),
    ...(displayName ? { displayName } : {}),
  }) as ChatMessageContext;

  return {
    ...message,
    attachments,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...(submissionRoomId ? { submissionRoomId } : {}),
    correlationId,
    ...(displayName ? { displayName } : {}),
    ...(Object.keys(context).length > 0 ? { context } : {}),
  };
}

function isFormSubmissionMessage(message: ChatMessage): boolean {
  const metadataType = extractMessageType(message.metadata);
  if (metadataType === "FORM_SUBMISSION") return true;
  return Boolean(parseFormSubmissionMessage(message));
}

function isAttachmentMessage(message: ChatMessage): boolean {
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) return false;
  if (message.metadata.attachment === true) return true;
  const metadataType = extractMessageType(message.metadata);
  return metadataType === "CHAT_MESSAGE";
}

function parseFormSubmissionMessage(message: ChatMessage): ChatFormSubmissionMessage | null {
  const payload = parseJsonRecord(message.body);
  if (!payload) return null;

  const metadata = message.metadata;
  const metadataType = extractMessageType(metadata);
  const lulaPayload = isRecord(metadata?.lulaPayload)
    ? (metadata?.lulaPayload as Record<string, unknown>)
    : undefined;
  const isExplicitFormPayload = payload.type === "form_submission";
  const isReadableSubmissionPayload = isRecord(payload.readable) || isRecord(payload.raw);
  if (
    metadataType !== "FORM_SUBMISSION" &&
    !lulaPayload &&
    !isExplicitFormPayload &&
    !isReadableSubmissionPayload
  ) {
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
    providerDirectMessageRoomId: providerDirectMessageRoomId,
    ...(submissionRoomId ? { submissionRoomId } : {}),
    ...(correlationId ? { correlationId } : {}),
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
    ...(displayName ? { displayName } : {}),
  };
}

function normalizeFormSubmissionPayload(payload: Record<string, unknown>): {
  answers: Record<string, string>;
  fields: ChatFormSubmissionField[];
} {
  const readable = isRecord(payload.readable) ? payload.readable : {};
  const raw = isRecord(payload.raw) ? payload.raw : {};
  const keys = Array.from(new Set([...Object.keys(raw), ...Object.keys(readable)]));
  const answers: Record<string, string> = {};
  const fields = keys.map((key) => {
    const readableEntry = isRecord(readable[key]) ? readable[key] : undefined;
    const rawValue = raw[key];
    const value = readableEntry && "value" in readableEntry ? readableEntry.value : rawValue;
    answers[key] = stringifyAnswerValue(value);

    return {
      id: firstString(readableEntry?.id, readableEntry?.fieldId, key) ?? key,
      label: firstString(readableEntry?.label, key) ?? key,
      type: firstString(readableEntry?.type, readableEntry?.fieldType) ?? inferFieldType(value),
      required: readableEntry?.required === true,
    };
  });

  return { answers, fields };
}

function stringifyAnswerValue(value: unknown): string {
  if (value === undefined || value === null) return "";
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

function inferFieldType(value: unknown): string {
  if (Array.isArray(value)) return "array";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (isRecord(value)) return "object";
  return "text";
}

function parseJsonRecord(input: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(input) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function serializeAttachmentsForWire(attachments: ChatAttachment[]): ChatAttachment[] {
  return attachments.map((attachment) => {
    const normalized = normalizeRequiredAttachment(attachment);
    const { localUri: _localUri, ...rest } = normalized;
    return rest;
  });
}

function normalizeAttachmentPayload(value: unknown): ChatAttachment[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const attachments = value
    .map((entry) => normalizeAttachment(entry))
    .filter((entry): entry is ChatAttachment => Boolean(entry));
  return attachments.length ? attachments : undefined;
}

function normalizeRequiredAttachment(value: unknown): ChatAttachment {
  const attachment = normalizeAttachment(value);
  if (!attachment) throw new Error("chat_attachment_invalid");
  return attachment;
}

function normalizeAttachment(value: unknown): ChatAttachment | null {
  if (!isRecord(value)) return null;
  const id = firstString(value.id, value.url, value.localUri, value.thumbnailUrl);
  if (!id) return null;
  const type = normalizeAttachmentType(value);
  const metadata = isRecord(value.metadata)
    ? (value.metadata as Record<string, unknown>)
    : undefined;
  return removeUndefinedValues({
    id,
    type,
    name: firstString(value.name),
    mimeType: firstString(value.mimeType),
    size:
      typeof value.size === "number" && Number.isFinite(value.size)
        ? Math.max(0, Math.floor(value.size))
        : undefined,
    url: firstString(value.url),
    thumbnailUrl: firstString(value.thumbnailUrl),
    localUri: firstString(value.localUri),
    width:
      typeof value.width === "number" && Number.isFinite(value.width)
        ? Math.max(0, Math.floor(value.width))
        : undefined,
    height:
      typeof value.height === "number" && Number.isFinite(value.height)
        ? Math.max(0, Math.floor(value.height))
        : undefined,
    metadata,
  }) as ChatAttachment;
}

function normalizeAttachmentType(value: Record<string, unknown>): "image" | "file" {
  const explicit = firstString(value.type)?.toLowerCase();
  if (explicit === "image" || explicit === "file") return explicit;
  const mimeType = firstString(value.mimeType)?.toLowerCase();
  if (mimeType?.startsWith("image/")) return "image";
  return "file";
}

function defaultAttachmentSource(attachment: ChatAttachment): string | null {
  const direct = firstString(attachment.localUri, attachment.url);
  if (direct) return direct;
  const id = firstString(attachment.id);
  if (id && /^(https?:|file:)/i.test(id)) return id;
  return null;
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
  return `msg-${Date.now()}-${createRuntimeIdSuffix()}`;
}

function generateIqId(): string {
  return `iq-${Date.now()}-${createRuntimeIdSuffix()}`;
}

function parseUploadSlotResponse(stanza: XmppElementLike): ChatAttachmentUploadSlot {
  const raw = toRawXmlString(stanza);
  const putMatch =
    raw.match(/<put\b([^>]*)>([\s\S]*?)<\/put>/) ?? raw.match(/<put\b([^>]*)\/>/);
  const getMatch =
    raw.match(/<get\b([^>]*)\/>/) ?? raw.match(/<get\b([^>]*)>(?:[\s\S]*?)<\/get>/);
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

  const headers: Record<string, string> = {};
  const headerRegex = /<header\b([^>]*)>([\s\S]*?)<\/header>/g;
  let headerMatch: RegExpExecArray | null = null;
  while ((headerMatch = headerRegex.exec(putMatch[2] ?? "")) !== null) {
    const attrs = parseXmlAttributes(headerMatch[1] ?? "");
    const name = attrs.name?.trim();
    const value = decodeXmlEntities((headerMatch[2] ?? "").trim());
    if (name && value) headers[name] = value;
  }

  return { putUrl, getUrl, headers };
}

function buildXmppUserLocalpart(userId: string): string {
  return `i.${userId}`;
}

function buildXmppUserAddress(userId: string, xmppDomain: string): string {
  return `${buildXmppUserLocalpart(userId)}@${xmppDomain}`;
}

function buildXmppUserResourceAddress(
  userId: string,
  xmppDomain: string,
  resource: string,
): string {
  return `${buildXmppUserAddress(userId, xmppDomain)}/${resource}`;
}

function buildXmppWebSocketUrl(xmppDomain: string, path?: string): string {
  const fullUrl = trimToUndefined(path);
  if (fullUrl && /^wss?:\/\//i.test(fullUrl)) {
    return fullUrl;
  }
  const normalizedPath = normalizeXmppWebSocketPath(path);
  return `wss://${xmppDomain}${normalizedPath}`;
}

function normalizeXmppWebSocketPath(path?: string): string {
  const trimmed = trimToUndefined(path) ?? DEFAULT_XMPP_WEBSOCKET_PATH;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function normalizeXmppDomain(domain?: string): string | undefined {
  const trimmed = trimToUndefined(domain);
  if (!trimmed) return undefined;
  return trimmed
    .replace(/^wss?:\/\//i, "")
    .replace(/\/.*$/, "")
    .trim();
}

function normalizeUserIdSegment(value?: string): string | undefined {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return undefined;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const withoutPrefix = localpart?.replace(/^i\./, "");
  return withoutPrefix?.replace(/\.d\..*$/, "") || undefined;
}

function getUserIdFromChatAddress(value?: string): string | undefined {
  const localpart = normalizeBareDeviceId(value).split("@")[0]?.trim();
  if (!localpart) return undefined;
  const withoutPrefix = localpart.startsWith("i.") ? localpart.slice(2) : localpart;
  const deviceMarker = withoutPrefix.indexOf(".d.");
  return (deviceMarker >= 0 ? withoutPrefix.slice(0, deviceMarker) : withoutPrefix) || undefined;
}

function normalizeDeviceIdSegment(value?: string): string | undefined {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return undefined;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const deviceMarker = localpart?.indexOf(".d.") ?? -1;
  return deviceMarker >= 0 ? localpart?.slice(deviceMarker + 3) || undefined : localpart;
}

function normalizeBareDeviceId(deviceId?: string | null): DeviceId {
  return addressToString(deviceId)?.trim().split("/")[0] ?? "";
}

function trimToUndefined(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeResourceSegment(value: string): string {
  const resource = value.trim().replace(/\s+/g, "-").replace(/\//g, "-");
  if (!resource) throw new Error("chat_resource_invalid");
  return resource;
}

function normalizeLogLevel(level: ChatLogLevel | undefined, logger?: ChatLogger): ChatLogLevel {
  if (!logger) return "silent";
  if (!level) return "error";
  if (level in CHAT_LOG_LEVEL_WEIGHT) return level;
  throw new Error(`chat_log_level_invalid:${level}`);
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
  options: Pick<ChatRoomDirectoryOptions, "currentUserId" | "xmppDomain"> = {},
): ChatRoom {
  const roomRecord = unwrapRoomRecord(response);
  const roomId = firstString(
    roomRecord.roomId,
    roomRecord.providerDirectMessageRoomId,
    roomRecord.id,
    roomRecord._id,
  );
  if (!roomId) throw new Error("chat_room_id_required");

  const id = firstString(roomRecord.id, roomRecord._id);
  const peerDeviceIds = collectPeerDeviceIdsFromRoom(roomRecord, options);
  const ownDeviceIds = collectOwnDeviceIdsFromRoom(roomRecord, options);
  return {
    ...(id ? { id } : {}),
    roomId,
    ...(peerDeviceIds.length ? { peerDeviceIds } : {}),
    ...(ownDeviceIds.length ? { ownDeviceIds } : {}),
    raw: response,
  };
}

function deriveFanoutDeviceIds(room: Pick<ChatRoom, "peerDeviceIds" | "ownDeviceIds">): DeviceId[] {
  return normalizeTransportAddressList([...(room.peerDeviceIds ?? []), ...(room.ownDeviceIds ?? [])]);
}

function unwrapRoomRecord(response: unknown): Record<string, unknown> {
  if (!isRecord(response)) throw new Error("chat_room_response_invalid");
  if (isRecord(response.data)) return response.data;
  if (isRecord(response.room)) return response.room;
  return response;
}

function collectPeerDeviceIdsFromRoom(
  room: Record<string, unknown>,
  options: Pick<ChatRoomDirectoryOptions, "currentUserId" | "xmppDomain">,
): string[] {
  const candidates: string[] = [];
  const domain = normalizeXmppDomain(options.xmppDomain);
  const roomUserId = firstString(
    room.peerUserId,
    room.peerAppUserId,
    room.userId,
    room.appUserId,
    room.providerUserId,
    room.peerProviderUserId,
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
      entry.providerUserId,
    );
    const entryNames = collectStringValues(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId,
      entry.deviceId,
      entry.deviceIds,
      entry.chatUserId,
      entry.chatUserIds,
    ).map(normalizeUserName);
    if (current && entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, entryUserId);
  }

  return normalizeTransportAddressList(candidates);
}

function collectOwnDeviceIdsFromRoom(
  room: Record<string, unknown>,
  options: Pick<ChatRoomDirectoryOptions, "currentUserId" | "xmppDomain">,
): string[] {
  const candidates: string[] = [];
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
      entry.providerUserId,
    ).map(normalizeUserName);
    if (!entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, options.currentUserId);
  }

  return normalizeTransportAddressList(candidates);
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

function pushDeviceIdCandidates(
  target: string[],
  value: unknown,
  xmppDomain?: string,
  userId?: string,
): void {
  const values: string[] = [];
  pushStrings(values, value);
  values
    .map((entry) => expandDeviceIdCandidate(entry, xmppDomain, userId))
    .filter((entry): entry is string => Boolean(entry))
    .forEach((entry) => target.push(entry));
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function normalizeUserName(value?: string): string | undefined {
  const normalized = normalizeBareDeviceId(value);
  if (!normalized) return undefined;
  return normalizeUserIdSegment(normalized) ?? normalized.split("@")[0] ?? normalized;
}

function expandDeviceIdCandidate(
  value: string,
  xmppDomain?: string,
  userId?: string,
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const domain = normalizeXmppDomain(xmppDomain);
  const targetDomain =
    normalizeXmppDomain(trimmed.includes("@") ? trimmed.split("@")[1]?.split("/")[0] : undefined) ??
    domain;
  const normalizedUserId = normalizeUserIdSegment(userId) ?? normalizeUserIdSegment(trimmed);

  if (normalizedUserId && targetDomain) {
    return getChatUserId({ username: normalizedUserId, domain: targetDomain });
  }

  if (trimmed.includes("@")) return normalizeBareDeviceId(trimmed);
  return domain ? getChatUserId({ username: trimmed, domain }) : trimmed;
}

function isValidOmemoState(value: unknown): value is OmemoState {
  if (!isRecord(value)) return false;
  return (
    typeof value.bareJid === "string" &&
    value.bareJid.length > 0 &&
    typeof value.omemoDeviceId === "number" &&
    Number.isFinite(value.omemoDeviceId) &&
    value.omemoDeviceId > 0 &&
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

function parseXmlAttributes(input: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([a-zA-Z_:][\w:.-]*)\s*=\s*(['"])([\s\S]*?)\2/g;
  let match: RegExpExecArray | null = null;
  while ((match = pattern.exec(input)) !== null) {
    const name = match[1]?.trim();
    const value = decodeXmlEntities(match[3] ?? "");
    if (name) attributes[name] = value;
  }
  return attributes;
}

function decodeXmlEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
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
