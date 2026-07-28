# Hubnet Chat SDK

Typed chat client for React Native and Node services.

```ts
import {
  createRoomDirectory,
  getChatDeviceId,
  getChatUserId,
  init,
} from "@hubnet-systems/chat-sdk";

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
  roomDirectory,
});

const {
  connect,
  onChatMessage,
  onAttachmentMessage,
  onFormSubmission,
  sendChatMessage,
  sendReply,
  addReaction,
  removeReaction,
  sendAttachment,
  sendAttachments,
  sendFormSubmission,
  sendTyping,
  markRead,
  resolveAttachment,
  getChatAddressObject,
} = chatClient;

const ownAddress = getChatAddressObject();
const peerUserId = getChatUserId({
  username: "peer-user-id",
  domain: "api.dev.lulafi.co",
});
const peerDeviceId = getChatDeviceId({
  username: "peer-user-id",
  deviceName: "d0eb68ad2ff10ee7",
  domain: "api.dev.lulafi.co",
});

onChatMessage((message) => {
  console.log(message.fromUserId, message.fromDeviceId, message.body);
  markRead(message.roomId!, message.id);
});

onFormSubmission((message) => {
  console.log(message.formId, message.payload);
});

onAttachmentMessage((message) => {
  console.log(message.attachments[0]?.name);
});

await connect();

const room = await chatClient.getOrCreateRoom("peer-user-id");

await sendChatMessage(room.roomId, "Hello");

await sendChatMessage({
  roomId: room.roomId,
  body: "Hello again",
  context: {
    correlationId: "submission-123",
    displayName: "Agent",
  },
});

await sendReply({
  roomId: room.roomId,
  body: "That answers my question.",
  replyTo: {
    messageId: "message-123",
    body: "Can you confirm this?",
    senderId: "peer-user-id",
    senderDisplayName: "Taylor",
  },
});

await addReaction({
  roomId: room.roomId,
  targetMessageId: "message-123",
  emoji: "👍",
});

await removeReaction({
  roomId: room.roomId,
  targetMessageId: "message-123",
  emoji: "👍",
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

await sendAttachment(room.roomId, {
  uri: "file:///tmp/report.pdf",
  name: "report.pdf",
  mimeType: "application/pdf",
  size: 1024,
});

await sendAttachments(
  room.roomId,
  [
    {
      uri: "file:///tmp/front.jpg",
      name: "front.jpg",
      mimeType: "image/jpeg",
    },
    {
      uri: "file:///tmp/back.jpg",
      name: "back.jpg",
      mimeType: "image/jpeg",
    },
  ],
  {
    body: "Front and back",
  },
);

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
});
```

`xmppWebSocketPath` is optional. The default is `/chat/websocket`. It can also be a full local/proxy URL such as `ws://192.168.100.10:8088/chat/websocket`.

The SDK connects to `wss://api.dev.lulafi.co/chat/websocket`.

`displayName` is written into outgoing message metadata as `metadata.displayName`.

The SDK binds the local `deviceId` as the XMPP resource by default. A device
with `userId: "u1"` and `deviceId: "d1"` connects as `i.u1@<domain>/d1`.

## Manual XMPP Test Clients

Use `test-client.html` for a browser test:

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/test-client.html`. Enter one account to test the
WebSocket connection and log incoming messages. The page loads Strophe.js from
jsDelivr.

The browser client defaults to SASL `PLAIN`. Its authentication selector can
force one SCRAM mode or let Strophe negotiate with the server.

Use `test-client.js` for a terminal test:

```sh
node test-client.js \
  --jid ACCOUNT_JID \
  --password PASSWORD
```

The client connects and logs incoming messages. Set a recipient with
`/to RECIPIENT_JID` to send a test message. Run `/help` for the terminal
commands.

Both clients accept standard XMPP JIDs and send plain XMPP chat stanzas. They
do not import this SDK or copy its account rules. They test WebSocket access,
authentication, routing, messages, and delivery receipts. They do not encrypt
message bodies.

## API

`init(config)` returns:

- `connect()` to open the chat connection.
- `stop()` to close the stream.
- `getOrCreateRoom(userId)` to fetch the room your backend owns for that peer.
- `onMessage(listener)` for raw chat messages. Deprecated. Prefer `onChatMessage()` or `onFormSubmission()`.
- `onChatMessage(listener)` for human chat messages.
- `onAttachmentMessage(listener)` for attachment messages.
- `onFormSubmission(listener)` for structured form submission payloads.
- `onTyping(listener)` for composing and paused states.
- `onDelivery(listener)` for delivered and read events.
- `onError(listener)` for stanza and runtime errors.
- `onStatus(listener)` for connection state.
- `getAddress()` for the current bare chat address.
- `getChatAddressObject()` for the current chat address, user id, device id, localpart, and domain.
- `getChatUserId({ username, domain })` for a chat address without a device resource.
- `getChatDeviceId({ username, deviceName, domain })` for a device-specific chat address.
- `getDomain()` for the normalized chat domain.
- `getUserId()` for the current app user id.
- `sendChatMessage({ roomId, body })` to send human chat text.
- `sendReply({ roomId, body, replyTo })` to send text with a typed reply reference.
- `addReaction({ roomId, targetMessageId, emoji })` to add a reaction to a message.
- `removeReaction({ roomId, targetMessageId, emoji })` to remove the current user's reaction.
- `uploadAttachment(roomId, attachment)` to upload a file or image through your attachment adapter.
- `sendAttachment(roomId, attachment)` to upload and send one file or image into a room.
- `sendAttachments(roomId, attachments, options)` to upload multiple files or images and send them in one room message with an optional `body` caption.
- `sendFormSubmission({ roomId, payload })` to send a JSON form submission payload.
- `sendMessage({ roomId, body })` for raw messages. Deprecated. Prefer `sendChatMessage()` or `sendFormSubmission()`.
- `sendTyping(roomId)` to send composing. The SDK sends paused after 10 seconds.
- `sendTyping(roomId, { isTyping: false })` to send paused at once.
- `markRead(roomId, messageId)` for read markers.
- `resolveAttachment(attachment)` to turn an attachment into a local or remote source string.

The SDK resolves room device IDs inside sends, attachments, typing events, and read markers. Pass `roomDirectory` in `init()` for the normal fanout path.

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
  roomDirectory,
});
```

`createRoomDirectory()` reads `roomId`, `peerDeviceId`, `peerDeviceIds`, `deviceId`, `deviceIds`, and `userMetadata[].deviceIds` from your room response. It can turn short device tokens into transport addresses with `xmppDomain` and each room user id. Typed chat APIs collapse those candidates to one bare JID per user.

`resolveRoomDeviceIds` still works as a fallback room fanout provider. New code should prefer `roomDirectory`.

The SDK client exposes `getPeerDeviceIds(roomId)`. That gives app code one method to inspect candidates from cache, incoming messages, or a configured provider.

## User Resources and Message Carbons

The SDK uses one XMPP account per app user and the device id as the XMPP resource:
`i.<user>@domain/<deviceId>`.

The SDK enables Message Carbons (XEP-0280) for its resource after each successful connection. The XMPP server owns copy generation and routing. The SDK unwraps sent and received carbon stanzas. Room-directory peers should resolve to bare user JIDs such as `i.<peer>@domain`. Use `targetScope: "resource"` with a full JID only for device sync or control messages.

`sendChatMessage`, `sendAttachment`, `sendAttachments`, `sendFormSubmission`, `sendTyping`, and `markRead` use `targetScope: "user"` by default. They strip `/resource` from explicit, cached, and room-directory targets before sending. Set `targetScope: "resource"` only for device-specific control traffic. The low-level `sendMessage` API keeps resource targeting as its default.

```ts
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
  authType: "x-oauth2",
  accessToken,
  roomDirectory,
  encryption: createOmemoEncryption({ storage }),
});
```

The API must issue XMPP credentials for the bare account `i.<user>@domain`.

## Chat vs Form Payloads

Use `sendChatMessage()` for human text. It keeps the body as plain text and writes Lula metadata for room context:

```ts
await chatClient.sendChatMessage({
  roomId,
  peerDeviceId,
  body: "Thanks for the submission.",
  context: {
    correlationId,
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
  providerDirectMessageRoomId,
});
```

`sendMessage()` remains available as the lower-level escape hatch, but new app code should use `sendChatMessage()` or `sendFormSubmission()`.

## Replies and Reactions

The SDK owns the wire contract for replies and reactions while preserving the metadata shape used by the existing mobile app.

- Replies remain normal chat messages with a typed `metadata.replyTo` reference.
- Reactions remain chat control messages with `chatInteractionType: "CHAT_REACTION"`, the target message id, emoji, actor id, and removal state in metadata.
- `onChatMessage()` continues to emit raw messages, including reaction control messages, so existing consumers are unaffected.
- Existing clients that already write or parse these metadata fields remain interoperable with the typed SDK methods.

Use `buildChatInteractionTimeline()` when a UI wants projected messages with reply references and aggregated reactions. Reaction control messages are removed from the projected timeline but remain present in the raw event stream and persisted history.

```ts
import {
  buildChatInteractionTimeline,
  parseChatReactionEvent,
  parseChatReplyReference,
} from "@hubnet-systems/chat-sdk";

const timeline = buildChatInteractionTimeline(rawMessages, currentUserId);

for (const message of timeline) {
  console.log(message.replyTo, message.reactions);
}

const reply = parseChatReplyReference(rawMessage.metadata);
const reaction = parseChatReactionEvent(rawMessage);
```

This allows applications to migrate incrementally: sending can move to `sendReply()`, `addReaction()`, and `removeReaction()` before their local timeline projection is replaced.

## Attachments

Pass an `attachmentService` in `init()` to upload and resolve room attachments. The SDK asks that adapter to upload a file, then carries the returned attachment object inside encrypted chat payloads and Lula fallback payloads.

If you use an XMPP upload service, the SDK can request upload slots for the adapter through `context.requestSlot(...)`.

## Auth

Password auth:

```ts
const chatClient = init({
  xmppDomain: process.env.CHAT_XMPP_DOMAIN!,
  userId: process.env.CHAT_USER_ID!,
  deviceId: process.env.CHAT_DEVICE_ID!,
  password: process.env.CHAT_PASSWORD!,
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

The OMEMO helper discovers encryption devices through XMPP PEP/PubSub. It
normalizes each account address to a bare JID, reads the
`eu.siacs.conversations.axolotl.devicelist` node, and fetches the published
identity bundle for each numeric OMEMO device id. It performs this discovery
for the recipient and for the sender's own account so carbon copies can be
decrypted by the sender's other clients. Applications do not provide XMPP
resources or device fanout lists for normal chat messages.

```ts
import { createOmemoEncryption, init, storageBackends } from "@hubnet-systems/chat-sdk";

const chatClient = init({
  xmppDomain,
  userId,
  deviceId,
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
  xmppDomain,
  userId,
  deviceId,
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
  xmppDomain,
  userId,
  deviceId,
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
  xmppDomain,
  userId,
  deviceId,
  password,
  encryption: createOmemoEncryption({ storage }),
});
```

The SDK owns connection state, OMEMO device discovery, listeners, receipts,
typing states, and message IDs. The XMPP server owns resource routing and
Message Carbon delivery.
