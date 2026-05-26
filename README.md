# Hubnet Chat SDK

Typed chat client for React Native and Node services.

```ts
import { createRoomDirectory, init } from "@hubnet-systems/chat-sdk";

const roomDirectory = createRoomDirectory({
  currentUserId: "6a0dce078d45ca01adbdd4f7",
  xmppDomain: "api.dev.lulafi.co",
  getOrCreateRoom: ({ userId }) => api.post("/chats/rooms", { userId }),
  getRoom: (roomId) => api.get(`/chats/rooms/${roomId}`),
});

const chatClient = init({
  xmppDomain: "api.dev.lulafi.co",
  userId: "6a0dce078d45ca01adbdd4f7",
  deviceId: "d0eb68ad2ff10ee7",
  displayName: "Taylor Morgan",
  password: "secret",
  resource: "ios-primary-client",
  roomDirectory,
});

const {
  connect,
  onChatMessage,
  onFormSubmission,
  sendChatMessage,
  sendFormSubmission,
  sendTyping,
  markRead,
} = chatClient;

onChatMessage((message) => {
  console.log(message.fromUserId, message.fromDeviceId, message.body);
  markRead(message.roomId!, message.id);
});

onFormSubmission((message) => {
  console.log(message.formId, message.payload);
});

await connect();

const room = await chatClient.getOrCreateRoom("peer-user-id");

await sendChatMessage(room.roomId, "Hello");

await sendChatMessage({
  roomId: room.roomId,
  body: "Hello again",
  context: {
    type: "form_thread",
    submissionId: "submission-123",
    senderName: "Agent",
  },
});

await sendFormSubmission({
  roomId: room.roomId,
  payload: {
    readable: {
      name: { label: "Name", value: "Taylor" },
    },
    raw: {
      name: "Taylor",
    },
  },
  formId: "form-123",
});

await sendTyping(room.roomId);
```

## Connection

`init(config)` derives the transport values from your app values:

```ts
init({
  xmppDomain: "api.dev.lulafi.co",
  userId: "6a0dce078d45ca01adbdd4f7",
  deviceId: "d0eb68ad2ff10ee7",
  displayName: "Taylor Morgan",
  password: "secret",
  resource: "ios-primary-client",
});
```

`xmppWebSocketPath` is optional. The default is `/chat/websocket`.

The SDK connects to `wss://api.dev.lulafi.co/chat/websocket`.

`displayName` is written into outgoing message metadata as `metadata.displayName`.

The SDK builds the XMPP address internally from the user and device:

```txt
i.6a0dce078d45ca01adbdd4f7.d.d0eb68ad2ff10ee7@api.dev.lulafi.co
```

Allowed resources:

- `server-client`
- `ios-primary-client`
- `android-primary-client`
- `ios-secondary-client`
- `android-secondary-client`

## API

`init(config)` returns:

- `connect()` to open the chat connection.
- `stop()` to close the stream.
- `getOrCreateRoom(userId)` to fetch the room your backend owns for that peer.
- `onMessage(listener)` for raw chat messages. Deprecated. Prefer `onChatMessage()` or `onFormSubmission()`.
- `onChatMessage(listener)` for human chat messages.
- `onFormSubmission(listener)` for structured form submission payloads.
- `onTyping(listener)` for composing and paused states.
- `onDelivery(listener)` for delivered and read events.
- `onError(listener)` for stanza and runtime errors.
- `onStatus(listener)` for connection state.
- `sendChatMessage({ roomId, body })` to send human chat text.
- `sendFormSubmission({ roomId, payload })` to send a JSON form submission payload.
- `sendMessage({ roomId, body })` to send a chat message.
- `sendMessage(roomId, body)` for the same room-first path.
- `sendTyping(roomId)` to send composing. The SDK sends paused after 10 seconds.
- `sendTyping(roomId, { isTyping: false })` to send paused at once.
- `sendDisplayed(roomId, messageId)` or `markRead(roomId, messageId)` for read markers.

The SDK resolves room device IDs inside `sendChatMessage()`, `sendFormSubmission()`, `sendMessage()`, `sendTyping()`, and read markers. Pass `roomDirectory` in `init()` for the normal fanout path.

The SDK remembers room peers after sends and incoming room messages.

Fanout treats partial delivery as success. It only throws after every target send fails.

Incoming chat, form submission, typing, and delivery events include both `fromUserId` and `fromDeviceId`. Use `fromUserId` for app-user matching and `fromDeviceId` for device-level delivery or fanout logic.

## Room Directory

```ts
import { createRoomDirectory, init } from "@hubnet-systems/chat-sdk";

const roomDirectory = createRoomDirectory({
  currentUserId,
  xmppDomain,
  getOrCreateRoom: ({ userId }) => api.post("/chats/rooms", { userId }),
  getRoom: (roomId) => api.get(`/chats/rooms/${roomId}`),
});

const chatClient = init({
  xmppDomain,
  userId,
  deviceId,
  password,
  resource: "server-client",
  roomDirectory,
});
```

`createRoomDirectory()` reads `roomId`, `peerDeviceId`, `peerDeviceIds`, `deviceId`, `deviceIds`, and `userMetadata[].deviceIds` from your room response. It can turn short device tokens into full transport addresses with `xmppDomain` and each room user id.

`resolveRoomDeviceIds` still works as a fallback for direct room fanout providers. New code should prefer `roomDirectory`.

The SDK client exposes `getPeerDeviceIds(roomId)`. That gives app code one SDK method to ask for the current fanout targets, no matter if they came from cache, incoming messages, or a configured provider.

## Chat vs Form Payloads

Use `sendChatMessage()` for human text. It keeps the body as plain text and writes Lula metadata for room context:

```ts
await chatClient.sendChatMessage({
  roomId,
  peerDeviceId,
  body: "Thanks for the submission.",
  context: {
    type: "form_thread",
    submissionId,
    displayName: "Agent",
  },
});
```

Use `sendFormSubmission()` for structured form data. It serializes the payload as JSON and writes the `lulaPayload` metadata block:

```ts
await chatClient.sendFormSubmission({
  roomId,
  payload: {
    readable,
    raw,
  },
  formId,
  providerUserId,
  providerChatRoomId,
});
```

`sendMessage()` remains available as the lower-level escape hatch.

## Auth

Password auth:

```ts
const chatClient = init({
  xmppDomain: process.env.CHAT_XMPP_DOMAIN!,
  userId: process.env.CHAT_USER_ID!,
  deviceId: process.env.CHAT_DEVICE_ID!,
  password: process.env.CHAT_PASSWORD!,
  resource: "server-client",
});
```

Token auth:

```ts
const chatClient = init({
  xmppDomain,
  userId,
  deviceId,
  accessToken,
  authType: "x-oauth2",
  resource: "server-client",
});
```

## Metadata

Without custom encryption, the SDK sends metadata in the existing Lula chat extension:

```xml
<lula xmlns="urn:lula:defy:chat:1">...</lula>
```

The payload is base64 JSON. Current mobile code already reads this format.

The SDK chooses `onChatMessage()` or `onFormSubmission()` from its own metadata and payload parsing.

## Encryption

If you want chat messages encrypted, use the built-in OMEMO helper. Typing indicators, delivery receipts, and read markers stay as normal chat control stanzas.

```ts
import { createOmemoEncryption, init, storageBackends } from "@hubnet-systems/chat-sdk";

const chatClient = init({
  xmppDomain,
  userId,
  deviceId,
  accessToken,
  resource: "ios-primary-client",
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
  xmppDomain,
  userId,
  deviceId,
  accessToken,
  resource: "ios-primary-client",
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
  xmppDomain,
  userId,
  deviceId,
  password,
  resource: "server-client",
  encryption: createOmemoEncryption({ storage }),
});
```

For MongoDB:

```ts
const storage = storageBackends.mongoDb({
  collection: db.collection("chat_omemo_state"),
});

const chatClient = init({
  xmppDomain,
  userId,
  deviceId,
  password,
  resource: "server-client",
  encryption: createOmemoEncryption({ storage }),
});
```

The SDK owns connection state, fanout, listeners, receipts, typing states, and message IDs.
