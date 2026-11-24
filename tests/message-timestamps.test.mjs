import assert from 'node:assert/strict';
import test from 'node:test';
import { xml } from '@xmpp/client';
import { createChatClient, XMPP_MESSAGE_TIME_NS, XMPP_SERVER_EVENT_NS } from '../dist/index.mjs';

const now = Date.parse('2026-10-15T15:44:00Z');
const acceptedAt = Date.parse('2026-10-09T00:36:00Z');
const domain = 'example.test';
const own = `i.bob@${domain}/phone`;
const peer = `i.alice@${domain}/phone`;
let nextId = 0;
const time = (ms, by = domain) => xml('time', { xmlns: XMPP_MESSAGE_TIME_NS, by, ms: String(ms) });
const delay = (ms, from = domain) => xml('delay', {
  xmlns: 'urn:xmpp:delay', stamp: new Date(ms).toISOString(), from,
});

function setup(t, metadata = {}, overrides = {}) {
  t.mock.method(Date, 'now', () => now);
  const state = { metadata, messages: [], errors: [], receipts: 0 };
  const sdk = createChatClient({
    apiKey: 'synthetic-test', userId: 'bob', deviceId: 'phone', xmppDomain: domain, password: 'synthetic-test',
    deliveryReceiptMode: 'manual',
    encryption: {
      encrypt: ({ body }) => ({ body, children: [] }),
      decrypt: () => ({ body: 'Synthetic message', metadata: state.metadata }),
    },
    ...overrides,
  });
  sdk.onMessage((message) => state.messages.push(message));
  sdk.onError((event) => state.errors.push(event));
  sdk.sendReceipt = async () => { state.receipts += 1; };
  t.after(() => sdk.stop());
  return { sdk, state };
}

function incoming({ carbon, timestamp = acceptedAt, wrapperTime, innerTime, children = [], outerFrom } = {}) {
  const message = xml('message', {
    xmlns: 'jabber:client', id: `timestamp-${++nextId}`, type: 'chat',
    from: carbon === 'sent' ? `i.bob@${domain}/laptop` : peer,
    to: carbon === 'sent' ? peer : own,
  }, xml('thread', {}, 'room'), xml('body', {}, '[encrypted]'),
    ...(timestamp === null ? [] : [time(timestamp)]),
    ...(innerTime === undefined ? [] : [delay(innerTime)]), ...children);
  if (!carbon) return message;
  return xml('message', { type: 'chat', from: outerFrom ?? `i.bob@${domain}`, to: own },
    xml(carbon, { xmlns: 'urn:xmpp:carbons:2' },
      xml('forwarded', { xmlns: 'urn:xmpp:forward:0' },
        ...(wrapperTime === undefined ? [] : [delay(wrapperTime)]), message)));
}

for (const carbon of [undefined, 'sent', 'received']) {
  test(`${carbon ?? 'direct'} delivery uses the first server time across replay`, async (t) => {
    const { sdk, state } = setup(t, { sentAtMs: acceptedAt - 2 * 86400000, createdAt: '2001-01-01T00:00:00Z' });
    await sdk.handleStanza(incoming({ carbon, wrapperTime: now, innerTime: acceptedAt + 1000 }));
    assert.equal(state.messages.length, 1);
    assert.equal(state.messages[0].timestamp, acceptedAt);
    assert.equal(state.messages[0].metadata.serverTimestampMs, acceptedAt);
    assert.equal(state.messages[0].metadata.sentAtMs, acceptedAt - 2 * 86400000);
  });
}

test('all client dates, including plausible backdates, leave server time unchanged', async (t) => {
  const { sdk, state } = setup(t);
  for (const sentAtMs of [undefined, acceptedAt - 1000, now + 3600000, 0, NaN, Infinity, now / 1000, 'invalid']) {
    state.metadata = { sentAtMs, createdAt: '2001-01-01T00:00:00Z', serverTimestampMs: now };
    await sdk.handleStanza(incoming());
    assert.equal(state.messages.at(-1).timestamp, acceptedAt);
    assert.equal(state.messages.at(-1).metadata.serverTimestampMs, acceptedAt);
  }
});

test('a device clock behind the server cannot alter server time', async (t) => {
  const { sdk, state } = setup(t);
  t.mock.method(Date, 'now', () => acceptedAt - 86400000);
  await sdk.handleStanza(incoming());
  assert.equal(state.messages[0].timestamp, acceptedAt);
});

test('legacy replay uses the trusted wrapper or server delay, never sender metadata', async (t) => {
  const { sdk, state } = setup(t, { sentAtMs: acceptedAt - 100000 });
  for (const carbon of [undefined, 'sent', 'received']) {
    await sdk.handleStanza(incoming({ carbon, timestamp: null,
      ...(carbon ? { wrapperTime: acceptedAt } : { innerTime: acceptedAt }) }));
  }
  assert.deepEqual(state.messages.map((message) => message.timestamp), [acceptedAt, acceptedAt, acceptedAt]);
});

test('missing, invalid and foreign server stamps never become local receipt times', async (t) => {
  const { sdk, state } = setup(t, { sentAtMs: acceptedAt });
  for (const child of [null, time(now, 'foreign.test'), time(-1), time('invalid'), time('1.5')]) {
    await sdk.handleStanza(incoming({ timestamp: null, children: child ? [child] : [] }));
  }
  assert.equal(state.messages.length, 0);
  assert.equal(state.errors.length, 5);
  assert.equal(state.receipts, 0);
});

test('a client delay and a forged carbon cannot claim a server timestamp', async (t) => {
  const { sdk, state } = setup(t);
  await sdk.handleStanza(incoming({ timestamp: null, children: [delay(acceptedAt, peer)] }));
  await sdk.handleStanza(incoming({ carbon: 'sent', outerFrom: peer }));
  assert.equal(state.messages.length, 0);
});

test('thread-gone and retraction replay retain server acceptance time', async (t) => {
  const { sdk } = setup(t);
  const gone = [], retractions = [];
  sdk.onThreadGone((event) => gone.push(event));
  sdk.processRetraction = async (event) => retractions.push(event);
  await sdk.handleStanza(incoming({ carbon: 'sent', wrapperTime: now,
    children: [xml('gone', { xmlns: 'http://jabber.org/protocol/chatstates' })] }));
  await sdk.handleStanza(incoming({ carbon: 'received', wrapperTime: now,
    children: [xml('retract', { xmlns: 'urn:xmpp:message-retract:1', id: 'original' })] }));
  assert.equal(gone[0].timestamp, acceptedAt);
  assert.equal(retractions[0].timestamp, acceptedAt);
});

test('backdating an expired correction cannot reopen its edit window', async (t) => {
  const original = { authorAddress: peer, timestamp: acceptedAt - 900000, body: 'Original', metadata: { messageType: 'CHAT_MESSAGE' } };
  const { sdk, state } = setup(t,
    { edited: true, replacesId: 'original', sentAtMs: original.timestamp + 1 },
    { resolveMessageForEdit: () => original });
  await sdk.handleStanza(incoming());
  assert.equal(state.messages.length, 0);
});

test('a correction accepted within its window remains valid on late replay', async (t) => {
  const original = { authorAddress: peer, timestamp: acceptedAt - 60000, body: 'Original', metadata: { messageType: 'CHAT_MESSAGE' } };
  const { sdk, state } = setup(t, { edited: true, replacesId: 'original', sentAtMs: 0 },
    { resolveMessageForEdit: () => original });
  await sdk.handleStanza(incoming({ carbon: 'received', wrapperTime: now }));
  assert.equal(state.messages.length, 1);
  assert.equal(state.messages[0].timestamp, acceptedAt);
});

test('only a server event can replace the sending device provisional edit clock', async (t) => {
  const { sdk } = setup(t);
  const key = sdk.editTargetKey('room', 'original');
  sdk.rememberEditTarget('room', 'original', { authorAddress: own, timestamp: 0, body: 'Original', metadata: {} });
  const notification = (from) => xml('message', { from, to: own, id: 'time:original', type: 'headline' },
    xml('event', { xmlns: XMPP_SERVER_EVENT_NS, type: 'message_timestamp' },
      Buffer.from(JSON.stringify({ roomId: 'room', messageId: 'original', timestamp: acceptedAt })).toString('base64')));
  await sdk.handleStanza(notification(peer));
  assert.equal(sdk.editTargets.get(key).timestamp, 0);
  await sdk.handleStanza(notification(domain));
  assert.equal(sdk.editTargets.get(key).timestamp, acceptedAt);
  assert.equal(sdk.serverMessageTimestamps.get(key), acceptedAt);
  sdk.rememberEditTarget('room', 'original', { authorAddress: own, timestamp: now, body: 'Replay', metadata: {} });
  assert.equal(sdk.editTargets.get(key).timestamp, acceptedAt);
});
