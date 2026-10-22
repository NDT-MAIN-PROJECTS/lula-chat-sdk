import { type ChatMessageEditTarget } from "./message-edit.js";
export { CHAT_MESSAGE_EDIT_WINDOW_MS, getMessageEditError, isMessageEditWithinWindow } from "./message-edit.js";
export type { ChatMessageEditTarget, ChatMessageEditError } from "./message-edit.js";
import { xml } from "@xmpp/client";
import { type OmemoDiscoveryCacheStore } from "./omemoDiscoveryCache.js";
export { createInMemoryOmemoDiscoveryCache } from "./omemoDiscoveryCache.js";
export type { OmemoDiscoveryCacheStore, OmemoDiscoverySnapshot } from "./omemoDiscoveryCache.js";
export type Unsubscribe = () => void;
export type ChatStatus = "idle" | "connecting" | "online" | "offline" | "stopping" | "error";
export type ChatDeliveryStatus = "delivered" | "read";
export type ChatDeliveryReceiptMode = "automatic" | "manual";
export type ChatServerAcknowledgementEvent = {
    /** The stable XMPP stanza id supplied by the sending client. */
    id: string;
    /** Logical chat room carried in the message thread, when present. */
    roomId?: string;
    /** XMPP target acknowledged as handled by the server. */
    toDeviceId?: DeviceId;
    acknowledgedAt: number;
    raw?: unknown;
};
export type ChatServerSendFailureEvent = {
    /** The stable XMPP stanza id supplied by the sending client. */
    id: string;
    roomId?: string;
    toDeviceId?: DeviceId;
    failedAt: number;
    raw?: unknown;
};
export type ChatStreamManagementEvent = {
    state: "enabled" | "resumed" | "failed";
    resumable: boolean;
};
export type DeviceId = string;
export type ChatTargetScope = "user" | "resource";
export declare const CHAT_CONVERSATION_STATE_MESSAGE_TYPE: "CONVERSATION_STATE";
export declare const CHAT_EMERGENCY_MESSAGE_TYPE: "EMERGENCY";
export declare const CHAT_EMERGENCY_TYPE_SOS: "sos";
export declare const CHAT_VOICE_MESSAGE_TYPE: "VOICE_MESSAGE";
export type ChatConversationState = "open" | "closed";
export type ChatConversationType = "form_submission";
export declare const CHAT_REACTION_INTERACTION_TYPE: "CHAT_REACTION";
export declare const CHAT_REACTION_EMOJIS: readonly ["👍", "❤️", "😂", "😮", "😢", "🙏"];
export type ChatReactionEmoji = string;
export type ChatReplyReference = {
    messageId: string;
    body: string;
    senderId?: string;
    senderDisplayName?: string;
};
export type ChatReactionEvent = {
    targetMessageId: string;
    emoji: ChatReactionEmoji;
    actorId: string;
    removed: boolean;
};
export type ChatRetractionEvent = {
    id: string;
    targetMessageId: string;
    fromUserId: string;
    fromFullAddress: string;
    fromDeviceId: DeviceId;
    toDeviceId: DeviceId;
    roomId: string;
    timestamp: number;
    raw?: unknown;
};
/**
 * Applies the XEP-0424 author rule for direct chat messages.
 */
export declare function isRetractionAuthorized(event: Pick<ChatRetractionEvent, "fromFullAddress" | "fromDeviceId">, originalAuthorAddress?: string | null): boolean;
export type ChatMessageAuthorResolverInput = {
    roomId: string;
    messageId: string;
};
/**
 * Resolves the original sender JID from a consumer's persistent message store.
 * The SDK uses this when the target message is not in its bounded runtime cache.
 */
export type ChatMessageAuthorResolver = (input: ChatMessageAuthorResolverInput) => Promise<string | null | undefined> | string | null | undefined;
export type ChatMessageMetadata = Record<string, unknown> & {
    messageType: "CHAT_MESSAGE" | "FORM_SUBMISSION" | typeof CHAT_CONVERSATION_STATE_MESSAGE_TYPE | typeof CHAT_EMERGENCY_MESSAGE_TYPE | typeof CHAT_VOICE_MESSAGE_TYPE;
    canonicalEventId?: string;
    /** XEP-0359 id assigned by the originating client and preserved across retries. */
    originId?: string;
    replyTo?: ChatReplyReference;
    chatInteractionType?: typeof CHAT_REACTION_INTERACTION_TYPE;
    reactionToId?: string;
    reactionEmoji?: ChatReactionEmoji;
    reactionActorId?: string;
    reactionRemoved?: boolean;
    emergencyType?: typeof CHAT_EMERGENCY_TYPE_SOS;
    emergencyAlertId?: string;
    emergencyTriggeredAt?: string;
    voiceMessage?: boolean;
    voiceDurationMs?: number;
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
/**
 * A native XEP-0045 room. `memberJids` is the current authoritative membership
 * snapshot used to build the XEP-0384 OMEMO recipient set.
 */
export type ChatGroupRoom = {
    roomId: string;
    mucJid: string;
    memberJids: DeviceId[];
    nickname?: string;
};
export type ChatGroupInvitationEvent = {
    /** Bare MUC JID supplied by an XEP-0249 or XEP-0045 invitation. */
    mucJid: string;
    fromJid?: string;
    reason?: string;
    password?: string;
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
    findOne: (filter: Record<string, unknown>) => Promise<MongoDbStorageDocument | null> | MongoDbStorageDocument | null;
    updateOne: (filter: Record<string, unknown>, update: Record<string, unknown>, options?: Record<string, unknown>) => Promise<unknown> | unknown;
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
    /**
     * Per-file content-encryption material. This object is carried only inside
     * the OMEMO-protected message payload; object storage receives ciphertext.
     */
    encryption?: ChatAttachmentEncryption;
    /**
     * Read authority for the opaque object locator. The authorization value is
     * deliberately separate from `url` so it is never copied into query strings,
     * access logs, analytics, or link previews. Like the AES key, this object is
     * only safe because the attachment manifest is carried inside OMEMO.
     */
    downloadCapability?: ChatAttachmentDownloadCapability;
};
export type ChatAttachmentDownloadCapability = {
    v: 1;
    scheme: "LulaAttachment";
    authorization: string;
    expiresAt: string;
};
export declare const CHAT_ATTACHMENT_CAPABILITY_HEADER: "x-lula-attachment-capability";
export declare const CHAT_ATTACHMENT_CAPABILITY_EXPIRES_HEADER: "x-lula-attachment-capability-expires";
export type ChatAttachmentEncryption = {
    v: 1;
    alg: "A256GCM";
    keyB64: string;
    ivB64: string;
    plaintextSha256B64: string;
    ciphertextSha256B64: string;
    plaintextSize: number;
    ciphertextSize: number;
};
export type ChatAttachmentEncryptionResult = {
    ciphertext: Uint8Array;
    encryption: ChatAttachmentEncryption;
};
export declare function encryptChatAttachmentBytes(input: ArrayBuffer | Uint8Array): ChatAttachmentEncryptionResult;
export declare function decryptChatAttachmentBytes(input: ArrayBuffer | Uint8Array, encryption: ChatAttachmentEncryption): Uint8Array;
export declare function isEncryptedChatAttachment(attachment: Pick<ChatAttachment, "encryption">): boolean;
export declare function hasChatAttachmentDownloadCapability(attachment: Pick<ChatAttachment, "downloadCapability">): boolean;
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
    requestSlot: (input: ChatAttachmentUploadSlotRequest) => Promise<ChatAttachmentUploadSlot>;
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
    upload: (input: ChatAttachmentUpload, context: ChatAttachmentUploadContext) => Promise<ChatAttachment> | ChatAttachment;
    resolve?: (attachment: ChatAttachment, context: ChatAttachmentResolveContext) => Promise<string | null | undefined> | string | null | undefined;
};
export type ChatAttachmentFetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;
export type ChatAttachmentFetchUploadOptions = {
    fetch?: ChatAttachmentFetch;
    loadBytes?: (input: ChatAttachmentUpload) => Promise<ArrayBuffer | Uint8Array> | ArrayBuffer | Uint8Array;
};
export type ChatAttachmentFetchDownloadOptions = {
    fetch?: ChatAttachmentFetch;
};
/** Parse the one-time upload response without ever placing its secret in a URL. */
export declare function chatAttachmentDownloadCapabilityFromHeaders(headers: Headers | Record<string, string | string[] | undefined>): ChatAttachmentDownloadCapability;
export declare function buildChatAttachmentDownloadRequest(attachment: ChatAttachment): {
    url: string;
    headers: Record<string, string>;
};
/**
 * Reference connector implementation: encrypt locally, request an XEP-0363
 * slot through the SDK, PUT ciphertext, and return the OMEMO-safe manifest.
 */
export declare function uploadChatAttachmentWithFetch(input: ChatAttachmentUpload, context: ChatAttachmentUploadContext, options?: ChatAttachmentFetchUploadOptions): Promise<ChatAttachment>;
/** Reference connector download path for capability-protected attachments. */
export declare function downloadChatAttachmentWithFetch(attachment: ChatAttachment, options?: ChatAttachmentFetchDownloadOptions): Promise<Uint8Array>;
/**
 * Single source for how a voice message is recorded. Apps take their recorder
 * settings from the two helpers below rather than hardcoding these values, so
 * changing the encoding is an edit here instead of one per app.
 *
 * Only `mimeType`/`extension` decide whether a note is playable on another
 * platform; the rest are consistency and payload size.
 */
export declare const CHAT_VOICE_SPEC: {
    /** AAC-LC in MP4, the container every platform can play. */
    readonly mimeType: "audio/mp4";
    /** The same container with the codec spelled out, as `MediaRecorder` wants it. */
    readonly codecMimeType: "audio/mp4;codecs=mp4a.40.2";
    readonly extension: "m4a";
    readonly sampleRate: 44100;
    readonly channels: 1;
    readonly bitsPerSecond: 128000;
    /** Shorter than this is a mis-click, not a message. */
    readonly minDurationMs: 700;
};
export type ChatVoiceRecorderWebOptions = {
    /**
     * `getUserMedia` constraints. Sample rate is absent on purpose: Chromium
     * ignores it here and returns the device rate, so resample through an
     * `AudioContext` pinned to `CHAT_VOICE_SPEC.sampleRate` and record that.
     */
    constraints: {
        audio: {
            channelCount: number;
        };
    };
    /** Options for the `MediaRecorder` constructor. */
    recorder: {
        mimeType: string;
        audioBitsPerSecond: number;
    };
};
/** Recorder settings for a browser or an Electron renderer. */
export declare function getChatVoiceRecorderWebOptions(): ChatVoiceRecorderWebOptions;
/**
 * Structurally an `expo-audio` `RecordingOptions`, spelled out here so the SDK
 * keeps no React Native dependency. Cast it if your expo-audio version types the
 * iOS fields as enums.
 */
export type ChatVoiceRecorderExpoOptions = {
    extension: string;
    sampleRate: number;
    numberOfChannels: number;
    bitRate: number;
    android: {
        outputFormat: string;
        audioEncoder: string;
    };
    ios: {
        outputFormat: string;
        audioQuality: number;
        linearPCMBitDepth: number;
        linearPCMIsBigEndian: boolean;
        linearPCMIsFloat: boolean;
    };
};
/**
 * Recorder settings for React Native: expo-audio's `RecordingPresets.HIGH_QUALITY`
 * with the channel count pinned to mono. Pass this rather than the preset, which
 * is expo's constant and can change under an `expo-audio` upgrade.
 */
export declare function getChatVoiceRecorderExpoOptions(): ChatVoiceRecorderExpoOptions;
/**
 * Whether an attachment should render as a player. The file name is the fallback
 * for a peer that uploaded without a content type. Wider than `CHAT_VOICE_SPEC`
 * on purpose: it also covers audio a user attached rather than recorded.
 */
export declare function isChatAudioAttachment(attachment: {
    mimeType?: string;
    name?: string;
}): boolean;
/**
 * The recorded length carried on a voice message, so a player can show a
 * duration before the audio loads. Undefined unless the metadata marks the
 * message as a voice note — either marker alone is enough, since a peer on an
 * older build may send only one.
 */
export declare function getChatVoiceDurationMs(metadata?: Record<string, unknown>): number | undefined;
export type ChatClientBaseConfig = {
    /** Explicit service-account bare JID. Ordinary app users keep the i.<user> address. */
    accountJid?: string;
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
    /**
     * Controls when XEP-0184 delivery receipts are sent for incoming messages.
     * "automatic" preserves the legacy receive-time acknowledgement. "manual"
     * requires a consumer to call acknowledgeDelivered() after durable storage.
     */
    deliveryReceiptMode?: ChatDeliveryReceiptMode;
    /**
     * Fail connection readiness when XEP-0280 message carbons cannot be enabled.
     * Durable multi-device clients should enable this to avoid partial histories.
     */
    requireMessageCarbons?: boolean;
    /**
     * Fail connection readiness unless XEP-0198 stream management was
     * negotiated. Enable this for clients that use server acknowledgement as
     * their durable-outbox acceptance boundary.
     */
    requireStreamManagement?: boolean;
    /**
     * Keep message send promises pending until ejabberd acknowledges every
     * successfully written target stanza through XEP-0198. This is a
     * server-acceptance acknowledgement, not an end-to-end delivery receipt.
     */
    awaitServerAcknowledgement?: boolean;
    /** Connection timeout in milliseconds. Defaults to 15000. */
    connectTimeoutMs?: number;
    /** Room lookup provider used to resolve peer transport addresses. */
    roomDirectory?: ChatRoomDirectory;
    /** Fallback resolver for older room-routing call sites. Prefer roomDirectory. */
    resolveRoomDeviceIds?: (roomId: string) => Promise<DeviceId[]> | DeviceId[];
    /**
     * Persistent author lookup used to validate XEP-0424 retractions after a
     * restart or when archive events arrive out of order. Unknown authors fail
     * closed and no authoritative retraction event is emitted.
     */
    resolveMessageAuthor?: ChatMessageAuthorResolver;
    /** Persistent original-message lookup for edit validation after a restart. */
    resolveMessageForEdit?: (input: ChatMessageAuthorResolverInput) => Promise<ChatMessageEditTarget | null | undefined> | ChatMessageEditTarget | null | undefined;
    /** Optional logger for connection, encryption, and stanza errors. */
    logger?: ChatLogger;
    /** Logger verbosity. Defaults to "error" when a logger is provided. */
    logLevel?: ChatLogLevel;
    /** Message encryption adapter. Pass createOmemoEncryption(...) for built-in OMEMO. */
    encryption: ChatEncryption;
    /**
     * Reject outbound and inbound user-message payloads when the encryption
     * adapter cannot produce or decode an encrypted envelope. Production OMEMO
     * clients should enable this so metadata and attachment keys never fall
     * back to the plain Lula extension.
     */
    requireEncryptedPayloads?: boolean;
    /** Attachment upload and resolve adapter for file and image messages. */
    attachmentService?: ChatAttachmentService;
    /** Reject outgoing attachment manifests without client-side encryption. */
    requireEncryptedAttachments?: boolean;
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
    /** Server acceptance time in Unix epoch milliseconds. Use for display and ordering. */
    timestamp: number;
    metadata: ChatMessageMetadata;
    attachments?: ChatAttachment[];
    raw?: unknown;
};
export type ChatIncomingDeliveryContext = {
    /** Whether this stanza requested an XEP-0184 delivery receipt. */
    receiptRequested: boolean;
    /**
     * Idempotently acknowledges that the host client durably accepted the
     * message. In manual mode this is the only operation that sends <received/>.
     */
    acknowledgeDelivered: () => Promise<void>;
};
export type ChatMessageListener = (message: ChatMessage, delivery: ChatIncomingDeliveryContext) => void;
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
    /** Typed chat APIs default to bare user JIDs. Use resource only for device control traffic. */
    targetScope?: ChatTargetScope;
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
export type ChatEditMessageInput = ChatTextMessageInput & {
    roomId: string;
    targetMessageId: string;
    /** Only for replay of a stable edit ID already acknowledged by the server.
     * Persist the acknowledgement locally; never obtain this from wire metadata. */
    serverAcceptedAt?: number;
};
export type ChatReplyMessageInput = ChatTextMessageInput & {
    replyTo: ChatReplyReference;
};
export type ChatEmergencyMessageInput = Omit<ChatTextMessageInput, "metadata"> & {
    alertId: string;
    emergencyType?: typeof CHAT_EMERGENCY_TYPE_SOS;
    triggeredAt?: string;
    metadata?: Record<string, unknown>;
};
export type ChatReactionMessageInput = Omit<ChatTextMessageInput, "body"> & {
    targetMessageId: string;
    emoji: ChatReactionEmoji;
    actorId?: string;
};
export type ChatRetractionInput = Omit<ChatMessageInput, "attachments" | "body" | "metadata" | "requestReceipt"> & {
    messageId: string;
};
export type ChatReactionSummary = {
    emoji: ChatReactionEmoji;
    count: number;
    actorIds: string[];
    reactedByCurrentUser: boolean;
};
export type ChatInteractiveMessage = ChatMessage & {
    interactionId: string;
    reactions: ChatReactionSummary[];
    replyTo?: ChatReplyReference;
};
export type ChatInteractionMessageLike = {
    id?: string;
    metadata?: Record<string, unknown>;
    senderId?: string;
    fromUserId?: string;
};
export declare function normalizeInteractionActorId(value?: string | null): string;
export declare function isChatReactionEmoji(value: unknown): value is ChatReactionEmoji;
export declare function getMessageInteractionId(message: ChatInteractionMessageLike): string;
export declare function parseChatReplyReference(metadata?: Record<string, unknown>): ChatReplyReference | undefined;
export declare function parseChatReactionEvent(message: ChatInteractionMessageLike): ChatReactionEvent | undefined;
export declare function isChatReactionControlMessage(message: ChatInteractionMessageLike): boolean;
export declare function buildChatInteractionTimeline(messages: ChatMessage[], currentActorId?: string | null): ChatInteractiveMessage[];
export type ChatTextMessage = ChatMessage & {
    context?: ChatMessageContext;
    providerDirectMessageRoomId: string;
    submissionRoomId?: string;
    correlationId?: string;
    displayName: string;
};
export type ChatEmergencyMessage = ChatTextMessage & {
    emergencyType: typeof CHAT_EMERGENCY_TYPE_SOS;
    alertId: string;
    triggeredAt: string;
};
export type ChatAttachmentMessage = ChatMessage & {
    attachments: ChatAttachment[];
    context?: ChatMessageContext;
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
    /** Describes the submitter, independently of the authenticated transport sender. */
    submitter?: ChatFormSubmitter;
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
export type ChatFormSubmitter = {
    kind: "user";
    userId: string;
} | {
    kind: "guest";
    guestSessionId: string;
    identityVerification: "none";
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
export type ChatConversationStateInput = Omit<ChatMessageInput, "attachments" | "body" | "metadata"> & {
    roomId: string;
    conversationType: ChatConversationType;
    state: ChatConversationState;
    conversationId?: string;
    changedAt?: string;
    metadata?: Record<string, unknown>;
};
export type ChatConversationStateEvent = {
    id: string;
    fromUserId: string;
    fromFullAddress: string;
    fromDeviceId: DeviceId;
    toDeviceId: DeviceId;
    roomId: string;
    conversationType: ChatConversationType;
    state: ChatConversationState;
    conversationId?: string;
    changedAt: string;
    timestamp: number;
    metadata: ChatMessageMetadata;
    raw?: unknown;
};
export type ChatAttachmentMessageInput = Omit<ChatTextMessageInput, "body" | "attachments"> & {
    attachment: ChatAttachmentUpload;
    body?: string;
};
export type ChatAttachmentsMessageInput = Omit<ChatTextMessageInput, "body" | "attachments"> & {
    attachments: ChatAttachmentUpload[];
    body?: string;
};
/**
 * A voice note is a one-attachment message with an empty body; the metadata is
 * what makes the far end draw a player. `durationMs` is what the recorder
 * measured, so a player can show a length before the audio arrives.
 */
export type ChatVoiceMessageInput = Omit<ChatTextMessageInput, "body" | "attachments" | "metadata"> & {
    attachment: ChatAttachmentUpload;
    durationMs: number;
    metadata?: Record<string, unknown>;
};
export type ChatTypingInput = {
    roomId: string;
    targetScope?: ChatTargetScope;
    peerDeviceId?: DeviceId;
    peerDeviceIds?: DeviceId[];
    toDeviceId?: DeviceId;
    toDeviceIds?: DeviceId[];
    isTyping?: boolean;
    autoPauseMs?: number;
    id?: string;
};
export type ChatThreadGoneInput = {
    roomId: string;
    targetRoomId?: string;
    targetScope?: ChatTargetScope;
    peerDeviceId?: DeviceId;
    peerDeviceIds?: DeviceId[];
    toDeviceId?: DeviceId;
    toDeviceIds?: DeviceId[];
    id?: string;
};
export type ChatDisplayedInput = {
    roomId: string;
    messageId: string;
    targetScope?: ChatTargetScope;
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
export type ChatThreadGoneEvent = {
    id: string;
    fromUserId: string;
    fromFullAddress: string;
    fromDeviceId: DeviceId;
    toDeviceId?: DeviceId;
    roomId: string;
    timestamp: number;
    raw?: unknown;
};
/**
 * A notice the server itself sent this account, such as a scheduled meeting
 * being canceled. It rides the chat connection so an app that is already
 * connected learns about it immediately, without polling an API for it.
 *
 * Only a stanza whose sender is the bare XMPP domain becomes one of these.
 * Accounts cannot send as the domain, so no user can forge a server event.
 */
export type ChatServerEvent = {
    /** Stanza id. The server keeps it stable for one event, so it doubles as a dedupe key. */
    id: string;
    /** What happened, e.g. `calendar_canceled`. */
    type: string;
    /** The event's payload, whose shape depends on `type`. */
    data: Record<string, unknown>;
    timestamp: number;
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
    /** All bare-JID recipients for a single encrypted groupchat stanza. */
    recipientJids?: DeviceId[];
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
    onDisconnect?: (context: ChatEncryptionContext) => void;
    onStanza?: (stanza: XmppElementLike, context: ChatEncryptionContext) => Promise<void> | void;
    encrypt: (input: ChatEncryptInput, context: ChatEncryptionContext) => Promise<ChatEncodedPayload | XmppChild[]> | ChatEncodedPayload | XmppChild[];
    decrypt: (input: ChatDecryptInput, context: ChatEncryptionContext) => Promise<ChatDecryptedMessage | null> | ChatDecryptedMessage | null;
};
export type OmemoEncryptionOptions = {
    storage?: ChatKeyValueStore;
    stateKeyPrefix?: string;
    /** Public discovery records. Defaults to a memory cache backed by `storage`. */
    discoveryCache?: OmemoDiscoveryCacheStore;
    discoveryRefreshAfterMs?: number;
    discoveryMaxAgeMs?: number;
};
export type ChatClient = {
    connect: () => Promise<void>;
    stop: () => Promise<void>;
    joinGroupRoom: (room: ChatGroupRoom) => Promise<void>;
    leaveGroupRoom: (roomId: string) => Promise<void>;
    updateGroupRoom: (room: ChatGroupRoom) => Promise<void>;
    getOrCreateRoom: {
        (userId: string, metadata?: Record<string, unknown>): Promise<ChatRoom>;
        (input: ChatRoomLookupInput): Promise<ChatRoom>;
    };
    getPeerDeviceIds: (roomId: string) => Promise<DeviceId[]>;
    sendChatMessage: {
        (message: ChatTextMessageInput): Promise<string>;
        (roomId: string, body: string, options?: Omit<ChatTextMessageInput, "roomId" | "body">): Promise<string>;
    };
    editMessage: (message: ChatEditMessageInput) => Promise<string>;
    sendEmergency: (message: ChatEmergencyMessageInput) => Promise<string>;
    sendReply: (message: ChatReplyMessageInput) => Promise<string>;
    addReaction: (message: ChatReactionMessageInput) => Promise<string>;
    removeReaction: (message: ChatReactionMessageInput) => Promise<string>;
    retractMessage: (message: ChatRetractionInput) => Promise<string>;
    sendFormSubmission: (message: ChatFormSubmissionInput) => Promise<string>;
    sendConversationState: (event: ChatConversationStateInput) => Promise<string>;
    uploadAttachment: {
        (roomId: string, attachment: ChatAttachmentUpload): Promise<ChatAttachment>;
        (input: {
            roomId: string;
            attachment: ChatAttachmentUpload;
        }): Promise<ChatAttachment>;
    };
    sendAttachment: {
        (message: ChatAttachmentMessageInput): Promise<string>;
        (roomId: string, attachment: ChatAttachmentUpload, options?: Omit<ChatAttachmentMessageInput, "roomId" | "attachment">): Promise<string>;
    };
    sendAttachments: {
        (message: ChatAttachmentsMessageInput): Promise<string>;
        (roomId: string, attachments: ChatAttachmentUpload[], options?: Omit<ChatAttachmentsMessageInput, "roomId" | "attachments">): Promise<string>;
    };
    sendVoiceMessage: (message: ChatVoiceMessageInput) => Promise<string>;
    /**
     * @deprecated Prefer sendChatMessage or sendFormSubmission for typed payloads.
     */
    sendMessage: {
        (message: ChatMessageInput): Promise<string>;
        (roomId: string, body: string, options?: Omit<ChatMessageInput, "roomId" | "body">): Promise<string>;
    };
    sendTyping: {
        (roomId: string, options?: Omit<ChatTypingInput, "roomId">): Promise<void>;
        (input: ChatTypingInput): Promise<void>;
    };
    sendThreadGone: {
        (roomId: string, options?: Omit<ChatThreadGoneInput, "roomId">): Promise<string>;
        (input: ChatThreadGoneInput): Promise<string>;
    };
    markRead: {
        (roomId: string, messageId: string, options?: Omit<ChatDisplayedInput, "roomId" | "messageId">): Promise<void>;
        (input: ChatDisplayedInput): Promise<void>;
    };
    /**
     * @deprecated Prefer onChatMessage or onFormSubmission for typed message payloads.
     */
    onMessage: (listener: ChatMessageListener) => Unsubscribe;
    onChatMessage: (listener: (message: ChatTextMessage, delivery: ChatIncomingDeliveryContext) => void) => Unsubscribe;
    onEmergency: (listener: (message: ChatEmergencyMessage, delivery: ChatIncomingDeliveryContext) => void) => Unsubscribe;
    onAttachmentMessage: (listener: (message: ChatAttachmentMessage, delivery: ChatIncomingDeliveryContext) => void) => Unsubscribe;
    onFormSubmission: (listener: (message: ChatFormSubmissionMessage, delivery: ChatIncomingDeliveryContext) => void) => Unsubscribe;
    onConversationState: (listener: (event: ChatConversationStateEvent, delivery: ChatIncomingDeliveryContext) => void) => Unsubscribe;
    onGroupInvitation: (listener: (event: ChatGroupInvitationEvent) => void) => Unsubscribe;
    onThreadGone: (listener: (event: ChatThreadGoneEvent) => void) => Unsubscribe;
    /** Emits only events sent by the server itself — see `ChatServerEvent`. */
    onServerEvent: (listener: (event: ChatServerEvent) => void) => Unsubscribe;
    /** Emits only XEP-0424 retractions whose author was verified by the SDK. */
    onRetraction: (listener: (event: ChatRetractionEvent) => void) => Unsubscribe;
    onTyping: (listener: (event: ChatTypingEvent) => void) => Unsubscribe;
    onDelivery: (listener: (event: ChatDeliveryEvent) => void) => Unsubscribe;
    onServerAcknowledged: (listener: (event: ChatServerAcknowledgementEvent) => void) => Unsubscribe;
    onServerSendFailed: (listener: (event: ChatServerSendFailureEvent) => void) => Unsubscribe;
    onStreamManagement: (listener: (event: ChatStreamManagementEvent) => void) => Unsubscribe;
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
type XmppChild = ReturnType<typeof xml>;
type XmppElementLike = {
    name?: string;
    attrs?: Record<string, string>;
    is?: (name: string, ns?: string) => boolean;
    getChild?: (name: string, ns?: string) => XmppElementLike | null | undefined;
    getChildren?: (name: string, ns?: string) => XmppElementLike[];
    getChildText?: (name: string, ns?: string) => string | null | undefined;
    getText?: () => string;
    toString?: () => string;
};
export declare const XMPP_MESSAGE_TIME_NS = "urn:lulafi:message-time:1";
export declare const XMPP_EMERGENCY_NS: "urn:lulafi:emergency:1";
/** Namespace of the `<event>` element a server event carries — see `ChatServerEvent`. */
export declare const XMPP_SERVER_EVENT_NS: "urn:lulafi:server-event:1";
export declare function init(config: ChatClientConfig): ChatClient;
export declare function createChatClient(config: ChatClientConfig): ChatClient;
export declare function createDeviceId(options?: CreateDeviceIdOptions): DeviceId;
export declare function getChatAddress(input: ChatAddressInput): ChatAddress;
export declare function getChatUserId(input: ChatUserIdInput): DeviceId;
export declare function getChatDeviceId(input: ChatDeviceIdInput): DeviceId;
export declare function createRoomDirectory(options: ChatRoomDirectoryOptions): ChatRoomDirectory;
export declare function createOmemoEncryption(options?: OmemoEncryptionOptions): ChatEncryption;
export declare function extractProviderDirectMessageRoomId(metadata?: Record<string, unknown>): string | undefined;
export declare function extractSubmissionId(metadata?: Record<string, unknown>): string | undefined;
export declare function extractSubmissionRoomId(metadata?: Record<string, unknown>): string | undefined;
export declare function extractDisplayName(metadata?: Record<string, unknown>): string | undefined;
export declare function buildChatMessageMetadata(input: {
    roomId?: string;
    metadata?: Record<string, unknown>;
    context?: ChatMessageContext;
    displayName?: string;
}): ChatMessageMetadata;
export declare function buildFormSubmissionMetadata(input: Pick<ChatFormSubmissionInput, "roomId" | "metadata" | "formId" | "providerUserId" | "recordId" | "formVersion" | "providerDirectMessageRoomId" | "submissionRoomId" | "correlationId" | "submittedAt" | "submitter"> & {
    displayName?: string;
}): ChatMessageMetadata;
export declare function parseConversationStateMessage(message: ChatMessage): ChatConversationStateEvent | null;
export declare function parseChatEmergencyMessage(message: ChatMessage): ChatEmergencyMessage | null;
export declare function isEmergencyMessage(message: ChatMessage): boolean;
/**
 * The server event a message stanza carries, or null when it carries none or
 * cannot be trusted. Trusted means sent by the bare `xmppDomain` itself: the
 * server stamps every account's stanzas with that account's address, so no
 * account can produce this sender.
 *
 * Wire format: `<event xmlns="urn:lulafi:server-event:1" type="…">` holding the
 * base64 of a JSON object, on a message with a stable `id`.
 */
export declare function parseChatServerEvent(stanza: XmppElementLike, xmppDomain: string): ChatServerEvent | null;
export declare function createMemoryStorageBackend(): ChatKeyValueStore;
export declare function createIndexDbStorageBackend(options?: IndexDbStorageOptions): ChatKeyValueStore;
export declare function createMongoDbStorageBackend(options: MongoDbStorageOptions): ChatKeyValueStore;
export declare const storageBackends: {
    memory: ChatKeyValueStore;
    indexDb: ChatKeyValueStore;
    mongoDb: typeof createMongoDbStorageBackend;
    createMemory: typeof createMemoryStorageBackend;
    createIndexDb: typeof createIndexDbStorageBackend;
    createMongoDb: typeof createMongoDbStorageBackend;
};
//# sourceMappingURL=index.d.ts.map