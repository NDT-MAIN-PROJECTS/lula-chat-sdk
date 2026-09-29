import assert from 'node:assert/strict';
import test from 'node:test';

import { xml } from '@xmpp/client';

import { parseChatServerEvent, XMPP_SERVER_EVENT_NS } from '../dist/index.mjs';

const domain = 'dev.lulafi.co';
const data = { type: 'calendar_canceled', eventId: '68f1000000000000000000e1', meetTitle: 'Standup' };

function encode(value) {
  return Buffer.from(JSON.stringify(value), 'utf8').toString('base64');
}

function serverEvent({ from = domain, id = 'calendar_canceled:e1:1', type = 'calendar_canceled', payload = encode(data), children = [] } = {}) {
  return xml(
    'message',
    { from, to: 'i.68f1000000000000000000bb@dev.lulafi.co', type: 'headline', ...(id ? { id } : {}) },
    xml('event', { xmlns: XMPP_SERVER_EVENT_NS, ...(type ? { type } : {}) }, payload),
    ...children,
  );
}

test('parses an event the server sent', () => {
  const event = parseChatServerEvent(serverEvent(), domain);
  assert.ok(event);
  assert.equal(event.id, 'calendar_canceled:e1:1');
  assert.equal(event.type, 'calendar_canceled');
  assert.deepEqual(event.data, data);
});

test('matches the server address regardless of case', () => {
  assert.ok(parseChatServerEvent(serverEvent({ from: 'DEV.Lulafi.co' }), domain));
});

test('rejects an event sent by an account, even on the same domain', () => {
  // A user can put this element in a message, but the server stamps it with
  // their own address, which is never the bare domain.
  assert.equal(parseChatServerEvent(serverEvent({ from: `i.68f1000000000000000000aa@${domain}` }), domain), null);
  assert.equal(parseChatServerEvent(serverEvent({ from: `${domain}/admin` }), domain), null);
});

test('rejects an event from another server', () => {
  assert.equal(parseChatServerEvent(serverEvent({ from: 'lulafi.co' }), domain), null);
});

test('rejects an event without the id consumers dedupe on', () => {
  assert.equal(parseChatServerEvent(serverEvent({ id: '' }), domain), null);
});

test('rejects an event without a type', () => {
  assert.equal(parseChatServerEvent(serverEvent({ type: '' }), domain), null);
});

test('rejects a payload that is not a JSON object', () => {
  assert.equal(parseChatServerEvent(serverEvent({ payload: 'not base64 json' }), domain), null);
  assert.equal(parseChatServerEvent(serverEvent({ payload: encode(['a']) }), domain), null);
});

test('ignores messages that carry no server event', () => {
  const chat = xml('message', { from: domain, id: 'x' }, xml('body', {}, 'hello'));
  assert.equal(parseChatServerEvent(chat, domain), null);
});

test('keeps the server timestamp of a delayed event', () => {
  const stamp = '2026-09-24T10:00:00.000Z';
  const event = parseChatServerEvent(
    serverEvent({ children: [xml('delay', { xmlns: 'urn:xmpp:delay', stamp })] }),
    domain,
  );
  assert.equal(event?.timestamp, Date.parse(stamp));
});
