# Chat SDK

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
  onConversationState,
  onThreadGone,
  onEmergency,
  sendChatMessage,
  sendReply,
  addReaction,
  removeReaction,
  sendAttachment,
  sendAttachments,
  sendFormSubmission,
  sendConversationState,
  sendThreadGone,
  sendEmergency,
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

onConversationState((event) => {
  if (event.conversationType === "form_submission" && event.state === "closed") {
    console.log("Disable the composer for", event.roomId);
  }
});

onThreadGone((event) => {
  console.log("Thread ended", event.roomId);
});

onEmergency((message) => {
  console.log("Emergency alert", message.alertId, message.body);
});

await connect();

// Native XEP-0045 group chat. The API remains authoritative for membership;
// the SDK uses the same bare-JID snapshot to encrypt one XEP-0384 payload for
// every member device before sending one groupchat stanza to the MUC service.
await chatClient.joinGroupRoom({
  roomId: "lg_66d1859f61d9cac92544fac9",
  mucJid: "g_66d1859f61d9cac92544fac9@conference.api.dev.lulafi.co",
  memberJids: [ownAddress.address, peerUserId],
});

await sendChatMessage({
  roomId: "lg_66d1859f61d9cac92544fac9",
  body: "Hello group",
});

// Call updateGroupRoom after an API membership change and leaveGroupRoom when
// the current user leaves. Registered rooms are automatically rejoined after
// reconnect, with bounded retries for transient join failures and a separate
// MUC occupant for each connected XMPP resource.
await chatClient.updateGroupRoom({
  roomId: "lg_66d1859f61d9cac92544fac9",
  mucJid: "g_66d1859f61d9cac92544fac9@conference.api.dev.lulafi.co",
  memberJids: [ownAddress.address, peerUserId],
});

// Applications can use native XEP-0045/XEP-0249 invitations as a prompt to
// refresh authoritative membership and join a newly assigned room immediately.
const unsubscribeInvitation = chatClient.onGroupInvitation(({ mucJid }) => {
  void refreshGroupRoomAndJoin(mucJid);
});

// XEP-0045 delivery is presence-based. This SDK rejoins registered rooms after
// reconnect but does not fetch history. Deployments that require recovery after
// a fully terminated session must add an explicit server-side archive policy
// (for example MUC/Sub plus MAM) and a matching client history query.

const room = await chatClient.getOrCreateRoom("peer-user-id");

await sendChatMessage(room.roomId, "Hello");

await sendEmergency({
  roomId: room.roomId,
  body: "I need urgent help. Please contact me now.",
  alertId: "alert-123",
  triggeredAt: new Date().toISOString(),
});

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

await sendConversationState({
  roomId: "submission-room-id",
  targetRoomId: room.roomId,
  conversationType: "form_submission",
  conversationId: "submission-123",
  state: "closed",
});

// Standards-only XEP-0085 signal for consumers that do not need the temporary
// Lula conversation-state compatibility payload.
await sendThreadGone({
  roomId: "submission-room-id",
  targetRoomId: room.roomId,
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

### Durable delivery receipts

Clients that persist chat history should opt into manual XEP-0184 receipts and
acknowledge only after their local transaction commits:

```ts
const chatClient = init({
  // ...authentication, encryption, and room configuration
  deliveryReceiptMode: "manual",
  requireMessageCarbons: true,
});

chatClient.onChatMessage(async (message, delivery) => {
  await messageStore.upsert(message); // must be durable when this resolves
  await delivery.acknowledgeDelivered();
});
```

`acknowledgeDelivered()` is idempotent. If persistence fails, do not call it;
the sender can retry the same stable message id. `deliveryReceiptMode` defaults
to `"automatic"` for compatibility with consumers that do not maintain a
durable message store. `requireMessageCarbons` defaults to `false`; multi-device
clients should enable it so the connection is not reported ready with partial
XEP-0280 coverage.

### XEP-0198 server acceptance and durable outboxes

Clients with a durable outbox should use ejabberd's stream-management
acknowledgement as the `serverAccepted` transition, not as proof that the
recipient durably stored the message. Retain direct messages until XEP-0184 is
received:

```ts
const chatClient = init({
  // ...authentication, encryption, and room configuration
  requireStreamManagement: true,
  awaitServerAcknowledgement: true,
});

await durableOutbox.stage(message); // persist before touching the network
try {
  await chatClient.sendChatMessage(message); // resolves after XEP-0198 ack
  await durableOutbox.markServerAccepted(message.id);
} catch (error) {
  await durableOutbox.keepForRetry(message.id, error);
}

chatClient.onDelivery(async (event) => {
  if (event.status === "delivered" || event.status === "read") {
    await durableOutbox.remove(event.id);
  }
});
```

With `awaitServerAcknowledgement`, the SDK requests an XEP-0198 acknowledgement
right after each logical message's target writes. Continuous traffic cannot
defer that request through the client's trailing acknowledgement timer.
The `chat_message_sent` log includes `durationMs` for connection readiness,
target lookup, encryption, writes, and the requested server acknowledgement.

During a resumable disconnect, xmpp.js replays only stanzas that ejabberd has
not acknowledged; an app-level timer must not send the same in-flight entry at
the same time. The durable outbox is still required for process termination,
because XEP-0198 stream state is in memory. Outgoing content messages include a
XEP-0359 `<origin-id/>`; after a cold start or missing receipt, retry the same
stable stanza id so receiving clients can apply idempotent persistence. A MUC
send remains server-accepted because per-occupant XEP-0184 receipts are not a
practical room-wide delivery boundary.

`onServerAcknowledged`, `onServerSendFailed`, and `onStreamManagement` are
available for observability in every SDK consumer. XEP-0198 proves server
acceptance only. Continue to use XEP-0184 for recipient delivery and chat
markers for read state.

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
- `joinGroupRoom({ roomId, mucJid, memberJids })` to join and register a native XEP-0045 room.
- `updateGroupRoom({ roomId, mucJid, memberJids })` after the authoritative membership changes.
- `leaveGroupRoom(roomId)` to send unavailable presence and unregister the room locally.
- `onGroupInvitation(listener)` for XEP-0045 mediated and XEP-0249 direct MUC invitations.
- `onMessage(listener)` for raw chat messages. Deprecated. Prefer `onChatMessage()` or `onFormSubmission()`.
- `onChatMessage(listener)` for human chat messages.
- `onAttachmentMessage(listener)` for attachment messages.
- `onFormSubmission(listener)` for structured form submission payloads.
- `onConversationState(listener)` for typed form-conversation open/closed control events. These events are not emitted by `onChatMessage()`.
- `onThreadGone(listener)` for standard XEP-0085 `<gone/>` events keyed by the stanza `<thread>` value.
- `onServerEvent(listener)` for notices the server itself sends this account (for example `calendar_canceled`), as `{ id, type, data }`. Only stanzas from the bare XMPP domain are accepted, so accounts cannot forge them. `parseChatServerEvent(stanza, xmppDomain)` exposes the same parsing.
- `onRetraction(listener)` for author-verified XEP-0424 message retractions.
- `onEmergency(listener)` for typed SOS messages. Emergency messages are not emitted by `onChatMessage()`.
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
- `retractMessage({ roomId, messageId })` to retract a message using XEP-0424.
- `uploadAttachment(roomId, attachment)` to upload a file or image through your attachment adapter.
- `sendAttachment(roomId, attachment)` to upload and send one file or image into a room.
- `sendAttachments(roomId, attachments, options)` to upload multiple files or images and send them in one room message with an optional `body` caption.
- `sendFormSubmission({ roomId, payload })` to send a JSON form submission payload.
- `sendConversationState({ roomId, targetRoomId, conversationType, state })` to notify every participant device that a logical form conversation changed state.
- `sendThreadGone({ roomId, targetRoomId })` to send a standalone XEP-0085 `<gone/>` state for a thread.
- `sendEmergency({ roomId, body, alertId, triggeredAt })` to send an encrypted SOS message carrying both typed metadata and a `<emergency xmlns="urn:lulafi:emergency:1"/>` stanza tag.
- `sendMessage({ roomId, body })` for raw messages. Deprecated. Prefer `sendChatMessage()` or `sendFormSubmission()`.
- `sendTyping(roomId)` to send composing. The SDK sends paused after 10 seconds.
- `sendTyping(roomId, { isTyping: false })` to send paused at once.
- `markRead(roomId, messageId)` for read markers.
- `resolveAttachment(attachment)` to turn an attachment into a local or remote source string.

The SDK resolves room transport addresses inside sends, attachments, typing events, and read markers. Pass `roomDirectory` in `init()` for normal direct-chat routing.

The SDK remembers room peers after sends and incoming room messages.

The legacy multi-target compatibility path treats partial delivery as success. Native MUC sends one stanza to the room and uses XEP-0198 acknowledgement as its server-acceptance boundary.

Incoming chat, form submission, typing, and delivery events include both `fromUserId` and `fromDeviceId`. Use `fromUserId` for app-user matching and `fromDeviceId` for device-level diagnostics.

Incoming retractions are verified inside the SDK before `onRetraction` is
emitted. The SDK validates messages observed during the current runtime and can
query a client's persistent store through `resolveMessageAuthor`. Configure the
resolver in every client that persists history so retractions received after a
restart can be verified:

```ts
const chatClient = init({
  // ...normal connection and encryption config
  resolveMessageAuthor: async ({ roomId, messageId }) => {
    const message = await messageStore.findByTransportId(roomId, messageId);
    return message?.senderJid;
  },
});
```

The resolver must return the original sender's JID. If ownership cannot be
established, the SDK queues the control event and does not emit an authoritative
retraction. This fail-closed behavior applies equally to mobile, desktop,
browser, connector, and other SDK consumers.

During the conversation-state migration, sending a `closed` state also sends `<gone/>` on a best-effort basis so upgraded and legacy clients remain compatible. `<gone/>` is a client signal rather than server-side authorization; applications should retain durable closure state and enforce it when deciding whether a thread is writable.

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

`resolveRoomDeviceIds` still works as a fallback room-routing provider. New code should prefer `roomDirectory`.

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

Attachments use XEP-0363 for transport and OMEMO for their private manifest. No
Lula business API call is needed for a new upload or download:

1. the SDK requests a one-time XMPP upload slot
2. the sender encrypts bytes locally with AES-256-GCM
3. the upload bridge stores only immutable ciphertext and returns a scoped read
   capability in response headers
4. the opaque locator, capability, AES key, hashes and metadata travel only in
   the OMEMO-encrypted stanza
5. recipients send the capability as an `Authorization` header, verify hashes,
   and decrypt locally

Pass an `attachmentService` only when a platform needs native file I/O or native
crypto (for example React Native). The SDK asks that adapter to upload a file,
then carries the returned attachment object inside encrypted chat payloads.

If you use an XMPP upload service, the SDK can request upload slots for the adapter through `context.requestSlot(...)`.

Production clients should set `requireEncryptedPayloads: true` and
`requireEncryptedAttachments: true`. Connector apps can use the complete SDK
reference implementation by supplying bytes; `sendAttachment()` then uses the
same slot/encryption/capability flow automatically. The exported helpers are
also available when a connector wants explicit lifecycle control.

```ts
import {
  downloadChatAttachmentWithFetch,
  uploadChatAttachmentWithFetch,
} from "@hubnet-systems/chat-sdk";

const client = init({
  // ...authentication, room configuration, and OMEMO encryption
  requireEncryptedPayloads: true,
  requireEncryptedAttachments: true,
});

await client.sendAttachment({
  roomId: "room-123",
  attachment: {
    name: "evidence.pdf",
    mimeType: "application/pdf",
    data: await readBytes("evidence.pdf"),
  },
});

// Explicit connector lifecycle, when needed:
const manifest = await uploadChatAttachmentWithFetch(file, uploadContext);
const plaintext = await downloadChatAttachmentWithFetch(manifest);
```

Never publish `encryption.keyB64` or `downloadCapability.authorization` outside
the OMEMO payload, log either value, or put either in a URL. Connector
applications consuming form submissions use the same SDK contract; the
attachment manifest is part of the form submission, not a second message.

Attachment downloads require a capability-bearing manifest and never call the
Lula API for a signed URL.

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
resources or per-resource recipient lists for normal chat messages.

Public device lists and identity keys use a memory cache backed by the supplied
`storage` adapter. Desktop's encrypted file and mobile's AsyncStorage retain
these records across app restarts. Private keys and shared secrets stay outside
the discovery records.

A warm send uses the complete cached key set without a discovery request.
Records refresh in the background after 30 seconds. Concurrent sends share one
refresh per account. Records older than 120 seconds require a fresh lookup.
Cold lookups fetch up to four identity bundles in parallel per account.

PubSub device-list and bundle notifications invalidate cached records.
Reconnection requires server validation before saved records can be used.
The eight most recent accounts refresh in the background on connection.
The cache and subscriptions cover at most 128 accounts per encryption adapter,
with at most 128 advertised devices per account.

Use `discoveryRefreshAfterMs` and `discoveryMaxAgeMs` to change the age limits.
Pass `discoveryCache` for a custom public-data store, or
`createInMemoryOmemoDiscoveryCache()` to keep discovery records in memory only.
The default persistent records use keys shaped as
`<stateKeyPrefix>:discovery:<owner bare JID>`. Account logout cleanup should
remove those records together with the account's encryption state.

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

## Message timestamps

Use `ChatMessage.timestamp` for display and ordering. The server assigns this
Unix time in milliseconds on first acceptance. Client `metadata.sentAtMs` and
`metadata.createdAt` have no authority over received message time.

The wire stamp is `<time xmlns="urn:lulafi:message-time:1" by="example.test"
ms="1791506160123"/>`. The server replaces client stamps at authenticated ingress.
It retains one time per account, room, and stable message ID across fanout,
retries, and restarts. MAM replay retains this stamp. Legacy archive rows use
their server archive time. Forwarded Message Carbons retain their wrapper delay.
The SDK checks a carbon's sender against the current account's bare JID.

The SDK copies the trusted time to `metadata.serverTimestampMs`. Sender metadata
cannot override that field. Server times do not depend on the receiving device's
clock. A received message without trusted time raises
`chat_message_server_timestamp_missing` and stays out of the message stream.

The sending device receives an `onServerEvent` event with type
`message_timestamp`. Its `data` contains `messageId`, `roomId`, and `timestamp`.
Replace the pending message's local time with this value. Keep its body, delivery
status, edits, attachments, and deletion state. These events come from the bare
server domain and use MAM storage for reconnect delivery.

Pending local time remains temporary. Existing caches receive corrections on
trusted replay. This change does not rewrite all historical client records.

Deploy `mod_lula_message_time` on ejabberd first. It stamps API notices at routing
too. Then publish this SDK change and update consumer dependencies. Mobile currently
uses a native crypto patch on SDK 0.1.39. Retain that patch during the upgrade.
Desktop currently pins SDK 0.1.38. The prepared client changes need this SDK
release for authoritative incoming time.

## Editing messages

Text messages can be edited by their original author for **15 minutes from the
original send time**. Subsequent edits do not extend the window. Attachments,
form submissions, emergency messages and deleted messages cannot be edited.

```ts
await chatClient.editMessage({
  roomId: "room-id",
  targetMessageId: "original-message-id",
  body: "Corrected text",
});
```

The SDK checks both the dedicated edit API and corrections passed to generic
send APIs. It checks again immediately before transport because connecting,
joining a group and encryption can outlive the window. Applications can use
`isMessageEditWithinWindow(originalTimestamp)` for menus and
`getMessageEditError(original, editorAddress)` for the full policy.

Supply `resolveMessageForEdit` in the client configuration to resolve an
original message from persistent storage, including canonical/local ID aliases:

```ts
resolveMessageForEdit: async ({ roomId, messageId }) => {
  const original = await messageStore.findByIdOrAlias(roomId, messageId);
  if (!original) return null;
  return {
    authorAddress: original.senderId,
    timestamp: original.timestamp,
    body: original.body,
    hasAttachments: Boolean(original.attachments?.length),
    ...(original.metadata ? { metadata: original.metadata } : {}),
  };
},
```

Without a resolver the SDK uses a bounded runtime cache of originals. A supplied
resolver is authoritative, including missing or deleted originals. Incoming
corrections are checked against their server acceptance time, so valid edits
can arrive later on offline devices. Unknown originals
are deferred in a bounded queue; in manual receipt mode they are not acknowledged
until the application persists the validated correction.

Consumers merge corrections using encrypted `edited` / `replacesId` metadata.
Preserve the original message ID, sender and timestamp; change only text and
supported text metadata. Use the latest edit creation timestamp (and event ID to
break ties) so out-of-order corrections cannot undo newer text.

Durable outboxes must discard edits not yet accepted when the window expires.
To replay an already acknowledged edit after expiry, pass its stable `id`,
original edit `metadata.sentAtMs` and locally persisted `serverAcceptedAt` to
`editMessage`. This acknowledgement must come from the sender's outbox, never
from incoming wire metadata. Receiving clients still validate the edit's original
creation time and authorship.

Receiving clients check the edit window using server acceptance times. A modified
sender cannot reopen an expired window with a backdated metadata timestamp.
The server retains the same time for a retry of an accepted edit ID. Message
content and correction metadata remain encrypted.

`npm run build` runs type checks, builds the package, and runs the Node tests.
# Service accounts and guest submissions

`ChatClientBaseConfig.accountJid` accepts an explicit service-account bare JID
on the configured XMPP domain. It leaves ordinary app-user addresses unchanged.
The core API uses this option for `no-reply@<domain>`.

`sendFormSubmission` accepts a typed `submitter` value. Guest submissions use
`{ kind: "guest", guestSessionId: "<random UUID>", identityVerification: "none" }`.
The SDK carries this marker inside the encrypted form metadata and removes
registered-user identity fields from guest metadata. The payload keeps the
same `readable` and `raw` maps used by mobile.

The account must authenticate with server-issued credentials. The marker does
not grant access or prove the submitter's identity. The server must enforce
public form access and the outbound-only account policy. SDK configuration
does not reject incoming messages at the server.

## Full Unicode emoji reactions

`isChatReactionEmoji` validates one complete emoji sequence using generated `emojibase-regex` 18.0 patterns. `CHAT_EMOJI_UNICODE_VERSION` exposes the validation version. Keycaps, country/subdivision flags, skin tones and ZWJ sequences are accepted; text, multiple emojis and standalone components are rejected. Legacy forms without an emoji-presentation selector remain accepted. The exact sequence is preserved for reaction identity and removal; do not strip selectors, skin tones, joiners or tag characters.

### Data and rendering

Emojibase replaces the previous handwritten Unicode-range validator with a versioned, generated matcher. The SDK bundles only the matcher, without runtime downloads, names, categories, fonts or artwork. Client pickers can use the corresponding pinned `emojibase-data` for search labels, categories and variants.

This standardizes the supported Unicode sequences, not their artwork. Native iOS, Samsung/Android and desktop fonts can draw the same sequence differently. A newer SDK cannot add missing glyphs to an older OS: a valid emoji can still appear as a box or separate characters. Clients requiring identical artwork or glyph-availability filtering must implement that rendering policy separately.

### Compatibility and rollout

| Receiving client | Behaviour |
| --- | --- |
| This SDK, recognized emoji | Parses the reaction; `buildChatInteractionTimeline` aggregates it on the target message. Rendering depends on the client's font. |
| This SDK, unrecognized or malformed reaction | `parseChatReactionEvent` returns `undefined`. The control envelope is still recognized, excluded from the projected chat timeline, and retained unchanged in raw events/history for later reprocessing. It is not converted into an ordinary message. |
| Already-installed older SDK | Its shipped validator and UI decide the outcome. Version 0.1.43's range check rejects valid examples such as `⭐` and `1️⃣`; some newer symbols happen to pass its broad ranges. Rejected controls can appear as standalone messages in its old projection. Updating this SDK cannot change that installed code. |
| Client without this SDK | Interoperable only if it implements the reaction metadata contract below and compatible transport, decryption and timeline handling. Treating every received body as chat text will not display proper reactions. |

There is no peer capability negotiation or automatic downgrade in this protocol. For a new Unicode release, upgrade receiving SDKs/validators in mobile, desktop and connector clients first, then expose the expanded sending picker. Keep compatible choices available during mixed-version deployments; do not assume every installed client supports all new reactions. A client's picker is not itself the receive-side validator.

### Clients that do not use the SDK

`addReaction` and `removeReaction` produce the same logical message format as before. After the normal transport/decryption step, a reaction looks like:

```json
{
  "id": "reaction-event-id",
  "body": "👩🏿‍💻",
  "metadata": {
    "messageType": "CHAT_MESSAGE",
    "chatInteractionType": "CHAT_REACTION",
    "reactionToId": "target-message-id",
    "reactionEmoji": "👩🏿‍💻",
    "reactionActorId": "user-id",
    "reactionRemoved": false
  }
}
```

The target is the original message's interaction ID (`metadata.canonicalEventId` when present, otherwise its ID). Use a new event ID for removal, the same target/actor/exact emoji, and `reactionRemoved: true`. Normalize linked-device identities to the same actor, deduplicate by target/emoji/actor, and apply additions/removals in timeline order. Route `CHAT_REACTION` envelopes away from ordinary message bubbles even if their emoji is unsupported. The SDK is optional; this contract is not. Matching code points identify the same reaction, while visual artwork can differ.

### Version choice and updates

Emoji 18 is the latest released Unicode emoji repertoire as of 9 November 2026, and is supported by the pinned Emojibase 18.0.0 packages. It is a standards version, not an arbitrary palette size or a guarantee of OS font support. We do not target unreleased Emoji 19. References: [Unicode's release list](https://www.unicode.org/releases/) and [UTS #51 revision 31](https://www.unicode.org/reports/tr51/tr51-31.html).

For an intentional upgrade:

1. Check the final Unicode release and pin the matching matcher and client catalogue versions together.
2. Update `CHAT_EMOJI_UNICODE_VERSION`, regenerate the independent fixture from the immutable official URL with `node scripts/update-emoji-fixture.mjs 18.0` (replace the version for an upgrade), and keep the source URL/SHA-256 in the fixture.
3. Run `npm run build`. Tests cover the complete Unicode fixture, legacy presentation forms, raw non-SDK events, add/remove round trips, and unsupported control filtering. Test real fonts separately on supported OS versions.
4. Publish the SDK, deploy receiving clients, replace temporary consumer patches with the released version, and only then enable new sending choices. Versions are pinned, so catalogue updates cannot silently change an installed application's behaviour.
