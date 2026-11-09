import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  CHAT_EMOJI_UNICODE_VERSION,
  isChatReactionEmoji,
  parseChatReactionEvent,
  CHAT_REACTION_INTERACTION_TYPE,
  isChatReactionControlMessage,
  buildChatInteractionTimeline,
  createChatClient,
} from "../dist/index.mjs";

const fixture = JSON.parse(
  fs.readFileSync(new URL("./fixtures/emoji-18.json", import.meta.url), "utf8"),
);
test("accepts every fully qualified sequence from the independent Unicode 18 test fixture", () => {
  assert.equal(CHAT_EMOJI_UNICODE_VERSION, fixture.version);
  assert.equal(
    fixture.source,
    `https://www.unicode.org/Public/${fixture.version}.0/emoji/emoji-test.txt`,
  );
  assert.match(fixture.sha256, /^[a-f0-9]{64}$/);
  assert.equal(fixture.fullyQualified.length, 3963);
  for (const emoji of fixture.fullyQualified)
    assert.equal(isChatReactionEmoji(emoji), true, JSON.stringify(emoji));
});

const reactionMessage = (id, emoji, removed = false) => ({
  id,
  body: emoji,
  senderId: "i.alice.d.phone@chat.test",
  metadata: {
    messageType: "CHAT_MESSAGE",
    chatInteractionType: "CHAT_REACTION",
    reactionToId: "canonical-target",
    reactionEmoji: emoji,
    reactionRemoved: removed,
  },
});
const targetMessage = {
  id: "local-target",
  body: "Original message",
  metadata: { canonicalEventId: "canonical-target" },
};

test("unsupported and malformed controls stay in raw history without becoming chat bubbles", () => {
  // Deliberately unrecognized, not a prediction of a future assigned emoji.
  const unknown = "\u{1FAFF}";
  const controls = [
    reactionMessage("unknown-add", unknown),
    reactionMessage("unknown-remove", unknown, true),
    reactionMessage("invalid-text", "hello"),
    reactionMessage("multiple", "😀😀"),
    { id: "empty-control", metadata: { chatInteractionType: "CHAT_REACTION" } },
  ];
  const normalEmojiMessage = {
    id: "ordinary",
    body: "😀",
    metadata: { messageType: "CHAT_MESSAGE" },
  };
  const raw = [targetMessage, ...controls, normalEmojiMessage];
  const before = JSON.stringify(raw);
  for (const message of controls) {
    assert.equal(parseChatReactionEvent(message), undefined);
    assert.equal(isChatReactionControlMessage(message), true);
  }
  const projected = buildChatInteractionTimeline(raw, "alice");
  assert.deepEqual(
    projected.map((message) => message.id),
    ["local-target", "ordinary"],
  );
  assert.deepEqual(projected[0].reactions, []);
  assert.equal(isChatReactionControlMessage(normalEmojiMessage), false);
  assert.equal(
    JSON.stringify(raw),
    before,
    "raw controls must remain intact for later reprocessing",
  );
});

test("non-SDK wire events aggregate and remove by canonical target, exact emoji and linked-device actor", () => {
  const first = reactionMessage("add-alice", "👩🏿‍💻");
  const second = {
    ...reactionMessage("add-bob", "👩🏿‍💻"),
    senderId: "i.bob@chat.test/laptop",
  };
  const remove = {
    ...reactionMessage("remove-alice", "👩🏿‍💻", true),
    senderId: "i.alice@chat.test/tablet",
  };
  const timeline = buildChatInteractionTimeline(
    [targetMessage, first, second, remove],
    "bob",
  );
  assert.equal(timeline.length, 1);
  assert.deepEqual(timeline[0].reactions, [
    {
      emoji: "👩🏿‍💻",
      count: 1,
      actorIds: ["bob"],
      reactedByCurrentUser: true,
    },
  ]);
  const removed = buildChatInteractionTimeline(
    [targetMessage, first, remove],
    "alice",
  );
  assert.deepEqual(removed[0].reactions, []);
});

test("public add/remove methods preserve the non-SDK wire contract and reject unsupported sends", async () => {
  const client = createChatClient({
    apiKey: "test",
    userId: "alice",
    deviceId: "phone",
    xmppDomain: "chat.test",
    password: "test",
  });
  const sent = [];
  client.sendChatMessage = async (message) => {
    sent.push(message);
    return `event-${sent.length}`;
  };
  const input = {
    roomId: "room",
    targetMessageId: "canonical-target",
    emoji: "1️⃣",
  };
  await client.addReaction(input);
  await client.removeReaction(input);
  for (const [index, message] of sent.entries()) {
    assert.equal(message.body, input.emoji);
    assert.deepEqual(message.metadata, {
      chatInteractionType: "CHAT_REACTION",
      reactionToId: "canonical-target",
      reactionEmoji: "1️⃣",
      reactionRemoved: index === 1,
      reactionActorId: "alice",
    });
    assert.deepEqual(parseChatReactionEvent(message), {
      targetMessageId: "canonical-target",
      emoji: "1️⃣",
      actorId: "alice",
      removed: index === 1,
    });
  }
  assert.throws(
    () => client.addReaction({ ...input, emoji: "\u{1FAFF}" }),
    /chat_reaction_emoji_invalid/,
  );
  assert.equal(sent.length, 2);
});
test("rejects text, multiple emojis and standalone components", () => {
  for (const value of [
    null,
    42,
    "",
    "hello",
    "😀😀",
    "👍 hello",
    "👍\n❤️",
    "🏻",
    "🦰",
    "🇿",
    "\u200d",
    "\ufe0f",
    "😀".repeat(1000),
  ]) {
    assert.equal(isChatReactionEmoji(value), false, JSON.stringify(value));
  }
});
test("keeps legacy presentation selectors and quick reactions compatible", () => {
  for (const emoji of [
    "👍",
    "❤",
    "❤️",
    "😂",
    "😮",
    "😢",
    "🙏",
    "1⃣",
    "1️⃣",
    "©",
    "©️",
  ])
    assert.equal(isChatReactionEmoji(emoji), true, emoji);
});
test("expanded reactions retain their exact Unicode sequence through parsing", () => {
  for (const emoji of [
    "⭐",
    "👩🏿‍💻",
    "🇿🇦",
    "1️⃣",
    "🏴\u{e0067}\u{e0062}\u{e0065}\u{e006e}\u{e0067}\u{e007f}",
  ]) {
    const event = parseChatReactionEvent({
      id: "event",
      senderId: "i.user.d.phone@chat.test",
      metadata: {
        chatInteractionType: CHAT_REACTION_INTERACTION_TYPE,
        reactionToId: "message",
        reactionEmoji: emoji,
      },
    });
    assert.equal(event?.emoji, emoji);
    assert.equal(event?.actorId, "user");
  }
});
