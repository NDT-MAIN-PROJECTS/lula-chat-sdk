import assert from 'node:assert/strict';
import test from 'node:test';
import { xml } from '@xmpp/client';
import { createChatClient, XMPP_MESSAGE_TIME_NS } from '../dist/index.mjs';

const domain = 'example.test';
const room = `g_one@conference.${domain}`;
const own = `i.alice@${domain}/phone`;
const author = `i.bob@${domain}/desktop`;
const eventNs = 'http://jabber.org/protocol/pubsub#event';
const node = 'urn:xmpp:mucsub:nodes:messages';
const acceptedAt = 1791506160123;

function fixture() {
  const decoded = [];
  const messages = [];
  const client = createChatClient({apiKey: '', xmppDomain: domain,
    userId: 'alice', deviceId: 'phone', password: 'unused',
    encryption: {encrypt: () => ({body: '', children: []}), decrypt: ({stanza}) => {
      decoded.push(stanza);
      return {body: stanza.getChildText('body'), metadata: {messageType: 'CHAT_MESSAGE'}};
    }} });
  client.onMessage(message => messages.push(message));
  return {client, decoded, messages};
}
function inner(overrides = {}, children = []) {
  return xml('message', {xmlns: 'jabber:client', type: 'groupchat',
    from: `${room}/bob`, to: own, id: 'original-id', ...overrides},
    xml('body', {}, 'Encrypted body'), xml('thread', {}, 'logical-room'),
    xml('sender', {xmlns: 'urn:lulafi:muc-sender:1', by: domain, jid: author}),
    xml('time', {xmlns: XMPP_MESSAGE_TIME_NS, by: domain, ms: String(acceptedAt)}),
    ...children);
}
function wrapped(message = inner(), attrs = {}) {
  return xml('message', {from: room, to: own, id: 'archive-id', ...attrs},
    xml('event', {xmlns: eventNs}, xml('items', {node},
      xml('item', {id: 'archive-id'}, message))));
}

test('MUC/Sub replay reaches decryption and retains inner identity, author, room and time', async () => {
  const state = fixture();
  const original = inner();
  await state.client.handleStanza(wrapped(original));
  assert.equal(state.decoded[0], original);
  assert.equal(state.messages.length, 1);
  assert.equal(state.messages[0].id, 'original-id');
  assert.equal(state.messages[0].roomId, 'logical-room');
  assert.equal(state.messages[0].fromFullAddress, author);
  assert.equal(state.messages[0].timestamp, acceptedAt);
});

test('MUC/Sub inside a received carbon uses the same group pipeline', async () => {
  const state = fixture();
  const carbon = xml('message', {from: `i.alice@${domain}`, to: own},
    xml('received', {xmlns: 'urn:xmpp:carbons:2'},
      xml('forwarded', {xmlns: 'urn:xmpp:forward:0'}, wrapped())));
  await state.client.handleStanza(carbon);
  assert.equal(state.messages.length, 1);
  assert.equal(state.messages[0].id, 'original-id');
});

test('rejects wrappers from users, foreign rooms, different rooms and other recipients', async () => {
  for (const stanza of [wrapped(inner(), {from: author}),
    wrapped(inner(), {from: 'g_one@conference.foreign.test'}),
    wrapped(inner({from: `g_other@conference.${domain}/bob`})),
    wrapped(inner(), {to: `i.other@${domain}`}), wrapped(inner({type: 'chat'}))]) {
    const state = fixture();
    await state.client.handleStanza(stanza);
    assert.equal(state.decoded.length, 0);
    assert.equal(state.messages.length, 0);
  }
});

test('rejects multiple items and threads registered to another room', async () => {
  const state = fixture();
  const multiple = wrapped();
  multiple.getChild('event').getChild('items').append(xml('item', {}, inner()));
  await state.client.handleStanza(multiple);
  state.client.rememberGroupRoom({roomId: 'logical-room',
    mucJid: `g_other@conference.${domain}`, memberJids: []});
  await state.client.handleStanza(wrapped());
  assert.equal(state.messages.length, 0);
});

test('a sender stamp on a direct message cannot replace its actual author', async () => {
  const state = fixture();
  await state.client.handleStanza(inner({type: 'chat', from: author}));
  assert.equal(state.messages[0].fromFullAddress, author);
});

test('subscription retractions retain the original target and author', async () => {
  const state = fixture();
  const events = [];
  state.client.onRetraction(event => events.push(event));
  state.client.rememberMessageAuthor('logical-room', 'target-id', author);
  await state.client.handleStanza(wrapped(inner({}, [
    xml('retract', {xmlns: 'urn:xmpp:message-retract:1', id: 'target-id'}),
  ])));
  assert.equal(events.length, 1);
  assert.equal(events[0].targetMessageId, 'target-id');
  assert.equal(events[0].fromFullAddress, author);
});

test('encrypted group replay works with the mobile async crypto interface', async () => {
  const {createOmemoEncryption, createInMemoryOmemoDiscoveryCache} = await import('../dist/index.mjs');
  const {x25519} = await import('@noble/curves/ed25519.js');
  const {gcm} = await import('@noble/ciphers/aes.js');
  const {hkdf} = await import('@noble/hashes/hkdf.js');
  const {sha256} = await import('@noble/hashes/sha2.js');
  const users = [
    {bare: `i.alice@${domain}`, id: 77, privateKey: new Uint8Array(32).fill(1)},
    {bare: `i.bob@${domain}`, id: 88, privateKey: new Uint8Array(32).fill(2)},
  ];
  const called = new Set();
  const crypto = {
    publicKey: async key => x25519.getPublicKey(key),
    sharedSecret: async (key, peer) => {called.add('agreement'); return x25519.getSharedSecret(key, peer);},
    hkdf: async (key, salt, info, length) => {called.add('derivation'); return hkdf(sha256, key, salt, info, length);},
    encrypt: async (key, iv, bytes) => {called.add('encrypt'); return gcm(key, iv).encrypt(bytes);},
    decrypt: async (key, iv, bytes) => {called.add('decrypt'); return gcm(key, iv).decrypt(bytes);},
  };
  const encryption = user => {
    const cache = createInMemoryOmemoDiscoveryCache();
    for (const peer of users) cache.set(user.bare, peer.bare, {fetchedAt: Date.now(),
      devices: [{deviceId: peer.id, identityKey: Buffer.from(x25519.getPublicKey(peer.privateKey)).toString('base64')}]});
    return createOmemoEncryption({crypto, discoveryCache: cache, storage: {
      getItem: () => JSON.stringify({bareJid: user.bare, omemoDeviceId: user.id,
        identityPrivateKey: Buffer.from(user.privateKey).toString('base64'),
        identityPublicKey: Buffer.from(x25519.getPublicKey(user.privateKey)).toString('base64')}),
      setItem() {}, removeItem() {},
    }});
  };
  const bob = encryption(users[1]);
  const payload = await bob.encrypt({toDeviceId: room, recipientJids: users.map(user => user.bare),
    body: 'Recovered encrypted group message', metadata: {messageType: 'CHAT_MESSAGE'}}, {
    getBareDeviceId: () => users[1].bare, getDeviceId: () => author,
    sendIq: async input => {
      const requested = input.payload.getChild('items');
      if (!requested) return xml('iq', {type: 'result'});
      const peer = users.find(user => user.bare === input.to) ?? users[1];
      const node = requested.attrs.node;
      const value = node.endsWith('devicelist')
        ? xml('list', {xmlns: 'eu.siacs.conversations.axolotl'}, xml('device', {id: String(peer.id)}))
        : xml('bundle', {}, xml('identityKey', {}, Buffer.from(x25519.getPublicKey(peer.privateKey)).toString('base64')));
      return xml('iq', {type: 'result'}, xml('pubsub', {xmlns: 'http://jabber.org/protocol/pubsub'},
        xml('items', {node}, xml('item', {id: 'current'}, value))));
    },
  });
  const original = inner();
  original.getChild('body').children = [payload.body];
  for (const child of payload.children) original.append(child);
  const received = [];
  const client = createChatClient({apiKey: '', xmppDomain: domain, userId: 'alice',
    deviceId: 'phone', password: 'unused', encryption: encryption(users[0])});
  client.onMessage(message => received.push(message));
  await client.handleStanza(wrapped(original));
  assert.equal(received[0].body, 'Recovered encrypted group message');
  assert.equal(received[0].id, 'original-id');
  assert.deepEqual(called, new Set(['agreement', 'derivation', 'encrypt', 'decrypt']));
});
