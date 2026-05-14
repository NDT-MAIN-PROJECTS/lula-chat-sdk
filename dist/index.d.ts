import { xml } from "@xmpp/client";
export type Unsubscribe = () => void;
export type ChatStatus = "idle" | "connecting" | "online" | "offline" | "stopping" | "error";
export type ChatDeliveryStatus = "delivered" | "read";
export declare const chatResources: readonly ["server-client", "ios-primary-client", "android-primary-client", "ios-secondary-client", "android-secondary-client"];
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
export type ChatMessageInput = {
    toJid?: string;
    toJids?: string[];
    peerJid?: string;
    peerJids?: string[];
    body: string;
    roomId?: string;
    metadata?: Record<string, unknown>;
    id?: string;
    requestReceipt?: boolean;
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
        (userName: string, metadata?: Record<string, unknown>): Promise<ChatRoom>;
        (input: ChatRoomLookupInput): Promise<ChatRoom>;
    };
    getPeerJids: (roomId: string) => Promise<string[]>;
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
    onTyping: (listener: (event: ChatTypingEvent) => void) => Unsubscribe;
    onDelivery: (listener: (event: ChatDeliveryEvent) => void) => Unsubscribe;
    onError: (listener: (event: ChatErrorEvent) => void) => Unsubscribe;
    onStatus: (listener: (event: ChatStatusEvent) => void) => Unsubscribe;
    getStatus: () => ChatStatus;
    getJid: () => string | undefined;
    getBareJid: () => string | undefined;
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