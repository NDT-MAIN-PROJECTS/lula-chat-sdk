# Lula Chat SDK

Typed XMPP chat client for React Native and Node services.

```ts
import { createRoomDirectory, init } from "@lulafi/chat-sdk";

const roomDirectory = createRoomDirectory({
  currentUserName: "i.user123",
  jidDomain: "example.com",
  getOrCreateRoom: ({ userName }) => api.post("/chats/rooms", { userName }),
  getRoom: (roomId) => api.get(`/chats/rooms/${roomId}`),
});

const chatClient = init({
  xmppServer: "wss://chat.example.com/xmpp-websocket",
  userName: "i.user123",
  JID: "i.user123@example.com",
  password: "secret",
  resource: "ios-primary-client",
  roomDirectory,
});

const { connect, onMessage, sendMessage, sendTyping, markRead } = chatClient;

onMessage((message) => {
  console.log(message.fromJid, message.body);
  markRead(message.roomId!, message.id);
});

await connect();

const room = await chatClient.getOrCreateRoom("i.peer456");

await sendMessage(room.roomId, "Hello");

await sendMessage({
  roomId: room.roomId,
  body: "Hello again",
  metadata: {
    providerChatRoomId: room.roomId,
    sentAtMs: Date.now(),
  },
});

await sendTyping(room.roomId);
```

## API

`init(config)` returns:

- `connect()` to open the XMPP stream.
- `stop()` to close the stream.
- `getOrCreateRoom(userName)` to fetch the room your backend owns for that peer.
- `onMessage(listener)` for chat messages.
- `onTyping(listener)` for composing and paused states.
- `onDelivery(listener)` for delivered and read events.
- `onError(listener)` for stanza and runtime errors.
- `onStatus(listener)` for connection state.
- `sendMessage({ roomId, body })` to send a chat message.
- `sendMessage(roomId, body)` for the same room-first path.
- `sendTyping(roomId)` to send composing. The SDK sends paused after 10 seconds.
- `sendTyping(roomId, { isTyping: false })` to send paused at once.
- `sendDisplayed(roomId, messageId)` or `markRead(roomId, messageId)` for read markers.

The SDK resolves room JIDs inside `sendMessage()`, `sendTyping()`, and read markers. Pass `roomDirectory` in `init()` for the normal fanout path.

The SDK remembers room peers after sends or incoming room messages.

Fanout treats partial delivery as success. It only throws after every target send fails.

## Room Directory

```ts
import { createRoomDirectory, init } from "@lulafi/chat-sdk";

const roomDirectory = createRoomDirectory({
  currentUserName,
  jidDomain: "example.com",
  getOrCreateRoom: ({ userName }) => api.post("/chats/rooms", { userName }),
  getRoom: (roomId) => api.get(`/chats/rooms/${roomId}`),
});

const chatClient = init({
  xmppServer,
  JID,
  password,
  roomDirectory,
});
```

`createRoomDirectory()` reads `roomId`, `peerJid`, `peerJids`, `chatUserId`, `chatUserIds`, and `userMetadata[].chatUserIds` from your room response. The app fetches rooms. The SDK owns fanout.

`resolveRoomJids` still works as a fallback for older call sites. New code should prefer `roomDirectory`.

The SDK client also exposes `getPeerJids(roomId)`. That gives app code one SDK method to ask for the current fanout targets, no matter if they came from cache, incoming messages, or a configured provider.

## Auth

Password auth:

```ts
const chatClient = init({
  xmppServer: process.env.XMPP_SERVICE_URL,
  JID: process.env.XMPP_JID,
  password: process.env.XMPP_PASSWORD,
  resource: "server-client",
});
```

Allowed resources:

- `server-client`
- `ios-primary-client`
- `android-primary-client`
- `ios-secondary-client`
- `android-secondary-client`

Token auth:

```ts
const chatClient = init({
  xmppServer,
  JID,
  accessToken,
  authType: "x-oauth2",
});
```

## Metadata

Without custom encryption, the SDK sends metadata in the existing Lula XMPP extension:

```xml
<lula xmlns="urn:lula:defy:chat:1">...</lula>
```

The payload is base64 JSON. Current mobile code already reads this format.

## Encryption

If you want chat messages encrypted, use the built-in OMEMO helper. Typing indicators, delivery receipts, and read markers stay as normal XMPP control stanzas.

```ts
import { createOmemoEncryption, init, storageBackends } from "@lulafi/chat-sdk";

const chatClient = init({
  xmppServer,
  JID,
  accessToken,
  encryption: createOmemoEncryption({
    storage: storageBackends.indexDb,
  }),
});
```

For a custom browser database name:

```ts
const storage = storageBackends.createIndexDb({
  dbName: "my-app-chat",
  storeName: "omemo",
});

const chatClient = init({
  xmppServer,
  JID,
  accessToken,
  encryption: createOmemoEncryption({ storage }),
});
```

For a server, pass a storage adapter backed by your database:

```ts
const storage = {
  getItem: (key: string) => db.omemoState.findValue(key),
  setItem: (key: string, value: string) => db.omemoState.saveValue(key, value),
  removeItem: (key: string) => db.omemoState.deleteValue(key),
};

const chatClient = init({
  xmppServer,
  JID,
  password,
  encryption: createOmemoEncryption({ storage }),
});
```

For MongoDB:

```ts
const storage = storageBackends.mongoDb({
  collection: db.collection("chat_omemo_state"),
});

const chatClient = init({
  xmppServer,
  JID,
  password,
  encryption: createOmemoEncryption({ storage }),
});
```

The SDK still owns connection state, fanout, listeners, receipts, typing states, and message IDs.
