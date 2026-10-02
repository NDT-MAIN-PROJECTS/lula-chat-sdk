import assert from "node:assert/strict";
import test from "node:test";

import {
  CHAT_MESSAGE_EDIT_WINDOW_MS as windowMs,
  createChatClient,
  getMessageEditError,
  isMessageEditWithinWindow,
} from "../dist/index.mjs";

const sentAt = Date.parse("2026-09-25T08:00:00Z");
const author = "i.alice@dev.lulafi.co/phone";
const target = {
  authorAddress: author,
  timestamp: sentAt,
  body: "Original",
  metadata: { messageType: "CHAT_MESSAGE" },
};

function client(options = {}) {
  return createChatClient({
    apiKey: "test",
    userId: "alice",
    deviceId: "phone",
    xmppDomain: "dev.lulafi.co",
    password: "test",
    encryption: { encrypt: ({ body }) => ({ body, children: [] }), decrypt: () => null },
    deliveryReceiptMode: "manual",
    ...options,
  });
}

function incoming({
  id = "original",
  timestamp = sentAt,
  from = author,
  metadata = {},
  body = "Original",
} = {}) {
  return {
    id,
    roomId: "room",
    body,
    timestamp,
    fromFullAddress: from,
    fromDeviceId: from,
    fromUserId: "alice",
    toDeviceId: "i.bob@dev.lulafi.co/phone",
    metadata: { messageType: "CHAT_MESSAGE", ...metadata },
  };
}

function delivery() {
  const result = { acknowledgements: 0, receiptRequested: true };
  result.acknowledgeDelivered = async () => {
    result.acknowledgements += 1;
  };
  return result;
}

const edit = (overrides = {}) =>
  incoming({
    id: "correction",
    body: "Corrected",
    timestamp: sentAt + 1000,
    metadata: { edited: true, replacesId: "original", sentAtMs: sentAt + 1000 },
    ...overrides,
  });

test("fixed window: 14:59 passes, 15:00 and a week fail; unknown/future times fail closed", () => {
  assert.equal(windowMs, 900000);
  assert.equal(isMessageEditWithinWindow(sentAt, sentAt + 899000), true);
  assert.equal(isMessageEditWithinWindow(sentAt, sentAt + windowMs), false);
  assert.equal(isMessageEditWithinWindow(sentAt, sentAt + 7 * 86400000), false);
  for (const value of [NaN, Infinity, 0])
    assert.equal(isMessageEditWithinWindow(value, sentAt), false);
  assert.equal(isMessageEditWithinWindow(sentAt, sentAt - 1), false);
});

test("author rule supports linked devices and legacy device JIDs, not other accounts or MUC occupants", () => {
  assert.equal(getMessageEditError(target, "i.alice@dev.lulafi.co/laptop", sentAt + 1), undefined);
  assert.equal(
    getMessageEditError(target, "i.alice.d.legacy@dev.lulafi.co", sentAt + 1),
    undefined,
  );
  assert.equal(
    getMessageEditError(target, "i.bob@dev.lulafi.co/phone", sentAt + 1),
    "chat_edit_not_message_author",
  );
  const groupTarget = { ...target, authorAddress: "room@conference.dev.lulafi.co/Alice" };
  assert.equal(
    getMessageEditError(groupTarget, "room@conference.dev.lulafi.co/alice", sentAt + 1),
    "chat_edit_not_message_author",
  );
  assert.equal(
    getMessageEditError(groupTarget, "room@conference.dev.lulafi.co/Bob", sentAt + 1),
    "chat_edit_not_message_author",
  );
});

test("unknown originals, attachments, deleted messages, forms and emergencies cannot be edited", () => {
  assert.equal(getMessageEditError(null, author, sentAt), "chat_edit_original_not_found");
  for (const changes of [
    { hasAttachments: true },
    { body: "" },
    { metadata: { redacted: true } },
    { metadata: { retracted: true } },
    { metadata: { messageType: "FORM_SUBMISSION" } },
    { metadata: { formId: "form" } },
    { metadata: { emergencyType: "sos" } },
  ])
    assert.equal(
      getMessageEditError({ ...target, ...changes }, author, sentAt + 1),
      "chat_edit_not_allowed",
    );
});

test("valid corrections received days later are emitted using their creation time", async () => {
  const sdk = client({ resolveMessageForEdit: () => target });
  const received = [];
  sdk.onMessage((message) => received.push(message));
  await sdk.emitValidatedMessage(edit(), delivery());
  assert.equal(received[0]?.body, "Corrected");
});

test("receiver rejects late and different-author corrections without emitting them", async () => {
  const sdk = client({ resolveMessageForEdit: () => target });
  let emitted = 0;
  sdk.onMessage(() => emitted++);
  for (const message of [
    edit({ timestamp: sentAt + windowMs }),
    edit({ from: "i.bob@dev.lulafi.co/phone" }),
  ]) {
    const receipt = delivery();
    await sdk.emitValidatedMessage(message, receipt);
    assert.equal(receipt.acknowledgements, 1);
  }
  assert.equal(emitted, 0);
});

test("out-of-order edits wait for their original and keep manual receipt ownership", async () => {
  const sdk = client();
  const received = [];
  sdk.onMessage((message) => received.push(message.id));
  const receipt = delivery();
  await sdk.emitValidatedMessage(edit(), receipt);
  assert.deepEqual(received, []);
  assert.equal(receipt.acknowledgements, 0);
  await sdk.emitValidatedMessage(incoming(), delivery());
  assert.deepEqual(received, ["original", "correction"]);
  assert.equal(receipt.acknowledgements, 0);
});

test("out-of-order invalid corrections are discarded after the original arrives", async () => {
  const sdk = client();
  const received = [];
  sdk.onMessage((message) => received.push(message.id));
  const receipt = delivery();
  await sdk.emitValidatedMessage(edit({ timestamp: sentAt + windowMs }), receipt);
  await sdk.emitValidatedMessage(incoming(), delivery());
  assert.deepEqual(received, ["original"]);
  assert.equal(receipt.acknowledgements, 1);
});

test("original replay and repeated edits never reset the SDK edit clock", async () => {
  const sdk = client();
  await sdk.emitValidatedMessage(incoming(), delivery());
  await sdk.emitValidatedMessage(edit(), delivery());
  await sdk.emitValidatedMessage(incoming({ timestamp: sentAt + 10000 }), delivery());
  const remembered = await sdk.resolveEditTarget("room", "original");
  assert.equal(remembered.timestamp, sentAt);
  assert.equal(getMessageEditError(remembered, author, sentAt + windowMs), "chat_edit_expired");
});

test("persistent resolver handles restart/aliases and deletions override runtime state", async () => {
  let persisted = target;
  const sdk = client({
    resolveMessageForEdit: ({ messageId }) => (messageId === "alias" ? persisted : undefined),
  });
  assert.equal((await sdk.resolveEditTarget("room", "alias")).timestamp, sentAt);
  await sdk.emitValidatedMessage(incoming(), delivery());
  persisted = { ...target, metadata: { retracted: true } };
  assert.equal(
    getMessageEditError(await sdk.resolveEditTarget("room", "alias"), author, sentAt + 1),
    "chat_edit_not_allowed",
  );
  assert.equal(await sdk.resolveEditTarget("room", "original"), undefined);
});

test("dedicated and generic send APIs both reject expired edits before connecting", async () => {
  const sdk = client({ resolveMessageForEdit: () => target });
  sdk.connect = async () => {
    throw new Error("must_not_connect");
  };
  await assert.rejects(
    sdk.editMessage({ roomId: "room", targetMessageId: "original", body: "Changed" }),
    /chat_edit_expired/,
  );
  await assert.rejects(
    sdk.sendChatMessage({
      roomId: "room",
      body: "Changed",
      metadata: { edited: true, replacesId: "original", sentAtMs: sentAt + 1 },
    }),
    /chat_edit_expired/,
  );
  await assert.rejects(
    sdk.sendMessage({
      roomId: "room",
      body: "Changed",
      metadata: { edited: true, replacesId: "original" },
    }),
    /chat_edit_expired/,
  );
});

test("expiry is rechecked after an asynchronous connection", async () => {
  const realNow = Date.now;
  let now = sentAt + windowMs - 1;
  Date.now = () => now;
  try {
    const sdk = client({ resolveMessageForEdit: () => target });
    let sends = 0;
    sdk.xmpp = {
      send: async () => {
        sends++;
      },
    };
    sdk.connect = async () => {
      now = sentAt + windowMs;
    };
    await assert.rejects(
      sdk.editMessage({
        roomId: "room",
        targetMessageId: "original",
        body: "Changed",
        toDeviceId: "i.bob@dev.lulafi.co",
      }),
      /chat_edit_expired/,
    );
    assert.equal(sends, 0);
  } finally {
    Date.now = realNow;
  }
});

test("an acknowledged stable edit can replay after expiry, but metadata cannot claim acceptance", async () => {
  const sdk = client({ resolveMessageForEdit: () => target });
  let sends = 0;
  sdk.xmpp = {
    send: async () => {
      sends++;
    },
  };
  sdk.connect = async () => {};
  const input = {
    roomId: "room",
    targetMessageId: "original",
    body: "Changed",
    id: "stable-edit",
    toDeviceId: "i.bob@dev.lulafi.co",
    metadata: { sentAtMs: sentAt + 1000 },
  };
  assert.equal(await sdk.editMessage({ ...input, serverAcceptedAt: sentAt + 1001 }), "stable-edit");
  assert.equal(sends, 1);
  await assert.rejects(
    sdk.sendChatMessage({
      ...input,
      metadata: {
        ...input.metadata,
        edited: true,
        replacesId: "original",
        serverAcceptedAt: sentAt + 1001,
      },
    }),
    /chat_edit_expired/,
  );
  assert.equal(sends, 1);
});

test("legacy canonical-ID aliases are ordinary messages, not correction events", async () => {
  const sdk = client();
  let received;
  sdk.onMessage((message) => {
    received = message;
  });
  await sdk.emitValidatedMessage(incoming({ metadata: { replacesId: "local-id" } }), delivery());
  assert.equal(received.id, "original");
  assert.equal(received.metadata.replacesId, undefined);
  sdk.xmpp = { send: async () => {} };
  sdk.connect = async () => {};
  const id = await sdk.sendChatMessage({
    roomId: "room",
    body: "Original",
    toDeviceId: "i.bob@dev.lulafi.co",
    metadata: { replacesId: "local-id" },
  });
  assert.ok(id);
});
