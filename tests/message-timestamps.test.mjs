import assert from 'node:assert/strict';
import test from 'node:test';
import { xml } from '@xmpp/client';

import { createChatClient } from '../dist/index.mjs';

const now = Date.parse('2026-10-15T15:44:00Z');
const archivedAt = Date.parse('2026-10-09T00:36:00Z');
const domain = 'example.test';
const own = `i.bob@${domain}/phone`;
const peer = `i.alice@${domain}/phone`;
let nextId = 0;

function setup(t, metadata = {}, overrides = {}) {
  t.mock.method(Date, 'now', () => now);
  const state = { metadata, messages: [], receipts: 0 };
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
  sdk.sendReceipt = async () => { state.receipts += 1; };
  t.after(() => sdk.stop());
  return { sdk, state };
}

function incoming({ carbon, stamp, innerStamp, requestReceipt = false, children = [] } = {}) {
  const delay = (value) => xml('delay', { xmlns: 'urn:xmpp:delay', stamp: value });
  const message = xml('message', {
    xmlns: 'jabber:client', id: `timestamp-${++nextId}`, type: 'chat',
    from: carbon === 'sent' ? `i.bob@${domain}/laptop` : peer,
    to: carbon === 'sent' ? peer : own,
  }, xml('thread', {}, 'room'), xml('body', {}, '[encrypted]'),
    ...(innerStamp ? [delay(innerStamp)] : []),
    ...(!carbon && stamp ? [delay(stamp)] : []),
    ...(requestReceipt ? [xml('request', { xmlns: 'urn:xmpp:receipts' })] : []),
    ...children);
  if (!carbon) return message;
  return xml('message', { type: 'chat', from: `i.bob@${domain}`, to: own },
    xml(carbon, { xmlns: 'urn:xmpp:carbons:2' },
      xml('forwarded', { xmlns: 'urn:xmpp:forward:0' }, ...(stamp ? [delay(stamp)] : []), message)));
}

for (const carbon of ['sent', 'received']) {
  test(`${carbon} replay retains the forwarding wrapper's timestamp when sender metadata is absent`, async (t) => {
    const { sdk, state } = setup(t);
    await sdk.handleStanza(incoming({ carbon, stamp: new Date(archivedAt).toISOString() }));
    assert.equal(state.messages.length, 1);
    assert.equal(state.messages[0].timestamp, archivedAt);
    assert.equal(state.messages[0].fromFullAddress, carbon === 'sent' ? `i.bob@${domain}/laptop` : peer);
  });
}

test('ordinary offline delivery preserves its inner delay and UTC offset', async (t) => {
  const { sdk, state } = setup(t);
  await sdk.handleStanza(incoming({ stamp: '2026-10-09T03:36:00+03:00' }));
  assert.equal(state.messages[0].timestamp, archivedAt);
});

test('valid original send times survive delayed delivery and replay on multiple devices', async (t) => {
  const sentAtMs = archivedAt - 2 * 86400000;
  const { sdk, state } = setup(t, { sentAtMs });
  for (const carbon of [undefined, 'sent', 'received']) {
    await sdk.handleStanza(incoming({ carbon, stamp: new Date(archivedAt).toISOString() }));
  }
  assert.deepEqual(state.messages.map((message) => message.timestamp), [sentAtMs, sentAtMs, sentAtMs]);
});

test('live messages with no sender timestamp fall back to receipt time', async (t) => {
  const { sdk, state } = setup(t);
  await sdk.handleStanza(incoming());
  assert.equal(state.messages[0].timestamp, now);
});

test('future sender time falls back to transport time regardless of the sending client', async (t) => {
  const { sdk, state } = setup(t, { sentAtMs: now + 9 * 3600000 });
  await sdk.handleStanza(incoming({ stamp: new Date(archivedAt).toISOString() }));
  await sdk.handleStanza(incoming());
  assert.deepEqual(state.messages.map((message) => message.timestamp), [archivedAt, now]);
  assert.equal(state.messages[0].metadata.sentAtMs, now + 9 * 3600000, 'keep original metadata separate from the resolved display timestamp');
});

test('sender time is checked against replay time as well as today', async (t) => {
  const { sdk, state } = setup(t, { sentAtMs: now - 1000 });
  await sdk.handleStanza(incoming({ carbon: 'sent', stamp: new Date(archivedAt).toISOString() }));
  assert.equal(state.messages[0].timestamp, archivedAt);
});

test('seconds, negative, non-finite, fractional and out-of-range sender dates are rejected', async (t) => {
  const { sdk, state } = setup(t);
  for (const sentAtMs of [Math.floor(now / 1000), 0, -1, NaN, Infinity, Number.MAX_SAFE_INTEGER, now + 0.5, '1792079040000']) {
    state.metadata = { sentAtMs };
    await sdk.handleStanza(incoming({ stamp: new Date(archivedAt).toISOString() }));
    assert.equal(state.messages.at(-1).timestamp, archivedAt);
  }
});

test('small clock skew is tolerated, but times beyond five minutes use receipt time', async (t) => {
  const { sdk, state } = setup(t);
  for (const delta of [0, 300000, 300001]) {
    state.metadata = { sentAtMs: now + delta };
    await sdk.handleStanza(incoming());
    assert.equal(state.messages.at(-1).timestamp, delta <= 300000 ? now + delta : now);
  }
});

test('legacy createdAt timestamps require an explicit timezone and a plausible instant', async (t) => {
  const { sdk, state } = setup(t);
  for (const [createdAt, expected] of [
    ['2026-10-08T03:36:00+03:00', archivedAt - 86400000],
    ['2026-10-08T00:36:00Z', archivedAt - 86400000],
    ['2026-10-08T00:36:00', archivedAt],
    ['2099-01-01T00:00:00Z', archivedAt],
    ['not-a-date', archivedAt],
  ]) {
    state.metadata = { createdAt };
    await sdk.handleStanza(incoming({ stamp: new Date(archivedAt).toISOString() }));
    assert.equal(state.messages.at(-1).timestamp, expected);
  }
});

test('invalid wrapper delays fall back to a valid inner delay or receipt time', async (t) => {
  const { sdk, state } = setup(t);
  for (const stamp of ['invalid', '2026-10-09T00:36:00', '2099-01-01T00:00:00Z', '1970-01-01T00:00:00Z']) {
    await sdk.handleStanza(incoming({ carbon: 'received', stamp, innerStamp: new Date(archivedAt).toISOString() }));
    assert.equal(state.messages.at(-1).timestamp, archivedAt);
    await sdk.handleStanza(incoming({ stamp }));
    assert.equal(state.messages.at(-1).timestamp, now);
  }
});

test('the wrapper delay takes precedence over an inner copy carrying a previous replay delay', async (t) => {
  const { sdk, state } = setup(t);
  await sdk.handleStanza(incoming({ carbon: 'sent', stamp: new Date(archivedAt).toISOString(), innerStamp: new Date(archivedAt - 1000).toISOString() }));
  assert.equal(state.messages[0].timestamp, archivedAt);
});

test('replayed thread-gone and retraction events also retain their wrapper delay', async (t) => {
  const { sdk } = setup(t);
  const gone = [];
  const retractions = [];
  sdk.onThreadGone((event) => gone.push(event));
  sdk.processRetraction = async (event) => retractions.push(event);
  const stamp = new Date(archivedAt).toISOString();
  await sdk.handleStanza(incoming({ carbon: 'sent', stamp, children: [xml('gone', { xmlns: 'http://jabber.org/protocol/chatstates' })] }));
  await sdk.handleStanza(incoming({ carbon: 'sent', stamp, children: [xml('retract', { xmlns: 'urn:xmpp:message-retract:1', id: 'original' })] }));
  assert.equal(gone[0].timestamp, archivedAt);
  assert.equal(retractions[0].timestamp, archivedAt);
});

test('invalid correction creation times cannot be repaired into the edit window', async (t) => {
  const original = { authorAddress: peer, timestamp: now - 60000, body: 'Original', metadata: { messageType: 'CHAT_MESSAGE' } };
  const { sdk, state } = setup(t, {}, { resolveMessageForEdit: () => original });
  for (const sentAtMs of [undefined, 0, Math.floor(now / 1000), now + 3600000]) {
    state.metadata = { edited: true, replacesId: 'original', ...(sentAtMs !== undefined ? { sentAtMs } : {}) };
    await sdk.handleStanza(incoming({ stamp: new Date(now).toISOString(), requestReceipt: true }));
  }
  assert.equal(state.messages.length, 0);
  assert.equal(state.receipts, 4, 'discarded corrections should not be replayed forever');
});

test('valid corrections still use creation time when replayed much later', async (t) => {
  const original = { authorAddress: peer, timestamp: archivedAt - 60000, body: 'Original', metadata: { messageType: 'CHAT_MESSAGE' } };
  const { sdk, state } = setup(t, { edited: true, replacesId: 'original', sentAtMs: archivedAt }, { resolveMessageForEdit: () => original });
  await sdk.handleStanza(incoming({ carbon: 'received', stamp: new Date(now).toISOString() }));
  assert.equal(state.messages.length, 1);
  assert.equal(state.messages[0].timestamp, archivedAt);
});
