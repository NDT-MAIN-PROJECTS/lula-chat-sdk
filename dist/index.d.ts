import { xml } from "@xmpp/client";
export type Unsubscribe = () => void;
export type ChatStatus = "idle" | "connecting" | "online" | "offline" | "stopping" | "error";
export type ChatDeliveryStatus = "delivered" | "read";
export type DeviceId = string;
export type ChatMessageMetadata = Record<string, unknown> & {
    messageType: "CHAT_MESSAGE" | "FORM_SUBMISSION";
};
export declare const chatResources: readonly ["server-client", "ios-primary-client", "android-primary-client", "ios-secondary-client", "android-secondary-client"];
export type ChatResource = (typeof chatResources)[number];
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
export type ChatClientBaseConfig = {
    /** API key for app access to the chat service. */
    apiKey: string;
    /** WebSocket path on the chat domain. Defaults to "/chat/websocket". */
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
    /** Device resource label, such as "ios-primary-client" or "server-client". */
    resource: ChatResource;
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
export type ChatAttachmentMessageInput = Omit<ChatTextMessageInput, "body" | "attachments"> & {
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
    encrypt: (input: ChatEncryptInput, context: ChatEncryptionContext) => Promise<ChatEncodedPayload | XmppChild[]> | ChatEncodedPayload | XmppChild[];
    decrypt: (input: ChatDecryptInput, context: ChatEncryptionContext) => Promise<ChatDecryptedMessage | null> | ChatDecryptedMessage | null;
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
        (roomId: string, body: string, options?: Omit<ChatTextMessageInput, "roomId" | "body">): Promise<string>;
    };
    sendFormSubmission: (message: ChatFormSubmissionInput) => Promise<string>;
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
export declare function init(config: ChatClientConfig): ChatClient;
export declare function createChatClient(config: ChatClientConfig): ChatClient;
export declare function createDeviceId(options?: CreateDeviceIdOptions): DeviceId;
export declare function getChatAddress(input: ChatAddressInput): ChatAddress;
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
export declare function buildFormSubmissionMetadata(input: Pick<ChatFormSubmissionInput, "roomId" | "metadata" | "formId" | "providerUserId" | "recordId" | "formVersion" | "providerDirectMessageRoomId" | "submissionRoomId" | "correlationId" | "submittedAt"> & {
    displayName?: string;
}): ChatMessageMetadata;
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
export {};
//# sourceMappingURL=index.d.ts.map