import assert from 'node:assert/strict';
import test from 'node:test';

import {
  downloadChatAttachmentWithFetch,
  uploadChatAttachmentWithFetch,
} from '../dist/index.mjs';

const plaintext = new TextEncoder().encode('connector attachment payload');
const locator = 'https://uploads.example.test/upload/transit/opaque/file.lulaenc';
const authorization =
  'LulaAttachment v1.2000000000.fixed_high_entropy_nonce.fixed_signature';

async function uploadForTest() {
  let uploadedCiphertext;
  const attachment = await uploadChatAttachmentWithFetch(
    {
      name: 'evidence.txt',
      mimeType: 'text/plain',
      data: plaintext,
    },
    {
      roomId: 'room-1',
      apiKey: 'unused',
      xmppDomain: 'example.test',
      userId: 'connector',
      deviceId: 'connector-device',
      requestSlot: async () => ({
        putUrl: `${locator}?v=slot-signature`,
        getUrl: locator,
        headers: { 'X-Slot-Header': 'slot' },
      }),
    },
    {
      fetch: async (_url, init) => {
        assert.equal(init.method, 'PUT');
        assert.equal(init.headers.Authorization, undefined);
        uploadedCiphertext = new Uint8Array(await new Response(init.body).arrayBuffer());
        return new Response(null, {
          status: 201,
          headers: {
            'X-Lula-Attachment-Capability': authorization,
            'X-Lula-Attachment-Capability-Expires': '2000000000',
          },
        });
      },
    },
  );
  return { attachment, uploadedCiphertext };
}

test('connector uploads ciphertext and downloads/decrypts with an authorization capability', async () => {
  const { attachment, uploadedCiphertext } = await uploadForTest();
  assert.notDeepEqual(uploadedCiphertext, plaintext);
  assert.equal(attachment.url, locator);
  assert.equal(attachment.downloadCapability.authorization, authorization);
  assert.equal(new URL(attachment.url).search, '');

  const downloaded = await downloadChatAttachmentWithFetch(attachment, {
    fetch: async (url, init) => {
      assert.equal(url, locator);
      assert.equal(init.headers.Authorization, authorization);
      return new Response(uploadedCiphertext, { status: 200 });
    },
  });
  assert.deepEqual(downloaded, plaintext);
});

test('tampered ciphertext is rejected before plaintext is returned', async () => {
  const { attachment, uploadedCiphertext } = await uploadForTest();
  uploadedCiphertext[0] ^= 0xff;
  await assert.rejects(
    downloadChatAttachmentWithFetch(attachment, {
      fetch: async () => new Response(uploadedCiphertext, { status: 200 }),
    }),
    /chat_attachment_ciphertext_hash_mismatch/,
  );
});

test('locator-only downloads are denied for new clients', async () => {
  await assert.rejects(
    downloadChatAttachmentWithFetch({ id: locator, type: 'file', url: locator }),
    /chat_attachment_download_capability_required/,
  );
});

test('uploads fail closed when the bridge omits its download capability', async () => {
  await assert.rejects(
    uploadChatAttachmentWithFetch(
      { name: 'evidence.txt', mimeType: 'text/plain', data: plaintext },
      {
        roomId: 'room-1',
        apiKey: 'unused',
        xmppDomain: 'example.test',
        userId: 'connector',
        deviceId: 'connector-device',
        requestSlot: async () => ({
          putUrl: `${locator}?v=slot-signature`,
          getUrl: locator,
          headers: {},
        }),
      },
      { fetch: async () => new Response(null, { status: 201 }) },
    ),
    /chat_attachment_download_capability_invalid/,
  );
});
