import { xml } from "@xmpp/client";
export type Unsubscribe = () => void;
export type ChatStatus = "idle" | "connecting" | "online" | "offline" | "stopping" | "error";
export type ChatDeliveryStatus = "delivered" | "read";
export type DeviceId = string;
export declare const chatResources: readonly ["server-client", "ios-primary-client", "android-primary-client", "ios-secondary-client", "android-secondary-client"];
export type ChatResource = (typeof chatResources)[number];
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
export type ChatClientConfig = {
    xmppWebSocketPath?: string;
    xmppDomain: string;
    userId: string;
    deviceId: DeviceId;
    password?: string;
    accessToken?: string;
    token?: string;
    authType?: "password" | "x-oauth2";
    resource?: ChatResource;
    autoReconnect?: boolean;
    connectTimeoutMs?: number;
    roomDirectory?: ChatRoomDirectory;
    resolveRoomDeviceIds?: (roomId: string) => Promise<DeviceId[]> | DeviceId[];
    logger?: ChatLogger;
    encryption?: ChatEncryption;
};
export type ChatMessage = {
    id: string;
    fromDeviceId: DeviceId;
    toDeviceId?: DeviceId;
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
    toDeviceId?: DeviceId;
    toDeviceIds?: DeviceId[];
    peerDeviceId?: DeviceId;
    peerDeviceIds?: DeviceId[];
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
    fromDeviceId: DeviceId;
    toDeviceId?: DeviceId;
    roomId?: string;
    isTyping: boolean;
    raw?: unknown;
};
export type ChatDeliveryEvent = {
    id: string;
    fromDeviceId: DeviceId;
    toDeviceId?: DeviceId;
    roomId?: string;
    status: ChatDeliveryStatus;
    raw?: unknown;
};
export type ChatErrorEvent = {
    id?: string;
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
export type ChatEncryptInput = {
    toDeviceId: DeviceId;
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
    sendMessage: {
        (message: ChatMessageInput): Promise<string>;
        (roomId: string, body: string, options?: Omit<ChatMessageInput, "roomId" | "body">): Promise<string>;
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
    getDeviceId: () => DeviceId | undefined;
    getBareDeviceId: () => DeviceId | undefined;
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
export declare function createRoomDirectory(options: ChatRoomDirectoryOptions): ChatRoomDirectory;
export declare function createOmemoEncryption(options?: OmemoEncryptionOptions): ChatEncryption;
export declare function extractProviderChatRoomId(metadata?: Record<string, unknown>): string | undefined;
export declare function extractSubmissionId(metadata?: Record<string, unknown>): string | undefined;
export declare function buildChatMessageMetadata(input: {
    roomId?: string;
    metadata?: Record<string, unknown>;
    context?: ChatMessageContext;
}): Record<string, unknown> | undefined;
export declare function buildFormSubmissionMetadata(input: Pick<ChatFormSubmissionInput, "roomId" | "metadata" | "formId" | "providerUserId" | "recordId" | "formVersion" | "providerChatRoomId" | "submittedAt">): Record<string, unknown>;
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