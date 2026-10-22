import assert from "node:assert/strict";
import test from "node:test";
import { buildFormSubmissionMetadata, createChatClient } from "../dist/index.mjs";

const guest = { kind: "guest", guestSessionId: "cfb45ada-29e6-4e63-bf38-ec6630f713ca", identityVerification: "none" };
const context = {
  formId: "507f1f77bcf86cd799439011", providerUserId: "507f1f77bcf86cd799439012",
  recordId: "507f1f77bcf86cd799439013", formVersion: 3,
  roomId: "lf_guest_507f1f77bcf86cd799439013", submissionRoomId: "lf_guest_507f1f77bcf86cd799439013",
  providerDirectMessageRoomId: "lf_guest_507f1f77bcf86cd799439013", correlationId: "507f1f77bcf86cd799439013",
  submittedAt: "2026-10-22T08:00:00.000Z",
};
const config = {
  apiKey: "", userId: "no-reply", deviceId: "core-api-guest-submissions", xmppDomain: "xmpp.example.test",
  password: "test-only", encryption: { encrypt: () => { throw new Error("No network in packaging checks"); }, decrypt: () => null },
};

test("service accounts preserve the exact no-reply JID and ordinary app addresses retain their prefix", () => {
  const service = createChatClient({ ...config, accountJid: "no-reply@xmpp.example.test" });
  assert.equal(service.getDeviceId(), "no-reply@xmpp.example.test/core-api-guest-submissions");
  const regular = createChatClient({ ...config, userId: context.providerUserId });
  assert.equal(regular.getDeviceId(), `i.${context.providerUserId}@xmpp.example.test/core-api-guest-submissions`);
  assert.throws(() => createChatClient({ ...config, accountJid: "no-reply@foreign.test" }), /jid_invalid/);
  assert.throws(() => createChatClient({ ...config, accountJid: "no-reply@xmpp.example.test/resource" }), /jid_invalid/);
});

test("guest markers cannot retain the registered user's identity fields", () => {
  const metadata = buildFormSubmissionMetadata({ ...context, submitter: guest,
    metadata: { userPk: "registered-user", userGroups: ["private-group"], providerPk: "provider-pk" } });
  assert.equal(metadata.messageType, "FORM_SUBMISSION");
  assert.deepEqual(metadata.submitter, guest);
  assert.equal(metadata.guestSubmission, true);
  assert.equal(metadata.userPk, undefined);
  assert.equal(metadata.userGroups, null);
  assert.equal(metadata.providerPk, "provider-pk");
  assert.equal(metadata.lulaPayload.submissionRoomId, context.submissionRoomId);
  assert.equal(metadata.lulaPayload.formVersion, 3);
  assert.throws(() => buildFormSubmissionMetadata({ ...context, submitter: { ...guest, guestSessionId: " " } }), /guest_session_required/);
});

test("guest sending uses mobile's readable/raw payload and keeps attachment and retry identifiers", async () => {
  const service = createChatClient({ ...config, accountJid: "no-reply@xmpp.example.test", displayName: "Guest" });
  const payload = { readable: { fullName: { fieldId: "name", label: "Full name", value: "Ada" } }, raw: { name: "Ada" } };
  const attachments = [{ id: "encrypted-object", type: "file", metadata: { fieldId: "passport" } }];
  let captured;
  service.sendMessageInput = async (input, scope) => { captured = { input, scope }; return input.id; };
  const id = await service.sendFormSubmission({ ...context, submitter: guest, payload, attachments,
    id: "stable-submission-id", requestReceipt: false, toDeviceIds: [`i.${context.providerUserId}@xmpp.example.test`], pretty: true });
  assert.equal(id, "stable-submission-id");
  assert.equal(captured.scope, "user");
  assert.deepEqual(JSON.parse(captured.input.body), payload);
  assert.deepEqual(captured.input.attachments, attachments);
  assert.equal(captured.input.requestReceipt, false);
  assert.equal(captured.input.roomId, context.roomId);
  assert.equal(captured.input.metadata.displayName, "Guest");
  assert.equal(captured.input.metadata.lulaPayload.correlationId, context.correlationId);
});

test("registered submissions keep their existing identity metadata", () => {
  const metadata = buildFormSubmissionMetadata({ ...context, metadata: { userPk: "mobile-user", userGroups: ["members"] } });
  assert.equal(metadata.userPk, "mobile-user");
  assert.deepEqual(metadata.userGroups, ["members"]);
  assert.equal(metadata.guestSubmission, undefined);
});
