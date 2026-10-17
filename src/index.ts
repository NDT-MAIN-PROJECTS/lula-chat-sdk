import { getMessageEditError, type ChatMessageEditTarget } from "./message-edit.js";
export { CHAT_MESSAGE_EDIT_WINDOW_MS, getMessageEditError, isMessageEditWithinWindow } from "./message-edit.js";
export type { ChatMessageEditTarget, ChatMessageEditError } from "./message-edit.js";

import { gcm } from "@noble/ciphers/aes.js";
import { x25519 } from "@noble/curves/ed25519.js";
import { hkdf } from "@noble/hashes/hkdf.js";
import { sha256 } from "@noble/hashes/sha2.js";
import { randomBytes as nobleRandomBytes, utf8ToBytes } from "@noble/hashes/utils.js";
import { client as createXmppClient, xml } from "@xmpp/client";
import { customAlphabet } from "nanoid/non-secure";
import saslMechanisms from "saslmechanisms";
import {
  createStoredOmemoDiscoveryCache,
  createOmemoDiscoveryReader,
  type OmemoDiscoveryCacheStore,
  type OmemoDiscoverySnapshot,
} from "./omemoDiscoveryCache.js";
export { createInMemoryOmemoDiscoveryCache } from "./omemoDiscoveryCache.js";
export type { OmemoDiscoveryCacheStore, OmemoDiscoverySnapshot } from "./omemoDiscoveryCache.js";

export type Unsubscribe = () => void;

export type ChatStatus =
  | "idle"
  | "connecting"
  | "online"
  | "offline"
  | "stopping"
  | "error";

export type ChatDeliveryStatus = "delivered" | "read";

export type ChatDeliveryReceiptMode = "automatic" | "manual";

export type ChatServerAcknowledgementEvent = {
  /** The stable XMPP stanza id supplied by the sending client. */
  id: string;
  /** Logical chat room carried in the message thread, when present. */
  roomId?: string;
  /** XMPP target acknowledged as handled by the server. */
  toDeviceId?: DeviceId;
  acknowledgedAt: number;
  raw?: unknown;
};

export type ChatServerSendFailureEvent = {
  /** The stable XMPP stanza id supplied by the sending client. */
  id: string;
  roomId?: string;
  toDeviceId?: DeviceId;
  failedAt: number;
  raw?: unknown;
};

export type ChatStreamManagementEvent = {
  state: "enabled" | "resumed" | "failed";
  resumable: boolean;
};

export type DeviceId = string;

export type ChatTargetScope = "user" | "resource";

type ChatMessageType =
  | "CHAT_MESSAGE"
  | "FORM_SUBMISSION"
  | "CONVERSATION_STATE"
  | "EMERGENCY"
  | "VOICE_MESSAGE";

export const CHAT_CONVERSATION_STATE_MESSAGE_TYPE = "CONVERSATION_STATE" as const;
export const CHAT_EMERGENCY_MESSAGE_TYPE = "EMERGENCY" as const;
export const CHAT_EMERGENCY_TYPE_SOS = "sos" as const;
export const CHAT_VOICE_MESSAGE_TYPE = "VOICE_MESSAGE" as const;

export type ChatConversationState = "open" | "closed";

export type ChatConversationType = "form_submission";

export const CHAT_REACTION_INTERACTION_TYPE = "CHAT_REACTION" as const;
export const CHAT_REACTION_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🙏"] as const;

export type ChatReactionEmoji = string;

const CHAT_REACTION_MAX_CODE_POINTS = 16;
const CHAT_REACTION_EMOJI_PATTERN = /[\u2600-\u27BF\u{1F1E6}-\u{1FAFF}]/u;
const CHAT_REACTION_EMOJI_SEQUENCE_PATTERN =
  /^[\u200D\uFE0F\u2600-\u27BF\u{1F1E6}-\u{1FAFF}]+$/u;

export type ChatReplyReference = {
  messageId: string;
  body: string;
  senderId?: string;
  senderDisplayName?: string;
};

export type ChatReactionEvent = {
  targetMessageId: string;
  emoji: ChatReactionEmoji;
  actorId: string;
  removed: boolean;
};

export type ChatRetractionEvent = {
  id: string;
  targetMessageId: string;
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId: DeviceId;
  roomId: string;
  timestamp: number;
  raw?: unknown;
};

/**
 * Applies the XEP-0424 author rule for direct chat messages.
 */
export function isRetractionAuthorized(
  event: Pick<ChatRetractionEvent, "fromFullAddress" | "fromDeviceId">,
  originalAuthorAddress?: string | null,
): boolean {
  const retractionAuthor = normalizeBareDeviceId(
    event.fromFullAddress || event.fromDeviceId,
  ).toLowerCase();
  const originalAuthor = normalizeBareDeviceId(originalAuthorAddress).toLowerCase();
  return Boolean(retractionAuthor && originalAuthor && retractionAuthor === originalAuthor);
}

export type ChatMessageAuthorResolverInput = {
  roomId: string;
  messageId: string;
};

/**
 * Resolves the original sender JID from a consumer's persistent message store.
 * The SDK uses this when the target message is not in its bounded runtime cache.
 */
export type ChatMessageAuthorResolver = (
  input: ChatMessageAuthorResolverInput,
) => Promise<string | null | undefined> | string | null | undefined;

export type ChatMessageMetadata = Record<string, unknown> & {
  messageType:
    | "CHAT_MESSAGE"
    | "FORM_SUBMISSION"
    | typeof CHAT_CONVERSATION_STATE_MESSAGE_TYPE
    | typeof CHAT_EMERGENCY_MESSAGE_TYPE
    | typeof CHAT_VOICE_MESSAGE_TYPE;
  canonicalEventId?: string;
  /** XEP-0359 id assigned by the originating client and preserved across retries. */
  originId?: string;
  replyTo?: ChatReplyReference;
  chatInteractionType?: typeof CHAT_REACTION_INTERACTION_TYPE;
  reactionToId?: string;
  reactionEmoji?: ChatReactionEmoji;
  reactionActorId?: string;
  reactionRemoved?: boolean;
  emergencyType?: typeof CHAT_EMERGENCY_TYPE_SOS;
  emergencyAlertId?: string;
  emergencyTriggeredAt?: string;
  voiceMessage?: boolean;
  voiceDurationMs?: number;
};

export type ChatLogLevel = "silent" | "error" | "warn" | "info" | "debug";

export type ChatLogger = {
  debug?: (message: string, data?: Record<string, unknown>) => void;
  info?: (message: string, data?: Record<string, unknown>) => void;
  warn?: (message: string, data?: Record<string, unknown>) => void;
  error?: (message: string, data?: Record<string, unknown>) => void;
};

export type ChatRoomLookupInput = {
  userId: string;
  metadata?: Record<string, unknown>;
};

export type ChatRoom = {
  id?: string;
  roomId: string;
  peerDeviceIds?: DeviceId[];
  ownDeviceIds?: DeviceId[];
  raw?: unknown;
};

/**
 * A native XEP-0045 room. `memberJids` is the current authoritative membership
 * snapshot used to build the XEP-0384 OMEMO recipient set.
 */
export type ChatGroupRoom = {
  roomId: string;
  mucJid: string;
  memberJids: DeviceId[];
  nickname?: string;
};

export type ChatGroupInvitationEvent = {
  /** Bare MUC JID supplied by an XEP-0249 or XEP-0045 invitation. */
  mucJid: string;
  fromJid?: string;
  reason?: string;
  password?: string;
  raw?: unknown;
};

export type ChatRoomDirectoryOptions = {
  currentUserId?: string;
  xmppDomain?: string;
  getOrCreateRoom?: (input: ChatRoomLookupInput) => Promise<unknown> | unknown;
  getRoom?: (roomId: string) => Promise<unknown> | unknown;
};

export type ChatRoomDirectory = {
  getPeerDeviceIds: (roomId: string) => Promise<DeviceId[]> | DeviceId[];
  getOrCreateRoom?: (input: ChatRoomLookupInput) => Promise<ChatRoom> | ChatRoom;
};

export type ChatKeyValueStore = {
  getItem: (key: string) => Promise<string | null | undefined> | string | null | undefined;
  setItem: (key: string, value: string) => Promise<void> | void;
  removeItem?: (key: string) => Promise<void> | void;
};

export type IndexDbStorageOptions = {
  dbName?: string;
  storeName?: string;
};

export type MongoDbStorageDocument = Record<string, unknown>;

export type MongoDbStorageCollection = {
  findOne: (
    filter: Record<string, unknown>,
  ) => Promise<MongoDbStorageDocument | null> | MongoDbStorageDocument | null;
  updateOne: (
    filter: Record<string, unknown>,
    update: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => Promise<unknown> | unknown;
  deleteOne: (filter: Record<string, unknown>) => Promise<unknown> | unknown;
};

export type MongoDbStorageOptions = {
  collection: MongoDbStorageCollection;
  keyField?: string;
  valueField?: string;
  updatedAtField?: string;
};

export type ChatAttachment = {
  id: string;
  type: "image" | "file";
  name?: string;
  mimeType?: string;
  size?: number;
  url?: string;
  thumbnailUrl?: string;
  localUri?: string;
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>;
  /**
   * Per-file content-encryption material. This object is carried only inside
   * the OMEMO-protected message payload; object storage receives ciphertext.
   */
  encryption?: ChatAttachmentEncryption;
  /**
   * Read authority for the opaque object locator. The authorization value is
   * deliberately separate from `url` so it is never copied into query strings,
   * access logs, analytics, or link previews. Like the AES key, this object is
   * only safe because the attachment manifest is carried inside OMEMO.
   */
  downloadCapability?: ChatAttachmentDownloadCapability;
};

export type ChatAttachmentDownloadCapability = {
  v: 1;
  scheme: "LulaAttachment";
  authorization: string;
  expiresAt: string;
};

export const CHAT_ATTACHMENT_CAPABILITY_HEADER =
  "x-lula-attachment-capability" as const;
export const CHAT_ATTACHMENT_CAPABILITY_EXPIRES_HEADER =
  "x-lula-attachment-capability-expires" as const;

export type ChatAttachmentEncryption = {
  v: 1;
  alg: "A256GCM";
  keyB64: string;
  ivB64: string;
  plaintextSha256B64: string;
  ciphertextSha256B64: string;
  plaintextSize: number;
  ciphertextSize: number;
};

export type ChatAttachmentEncryptionResult = {
  ciphertext: Uint8Array;
  encryption: ChatAttachmentEncryption;
};

const CHAT_ATTACHMENT_ENCRYPTION_AAD = utf8ToBytes("urn:lula:defy:attachment:1");

export function encryptChatAttachmentBytes(
  input: ArrayBuffer | Uint8Array,
): ChatAttachmentEncryptionResult {
  const plaintext =
    input instanceof Uint8Array ? new Uint8Array(input) : new Uint8Array(input);
  const key = nobleRandomBytes(32);
  const iv = nobleRandomBytes(12);
  const ciphertext = gcm(key, iv, CHAT_ATTACHMENT_ENCRYPTION_AAD).encrypt(plaintext);
  return {
    ciphertext,
    encryption: {
      v: 1,
      alg: "A256GCM",
      keyB64: bytesToBase64(key),
      ivB64: bytesToBase64(iv),
      plaintextSha256B64: bytesToBase64(sha256(plaintext)),
      ciphertextSha256B64: bytesToBase64(sha256(ciphertext)),
      plaintextSize: plaintext.length,
      ciphertextSize: ciphertext.length,
    },
  };
}

export function decryptChatAttachmentBytes(
  input: ArrayBuffer | Uint8Array,
  encryption: ChatAttachmentEncryption,
): Uint8Array {
  const ciphertext =
    input instanceof Uint8Array ? new Uint8Array(input) : new Uint8Array(input);
  const normalized = normalizeAttachmentEncryption(encryption);
  if (!normalized) throw new Error("chat_attachment_encryption_invalid");
  if (ciphertext.length !== normalized.ciphertextSize) {
    throw new Error("chat_attachment_ciphertext_size_mismatch");
  }
  if (bytesToBase64(sha256(ciphertext)) !== normalized.ciphertextSha256B64) {
    throw new Error("chat_attachment_ciphertext_hash_mismatch");
  }
  let plaintext: Uint8Array;
  try {
    plaintext = gcm(
      base64ToBytes(normalized.keyB64),
      base64ToBytes(normalized.ivB64),
      CHAT_ATTACHMENT_ENCRYPTION_AAD,
    ).decrypt(ciphertext);
  } catch {
    throw new Error("chat_attachment_decryption_failed");
  }
  if (plaintext.length !== normalized.plaintextSize) {
    throw new Error("chat_attachment_plaintext_size_mismatch");
  }
  if (bytesToBase64(sha256(plaintext)) !== normalized.plaintextSha256B64) {
    throw new Error("chat_attachment_plaintext_hash_mismatch");
  }
  return plaintext;
}

export function isEncryptedChatAttachment(
  attachment: Pick<ChatAttachment, "encryption">,
): boolean {
  return Boolean(normalizeAttachmentEncryption(attachment.encryption));
}

export function hasChatAttachmentDownloadCapability(
  attachment: Pick<ChatAttachment, "downloadCapability">,
): boolean {
  return Boolean(
    normalizeAttachmentDownloadCapability(attachment.downloadCapability),
  );
}

export type ChatAttachmentUpload = {
  uri?: string;
  name?: string;
  mimeType?: string;
  size?: number;
  data?: ArrayBuffer | Uint8Array;
  metadata?: Record<string, unknown>;
  raw?: unknown;
};

export type ChatAttachmentUploadSlotRequest = {
  name: string;
  mimeType: string;
  size: number;
};

export type ChatAttachmentUploadSlot = {
  putUrl: string;
  getUrl: string;
  headers: Record<string, string>;
};

export type ChatAttachmentUploadContext = {
  roomId: string;
  apiKey: string;
  xmppDomain: string;
  userId: string;
  deviceId: DeviceId;
  requestSlot: (
    input: ChatAttachmentUploadSlotRequest,
  ) => Promise<ChatAttachmentUploadSlot>;
  logger?: ChatLogger;
};

export type ChatAttachmentResolveContext = {
  apiKey: string;
  xmppDomain: string;
  userId: string;
  deviceId: DeviceId;
  logger?: ChatLogger;
};

export type ChatAttachmentService = {
  upload: (
    input: ChatAttachmentUpload,
    context: ChatAttachmentUploadContext,
  ) => Promise<ChatAttachment> | ChatAttachment;
  resolve?: (
    attachment: ChatAttachment,
    context: ChatAttachmentResolveContext,
  ) => Promise<string | null | undefined> | string | null | undefined;
};

export type ChatAttachmentFetch = (
  input: string | URL | Request,
  init?: RequestInit,
) => Promise<Response>;

export type ChatAttachmentFetchUploadOptions = {
  fetch?: ChatAttachmentFetch;
  loadBytes?: (
    input: ChatAttachmentUpload,
  ) => Promise<ArrayBuffer | Uint8Array> | ArrayBuffer | Uint8Array;
};

export type ChatAttachmentFetchDownloadOptions = {
  fetch?: ChatAttachmentFetch;
};

function readAttachmentResponseHeader(
  headers: Headers | Record<string, string | string[] | undefined>,
  name: string,
): string | undefined {
  if (typeof (headers as Headers).get === "function") {
    return (headers as Headers).get(name)?.trim() || undefined;
  }
  const expected = name.toLowerCase();
  for (const [headerName, rawValue] of Object.entries(headers)) {
    if (headerName.toLowerCase() !== expected) continue;
    const value = Array.isArray(rawValue) ? rawValue[0] : rawValue;
    return value?.trim() || undefined;
  }
  return undefined;
}

/** Parse the one-time upload response without ever placing its secret in a URL. */
export function chatAttachmentDownloadCapabilityFromHeaders(
  headers: Headers | Record<string, string | string[] | undefined>,
): ChatAttachmentDownloadCapability {
  const authorization = readAttachmentResponseHeader(
    headers,
    CHAT_ATTACHMENT_CAPABILITY_HEADER,
  );
  const expiresRaw = readAttachmentResponseHeader(
    headers,
    CHAT_ATTACHMENT_CAPABILITY_EXPIRES_HEADER,
  );
  const expiresEpochSeconds = Number.parseInt(expiresRaw ?? "", 10);
  if (
    !authorization ||
    !/^LulaAttachment\s+v1\.[A-Za-z0-9._-]+$/.test(authorization) ||
    !Number.isSafeInteger(expiresEpochSeconds) ||
    expiresEpochSeconds <= 0
  ) {
    throw new Error("chat_attachment_download_capability_invalid");
  }
  return {
    v: 1,
    scheme: "LulaAttachment",
    authorization,
    expiresAt: new Date(expiresEpochSeconds * 1000).toISOString(),
  };
}

export function buildChatAttachmentDownloadRequest(
  attachment: ChatAttachment,
): { url: string; headers: Record<string, string> } {
  const url = firstString(attachment.url, attachment.id);
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error("chat_attachment_download_locator_invalid");
  }
  const capability = normalizeAttachmentDownloadCapability(
    attachment.downloadCapability,
  );
  if (!capability) {
    throw new Error("chat_attachment_download_capability_required");
  }
  if (Date.parse(capability.expiresAt) <= Date.now()) {
    throw new Error("chat_attachment_download_capability_expired");
  }
  return {
    url,
    headers: { Authorization: capability.authorization },
  };
}

function requiredAttachmentFetch(fetchOverride?: ChatAttachmentFetch): ChatAttachmentFetch {
  const fetchImpl = fetchOverride ?? globalThis.fetch;
  if (typeof fetchImpl !== "function") {
    throw new Error("chat_attachment_fetch_unavailable");
  }
  return fetchImpl.bind(globalThis) as ChatAttachmentFetch;
}

function stableChatAttachmentLocator(sourceUrl: string): string {
  try {
    const parsed = new URL(sourceUrl);
    for (const key of [
      "v",
      "v2",
      "token",
      "size",
      "content_type",
      "expires",
      "slot",
      "username",
    ]) {
      parsed.searchParams.delete(key);
    }
    parsed.hash = "";
    return parsed.toString();
  } catch {
    return sourceUrl;
  }
}

/**
 * Reference connector implementation: encrypt locally, request an XEP-0363
 * slot through the SDK, PUT ciphertext, and return the OMEMO-safe manifest.
 */
export async function uploadChatAttachmentWithFetch(
  input: ChatAttachmentUpload,
  context: ChatAttachmentUploadContext,
  options: ChatAttachmentFetchUploadOptions = {},
): Promise<ChatAttachment> {
  const bytes = input.data ?? (await options.loadBytes?.(input));
  if (!(bytes instanceof ArrayBuffer) && !(bytes instanceof Uint8Array)) {
    throw new Error("chat_attachment_bytes_required");
  }
  const name = firstString(input.name) ?? `attachment-${Date.now()}.bin`;
  const mimeType = firstString(input.mimeType) ?? "application/octet-stream";
  const encrypted = encryptChatAttachmentBytes(bytes);
  const encryptedName = `${name.replace(/[^\w.-]/g, "_").slice(-96) || "attachment"}.lulaenc`;
  const slot = await context.requestSlot({
    name: encryptedName,
    mimeType: "application/octet-stream",
    size: encrypted.encryption.ciphertextSize,
  });
  const response = await requiredAttachmentFetch(options.fetch)(slot.putUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/octet-stream",
      ...slot.headers,
    },
    body: encrypted.ciphertext as BodyInit,
  });
  if (!response.ok) {
    throw new Error(`chat_attachment_upload_failed:${response.status}`);
  }
  const downloadCapability = chatAttachmentDownloadCapabilityFromHeaders(
    response.headers,
  );
  const stableLocator = stableChatAttachmentLocator(slot.getUrl.trim());
  if (!/^https?:\/\//i.test(stableLocator)) {
    throw new Error("chat_attachment_download_locator_invalid");
  }
  return normalizeRequiredAttachment({
    id: stableLocator,
    type: mimeType.startsWith("image/") ? "image" : "file",
    name,
    mimeType,
    size: encrypted.encryption.plaintextSize,
    url: stableLocator,
    metadata: input.metadata,
    encryption: encrypted.encryption,
    downloadCapability,
  });
}

/** Reference connector download path for capability-protected attachments. */
export async function downloadChatAttachmentWithFetch(
  attachment: ChatAttachment,
  options: ChatAttachmentFetchDownloadOptions = {},
): Promise<Uint8Array> {
  const request = buildChatAttachmentDownloadRequest(attachment);
  const response = await requiredAttachmentFetch(options.fetch)(request.url, {
    method: "GET",
    headers: request.headers,
  });
  if (!response.ok) {
    throw new Error(`chat_attachment_download_failed:${response.status}`);
  }
  const downloaded = new Uint8Array(await response.arrayBuffer());
  return attachment.encryption
    ? decryptChatAttachmentBytes(downloaded, attachment.encryption)
    : downloaded;
}

/**
 * Single source for how a voice message is recorded. Apps take their recorder
 * settings from the two helpers below rather than hardcoding these values, so
 * changing the encoding is an edit here instead of one per app.
 *
 * Only `mimeType`/`extension` decide whether a note is playable on another
 * platform; the rest are consistency and payload size.
 */
export const CHAT_VOICE_SPEC = {
  /** AAC-LC in MP4, the container every platform can play. */
  mimeType: "audio/mp4",
  /** The same container with the codec spelled out, as `MediaRecorder` wants it. */
  codecMimeType: "audio/mp4;codecs=mp4a.40.2",
  extension: "m4a",
  sampleRate: 44100,
  channels: 1,
  bitsPerSecond: 128000,
  /** Shorter than this is a mis-click, not a message. */
  minDurationMs: 700,
} as const;

export type ChatVoiceRecorderWebOptions = {
  /**
   * `getUserMedia` constraints. Sample rate is absent on purpose: Chromium
   * ignores it here and returns the device rate, so resample through an
   * `AudioContext` pinned to `CHAT_VOICE_SPEC.sampleRate` and record that.
   */
  constraints: { audio: { channelCount: number } };
  /** Options for the `MediaRecorder` constructor. */
  recorder: { mimeType: string; audioBitsPerSecond: number };
};

/** Recorder settings for a browser or an Electron renderer. */
export function getChatVoiceRecorderWebOptions(): ChatVoiceRecorderWebOptions {
  return {
    constraints: { audio: { channelCount: CHAT_VOICE_SPEC.channels } },
    recorder: {
      mimeType: CHAT_VOICE_SPEC.codecMimeType,
      audioBitsPerSecond: CHAT_VOICE_SPEC.bitsPerSecond,
    },
  };
}

/**
 * Structurally an `expo-audio` `RecordingOptions`, spelled out here so the SDK
 * keeps no React Native dependency. Cast it if your expo-audio version types the
 * iOS fields as enums.
 */
export type ChatVoiceRecorderExpoOptions = {
  extension: string;
  sampleRate: number;
  numberOfChannels: number;
  bitRate: number;
  android: { outputFormat: string; audioEncoder: string };
  ios: {
    outputFormat: string;
    audioQuality: number;
    linearPCMBitDepth: number;
    linearPCMIsBigEndian: boolean;
    linearPCMIsFloat: boolean;
  };
};

/**
 * Recorder settings for React Native: expo-audio's `RecordingPresets.HIGH_QUALITY`
 * with the channel count pinned to mono. Pass this rather than the preset, which
 * is expo's constant and can change under an `expo-audio` upgrade.
 */
export function getChatVoiceRecorderExpoOptions(): ChatVoiceRecorderExpoOptions {
  return {
    extension: `.${CHAT_VOICE_SPEC.extension}`,
    sampleRate: CHAT_VOICE_SPEC.sampleRate,
    numberOfChannels: CHAT_VOICE_SPEC.channels,
    bitRate: CHAT_VOICE_SPEC.bitsPerSecond,
    android: { outputFormat: "mpeg4", audioEncoder: "aac" },
    ios: {
      // `IOSOutputFormat.MPEG4AAC` — a FourCC, trailing space included.
      outputFormat: "aac ",
      // `AudioQuality.MAX`.
      audioQuality: 0x7f,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
  };
}

const CHAT_AUDIO_EXTENSION_PATTERN = /\.(aac|caf|m4a|mp3|ogg|opus|wav|webm)$/i;

/**
 * Whether an attachment should render as a player. The file name is the fallback
 * for a peer that uploaded without a content type. Wider than `CHAT_VOICE_SPEC`
 * on purpose: it also covers audio a user attached rather than recorded.
 */
export function isChatAudioAttachment(attachment: {
  mimeType?: string;
  name?: string;
}): boolean {
  if (attachment.mimeType?.trim().toLowerCase().startsWith("audio/")) {
    return true;
  }
  return CHAT_AUDIO_EXTENSION_PATTERN.test(String(attachment.name ?? ""));
}

/**
 * The recorded length carried on a voice message, so a player can show a
 * duration before the audio loads. Undefined unless the metadata marks the
 * message as a voice note — either marker alone is enough, since a peer on an
 * older build may send only one.
 */
export function getChatVoiceDurationMs(
  metadata?: Record<string, unknown>,
): number | undefined {
  if (!metadata) {
    return undefined;
  }
  if (metadata.voiceMessage !== true && metadata.messageType !== CHAT_VOICE_MESSAGE_TYPE) {
    return undefined;
  }
  const value = metadata.voiceDurationMs;
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : undefined;
}

/** Drop any codec parameter: `audio/mp4;codecs=mp4a.40.2` is `audio/mp4` on the wire. */
function normalizeVoiceMimeType(value?: string): string {
  return (value ?? "").split(";")[0].trim().toLowerCase();
}

/** Voice notes always end in the spec's extension — `isChatAudioAttachment` reads it. */
function normalizeVoiceAttachmentName(name?: string): string {
  const suffix = `.${CHAT_VOICE_SPEC.extension}`;
  const trimmed = name?.trim();
  if (trimmed && trimmed.toLowerCase().endsWith(suffix)) {
    return trimmed;
  }
  const base = trimmed?.replace(/\.[^./\\]+$/, "").trim();
  return `${base || `voice-${Date.now()}`}${suffix}`;
}

export type ChatClientBaseConfig = {
  /** API key for app access to the chat service. */
  apiKey: string;

  /** WebSocket path on the chat domain, or a full ws(s) URL. Defaults to "/chat/websocket". */
  xmppWebSocketPath?: string;

  /** Chat service domain, for example "api.dev.lulafi.co". */
  xmppDomain: string;

  /** XMPP upload service JID. Defaults to "upload.<xmppDomain>". */
  xmppUploadService?: string;

  /** Current app user id. The SDK uses it to derive the transport address. */
  userId: string;

  /** Current device id token, for example "d0eb68ad2ff10ee7". */
  deviceId: DeviceId;

  /** Display name written to outgoing message metadata. */
  displayName?: string;

  /** Reconnect after transient connection loss. */
  autoReconnect?: boolean;

  /**
   * Controls when XEP-0184 delivery receipts are sent for incoming messages.
   * "automatic" preserves the legacy receive-time acknowledgement. "manual"
   * requires a consumer to call acknowledgeDelivered() after durable storage.
   */
  deliveryReceiptMode?: ChatDeliveryReceiptMode;

  /**
   * Fail connection readiness when XEP-0280 message carbons cannot be enabled.
   * Durable multi-device clients should enable this to avoid partial histories.
   */
  requireMessageCarbons?: boolean;

  /**
   * Fail connection readiness unless XEP-0198 stream management was
   * negotiated. Enable this for clients that use server acknowledgement as
   * their durable-outbox acceptance boundary.
   */
  requireStreamManagement?: boolean;

  /**
   * Keep message send promises pending until ejabberd acknowledges every
   * successfully written target stanza through XEP-0198. This is a
   * server-acceptance acknowledgement, not an end-to-end delivery receipt.
   */
  awaitServerAcknowledgement?: boolean;

  /** Connection timeout in milliseconds. Defaults to 15000. */
  connectTimeoutMs?: number;

  /** Room lookup provider used to resolve peer transport addresses. */
  roomDirectory?: ChatRoomDirectory;

  /** Fallback resolver for older room-routing call sites. Prefer roomDirectory. */
  resolveRoomDeviceIds?: (roomId: string) => Promise<DeviceId[]> | DeviceId[];

  /**
   * Persistent author lookup used to validate XEP-0424 retractions after a
   * restart or when archive events arrive out of order. Unknown authors fail
   * closed and no authoritative retraction event is emitted.
   */
  resolveMessageAuthor?: ChatMessageAuthorResolver;
  /** Persistent original-message lookup for edit validation after a restart. */
  resolveMessageForEdit?: (input: ChatMessageAuthorResolverInput) =>
    Promise<ChatMessageEditTarget | null | undefined> | ChatMessageEditTarget | null | undefined;

  /** Optional logger for connection, encryption, and stanza errors. */
  logger?: ChatLogger;

  /** Logger verbosity. Defaults to "error" when a logger is provided. */
  logLevel?: ChatLogLevel;

  /** Message encryption adapter. Pass createOmemoEncryption(...) for built-in OMEMO. */
  encryption: ChatEncryption;

  /**
   * Reject outbound and inbound user-message payloads when the encryption
   * adapter cannot produce or decode an encrypted envelope. Production OMEMO
   * clients should enable this so metadata and attachment keys never fall
   * back to the plain Lula extension.
   */
  requireEncryptedPayloads?: boolean;

  /** Attachment upload and resolve adapter for file and image messages. */
  attachmentService?: ChatAttachmentService;

  /** Reject outgoing attachment manifests without client-side encryption. */
  requireEncryptedAttachments?: boolean;
};

export type ChatPasswordAuthConfig = ChatClientBaseConfig & {
  /** Password auth is the default when authType is omitted. */
  authType?: "password";

  /** Password for password auth. Required for the default auth mode. */
  password: string;

  /** Access tokens are only valid with authType "x-oauth2". */
  accessToken?: never;
};

export type ChatXOAuth2Config = ChatClientBaseConfig & {
  /** Use X-OAUTH2 auth with an access token. */
  authType: "x-oauth2";

  /** Access token for X-OAUTH2 auth. Required when authType is "x-oauth2". */
  accessToken: string;

  /** Passwords are only valid with password auth. */
  password?: never;
};

export type ChatClientConfig = ChatPasswordAuthConfig | ChatXOAuth2Config;

export type ChatMessage = {
  id: string;
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId: DeviceId;
  roomId: string;
  body: string;
  /** Server acceptance time in Unix epoch milliseconds. Use for display and ordering. */
  timestamp: number;
  metadata: ChatMessageMetadata;
  attachments?: ChatAttachment[];
  raw?: unknown;
};

export type ChatIncomingDeliveryContext = {
  /** Whether this stanza requested an XEP-0184 delivery receipt. */
  receiptRequested: boolean;
  /**
   * Idempotently acknowledges that the host client durably accepted the
   * message. In manual mode this is the only operation that sends <received/>.
   */
  acknowledgeDelivered: () => Promise<void>;
};

export type ChatMessageListener = (
  message: ChatMessage,
  delivery: ChatIncomingDeliveryContext,
) => void;

export type ChatMessageContext = {
  providerDirectMessageRoomId?: string;
  submissionRoomId?: string;
  correlationId?: string;
  senderName?: string;
  displayName?: string;
  [key: string]: unknown;
};

export type ChatMessageInput = {
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
  body: string;
  attachments?: ChatAttachment[];
  roomId?: string;
  targetRoomId?: string;
  /** Typed chat APIs default to bare user JIDs. Use resource only for device control traffic. */
  targetScope?: ChatTargetScope;
  /** Any additional metadata for the text message. */
  metadata?: Record<string, unknown>;
  id?: string;
  requestReceipt?: boolean;
};

export type ChatTextMessageInput = Omit<ChatMessageInput, "metadata"> & {
  /** Any additional metadata for the text message. */
  metadata?: Record<string, unknown>;
  context?: ChatMessageContext;
};

export type ChatEditMessageInput = ChatTextMessageInput & {
  roomId: string;
  targetMessageId: string;
  /** Only for replay of a stable edit ID already acknowledged by the server.
   * Persist the acknowledgement locally; never obtain this from wire metadata. */
  serverAcceptedAt?: number;
};

export type ChatReplyMessageInput = ChatTextMessageInput & {
  replyTo: ChatReplyReference;
};

export type ChatEmergencyMessageInput = Omit<ChatTextMessageInput, "metadata"> & {
  alertId: string;
  emergencyType?: typeof CHAT_EMERGENCY_TYPE_SOS;
  triggeredAt?: string;
  metadata?: Record<string, unknown>;
};

export type ChatReactionMessageInput = Omit<ChatTextMessageInput, "body"> & {
  targetMessageId: string;
  emoji: ChatReactionEmoji;
  actorId?: string;
};

export type ChatRetractionInput = Omit<
  ChatMessageInput,
  "attachments" | "body" | "metadata" | "requestReceipt"
> & {
  messageId: string;
};

export type ChatReactionSummary = {
  emoji: ChatReactionEmoji;
  count: number;
  actorIds: string[];
  reactedByCurrentUser: boolean;
};

export type ChatInteractiveMessage = ChatMessage & {
  interactionId: string;
  reactions: ChatReactionSummary[];
  replyTo?: ChatReplyReference;
};

export type ChatInteractionMessageLike = {
  id?: string;
  metadata?: Record<string, unknown>;
  senderId?: string;
  fromUserId?: string;
};

export function normalizeInteractionActorId(value?: string | null): string {
  const normalized = (String(value ?? "").trim().split("/")[0] ?? "").toLowerCase();
  if (!normalized) return "";
  const localpart = normalized.split("@")[0] ?? normalized;
  const appUserMatch = /^i\.([^.]+)(?:\.d\..+)?$/.exec(localpart);
  return appUserMatch?.[1] ?? normalized;
}

export function isChatReactionEmoji(value: unknown): value is ChatReactionEmoji {
  if (typeof value !== "string") return false;
  const normalized = value.trim();
  return (
    normalized.length > 0 &&
    !/\s/u.test(normalized) &&
    Array.from(normalized).length <= CHAT_REACTION_MAX_CODE_POINTS &&
    CHAT_REACTION_EMOJI_PATTERN.test(normalized) &&
    CHAT_REACTION_EMOJI_SEQUENCE_PATTERN.test(normalized)
  );
}

export function getMessageInteractionId(message: ChatInteractionMessageLike): string {
  return firstString(message.metadata?.canonicalEventId, message.id) ?? "";
}

export function parseChatReplyReference(
  metadata?: Record<string, unknown>,
): ChatReplyReference | undefined {
  if (!metadata || !isRecord(metadata.replyTo)) return undefined;
  const messageId = firstString(metadata.replyTo.messageId);
  const body = firstString(metadata.replyTo.body);
  if (!messageId || !body) return undefined;
  const senderId = firstString(metadata.replyTo.senderId);
  const senderDisplayName = firstString(metadata.replyTo.senderDisplayName);
  return {
    messageId,
    body,
    ...(senderId ? { senderId } : {}),
    ...(senderDisplayName ? { senderDisplayName } : {}),
  };
}

export function parseChatReactionEvent(
  message: ChatInteractionMessageLike,
): ChatReactionEvent | undefined {
  const metadata = message.metadata;
  if (!metadata || metadata.chatInteractionType !== CHAT_REACTION_INTERACTION_TYPE) {
    return undefined;
  }
  const targetMessageId = firstString(metadata.reactionToId);
  const emoji =
    typeof metadata.reactionEmoji === "string"
      ? metadata.reactionEmoji.trim()
      : metadata.reactionEmoji;
  const actorId = normalizeInteractionActorId(
    firstString(metadata.reactionActorId, message.senderId, message.fromUserId),
  );
  if (!targetMessageId || !isChatReactionEmoji(emoji) || !actorId) return undefined;
  return {
    targetMessageId,
    emoji,
    actorId,
    removed: metadata.reactionRemoved === true,
  };
}

export function isChatReactionControlMessage(message: ChatInteractionMessageLike): boolean {
  return Boolean(parseChatReactionEvent(message));
}

export function buildChatInteractionTimeline(
  messages: ChatMessage[],
  currentActorId?: string | null,
): ChatInteractiveMessage[] {
  const reactionActorsByMessage = new Map<
    string,
    Map<ChatReactionEmoji, Set<string>>
  >();

  messages.forEach((message) => {
    const event = parseChatReactionEvent(message);
    if (!event) return;
    const reactions =
      reactionActorsByMessage.get(event.targetMessageId) ??
      new Map<ChatReactionEmoji, Set<string>>();
    const actors = reactions.get(event.emoji) ?? new Set<string>();
    if (event.removed) actors.delete(event.actorId);
    else actors.add(event.actorId);
    reactions.set(event.emoji, actors);
    reactionActorsByMessage.set(event.targetMessageId, reactions);
  });

  const normalizedCurrentActorId = normalizeInteractionActorId(currentActorId);
  const timeline: ChatInteractiveMessage[] = [];
  messages.forEach((message) => {
    if (isChatReactionControlMessage(message)) return;
    const interactionId = getMessageInteractionId(message);
    const reactionActors = reactionActorsByMessage.get(interactionId);
    const reactions: ChatReactionSummary[] = [];
    const quickEmojis = CHAT_REACTION_EMOJIS as readonly string[];
    const orderedEmojis: ChatReactionEmoji[] = [
      ...CHAT_REACTION_EMOJIS.filter((emoji) => reactionActors?.has(emoji)),
      ...Array.from(reactionActors?.keys() ?? []).filter(
        (emoji) => !quickEmojis.includes(emoji),
      ),
    ];
    orderedEmojis.forEach((emoji) => {
      const actorIds = Array.from(reactionActors?.get(emoji) ?? []);
      if (actorIds.length === 0) return;
      reactions.push({
        emoji,
        count: actorIds.length,
        actorIds,
        reactedByCurrentUser:
          Boolean(normalizedCurrentActorId) && actorIds.includes(normalizedCurrentActorId),
      });
    });
    const replyTo = parseChatReplyReference(message.metadata);
    timeline.push({
      ...message,
      interactionId,
      reactions,
      ...(replyTo ? { replyTo } : {}),
    });
  });
  return timeline;
}

export type ChatTextMessage = ChatMessage & {
  context?: ChatMessageContext;
  providerDirectMessageRoomId: string;
  submissionRoomId?: string;
  correlationId?: string;
  displayName: string;
};

export type ChatEmergencyMessage = ChatTextMessage & {
  emergencyType: typeof CHAT_EMERGENCY_TYPE_SOS;
  alertId: string;
  triggeredAt: string;
};

export type ChatAttachmentMessage = ChatMessage & {
  attachments: ChatAttachment[];
  context?: ChatMessageContext;
  /* The room ID of the provider direct message. */
  providerDirectMessageRoomId?: string;
  /** The room ID where the submission was made. */
  submissionRoomId?: string;
  /** The ID of the submission. */
  correlationId?: string;
  displayName?: string;
};

export type ChatFormSubmissionField = {
  id: string;
  label: string;
  type: string;
  required: boolean;
};

export type ChatFormSubmissionInput = Omit<ChatMessageInput, "body" | "metadata"> & {
  payload: Record<string, unknown>;
  metadata?: Record<string, unknown>;
  formId?: string;
  providerUserId?: string;
  recordId?: string;
  formVersion?: number;
  providerDirectMessageRoomId: string;
  submissionRoomId: string;
  correlationId: string;
  submittedAt?: string;
  pretty?: boolean;
};

export type ChatFormSubmissionMessage = ChatMessage & {
  answers: Record<string, string>;
  fields: ChatFormSubmissionField[];
  payload: Record<string, unknown>;
  providerDirectMessageRoomId?: string;
  submissionRoomId?: string;
  correlationId?: string;
  formId?: string;
  providerUserId?: string;
  recordId?: string;
  formVersion?: number;
  submittedAt?: string;
  displayName?: string;
};

export type ChatConversationStateInput = Omit<
  ChatMessageInput,
  "attachments" | "body" | "metadata"
> & {
  roomId: string;
  conversationType: ChatConversationType;
  state: ChatConversationState;
  conversationId?: string;
  changedAt?: string;
  metadata?: Record<string, unknown>;
};

export type ChatConversationStateEvent = {
  id: string;
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId: DeviceId;
  roomId: string;
  conversationType: ChatConversationType;
  state: ChatConversationState;
  conversationId?: string;
  changedAt: string;
  timestamp: number;
  metadata: ChatMessageMetadata;
  raw?: unknown;
};

export type ChatAttachmentMessageInput = Omit<
  ChatTextMessageInput,
  "body" | "attachments"
> & {
  attachment: ChatAttachmentUpload;
  body?: string;
};

export type ChatAttachmentsMessageInput = Omit<
  ChatTextMessageInput,
  "body" | "attachments"
> & {
  attachments: ChatAttachmentUpload[];
  body?: string;
};

/**
 * A voice note is a one-attachment message with an empty body; the metadata is
 * what makes the far end draw a player. `durationMs` is what the recorder
 * measured, so a player can show a length before the audio arrives.
 */
export type ChatVoiceMessageInput = Omit<
  ChatTextMessageInput,
  "body" | "attachments" | "metadata"
> & {
  attachment: ChatAttachmentUpload;
  durationMs: number;
  metadata?: Record<string, unknown>;
};

export type ChatTypingInput = {
  roomId: string;
  targetScope?: ChatTargetScope;
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  isTyping?: boolean;
  autoPauseMs?: number;
  id?: string;
};

export type ChatThreadGoneInput = {
  roomId: string;
  targetRoomId?: string;
  targetScope?: ChatTargetScope;
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  id?: string;
};

export type ChatDisplayedInput = {
  roomId: string;
  messageId: string;
  targetScope?: ChatTargetScope;
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  id?: string;
};

export type ChatTypingEvent = {
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId?: DeviceId;
  roomId: string;
  isTyping: boolean;
  raw?: unknown;
};

export type ChatThreadGoneEvent = {
  id: string;
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId?: DeviceId;
  roomId: string;
  timestamp: number;
  raw?: unknown;
};

/**
 * A notice the server itself sent this account, such as a scheduled meeting
 * being canceled. It rides the chat connection so an app that is already
 * connected learns about it immediately, without polling an API for it.
 *
 * Only a stanza whose sender is the bare XMPP domain becomes one of these.
 * Accounts cannot send as the domain, so no user can forge a server event.
 */
export type ChatServerEvent = {
  /** Stanza id. The server keeps it stable for one event, so it doubles as a dedupe key. */
  id: string;
  /** What happened, e.g. `calendar_canceled`. */
  type: string;
  /** The event's payload, whose shape depends on `type`. */
  data: Record<string, unknown>;
  timestamp: number;
  raw?: unknown;
};

export type ChatDeliveryEvent = {
  id: string;
  fromUserId: string;
  fromFullAddress: string;
  fromDeviceId: DeviceId;
  toDeviceId?: DeviceId;
  roomId: string;
  status: ChatDeliveryStatus;
  raw?: unknown;
};

export type ChatErrorEvent = {
  id?: string;
  fromUserId?: string;
  fromFullAddress?: string;
  fromDeviceId?: DeviceId;
  toDeviceId?: DeviceId;
  roomId?: string;
  condition?: string;
  text?: string;
  error?: unknown;
  raw?: unknown;
};

export type ChatStatusEvent = {
  status: ChatStatus;
  deviceId?: DeviceId;
  error?: unknown;
};

export type ChatAddress = {
  raw: string;
  address: DeviceId;
  userId: string;
  deviceId: DeviceId;
  localpart: string;
  domain: string;
};

export type ChatAddressInput = {
  xmppDomain: string;
  userId: string;
  deviceId: DeviceId;
};

export type ChatUserIdInput = {
  username: string;
  domain: string;
};

export type ChatDeviceIdInput = ChatUserIdInput & {
  deviceId?: DeviceId;
  deviceName?: DeviceId;
};

export type CreateDeviceIdOptions = {
  prefix?: string;
};

export type ChatEncryptInput = {
  toDeviceId: DeviceId;
  /** All bare-JID recipients for a single encrypted groupchat stanza. */
  recipientJids?: DeviceId[];
  body: string;
  metadata: ChatMessageMetadata;
  attachments?: ChatAttachment[];
};

export type ChatEncodedPayload = {
  body?: string;
  children?: XmppChild[];
};

export type ChatDecryptInput = {
  stanza: XmppElementLike;
};

export type ChatDecryptedMessage = {
  body: string;
  metadata?: Record<string, unknown>;
  attachments?: ChatAttachment[];
};

export type ChatEncryptionContext = {
  getDeviceId: () => DeviceId | undefined;
  getBareDeviceId: () => DeviceId | undefined;
  sendIq: (input: {
    type: "get" | "set";
    payload: XmppChild;
    to?: string;
    timeoutMs?: number;
  }) => Promise<XmppElementLike>;
  logger?: ChatLogger;
};

export type ChatEncryption = {
  onConnect?: (context: ChatEncryptionContext) => Promise<void> | void;
  onDisconnect?: (context: ChatEncryptionContext) => void;
  onStanza?: (stanza: XmppElementLike, context: ChatEncryptionContext) => Promise<void> | void;
  encrypt: (
    input: ChatEncryptInput,
    context: ChatEncryptionContext,
  ) => Promise<ChatEncodedPayload | XmppChild[]> | ChatEncodedPayload | XmppChild[];
  decrypt: (
    input: ChatDecryptInput,
    context: ChatEncryptionContext,
  ) => Promise<ChatDecryptedMessage | null> | ChatDecryptedMessage | null;
};

export type OmemoEncryptionOptions = {
  storage?: ChatKeyValueStore;
  stateKeyPrefix?: string;
  /** Public discovery records. Defaults to a memory cache backed by `storage`. */
  discoveryCache?: OmemoDiscoveryCacheStore;
  discoveryRefreshAfterMs?: number;
  discoveryMaxAgeMs?: number;
};

export type ChatClient = {
  connect: () => Promise<void>;
  stop: () => Promise<void>;
  joinGroupRoom: (room: ChatGroupRoom) => Promise<void>;
  leaveGroupRoom: (roomId: string) => Promise<void>;
  updateGroupRoom: (room: ChatGroupRoom) => Promise<void>;
  getOrCreateRoom: {
    (userId: string, metadata?: Record<string, unknown>): Promise<ChatRoom>;
    (input: ChatRoomLookupInput): Promise<ChatRoom>;
  };
  getPeerDeviceIds: (roomId: string) => Promise<DeviceId[]>;
  sendChatMessage: {
    (message: ChatTextMessageInput): Promise<string>;
    (
      roomId: string,
      body: string,
      options?: Omit<ChatTextMessageInput, "roomId" | "body">,
    ): Promise<string>;
  };
  editMessage: (message: ChatEditMessageInput) => Promise<string>;
  sendEmergency: (message: ChatEmergencyMessageInput) => Promise<string>;
  sendReply: (message: ChatReplyMessageInput) => Promise<string>;
  addReaction: (message: ChatReactionMessageInput) => Promise<string>;
  removeReaction: (message: ChatReactionMessageInput) => Promise<string>;
  retractMessage: (message: ChatRetractionInput) => Promise<string>;
  sendFormSubmission: (message: ChatFormSubmissionInput) => Promise<string>;
  sendConversationState: (event: ChatConversationStateInput) => Promise<string>;
  uploadAttachment: {
    (roomId: string, attachment: ChatAttachmentUpload): Promise<ChatAttachment>;
    (input: { roomId: string; attachment: ChatAttachmentUpload }): Promise<ChatAttachment>;
  };
  sendAttachment: {
    (message: ChatAttachmentMessageInput): Promise<string>;
    (
      roomId: string,
      attachment: ChatAttachmentUpload,
      options?: Omit<ChatAttachmentMessageInput, "roomId" | "attachment">,
    ): Promise<string>;
  };
  sendAttachments: {
    (message: ChatAttachmentsMessageInput): Promise<string>;
    (
      roomId: string,
      attachments: ChatAttachmentUpload[],
      options?: Omit<ChatAttachmentsMessageInput, "roomId" | "attachments">,
    ): Promise<string>;
  };
  sendVoiceMessage: (message: ChatVoiceMessageInput) => Promise<string>;
  /**
   * @deprecated Prefer sendChatMessage or sendFormSubmission for typed payloads.
   */
  sendMessage: {
    (message: ChatMessageInput): Promise<string>;
    (
      roomId: string,
      body: string,
      options?: Omit<ChatMessageInput, "roomId" | "body">,
    ): Promise<string>;
  };
  sendTyping: {
    (roomId: string, options?: Omit<ChatTypingInput, "roomId">): Promise<void>;
    (input: ChatTypingInput): Promise<void>;
  };
  sendThreadGone: {
    (roomId: string, options?: Omit<ChatThreadGoneInput, "roomId">): Promise<string>;
    (input: ChatThreadGoneInput): Promise<string>;
  };
  markRead: {
    (roomId: string, messageId: string, options?: Omit<ChatDisplayedInput, "roomId" | "messageId">): Promise<void>;
    (input: ChatDisplayedInput): Promise<void>;
  };
  /**
   * @deprecated Prefer onChatMessage or onFormSubmission for typed message payloads.
   */
  onMessage: (listener: ChatMessageListener) => Unsubscribe;
  onChatMessage: (
    listener: (message: ChatTextMessage, delivery: ChatIncomingDeliveryContext) => void,
  ) => Unsubscribe;
  onEmergency: (
    listener: (message: ChatEmergencyMessage, delivery: ChatIncomingDeliveryContext) => void,
  ) => Unsubscribe;
  onAttachmentMessage: (
    listener: (message: ChatAttachmentMessage, delivery: ChatIncomingDeliveryContext) => void,
  ) => Unsubscribe;
  onFormSubmission: (
    listener: (message: ChatFormSubmissionMessage, delivery: ChatIncomingDeliveryContext) => void,
  ) => Unsubscribe;
  onConversationState: (
    listener: (event: ChatConversationStateEvent, delivery: ChatIncomingDeliveryContext) => void,
  ) => Unsubscribe;
  onGroupInvitation: (listener: (event: ChatGroupInvitationEvent) => void) => Unsubscribe;
  onThreadGone: (listener: (event: ChatThreadGoneEvent) => void) => Unsubscribe;
  /** Emits only events sent by the server itself — see `ChatServerEvent`. */
  onServerEvent: (listener: (event: ChatServerEvent) => void) => Unsubscribe;
  /** Emits only XEP-0424 retractions whose author was verified by the SDK. */
  onRetraction: (listener: (event: ChatRetractionEvent) => void) => Unsubscribe;
  onTyping: (listener: (event: ChatTypingEvent) => void) => Unsubscribe;
  onDelivery: (listener: (event: ChatDeliveryEvent) => void) => Unsubscribe;
  onServerAcknowledged: (
    listener: (event: ChatServerAcknowledgementEvent) => void,
  ) => Unsubscribe;
  onServerSendFailed: (
    listener: (event: ChatServerSendFailureEvent) => void,
  ) => Unsubscribe;
  onStreamManagement: (
    listener: (event: ChatStreamManagementEvent) => void,
  ) => Unsubscribe;
  onError: (listener: (event: ChatErrorEvent) => void) => Unsubscribe;
  onStatus: (listener: (event: ChatStatusEvent) => void) => Unsubscribe;
  resolveAttachment: (attachment: ChatAttachment) => Promise<string | null>;
  getStatus: () => ChatStatus;
  getDeviceId: () => DeviceId | undefined;
  getBareDeviceId: () => DeviceId | undefined;
  getAddress: () => DeviceId;
  getChatAddressObject: () => ChatAddress;
  getDomain: () => string;
  getUserId: () => string;
};

type XmppClientLike = ReturnType<typeof createXmppClient>;
type XmppChild = ReturnType<typeof xml>;

type XmppElementLike = {
  name?: string;
  attrs?: Record<string, string>;
  is?: (name: string, ns?: string) => boolean;
  getChild?: (name: string, ns?: string) => XmppElementLike | null | undefined;
  getChildren?: (name: string, ns?: string) => XmppElementLike[];
  getChildText?: (name: string, ns?: string) => string | null | undefined;
  getText?: () => string;
  toString?: () => string;
};

type ServerAckWaiter = {
  expectedTargets: Set<string>;
  acknowledgedTargets: Set<string>;
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
};

type XmppStreamManagementLike = {
  enabled?: boolean;
  enableSent?: boolean;
  id?: string;
  on?: (event: "ack" | "fail" | "resumed", listener: (stanza?: XmppElementLike) => void) => void;
};

type PendingIq = {
  resolve: (stanza: XmppElementLike) => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
};

type PendingGroupJoin = {
  promise: Promise<void>;
  resolve: () => void;
  reject: (error: Error) => void;
  timeout: ReturnType<typeof setTimeout>;
};

type CarbonForwardedMessage = {
  direction: "sent" | "received";
  message: XmppElementLike;
  timestamp?: number;
};

const XMPP_CHAT_NS = "urn:lula:defy:chat:1";
export const XMPP_MESSAGE_TIME_NS = "urn:lulafi:message-time:1";
const XMPP_RECEIPTS_NS = "urn:xmpp:receipts";
const XMPP_CHAT_MARKERS_NS = "urn:xmpp:chat-markers:0";
const XMPP_CHATSTATES_NS = "http://jabber.org/protocol/chatstates";
const XMPP_HTTP_UPLOAD_NS = "urn:xmpp:http:upload:0";
const XMPP_CARBONS_NS = "urn:xmpp:carbons:2";
const XMPP_FORWARD_NS = "urn:xmpp:forward:0";
const XMPP_FALLBACK_NS = "urn:xmpp:fallback:0";
const XMPP_HINTS_NS = "urn:xmpp:hints";
const XMPP_RETRACT_NS = "urn:xmpp:message-retract:1";
const XMPP_STREAM_MANAGEMENT_NS = "urn:xmpp:sm:3";
const XMPP_STABLE_ID_NS = "urn:xmpp:sid:0";
const XMPP_MUC_NS = "http://jabber.org/protocol/muc";
const XMPP_MUC_USER_NS = "http://jabber.org/protocol/muc#user";
const XMPP_DIRECT_MUC_INVITE_NS = "jabber:x:conference";
export const XMPP_EMERGENCY_NS = "urn:lulafi:emergency:1" as const;
/** Namespace of the `<event>` element a server event carries — see `ChatServerEvent`. */
export const XMPP_SERVER_EVENT_NS = "urn:lulafi:server-event:1" as const;
const OMEMO_NS = "eu.siacs.conversations.axolotl";
const OMEMO_DEVICELIST_NODE = "eu.siacs.conversations.axolotl.devicelist";
const OMEMO_BUNDLE_NODE_PREFIX = "eu.siacs.conversations.axolotl.bundles:";
const OMEMO_AES_KEY_BYTES = 16;
const OMEMO_KEY_WRAP_BYTES = 16;
const OMEMO_KEY_WRAP_BUNDLE_BYTES = OMEMO_KEY_WRAP_BYTES * 2;
const OMEMO_INFO = new TextEncoder().encode("lula-defy-omemo-v1");
const OMEMO_WRAP_INFO = new TextEncoder().encode("lula-defy-omemo-wrap-v1");
const PUBSUB_NS = "http://jabber.org/protocol/pubsub";
const XDATA_NS = "jabber:x:data";
const DEFAULT_CONNECT_TIMEOUT_MS = 15000;
const DEFAULT_IQ_TIMEOUT_MS = 15000;
const DEFAULT_MUC_JOIN_TIMEOUT_MS = 15000;
const MUC_JOIN_RETRY_DELAYS_MS = [500, 1000, 2000, 4000, 8000, 16000] as const;
const OMEMO_IQ_TIMEOUT_MS = 10000;
const OMEMO_IQ_MAX_ATTEMPTS = 3;
const OMEMO_IQ_RETRY_DELAY_MS = 250;
const DEFAULT_TYPING_AUTO_PAUSE_MS = 10000;
const DEFAULT_OMEMO_STATE_KEY_PREFIX = "chat_sdk_omemo_state";
const DEFAULT_XMPP_WEBSOCKET_PATH = "/chat/websocket";
const MAX_RUNTIME_MESSAGE_AUTHORS_PER_ROOM = 500;
const MAX_RUNTIME_MESSAGE_AUTHOR_ROOMS = 100;
const MAX_PENDING_RETRACTIONS_PER_ROOM = 200;
const MAX_PENDING_RETRACTION_ROOMS = 100;
const CHAT_LOG_LEVEL_WEIGHT: Record<ChatLogLevel, number> = {
  silent: 0,
  error: 1,
  warn: 2,
  info: 3,
  debug: 4,
};
const createRuntimeIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 12);
const createDeviceIdSuffix = customAlphabet("0123456789abcdefghijklmnopqrstuvwxyz", 16);

class XOauth2Mechanism {
  public name = "X-OAUTH2";

  public clientFirst = true;

  public response({
    username,
    password,
  }: {
    username?: string | null;
    password?: string | null;
  }): string {
    return `\u0000${String(username || "")}\u0000${String(password || "")}`;
  }

  public challenge(): this {
    return this;
  }
}

let xOAuth2Registered = false;

function registerXOAuth2Preference(): void {
  if (xOAuth2Registered) return;

  const moduleValue = saslMechanisms as {
    Factory?: { prototype?: { use?: (...args: unknown[]) => unknown } };
    default?: { Factory?: { prototype?: { use?: (...args: unknown[]) => unknown } } };
  };
  const Factory = moduleValue.Factory ?? moduleValue.default?.Factory;
  const prototype = Factory?.prototype;
  const originalUse = prototype?.use;
  if (!prototype || typeof originalUse !== "function") return;

  prototype.use = function patchedUse(this: { _mechs?: { name?: string }[] }) {
    const result = originalUse.apply(this, arguments as unknown as Parameters<typeof originalUse>);
    const index = this._mechs?.findIndex(
      (entry) => String(entry?.name || "").toUpperCase() === "X-OAUTH2",
    );
    if (typeof index === "number" && index > 0) {
      const [entry] = this._mechs!.splice(index, 1);
      if (entry) this._mechs!.unshift(entry);
    }
    return result;
  };

  xOAuth2Registered = true;
}

export function init(config: ChatClientConfig): ChatClient {
  return new LulaChatClient(config);
}

export function createChatClient(config: ChatClientConfig): ChatClient {
  return init(config);
}

export function createDeviceId(options: CreateDeviceIdOptions = {}): DeviceId {
  const prefix = normalizeDeviceIdSegment(options.prefix) ?? "";
  return `${prefix}${createDeviceIdSuffix()}`;
}

export function getChatAddress(input: ChatAddressInput): ChatAddress {
  const domain = normalizeXmppDomain(input.xmppDomain);
  if (!domain) throw new Error("chat_xmpp_domain_required");

  const userId = normalizeUserIdSegment(input.userId);
  if (!userId) throw new Error("chat_user_id_required");

  const localDeviceId = normalizeDeviceIdSegment(input.deviceId);
  if (!localDeviceId) throw new Error("chat_device_id_required");

  const resource = normalizeResourceSegment(localDeviceId);
  const localpart = buildXmppUserLocalpart(userId);
  const raw = buildXmppUserResourceAddress(userId, domain, resource);
  const address = buildXmppUserAddress(userId, domain);

  return {
    raw,
    address,
    userId,
    deviceId: localDeviceId,
    localpart,
    domain,
  };
}

export function getChatUserId(input: ChatUserIdInput): DeviceId {
  const domain = normalizeXmppDomain(input.domain);
  if (!domain) throw new Error("chat_xmpp_domain_required");

  const userId = normalizeUserIdSegment(input.username);
  if (!userId) throw new Error("chat_user_id_required");

  return buildXmppUserAddress(userId, domain);
}

export function getChatDeviceId(input: ChatDeviceIdInput): DeviceId {
  const bareUserJid = getChatUserId(input);
  const resource = normalizeResourceSegment(input.deviceId ?? input.deviceName ?? "");
  return `${bareUserJid}/${resource}`;
}

export function createRoomDirectory(options: ChatRoomDirectoryOptions): ChatRoomDirectory {
  const roomCache = new Map<string, ChatRoom>();

  const rememberRoom = (room: ChatRoom) => {
    roomCache.set(room.roomId, room);
    if (room.id) roomCache.set(room.id, room);
    return room;
  };

  return {
    getPeerDeviceIds: async (roomId) => {
      const normalizedRoomId = roomId.trim();
      if (!normalizedRoomId) return [];

      const cached = roomCache.get(normalizedRoomId);
      const cachedDeviceIds = normalizeTransportAddressList([
        ...(cached?.peerDeviceIds ?? []),
        ...(cached?.ownDeviceIds ?? []),
      ]);
      if (cachedDeviceIds.length) return cachedDeviceIds;

      if (!options.getRoom) return [];
      const room = normalizeChatRoomResponse(await options.getRoom(normalizedRoomId), options);
      return deriveRoomDeviceIds(room);
    },
    getOrCreateRoom: options.getOrCreateRoom
      ? async (input) => {
          const room = normalizeChatRoomResponse(await options.getOrCreateRoom!(input), options);
          return rememberRoom(room);
        }
      : undefined,
  };
}

class LulaChatClient implements ChatClient {
  private readonly config: NormalizedConfig;

  private readonly messageListeners = new Set<ChatMessageListener>();

  private readonly groupInvitationListeners = new Set<
    (event: ChatGroupInvitationEvent) => void
  >();

  private readonly typingListeners = new Set<(event: ChatTypingEvent) => void>();

  private readonly threadGoneListeners = new Set<(event: ChatThreadGoneEvent) => void>();

  private readonly serverEventListeners = new Set<(event: ChatServerEvent) => void>();

  private readonly retractionListeners = new Set<(event: ChatRetractionEvent) => void>();

  private readonly deliveryListeners = new Set<(event: ChatDeliveryEvent) => void>();

  private readonly serverAcknowledgementListeners = new Set<
    (event: ChatServerAcknowledgementEvent) => void
  >();

  private readonly serverSendFailureListeners = new Set<
    (event: ChatServerSendFailureEvent) => void
  >();

  private readonly streamManagementListeners = new Set<
    (event: ChatStreamManagementEvent) => void
  >();

  private readonly errorListeners = new Set<(event: ChatErrorEvent) => void>();

  private readonly statusListeners = new Set<(event: ChatStatusEvent) => void>();

  private xmpp: XmppClientLike | null = null;

  private status: ChatStatus = "idle";

  private connectPromise: Promise<void> | null = null;

  private onlineReadinessPromise: Promise<void> | null = null;

  private readonly pendingIqMap = new Map<string, PendingIq>();

  private readonly groupRooms = new Map<string, ChatGroupRoom>();

  private readonly groupRoomIdsByMucJid = new Map<string, string>();

  private readonly joinedGroupRooms = new Set<string>();

  private readonly mucOccupantRealJids = new Map<string, string>();

  private readonly pendingGroupJoins = new Map<string, PendingGroupJoin>();

  private readonly groupJoinRetryTimers = new Map<
    string,
    ReturnType<typeof setTimeout>
  >();

  private readonly groupJoinRetryAttempts = new Map<string, number>();

  private readonly serverAckWaiters = new Map<string, ServerAckWaiter>();
  private readonly serverMessageTimestamps = new Map<string, number>();

  private onlineDeviceId?: DeviceId;

  private readonly roomPeers = new Map<string, Set<string>>();

  private readonly editTargets = new Map<string, ChatMessageEditTarget>();
  private readonly pendingEdits = new Map<string, { message: ChatMessage; delivery: ChatIncomingDeliveryContext }>();

  private readonly messageAuthorsByRoom = new Map<string, Map<string, string>>();

  private readonly pendingRetractionsByRoom = new Map<
    string,
    Map<string, ChatRetractionEvent>
  >();

  private readonly typingAutoPauseTimers = new Map<string, ReturnType<typeof setTimeout>>();

  public constructor(config: ChatClientConfig) {
    this.config = normalizeConfig(config);
  }

  public async connect(): Promise<void> {
    if (this.status === "online" && this.xmpp) return;
    if (this.connectPromise) return this.connectPromise;

    this.log("debug", "chat_connect_requested", {
      status: this.status,
      deviceId: this.config.localDeviceId,
      domain: this.config.domain,
    });
    this.connectPromise = this.connectFresh();
    try {
      await this.connectPromise;
    } finally {
      this.connectPromise = null;
    }
  }

  public async stop(): Promise<void> {
    this.log("info", "chat_stop_requested", { status: this.status });
    this.config.encryption?.onDisconnect?.(this.getEncryptionContext());
    this.setStatus("stopping");
    for (const timer of this.typingAutoPauseTimers.values()) {
      clearTimeout(timer);
    }
    this.typingAutoPauseTimers.clear();
    const current = this.xmpp;
    this.xmpp = null;
    this.onlineDeviceId = undefined;
    this.onlineReadinessPromise = null;
    this.joinedGroupRooms.clear();
    this.mucOccupantRealJids.clear();
    this.clearAllGroupJoinRetries();
    this.rejectPendingGroupJoins(new Error("chat_client_stopped"));
    this.rejectPendingIq(new Error("chat_client_stopped"));
    this.rejectServerAckWaiters(new Error("chat_client_stopped"));
    if (current) {
      current.reconnect.stop();
      await current.stop();
    }
    this.setStatus("offline");
    this.log("info", "chat_stopped");
  }

  public async joinGroupRoom(room: ChatGroupRoom): Promise<void> {
    const normalized = this.normalizeGroupRoom(room);
    this.rememberGroupRoom(normalized);
    try {
      await this.connect();
      await this.ensureGroupRoomJoined(normalized.roomId);
    } catch (error) {
      this.scheduleGroupJoinRetry(normalized.roomId);
      throw error;
    }
  }

  public async updateGroupRoom(room: ChatGroupRoom): Promise<void> {
    const normalized = this.normalizeGroupRoom(room);
    this.rememberGroupRoom(normalized);
    if (this.status === "online") {
      try {
        await this.ensureGroupRoomJoined(normalized.roomId);
      } catch (error) {
        this.scheduleGroupJoinRetry(normalized.roomId);
        throw error;
      }
    }
  }

  public async leaveGroupRoom(roomId: string): Promise<void> {
    const normalizedRoomId = roomId.trim();
    if (!normalizedRoomId) throw new Error("chat_room_id_required");
    const room = this.groupRooms.get(normalizedRoomId);
    if (!room) return;

    if (this.xmpp && this.joinedGroupRooms.has(normalizedRoomId)) {
      await this.xmpp.send(
        xml("presence", {
          to: `${room.mucJid}/${this.getGroupNickname(room)}`,
          type: "unavailable",
        }),
      );
    }
    this.joinedGroupRooms.delete(normalizedRoomId);
    this.clearGroupJoinRetry(normalizedRoomId);
    this.groupRooms.delete(normalizedRoomId);
    this.groupRoomIdsByMucJid.delete(normalizeBareDeviceId(room.mucJid));
  }

  public async getPeerDeviceIds(roomId: string): Promise<DeviceId[]> {
    const deviceIds = await this.resolveRoomDeviceIds(roomId);
    this.log("debug", "chat_peer_device_ids_resolved", {
      roomId,
      deviceCount: deviceIds.length,
    });
    return deviceIds;
  }

  public async getOrCreateRoom(
    inputOrUserId: ChatRoomLookupInput | string,
    metadata?: Record<string, unknown>,
  ): Promise<ChatRoom> {
    const input =
      typeof inputOrUserId === "string"
        ? { userId: inputOrUserId, metadata }
        : inputOrUserId;
    const room = await this.resolveRoomForUserId(input);
    this.log("debug", "chat_room_resolved_for_user", {
      userId: input.userId,
      roomId: room.roomId,
    });
    return room;
  }

  public async sendChatMessage(
    inputOrRoomId: ChatTextMessageInput | string,
    body?: string,
    options?: Omit<ChatTextMessageInput, "roomId" | "body">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, body: body ?? "" }
        : inputOrRoomId;
    const metadata = buildChatMessageMetadata({
      ...input,
      displayName: this.config.displayName,
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...input,
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId,
      },
      "user",
    );
  }

  public async editMessage(input: ChatEditMessageInput): Promise<string> {
    if (!input.roomId.trim() || !input.targetMessageId.trim())
      throw new Error("chat_edit_original_not_found");
    if (input.attachments?.length) throw new Error("chat_edit_not_allowed");
    if (
      input.serverAcceptedAt !== undefined &&
      (!input.id || !Number.isFinite(input.serverAcceptedAt) || input.serverAcceptedAt <= 0)
    ) {
      throw new Error("chat_edit_acceptance_invalid");
    }
    return this.sendMessageInput(
      {
        ...input,
        metadata: buildChatMessageMetadata({
          ...input,
          displayName: this.config.displayName,
          metadata: { ...input.metadata, edited: true, replacesId: input.targetMessageId },
        }),
      },
      "user",
      input.serverAcceptedAt,
    );
  }

  public async sendEmergency(input: ChatEmergencyMessageInput): Promise<string> {
    const alertId = input.alertId.trim();
    if (!alertId) throw new Error("chat_emergency_alert_id_required");
    const emergencyType = input.emergencyType ?? CHAT_EMERGENCY_TYPE_SOS;
    if (emergencyType !== CHAT_EMERGENCY_TYPE_SOS) {
      throw new Error("chat_emergency_type_invalid");
    }
    const triggeredAt = normalizeIsoDate(input.triggeredAt) ?? new Date().toISOString();
    const metadata = buildChatMessageMetadata({
      ...input,
      metadata: {
        ...(input.metadata ?? {}),
        messageType: CHAT_EMERGENCY_MESSAGE_TYPE,
        emergencyType,
        emergencyAlertId: alertId,
        emergencyTriggeredAt: triggeredAt,
      },
      displayName: this.config.displayName,
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...input,
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId,
      },
      "user",
    );
  }

  public sendReply(input: ChatReplyMessageInput): Promise<string> {
    const { replyTo, metadata, ...message } = input;
    return this.sendChatMessage({
      ...message,
      metadata: { ...(metadata ?? {}), replyTo },
    });
  }

  public addReaction(input: ChatReactionMessageInput): Promise<string> {
    return this.sendReaction(input, false);
  }

  public removeReaction(input: ChatReactionMessageInput): Promise<string> {
    return this.sendReaction(input, true);
  }

  public async retractMessage(input: ChatRetractionInput): Promise<string> {
    const targetMessageId = input.messageId.trim();
    if (!targetMessageId) throw new Error("chat_retraction_target_required");

    const roomId = input.roomId?.trim();
    if (!roomId) throw new Error("chat_room_id_required");

    await this.connect();
    const id = input.id || `retract-${generateMessageId()}`;
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetScope = input.targetScope ?? "user";
    const groupRoom =
      this.getGroupRoomForTransport(targetRoomId) ??
      this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom
      ? [groupRoom.mucJid]
      : await this.resolveRoomTargets({
          roomId: targetRoomId,
          explicitDeviceIds: collectTargetDeviceIds(input),
          targetScope,
        });
    const fallbackBody = "/me retracted a previous message.";
    const metadata = normalizeMessageMetadata(undefined, "CHAT_MESSAGE");

    await this.sendToTargets(targetDeviceIds, async (toDeviceId) => {
      const encodedPayload = await this.encodePayload({
        toDeviceId,
        ...(groupRoom
          ? { recipientJids: this.getGroupEncryptionRecipientJids(groupRoom) }
          : {}),
        body: fallbackBody,
        metadata,
      });
      const children: XmppChild[] = [
        xml("body", {}, encodedPayload.body ?? fallbackBody),
        ...encodedPayload.children,
        xml("thread", {}, roomId),
        xml("retract", { xmlns: XMPP_RETRACT_NS, id: targetMessageId }),
        xml("fallback", { xmlns: XMPP_FALLBACK_NS, for: XMPP_RETRACT_NS }),
        xml("store", { xmlns: XMPP_HINTS_NS }),
      ];
      await this.requireXmpp().send(
        xml(
          "message",
          { to: toDeviceId, type: groupRoom ? "groupchat" : "chat", id },
          ...children,
        ),
      );
    });

    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
    }
    this.log("info", "chat_message_retraction_sent", {
      id,
      targetMessageId,
      roomId,
      targetCount: targetDeviceIds.length,
    });
    return id;
  }

  private sendReaction(input: ChatReactionMessageInput, removed: boolean): Promise<string> {
    const { targetMessageId, emoji, actorId, metadata, ...message } = input;
    const normalizedTargetMessageId = targetMessageId.trim();
    const normalizedEmoji = emoji.trim();
    if (!normalizedTargetMessageId) throw new Error("chat_reaction_target_required");
    if (!isChatReactionEmoji(normalizedEmoji)) throw new Error("chat_reaction_emoji_invalid");
    const normalizedActorId = normalizeInteractionActorId(actorId ?? this.config.userId);
    if (!normalizedActorId) throw new Error("chat_reaction_actor_required");
    return this.sendChatMessage({
      ...message,
      body: normalizedEmoji,
      metadata: {
        ...(metadata ?? {}),
        chatInteractionType: CHAT_REACTION_INTERACTION_TYPE,
        reactionToId: normalizedTargetMessageId,
        reactionEmoji: normalizedEmoji,
        reactionRemoved: removed,
        reactionActorId: normalizedActorId,
      },
    });
  }

  public async sendFormSubmission(input: ChatFormSubmissionInput): Promise<string> {
    const metadata = buildFormSubmissionMetadata({
      ...input,
      displayName: this.config.displayName,
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    return this.sendMessageInput(
      {
        ...pickMessageTargetInput(input),
        body: JSON.stringify(input.payload, null, input.pretty ? 2 : undefined),
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? input.roomId,
      },
      "user",
    );
  }

  public async sendConversationState(input: ChatConversationStateInput): Promise<string> {
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (input.conversationType !== "form_submission") {
      throw new Error("chat_conversation_type_invalid");
    }
    if (input.state !== "open" && input.state !== "closed") {
      throw new Error("chat_conversation_state_invalid");
    }
    const changedAt = normalizeIsoDate(input.changedAt) ?? new Date().toISOString();
    const metadata = normalizeMessageMetadata(
      {
        ...(input.metadata ?? {}),
        conversationType: input.conversationType,
        conversationState: input.state,
        conversationId: trimToUndefined(input.conversationId),
        conversationChangedAt: changedAt,
      },
      CHAT_CONVERSATION_STATE_MESSAGE_TYPE,
    );
    const legacyId = await this.sendMessageInput(
      {
        toDeviceId: input.toDeviceId,
        toDeviceIds: input.toDeviceIds,
        peerDeviceId: input.peerDeviceId,
        peerDeviceIds: input.peerDeviceIds,
        roomId,
        targetRoomId: input.targetRoomId,
        targetScope: input.targetScope,
        id: input.id,
        requestReceipt: input.requestReceipt,
        body: input.state === "closed" ? "Conversation closed" : "Conversation reopened",
        metadata,
      },
      "user",
    );
    if (input.state === "closed") {
      try {
        await this.sendThreadGone({
          toDeviceId: input.toDeviceId,
          toDeviceIds: input.toDeviceIds,
          peerDeviceId: input.peerDeviceId,
          peerDeviceIds: input.peerDeviceIds,
          roomId,
          targetRoomId: input.targetRoomId,
          targetScope: input.targetScope,
          id: input.id ? `${input.id}-gone` : undefined,
        });
      } catch (error) {
        // Preserve the legacy state event during migration if the standards-based
        // chat-state signal cannot be sent to any target.
        this.log("warn", "chat_thread_gone_compat_send_failed", {
          roomId,
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
    return legacyId;
  }

  public async uploadAttachment(
    inputOrRoomId: { roomId: string; attachment: ChatAttachmentUpload } | string,
    attachment?: ChatAttachmentUpload,
  ): Promise<ChatAttachment> {
    const input =
      typeof inputOrRoomId === "string"
        ? { roomId: inputOrRoomId, attachment: attachment as ChatAttachmentUpload }
        : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.attachment) throw new Error("chat_attachment_required");
    await this.connect();
    const context = this.getAttachmentUploadContext(roomId);
    const uploaded = this.config.attachmentService?.upload
      ? await this.config.attachmentService.upload(input.attachment, context)
      : await uploadChatAttachmentWithFetch(input.attachment, context);
    const normalized = normalizeRequiredAttachment(uploaded);
    if (this.config.requireEncryptedAttachments && !isEncryptedChatAttachment(normalized)) {
      throw new Error("chat_attachment_encryption_required");
    }
    if (
      this.config.requireEncryptedAttachments &&
      !hasChatAttachmentDownloadCapability(normalized)
    ) {
      throw new Error("chat_attachment_download_capability_required");
    }
    return normalized;
  }

  public async sendAttachment(
    inputOrRoomId: ChatAttachmentMessageInput | string,
    attachment?: ChatAttachmentUpload,
    options?: Omit<ChatAttachmentMessageInput, "roomId" | "attachment">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, attachment: attachment as ChatAttachmentUpload }
        : inputOrRoomId;
    const { attachment: attachmentUpload, ...message } = input;
    return this.sendAttachments({
      ...message,
      attachments: [attachmentUpload],
    });
  }

  public async sendAttachments(
    inputOrRoomId: ChatAttachmentsMessageInput | string,
    attachments?: ChatAttachmentUpload[],
    options?: Omit<ChatAttachmentsMessageInput, "roomId" | "attachments">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, attachments: attachments ?? [] }
        : inputOrRoomId;
    const roomId = input.roomId?.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!Array.isArray(input.attachments) || input.attachments.length === 0) {
      throw new Error("chat_attachments_required");
    }

    const uploadedAttachments: ChatAttachment[] = [];
    for (const attachmentUpload of input.attachments) {
      if (!attachmentUpload) throw new Error("chat_attachment_required");
      uploadedAttachments.push(
        await this.uploadAttachment({ roomId, attachment: attachmentUpload }),
      );
    }

    const firstAttachment = uploadedAttachments[0];
    const metadata = buildChatMessageMetadata({
      ...input,
      roomId,
      metadata: {
        ...(input.metadata ?? {}),
        attachment: true,
        attachmentCount: uploadedAttachments.length,
        ...(uploadedAttachments.length === 1 && firstAttachment?.mimeType
          ? { mimeType: firstAttachment.mimeType }
          : {}),
        ...(uploadedAttachments.length === 1 && typeof firstAttachment?.size === "number"
          ? { size: firstAttachment.size }
          : {}),
      },
      displayName: this.config.displayName,
    });
    const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata);
    const { attachments: _attachmentUploads, ...message } = input;
    return this.sendMessageInput(
      {
        ...message,
        roomId,
        body: input.body ?? "",
        attachments: uploadedAttachments,
        metadata,
        targetRoomId: input.targetRoomId ?? providerDirectMessageRoomId ?? roomId,
      },
      "user",
    );
  }

  /**
   * Send a recording as a voice message.
   *
   * Only container and duration are checked — they are the two things that can
   * break a message. Sample rate, channels and bit rate do not affect playback,
   * and the SDK is handed a file URI rather than bytes on React Native, so it
   * could not read them back regardless; the recorder helpers above are what
   * keep those aligned.
   */
  public async sendVoiceMessage(input: ChatVoiceMessageInput): Promise<string> {
    const { attachment, durationMs, metadata: callerMetadata, ...message } = input;
    if (!attachment) {
      throw new Error("chat_attachment_required");
    }
    if (normalizeVoiceMimeType(attachment.mimeType) !== CHAT_VOICE_SPEC.mimeType) {
      throw new Error("chat_voice_mime_type_invalid");
    }
    const roundedDurationMs = Math.round(durationMs);
    if (
      !Number.isFinite(roundedDurationMs) ||
      roundedDurationMs < CHAT_VOICE_SPEC.minDurationMs
    ) {
      throw new Error("chat_voice_duration_too_short");
    }

    // A caller's own message type wins: an emergency recorded as a voice note is
    // an EMERGENCY first, and `voiceMessage` is what still renders it as a player.
    const voiceMetadata = {
      voiceMessage: true,
      voiceDurationMs: roundedDurationMs,
      messageType: firstString(callerMetadata?.messageType) ?? CHAT_VOICE_MESSAGE_TYPE,
    };

    return this.sendAttachments({
      ...message,
      attachments: [
        {
          ...attachment,
          name: normalizeVoiceAttachmentName(attachment.name),
          // The codec parameter belongs to the recorder, not the wire.
          mimeType: CHAT_VOICE_SPEC.mimeType,
          metadata: { ...(attachment.metadata ?? {}), ...voiceMetadata },
        },
      ],
      body: "",
      metadata: { ...(callerMetadata ?? {}), ...voiceMetadata },
    });
  }

  public async sendMessage(
    inputOrRoomId: ChatMessageInput | string,
    body?: string,
    options?: Omit<ChatMessageInput, "roomId" | "body">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, body: body ?? "" }
        : inputOrRoomId;
    return this.sendMessageInput(input, "resource");
  }

  private async sendMessageInput(
    input: ChatMessageInput,
    defaultTargetScope: ChatTargetScope,
    editServerAcceptedAt?: number,
  ): Promise<string> {
    const sendStartedAt = Date.now();
    const messageBody = input.body ?? "";
    const attachments = normalizeAttachmentPayload(input.attachments);
    if (!messageBody.trim() && !attachments?.length) throw new Error("chat_body_required");
    if (
      this.config.requireEncryptedAttachments &&
      attachments?.some((attachment) => !isEncryptedChatAttachment(attachment))
    ) {
      throw new Error("chat_attachment_encryption_required");
    }
    if (
      this.config.requireEncryptedAttachments &&
      attachments?.some(
        (attachment) => !hasChatAttachmentDownloadCapability(attachment),
      )
    ) {
      throw new Error("chat_attachment_download_capability_required");
    }
    const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");
    const editTargetId = trimToUndefined(typeof metadata.replacesId === "string" ? metadata.replacesId : undefined);
    const isEdit = metadata.edited === true;
    // replacesId also appears on legacy local-to-canonical ID notifications.
    // Without the edit flag it is an alias, not a correction, and stays local.
    if (!isEdit) delete metadata.replacesId;
    let originalForEdit: ChatMessageEditTarget | null | undefined;
    if (isEdit) {
      if (!editTargetId || metadata.edited !== true || metadata.messageType !== "CHAT_MESSAGE" || attachments?.length || !input.roomId) {
        throw new Error("chat_edit_not_allowed");
      }
      originalForEdit = await this.resolveEditTarget(input.roomId, editTargetId);
      const error = getMessageEditError(originalForEdit, this.getDeviceId() ?? "");
      if (error && !(error === "chat_edit_expired" && editServerAcceptedAt !== undefined)) throw new Error(error);
      // Keep the client creation time for outbox retries. Receivers use server time.
      const editTimestamp = parseMetadataTimestamp(metadata) ?? Date.now();
      const timestampError = getMessageEditError(originalForEdit, this.getDeviceId() ?? "", editTimestamp);
      if (timestampError) throw new Error(timestampError);
      metadata.sentAtMs = editTimestamp;
    } else if (!parseMetadataTimestamp(metadata)) {
      metadata.sentAtMs = Date.now();
    }

    await this.connect();
    const xmpp = this.requireXmpp();
    const id = input.id || generateMessageId();
    const roomId = input.roomId?.trim();
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetScope = input.targetScope ?? defaultTargetScope;
    const groupRoom =
      this.getGroupRoomForTransport(targetRoomId) ??
      this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom
      ? [groupRoom.mucJid]
      : await this.resolveRoomTargets({
          roomId: targetRoomId,
          explicitDeviceIds: collectTargetDeviceIds(input),
          targetScope,
        });
    this.log("debug", "chat_message_send_started", {
      id,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length,
      targetDeviceIds,
      hasAttachments: Boolean(attachments?.length),
      messageType: metadata.messageType,
    });

    if (
      this.config.awaitServerAcknowledgement &&
      (xmpp.streamManagement as XmppStreamManagementLike).enabled !== true
    ) {
      throw new Error("chat_stream_management_unavailable");
    }
    const serverAckPromise = this.config.awaitServerAcknowledgement
      ? this.createServerAckWaiter(id, targetDeviceIds)
      : null;
    try {
      const sentTargets = await this.sendToTargets(targetDeviceIds, async (toDeviceId) => {
        const encodedPayload = await this.encodePayload({
          toDeviceId,
          ...(groupRoom
            ? { recipientJids: this.getGroupEncryptionRecipientJids(groupRoom) }
            : {}),
          body: messageBody,
          metadata,
          attachments,
        });
        const children: XmppChild[] = [
          xml("body", {}, encodedPayload.body ?? messageBody),
          ...encodedPayload.children,
          // Keep the application-generated id stable when a stanza is replayed
          // by stream management or resent from a durable client outbox.
          xml("origin-id", { xmlns: XMPP_STABLE_ID_NS, id }),
        ];

        if (roomId) children.push(xml("thread", {}, roomId));
        const emergency = parseEmergencyMetadata(metadata);
        if (emergency) {
          children.push(
            xml("emergency", {
              xmlns: XMPP_EMERGENCY_NS,
              type: emergency.emergencyType,
              "alert-id": emergency.alertId,
              "triggered-at": emergency.triggeredAt,
            }),
          );
        }
        if (metadata.messageType === CHAT_CONVERSATION_STATE_MESSAGE_TYPE) {
          children.push(xml("store", { xmlns: XMPP_HINTS_NS }));
        }
        if (!groupRoom && input.requestReceipt !== false) {
          children.push(xml("request", { xmlns: XMPP_RECEIPTS_NS }));
          children.push(xml("markable", { xmlns: XMPP_CHAT_MARKERS_NS }));
        }

        // Connecting, joining a group and encryption can outlive the window.
        if (isEdit && editServerAcceptedAt === undefined) {
          originalForEdit = await this.resolveEditTarget(input.roomId!, editTargetId!);
          const error = getMessageEditError(originalForEdit, this.getDeviceId() ?? "");
          if (error) throw new Error(error);
        }
        await xmpp.send(
          xml(
            "message",
            { to: toDeviceId, type: groupRoom ? "groupchat" : "chat", id },
            ...children,
          ),
        );
      });
      if (serverAckPromise) {
        this.updateServerAckExpectedTargets(id, sentTargets);
        // Ask after the message writes. The library's trailing debounce can
        // defer acknowledgements throughout a continuous run of stanzas.
        await xmpp.send(xml("r", { xmlns: XMPP_STREAM_MANAGEMENT_NS }));
        await serverAckPromise;
      }
    } catch (error) {
      this.cancelServerAckWaiter(id);
      throw error;
    }
    this.log("info", "chat_message_sent", {
      id,
      durationMs: Date.now() - sendStartedAt,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length,
      messageType: metadata.messageType,
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId && targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
    }
    if (roomId) {
      this.rememberMessageAuthor(roomId, id, this.getDeviceId());
      if (!isEdit) this.rememberEditTarget(roomId, id, {
        authorAddress: this.getDeviceId() ?? "",
        timestamp: this.serverMessageTimestamps.get(this.editTargetKey(roomId, id)) ?? 0,
        body: messageBody, hasAttachments: Boolean(attachments?.length), metadata,
      });
    }
    return id;
  }

  public async sendTyping(
    inputOrRoomId: ChatTypingInput | string,
    options?: Omit<ChatTypingInput, "roomId">,
  ): Promise<void> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId }
        : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const isTyping = input.isTyping ?? true;
    const targetScope = input.targetScope ?? "user";
    const groupRoom = this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.connect();
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom
      ? [groupRoom.mucJid]
      : await this.resolveRoomTargets({
          roomId,
          explicitDeviceIds: collectTargetDeviceIds(input),
          targetScope,
        });

    this.log("debug", "chat_typing_send_started", {
      roomId,
      isTyping,
      targetScope,
      targetCount: targetDeviceIds.length,
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    this.clearTypingAutoPause(roomId);
    await this.connect();
    const children: XmppChild[] = [];
    children.push(xml("thread", {}, roomId));
    children.push(xml(isTyping ? "composing" : "paused", { xmlns: XMPP_CHATSTATES_NS }));
    await this.sendToTargets(targetDeviceIds, (toDeviceId) =>
      this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: groupRoom ? "groupchat" : "chat",
          id: input.id || `typing-${Date.now()}`,
        }, ...children),
      ),
    );

    if (isTyping) {
      this.scheduleTypingAutoPause(roomId, input.autoPauseMs ?? DEFAULT_TYPING_AUTO_PAUSE_MS);
    }
    this.log("debug", "chat_typing_sent", {
      roomId,
      isTyping,
      targetCount: targetDeviceIds.length,
    });
  }

  public async sendThreadGone(
    inputOrRoomId: ChatThreadGoneInput | string,
    options?: Omit<ChatThreadGoneInput, "roomId">,
  ): Promise<string> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId }
        : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const targetRoomId = input.targetRoomId?.trim() || roomId;
    const targetScope = input.targetScope ?? "user";
    const groupRoom =
      this.getGroupRoomForTransport(targetRoomId) ??
      this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.connect();
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom
      ? [groupRoom.mucJid]
      : await this.resolveRoomTargets({
          roomId: targetRoomId,
          explicitDeviceIds: collectTargetDeviceIds(input),
          targetScope,
        });
    const id = input.id?.trim() || `gone-${generateMessageId()}`;

    this.log("debug", "chat_thread_gone_send_started", {
      id,
      roomId,
      targetRoomId,
      targetScope,
      targetCount: targetDeviceIds.length,
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    if (targetRoomId !== roomId) {
      this.rememberRoomPeers(targetRoomId, targetDeviceIds);
    }
    this.clearTypingAutoPause(roomId);
    await this.connect();
    await this.sendToTargets(targetDeviceIds, (toDeviceId) =>
      this.requireXmpp().send(
        xml(
          "message",
          { to: toDeviceId, type: groupRoom ? "groupchat" : "chat", id },
          xml("thread", {}, roomId),
          xml("gone", { xmlns: XMPP_CHATSTATES_NS }),
        ),
      ),
    );
    this.log("debug", "chat_thread_gone_sent", {
      id,
      roomId,
      targetRoomId,
      targetCount: targetDeviceIds.length,
    });
    return id;
  }

  public async markRead(
    inputOrRoomId: ChatDisplayedInput | string,
    messageId?: string,
    options?: Omit<ChatDisplayedInput, "roomId" | "messageId">,
  ): Promise<void> {
    const input =
      typeof inputOrRoomId === "string"
        ? { ...(options ?? {}), roomId: inputOrRoomId, messageId: messageId ?? "" }
        : inputOrRoomId;
    const roomId = input.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    if (!input.messageId.trim()) throw new Error("chat_message_id_required");
    const targetScope = input.targetScope ?? "user";
    const groupRoom = this.getGroupRoomForTransport(roomId);
    if (groupRoom) {
      await this.connect();
      await this.ensureGroupRoomJoined(groupRoom.roomId);
    }
    const targetDeviceIds = groupRoom
      ? [groupRoom.mucJid]
      : await this.resolveRoomTargets({
          roomId,
          explicitDeviceIds: collectTargetDeviceIds(input),
          targetScope,
        });

    this.log("debug", "chat_read_marker_send_started", {
      roomId,
      messageId: input.messageId,
      targetScope,
      targetCount: targetDeviceIds.length,
    });
    this.rememberRoomPeers(roomId, targetDeviceIds);
    await this.connect();
    const children: XmppChild[] = [
      xml("displayed", { xmlns: XMPP_CHAT_MARKERS_NS, id: input.messageId }),
    ];
    children.unshift(xml("thread", {}, roomId));
    await this.sendToTargets(targetDeviceIds, (toDeviceId) =>
      this.requireXmpp().send(
        xml("message", {
          to: toDeviceId,
          type: groupRoom ? "groupchat" : "chat",
          id: input.id || `displayed-${Date.now()}`,
        }, ...children),
      ),
    );
    this.log("debug", "chat_read_marker_sent", {
      roomId,
      messageId: input.messageId,
      targetCount: targetDeviceIds.length,
    });
  }

  public async resolveAttachment(attachment: ChatAttachment): Promise<string | null> {
    const normalized = normalizeRequiredAttachment(attachment);
    if (this.config.attachmentService?.resolve) {
      const resolved = await this.config.attachmentService.resolve(
        normalized,
        this.getAttachmentResolveContext(),
      );
      if (typeof resolved === "string" && resolved.trim()) return resolved.trim();
    }
    if (isEncryptedChatAttachment(normalized)) {
      throw new Error("chat_attachment_resolver_required");
    }
    return defaultAttachmentSource(normalized);
  }

  public onMessage(listener: ChatMessageListener): Unsubscribe {
    this.messageListeners.add(listener);
    return () => this.messageListeners.delete(listener);
  }

  public onChatMessage(
    listener: (message: ChatTextMessage, delivery: ChatIncomingDeliveryContext) => void,
  ): Unsubscribe {
    return this.onMessage((message, delivery) => {
      if (isConversationStateMessage(message)) return;
      if (isFormSubmissionMessage(message)) return;
      if (isAttachmentMessage(message)) return;
      if (isEmergencyMessage(message)) return;
      listener(toChatTextMessage(message), delivery);
    });
  }

  public onEmergency(
    listener: (message: ChatEmergencyMessage, delivery: ChatIncomingDeliveryContext) => void,
  ): Unsubscribe {
    return this.onMessage((message, delivery) => {
      const emergency = parseChatEmergencyMessage(message);
      if (emergency) listener(emergency, delivery);
    });
  }

  public onAttachmentMessage(
    listener: (message: ChatAttachmentMessage, delivery: ChatIncomingDeliveryContext) => void,
  ): Unsubscribe {
    return this.onMessage((message, delivery) => {
      if (!isAttachmentMessage(message)) return;
      listener(toChatAttachmentMessage(message), delivery);
    });
  }

  public onFormSubmission(
    listener: (message: ChatFormSubmissionMessage, delivery: ChatIncomingDeliveryContext) => void,
  ): Unsubscribe {
    return this.onMessage((message, delivery) => {
      const parsed = parseFormSubmissionMessage(message);
      if (parsed) listener(parsed, delivery);
    });
  }

  public onConversationState(
    listener: (event: ChatConversationStateEvent, delivery: ChatIncomingDeliveryContext) => void,
  ): Unsubscribe {
    return this.onMessage((message, delivery) => {
      const event = parseConversationStateMessage(message);
      if (event) listener(event, delivery);
    });
  }

  public onGroupInvitation(
    listener: (event: ChatGroupInvitationEvent) => void,
  ): Unsubscribe {
    return addListener(this.groupInvitationListeners, listener);
  }

  public onThreadGone(listener: (event: ChatThreadGoneEvent) => void): Unsubscribe {
    return addListener(this.threadGoneListeners, listener);
  }

  public onServerEvent(listener: (event: ChatServerEvent) => void): Unsubscribe {
    return addListener(this.serverEventListeners, listener);
  }

  public onRetraction(listener: (event: ChatRetractionEvent) => void): Unsubscribe {
    return addListener(this.retractionListeners, listener);
  }

  public onTyping(listener: (event: ChatTypingEvent) => void): Unsubscribe {
    return addListener(this.typingListeners, listener);
  }

  public onDelivery(listener: (event: ChatDeliveryEvent) => void): Unsubscribe {
    return addListener(this.deliveryListeners, listener);
  }

  public onServerAcknowledged(
    listener: (event: ChatServerAcknowledgementEvent) => void,
  ): Unsubscribe {
    return addListener(this.serverAcknowledgementListeners, listener);
  }

  public onServerSendFailed(
    listener: (event: ChatServerSendFailureEvent) => void,
  ): Unsubscribe {
    return addListener(this.serverSendFailureListeners, listener);
  }

  public onStreamManagement(
    listener: (event: ChatStreamManagementEvent) => void,
  ): Unsubscribe {
    return addListener(this.streamManagementListeners, listener);
  }

  public onError(listener: (event: ChatErrorEvent) => void): Unsubscribe {
    return addListener(this.errorListeners, listener);
  }

  public onStatus(listener: (event: ChatStatusEvent) => void): Unsubscribe {
    const unsubscribe = addListener(this.statusListeners, listener);
    listener({
      status: this.status,
      deviceId: this.onlineDeviceId,
    });
    return unsubscribe;
  }

  public getStatus(): ChatStatus {
    return this.status;
  }

  public getDeviceId(): DeviceId | undefined {
    return this.onlineDeviceId ?? this.config.deviceId;
  }

  public getBareDeviceId(): DeviceId | undefined {
    return normalizeBareDeviceId(this.getDeviceId());
  }

  public getAddress(): DeviceId {
    return this.getChatAddressObject().address;
  }

  public getChatAddressObject(): ChatAddress {
    const raw = this.getDeviceId() ?? this.config.deviceId;
    return {
      raw,
      address: normalizeBareDeviceId(raw) || this.config.deviceId,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      localpart: this.config.username,
      domain: this.config.domain,
    };
  }

  public getDomain(): string {
    return this.config.domain;
  }

  public getUserId(): string {
    return this.config.userId;
  }

  private async connectFresh(): Promise<void> {
    if (this.xmpp) {
      await this.stop();
    }
    this.setStatus("connecting");
    this.log("info", "chat_connect_started", {
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      authType: this.config.authType,
    });
    if (this.config.authType === "x-oauth2") {
      registerXOAuth2Preference();
    }
    const xmpp = createXmppClient({
      service: this.config.service,
      domain: this.config.domain,
      resource: this.config.resource,
      credentials: this.createCredentials() as never,
    });

    this.xmpp = xmpp;
    if (this.config.authType === "x-oauth2") {
      registerXOAuth2OnClient(xmpp);
    }
    this.bindXmppEvents(xmpp);
    this.bindStreamManagementEvents(xmpp);

    try {
      await withTimeout(
        xmpp.start(),
        this.config.connectTimeoutMs,
        "chat_connect_timeout",
      );
      const onlineReadiness = this.onlineReadinessPromise;
      if (!onlineReadiness) {
        throw new Error("chat_online_readiness_missing");
      }
      await withTimeout(
        onlineReadiness,
        this.config.connectTimeoutMs,
        "chat_online_readiness_timeout",
      );
    } catch (error) {
      this.xmpp = null;
      this.setStatus("error", error);
      this.log("error", "chat_connect_failed", { error });
      await safeStop(xmpp);
      throw error;
    }
  }

  private createCredentials(): unknown {
    const username = this.config.username;
    const secret = this.config.password;
    if (!secret) return { username };

    if (this.config.authType === "x-oauth2") {
      return async (
        authenticate: (
          credentials: { username?: string; password?: string },
          mechanism: string,
          userAgent?: unknown,
        ) => Promise<void>,
        mechanisms: string[],
      ) => {
        const picked = pickMechanism(mechanisms, ["X-OAUTH2"]);
        if (!picked) {
          throw new Error(`chat_no_usable_auth_mechanism:${mechanisms.join(",")}`);
        }
        await authenticate(
          { username, password: secret },
          picked,
          xml("user-agent", { id: "lulafi-chat-sdk" }),
        );
      };
    }

    return async (
      authenticate: (
        credentials: { username?: string; password?: string },
        mechanism: string,
        userAgent?: unknown,
      ) => Promise<void>,
      mechanisms: string[],
      _fast: unknown,
      _entity: { isSecure?: () => boolean },
    ) => {
      const preferred = ["SCRAM-SHA-1", "ANONYMOUS"];
      const picked = pickMechanism(mechanisms, preferred);
      if (!picked) {
        throw new Error(`chat_no_usable_auth_mechanism:${mechanisms.join(",")}`);
      }
      await authenticate(
        { username, password: secret },
        picked,
        xml("user-agent", { id: "lulafi-chat-sdk" }),
      );
    };
  }

  private bindXmppEvents(xmpp: XmppClientLike): void {
    xmpp.on("online", (address: unknown) => {
      if (this.xmpp !== xmpp) return;
      this.onlineDeviceId = addressToString(address) ?? this.config.deviceId;
      this.onlineReadinessPromise = (async () => {
        const streamManagement = xmpp.streamManagement as XmppStreamManagementLike;
        const streamManagementRequired =
          this.config.requireStreamManagement || this.config.awaitServerAcknowledgement;
        // xmpp.js emits `online` from resource binding before the surrounding
        // stream-feature middleware has completed XEP-0198 negotiation. A
        // synchronous `enabled` check here therefore rejects capable servers.
        // Wait for the actual <enabled/> result before declaring readiness.
        const streamManagementEnabled = streamManagementRequired
          ? await this.waitForStreamManagementNegotiation(xmpp)
          : streamManagement.enabled === true;
        if (this.xmpp !== xmpp) return;
        if (streamManagementRequired && !streamManagementEnabled) {
          throw new Error("chat_stream_management_required");
        }
        if (streamManagementEnabled) {
          this.emit(this.streamManagementListeners, {
            state: "enabled",
            resumable: Boolean(streamManagement.id),
          });
        }
        await xmpp.send(xml("presence"));
        try {
          await this.enableMessageCarbons();
          this.log("debug", "chat_carbons_enabled", {
            deviceId: this.onlineDeviceId,
          });
        } catch (error) {
          this.log("warn", "chat_carbons_enable_failed", { error });
          if (this.config.requireMessageCarbons) {
            throw new Error("chat_carbons_required", { cause: error });
          }
        }
        try {
          await this.config.encryption?.onConnect?.(this.getEncryptionContext());
          this.log("debug", "chat_encryption_connected", {
            deviceId: this.getBareDeviceId(),
          });
        } catch (error) {
          this.log("error", "chat_encryption_connect_failed", { error });
          this.emit(this.errorListeners, { error });
        }
        if (this.xmpp !== xmpp) return;
        await this.rejoinGroupRooms();
        if (this.xmpp !== xmpp) return;
        this.setStatus("online");
        this.log("info", "chat_online", {
          deviceId: this.onlineDeviceId,
          bareDeviceId: this.getBareDeviceId(),
        });
      })();
      this.onlineReadinessPromise.catch((error) => {
        if (this.xmpp !== xmpp) return;
        this.setStatus("error", error);
        this.emit(this.errorListeners, { error });
      });
    });

    xmpp.on("offline", () => {
      if (this.xmpp !== xmpp) return;
      this.config.encryption?.onDisconnect?.(this.getEncryptionContext());
      this.setStatus("offline");
      this.onlineDeviceId = undefined;
      this.onlineReadinessPromise = null;
      this.joinedGroupRooms.clear();
      this.mucOccupantRealJids.clear();
      this.clearAllGroupJoinRetries();
      this.rejectPendingGroupJoins(new Error("chat_muc_offline"));
      this.log("warn", "chat_offline");
      this.rejectPendingIq(new Error("chat_iq_offline"));
      this.rejectServerAckWaiters(new Error("chat_stream_offline"));
    });

    xmpp.on("error", (error: unknown) => {
      if (this.xmpp !== xmpp) return;
      this.log("error", "chat_xmpp_error", { error });
      this.emit(this.errorListeners, { error });
      this.setStatus("error", error);
    });

    xmpp.on("stanza", (stanza: XmppElementLike) => {
      if (this.xmpp !== xmpp) return;
      this.handleStanza(stanza).catch((error: unknown) => {
        this.emit(this.errorListeners, { error, raw: stanza });
      });
    });
  }

  private async enableMessageCarbons(): Promise<void> {
    await this.sendIq({
      type: "set",
      payload: xml("enable", { xmlns: XMPP_CARBONS_NS }),
    });
  }

  private async waitForStreamManagementNegotiation(xmpp: XmppClientLike): Promise<boolean> {
    const streamManagement = xmpp.streamManagement as XmppStreamManagementLike;
    if (streamManagement.enabled === true) return true;

    const timeoutMs = Math.max(250, Math.min(this.config.connectTimeoutMs, 10_000));
    this.log("debug", "chat_stream_management_negotiation_wait", {
      timeoutMs,
      enableSent: streamManagement.enableSent === true,
    });
    return new Promise<boolean>((resolve) => {
      let settled = false;
      let pollTimer: ReturnType<typeof setInterval> | undefined;
      let timeoutTimer: ReturnType<typeof setTimeout> | undefined;

      const cleanup = () => {
        if (pollTimer) clearInterval(pollTimer);
        if (timeoutTimer) clearTimeout(timeoutTimer);
        xmpp.removeListener("element", onElement);
        xmpp.removeListener("offline", onOffline);
      };
      const finish = (enabled: boolean) => {
        if (settled) return;
        settled = true;
        cleanup();
        this.log(enabled ? "debug" : "warn", "chat_stream_management_negotiation_complete", {
          enabled,
          enableSent: streamManagement.enableSent === true,
          resumable: Boolean(streamManagement.id),
        });
        resolve(enabled);
      };
      const checkEnabled = () => {
        if (streamManagement.enabled === true) finish(true);
      };
      const onElement = (element: XmppElementLike) => {
        if (element.is?.("failed", XMPP_STREAM_MANAGEMENT_NS)) {
          finish(false);
          return;
        }
        // The stream-management plugin sets `enabled` in its own continuation
        // after receiving <enabled/>. Polling bridges that short async gap.
        if (element.is?.("enabled", XMPP_STREAM_MANAGEMENT_NS)) {
          queueMicrotask(checkEnabled);
        }
      };
      const onOffline = () => finish(false);

      xmpp.on("element", onElement);
      xmpp.on("offline", onOffline);
      pollTimer = setInterval(checkEnabled, 10);
      timeoutTimer = setTimeout(() => finish(streamManagement.enabled === true), timeoutMs);
      checkEnabled();
    });
  }

  private bindStreamManagementEvents(xmpp: XmppClientLike): void {
    const streamManagement = xmpp.streamManagement as XmppStreamManagementLike;
    streamManagement.on?.("ack", (stanza) => {
      if (this.xmpp !== xmpp) return;
      if (!stanza || (!stanza.is?.("message") && stanza.name !== "message")) return;
      const id = trimToUndefined(stanza.attrs?.id);
      if (!id) return;
      const target = normalizeTransportAddress(stanza.attrs?.to);
      const waiter = this.serverAckWaiters.get(id);
      if (waiter && target) {
        waiter.acknowledgedTargets.add(target);
        this.resolveServerAckWaiterIfComplete(id, waiter);
      }
      this.emit(this.serverAcknowledgementListeners, {
        id,
        acknowledgedAt: Date.now(),
        ...(target ? { toDeviceId: target } : {}),
        ...(trimToUndefined(stanza.getChildText?.("thread"))
          ? { roomId: trimToUndefined(stanza.getChildText?.("thread")) }
          : {}),
        raw: stanza,
      });
    });
    streamManagement.on?.("fail", (stanza) => {
      if (this.xmpp !== xmpp) return;
      if (!stanza || (!stanza.is?.("message") && stanza.name !== "message")) return;
      const id = trimToUndefined(stanza.attrs?.id);
      if (!id) return;
      const waiter = this.serverAckWaiters.get(id);
      if (waiter) {
        this.serverAckWaiters.delete(id);
        waiter.reject(new Error(`chat_server_ack_failed:${id}`));
      }
      const target = normalizeTransportAddress(stanza.attrs?.to);
      this.emit(this.serverSendFailureListeners, {
        id,
        failedAt: Date.now(),
        ...(target ? { toDeviceId: target } : {}),
        ...(trimToUndefined(stanza.getChildText?.("thread"))
          ? { roomId: trimToUndefined(stanza.getChildText?.("thread")) }
          : {}),
        raw: stanza,
      });
      this.emit(this.streamManagementListeners, {
        state: "failed",
        resumable: false,
      });
    });
    streamManagement.on?.("resumed", () => {
      if (this.xmpp !== xmpp) return;
      this.setStatus("online");
      this.emit(this.streamManagementListeners, {
        state: "resumed",
        resumable: true,
      });
      this.log("info", "chat_stream_resumed");
    });
  }

  private createServerAckWaiter(messageId: string, targets: string[]): Promise<void> {
    this.cancelServerAckWaiter(messageId);
    let resolve!: () => void;
    let reject!: (error: Error) => void;
    const promise = new Promise<void>((resolvePromise, rejectPromise) => {
      resolve = resolvePromise;
      reject = rejectPromise;
    });
    // A stream failure can arrive while a multi-target send is still awaiting
    // its remaining writes. Attach a handler immediately so rejection cannot
    // be reported as unhandled before sendMessageInput awaits the promise.
    promise.catch(() => {});
    this.serverAckWaiters.set(messageId, {
      expectedTargets: new Set(normalizeTransportAddressList(targets)),
      acknowledgedTargets: new Set<string>(),
      promise,
      resolve,
      reject,
    });
    return promise;
  }

  private updateServerAckExpectedTargets(messageId: string, targets: string[]): void {
    const waiter = this.serverAckWaiters.get(messageId);
    if (!waiter) return;
    waiter.expectedTargets = new Set(normalizeTransportAddressList(targets));
    this.resolveServerAckWaiterIfComplete(messageId, waiter);
  }

  private resolveServerAckWaiterIfComplete(messageId: string, waiter: ServerAckWaiter): void {
    if (!waiter.expectedTargets.size) return;
    const complete = Array.from(waiter.expectedTargets).every((target) =>
      waiter.acknowledgedTargets.has(target),
    );
    if (!complete) return;
    this.serverAckWaiters.delete(messageId);
    waiter.resolve();
  }

  private cancelServerAckWaiter(messageId: string): void {
    const waiter = this.serverAckWaiters.get(messageId);
    if (!waiter) return;
    this.serverAckWaiters.delete(messageId);
    waiter.reject(new Error(`chat_server_ack_cancelled:${messageId}`));
  }

  private rejectServerAckWaiters(error: Error): void {
    const waiters = Array.from(this.serverAckWaiters.values());
    this.serverAckWaiters.clear();
    waiters.forEach((waiter) => waiter.reject(error));
  }

  private unwrapCarbonMessage(stanza: XmppElementLike): CarbonForwardedMessage | null {
    const sent = stanza.getChild?.("sent", XMPP_CARBONS_NS);
    const received = stanza.getChild?.("received", XMPP_CARBONS_NS);
    const carbon = sent ?? received;
    // A forwarded copy is trusted only from our own bare account.
    if (carbon && addressToString(stanza.attrs?.from)?.toLowerCase() !==
        normalizeBareDeviceId(this.getDeviceId()).toLowerCase()) return null;
    const direction = sent ? "sent" : received ? "received" : undefined;
    const forwarded = carbon?.getChild?.("forwarded", XMPP_FORWARD_NS);
    const message =
      forwarded?.getChild?.("message", "jabber:client") ??
      forwarded?.getChild?.("message");
    if (!direction || !message) return null;
    const timestamp = forwarded ? parseDelayTimestamp(forwarded) : undefined;
    return { direction, message, ...(timestamp !== undefined ? { timestamp } : {}) };
  }

  private normalizeGroupRoom(room: ChatGroupRoom): ChatGroupRoom {
    const roomId = room.roomId.trim();
    if (!roomId) throw new Error("chat_room_id_required");
    const mucJid = normalizeBareDeviceId(room.mucJid).toLowerCase();
    if (!mucJid || !mucJid.includes("@")) {
      throw new Error("chat_muc_jid_required");
    }
    const ownBareJid = normalizeBareDeviceId(this.config.deviceId).toLowerCase();
    const memberJids = Array.from(
      new Set(
        [ownBareJid, ...room.memberJids]
          .map((jid) => normalizeBareDeviceId(jid).toLowerCase())
          .filter(Boolean),
      ),
    );
    return {
      roomId,
      mucJid,
      memberJids,
      ...(trimToUndefined(room.nickname)
        ? { nickname: trimToUndefined(room.nickname) }
        : {}),
    };
  }

  private rememberGroupRoom(room: ChatGroupRoom): void {
    const previous = this.groupRooms.get(room.roomId);
    if (previous && previous.mucJid !== room.mucJid) {
      this.groupRoomIdsByMucJid.delete(previous.mucJid);
      this.joinedGroupRooms.delete(room.roomId);
    }
    this.groupRooms.set(room.roomId, room);
    this.groupRoomIdsByMucJid.set(room.mucJid, room.roomId);
  }

  private getGroupNickname(room: ChatGroupRoom): string {
    const preferred = room.nickname ?? `${this.config.userId}-${this.config.localDeviceId}`;
    return preferred
      .trim()
      .replace(/[^a-zA-Z0-9._-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^[._-]+|[._-]+$/g, "")
      .slice(0, 96) || `device-${this.config.localDeviceId}`;
  }

  private async ensureGroupRoomJoined(roomId: string): Promise<void> {
    if (this.joinedGroupRooms.has(roomId)) return;
    const pending = this.pendingGroupJoins.get(roomId);
    if (pending) {
      await pending.promise;
      return;
    }

    const room = this.groupRooms.get(roomId);
    if (!room) throw new Error(`chat_muc_room_unknown:${roomId}`);
    const occupantJid = `${room.mucJid}/${this.getGroupNickname(room)}`;

    let resolveJoin!: () => void;
    let rejectJoin!: (error: Error) => void;
    const joined = new Promise<void>((resolve, reject) => {
      resolveJoin = resolve;
      rejectJoin = reject;
    });
    const timeout = setTimeout(() => {
      this.pendingGroupJoins.delete(roomId);
      rejectJoin(new Error(`chat_muc_join_timeout:${roomId}`));
    }, DEFAULT_MUC_JOIN_TIMEOUT_MS);
    this.pendingGroupJoins.set(roomId, {
      promise: joined,
      resolve: resolveJoin,
      reject: rejectJoin,
      timeout,
    });
    joined.catch(() => {});

    try {
      await this.requireXmpp().send(
        xml(
          "presence",
          { to: occupantJid },
          xml("x", { xmlns: XMPP_MUC_NS }),
        ),
      );
      await joined;
    } catch (error) {
      const waiter = this.pendingGroupJoins.get(roomId);
      if (waiter) {
        clearTimeout(waiter.timeout);
        this.pendingGroupJoins.delete(roomId);
        waiter.reject(error instanceof Error ? error : new Error(String(error)));
      }
      throw error;
    }
  }

  private clearGroupJoinRetry(roomId: string): void {
    const timer = this.groupJoinRetryTimers.get(roomId);
    if (timer) clearTimeout(timer);
    this.groupJoinRetryTimers.delete(roomId);
    this.groupJoinRetryAttempts.delete(roomId);
  }

  private clearAllGroupJoinRetries(): void {
    for (const timer of this.groupJoinRetryTimers.values()) {
      clearTimeout(timer);
    }
    this.groupJoinRetryTimers.clear();
    this.groupJoinRetryAttempts.clear();
  }

  private scheduleGroupJoinRetry(roomId: string): void {
    if (
      this.joinedGroupRooms.has(roomId) ||
      this.groupJoinRetryTimers.has(roomId) ||
      !this.groupRooms.has(roomId)
    ) {
      return;
    }
    const attempt = this.groupJoinRetryAttempts.get(roomId) ?? 0;
    const delayMs = MUC_JOIN_RETRY_DELAYS_MS[attempt];
    if (delayMs === undefined) {
      this.log("warn", "chat_muc_join_retry_exhausted", { roomId, attempt });
      return;
    }
    this.groupJoinRetryAttempts.set(roomId, attempt + 1);
    const timer = setTimeout(() => {
      this.groupJoinRetryTimers.delete(roomId);
      if (this.status !== "online" || !this.groupRooms.has(roomId)) return;
      this.ensureGroupRoomJoined(roomId).catch((error) => {
        this.log("warn", "chat_muc_join_retry_failed", {
          roomId,
          attempt: attempt + 1,
          error,
        });
        this.scheduleGroupJoinRetry(roomId);
      });
    }, delayMs);
    this.groupJoinRetryTimers.set(roomId, timer);
    this.log("info", "chat_muc_join_retry_scheduled", {
      roomId,
      attempt: attempt + 1,
      delayMs,
    });
  }

  private async rejoinGroupRooms(): Promise<void> {
    this.joinedGroupRooms.clear();
    const roomIds = Array.from(this.groupRooms.keys());
    const results = await Promise.allSettled(
      roomIds.map((roomId) => this.ensureGroupRoomJoined(roomId)),
    );
    results.forEach((result, index) => {
      if (result.status === "rejected") {
        const roomId = roomIds[index];
        this.log("warn", "chat_muc_rejoin_failed", {
          roomId,
          error: result.reason,
        });
        if (roomId) this.scheduleGroupJoinRetry(roomId);
      }
    });
  }

  private rejectPendingGroupJoins(error: Error): void {
    const pending = Array.from(this.pendingGroupJoins.values());
    this.pendingGroupJoins.clear();
    pending.forEach((entry) => {
      clearTimeout(entry.timeout);
      entry.reject(error);
    });
  }

  private handleGroupPresence(stanza: XmppElementLike): void {
    const from = addressToString(stanza.attrs?.from) ?? "";
    const mucJid = normalizeBareDeviceId(from).toLowerCase();
    const roomId = this.groupRoomIdsByMucJid.get(mucJid);
    if (!roomId) return;

    const mucUser =
      stanza.getChild?.("x", XMPP_MUC_USER_NS) ?? stanza.getChild?.("x");
    const realJid = trimToUndefined(mucUser?.getChild?.("item")?.attrs?.jid);
    const occupantKey = from.toLowerCase();
    if (stanza.attrs?.type === "unavailable") {
      this.mucOccupantRealJids.delete(occupantKey);
    } else if (realJid) {
      this.mucOccupantRealJids.set(occupantKey, realJid);
    }

    const room = this.groupRooms.get(roomId);
    const expectedOccupant = room
      ? `${room.mucJid}/${this.getGroupNickname(room)}`.toLowerCase()
      : "";
    const raw = toRawXmlString(stanza);
    const isSelfPresence =
      from.toLowerCase() === expectedOccupant ||
      /<status\b[^>]*\bcode=["']110["']/.test(raw);
    if (!isSelfPresence) return;

    const waiter = this.pendingGroupJoins.get(roomId);
    if (stanza.attrs?.type === "error") {
      const parsed = parseStanzaError(stanza);
      const error = new Error(
        `chat_muc_join_error:${roomId}:${parsed.condition ?? "unknown"}`,
      );
      if (waiter) {
        clearTimeout(waiter.timeout);
        this.pendingGroupJoins.delete(roomId);
        waiter.reject(error);
      }
      return;
    }
    if (stanza.attrs?.type === "unavailable") {
      this.joinedGroupRooms.delete(roomId);
      return;
    }

    this.joinedGroupRooms.add(roomId);
    this.clearGroupJoinRetry(roomId);
    if (waiter) {
      clearTimeout(waiter.timeout);
      this.pendingGroupJoins.delete(roomId);
      waiter.resolve();
    }
    this.log("info", "chat_muc_joined", { roomId, mucJid });
  }

  private getMucRealSenderJid(stanza: XmppElementLike): string | undefined {
    const mucUser =
      stanza.getChild?.("x", XMPP_MUC_USER_NS) ?? stanza.getChild?.("x");
    return (
      trimToUndefined(mucUser?.getChild?.("item")?.attrs?.jid) ??
      this.mucOccupantRealJids.get(
        (addressToString(stanza.attrs?.from) ?? "").toLowerCase(),
      )
    );
  }

  private parseGroupInvitation(
    stanza: XmppElementLike,
  ): ChatGroupInvitationEvent | null {
    const directInvite = stanza.getChild?.("x", XMPP_DIRECT_MUC_INVITE_NS);
    const directMucJid = normalizeBareDeviceId(
      trimToUndefined(directInvite?.attrs?.jid),
    );
    if (directMucJid) {
      const fromJid = normalizeBareDeviceId(addressToString(stanza.attrs?.from));
      return {
        mucJid: directMucJid,
        ...(fromJid ? { fromJid } : {}),
        ...(trimToUndefined(directInvite?.attrs?.reason)
          ? { reason: trimToUndefined(directInvite?.attrs?.reason) }
          : {}),
        ...(trimToUndefined(directInvite?.attrs?.password)
          ? { password: trimToUndefined(directInvite?.attrs?.password) }
          : {}),
        raw: stanza,
      };
    }

    const mucUser = stanza.getChild?.("x", XMPP_MUC_USER_NS);
    const mediatedInvite = mucUser?.getChild?.("invite");
    if (!mediatedInvite) return null;
    const mucJid = normalizeBareDeviceId(addressToString(stanza.attrs?.from));
    if (!mucJid) return null;
    const fromJid = normalizeBareDeviceId(
      trimToUndefined(mediatedInvite.attrs?.from),
    );
    const reason = trimToUndefined(mediatedInvite.getChildText?.("reason"));
    const password = trimToUndefined(mucUser?.getChildText?.("password"));
    return {
      mucJid,
      ...(fromJid ? { fromJid } : {}),
      ...(reason ? { reason } : {}),
      ...(password ? { password } : {}),
      raw: stanza,
    };
  }

  private async handleStanza(stanza: XmppElementLike): Promise<void> {
    this.resolvePendingIq(stanza);
    if (stanza.is?.("presence")) {
      this.handleGroupPresence(stanza);
      return;
    }
    if (!stanza.is?.("message")) return;
    await this.config.encryption?.onStanza?.(stanza, this.getEncryptionContext());

    // Checked on the stanza as delivered, never on a carbon's inner copy: the
    // server addresses these to each account directly, so one that arrives any
    // other way is not a server event.
    if (stanza.getChild?.("event", XMPP_SERVER_EVENT_NS)) {
      const serverEvent = parseChatServerEvent(stanza, this.config.domain);
      if (serverEvent) {
        if (serverEvent.type === "message_timestamp") {
          const { messageId, roomId, timestamp } = serverEvent.data;
          if (typeof messageId !== "string" || typeof roomId !== "string" ||
              !isServerMessageTimestamp(timestamp)) return;
          const key = this.editTargetKey(roomId, messageId);
          this.serverMessageTimestamps.set(key, timestamp);
          const target = this.editTargets.get(key);
          if (target) target.timestamp = timestamp;
          if (this.serverMessageTimestamps.size > 2000)
            this.serverMessageTimestamps.delete(this.serverMessageTimestamps.keys().next().value!);
        }
        this.log("debug", "chat_server_event_received", {
          id: serverEvent.id,
          type: serverEvent.type,
        });
        this.emit(this.serverEventListeners, serverEvent);
      } else {
        this.log("warn", "chat_server_event_rejected", {
          id: stanza.attrs?.id,
          from: addressToString(stanza.attrs?.from),
        });
      }
      return;
    }

    const carbon = this.unwrapCarbonMessage(stanza);
    if (!carbon && (stanza.getChild?.("sent", XMPP_CARBONS_NS) ||
                    stanza.getChild?.("received", XMPP_CARBONS_NS))) return;
    const messageStanza = carbon?.message ?? stanza;
    // XEP-0297 puts the replay delay beside the inner message. Preserve it
    // before unwrapping so older linked-device copies retain their archive time.
    const transportTimestamp = parseServerMessageTimestamp(messageStanza, this.config.domain) ??
      carbon?.timestamp ?? parseTrustedDelayTimestamp(messageStanza, this.config.domain);
    const attrs = messageStanza.attrs ?? {};
    const groupInvitation = this.parseGroupInvitation(messageStanza);
    if (groupInvitation) {
      this.emit(this.groupInvitationListeners, groupInvitation);
      this.log("info", "chat_muc_invitation_received", {
        mucJid: groupInvitation.mucJid,
        fromJid: groupInvitation.fromJid,
      });
      return;
    }
    const isGroupMessage = attrs.type === "groupchat";
    const mucSenderJid = isGroupMessage
      ? this.getMucRealSenderJid(messageStanza)
      : undefined;
    const stanzaFromAddress = addressToString(attrs.from);
    const fromFullAddress = normalizeTransportAddress(
      mucSenderJid ?? stanzaFromAddress,
    );
    const fromDeviceId =
      fromFullAddress || normalizeBareDeviceId(mucSenderJid ?? stanzaFromAddress);
    const fromUserId = getUserIdFromChatAddress(fromFullAddress) || "";
    const toDeviceId = isGroupMessage
      ? this.getDeviceId()
      : attrs.to
      ? normalizeTransportAddress(addressToString(attrs.to)) || addressToString(attrs.to)
      : this.getDeviceId();
    const mucRoomId = isGroupMessage
      ? this.groupRoomIdsByMucJid.get(normalizeBareDeviceId(stanzaFromAddress))
      : undefined;
    const roomId =
      trimToUndefined(messageStanza.getChildText?.("thread") ?? undefined) ?? mucRoomId;
    this.rememberRoomPeer(roomId, carbon?.direction === "sent" ? toDeviceId : fromDeviceId);
    this.log("debug", "chat_message_stanza_received", {
      id: attrs.id,
      type: attrs.type,
      fromDeviceId,
      toDeviceId,
      roomId,
      carbonDirection: carbon?.direction,
    });

    const receipt = messageStanza.getChild?.("received", XMPP_RECEIPTS_NS);
    const markerReceived = messageStanza.getChild?.("received", XMPP_CHAT_MARKERS_NS);
    const displayed = messageStanza.getChild?.("displayed", XMPP_CHAT_MARKERS_NS);
    const receiptId = receipt?.attrs?.id ?? markerReceived?.attrs?.id;
    if (receiptId) {
      if (roomId) {
        this.emit(this.deliveryListeners, {
          id: receiptId,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          status: "delivered",
          raw: messageStanza,
        });
        this.log("debug", "chat_delivery_received", {
          id: receiptId,
          roomId,
          status: "delivered",
          fromDeviceId,
        });
      } else {
        this.log("debug", "chat_delivery_ignored_missing_room", {
          id: receiptId,
          fromDeviceId,
        });
      }
      return;
    }

    if (displayed?.attrs?.id) {
      if (roomId) {
        this.emit(this.deliveryListeners, {
          id: displayed.attrs.id,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          status: "read",
          raw: messageStanza,
        });
        this.log("debug", "chat_delivery_received", {
          id: displayed.attrs.id,
          roomId,
          status: "read",
          fromDeviceId,
        });
      } else {
        this.log("debug", "chat_read_marker_ignored_missing_room", {
          id: displayed.attrs.id,
          fromDeviceId,
        });
      }
      return;
    }

    if (attrs.type === "error") {
      const errorEvent = parseStanzaError(messageStanza);
      this.log("warn", "chat_message_error_stanza_received", {
        id: attrs.id,
        roomId,
        condition: errorEvent.condition,
        text: errorEvent.text,
      });
      this.emit(this.errorListeners, {
        ...errorEvent,
        id: attrs.id,
        fromUserId: fromUserId || undefined,
        fromFullAddress: fromFullAddress || undefined,
        fromDeviceId,
        toDeviceId,
        roomId,
        raw: messageStanza,
      });
      return;
    }

    const retraction = messageStanza.getChild?.("retract", XMPP_RETRACT_NS);
    if (retraction) {
      if (transportTimestamp === undefined) return;
      const targetMessageId = trimToUndefined(retraction.attrs?.id);
      if (targetMessageId && roomId && toDeviceId) {
        const eventId = attrs.id || generateMessageId();
        await this.processRetraction({
          id: eventId,
          targetMessageId,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          timestamp: transportTimestamp,
          raw: messageStanza,
        });
      } else {
        this.log("warn", "chat_message_retraction_ignored_missing_context", {
          id: attrs.id,
          targetMessageId,
          roomId,
          fromDeviceId,
          hasToDeviceId: Boolean(toDeviceId),
        });
      }

      // XEP-0424 includes a human-readable fallback body for clients that do
      // not understand retractions. Supporting clients must not surface that
      // fallback as a new chat message.
      return;
    }

    const composing = messageStanza.getChild?.("composing", XMPP_CHATSTATES_NS);
    const paused = messageStanza.getChild?.("paused", XMPP_CHATSTATES_NS);
    const gone = messageStanza.getChild?.("gone", XMPP_CHATSTATES_NS);
    if ((composing || paused) && roomId) {
      this.emit(this.typingListeners, {
        fromUserId,
        fromFullAddress,
        fromDeviceId,
        toDeviceId,
        roomId,
        isTyping: Boolean(composing),
        raw: messageStanza,
      });
      this.log("debug", "chat_typing_received", {
        roomId,
        fromDeviceId,
        isTyping: Boolean(composing),
      });
    }
    if (gone) {
      if (transportTimestamp === undefined) return;
      if (roomId) {
        const eventId = attrs.id || generateMessageId();
        this.emit(this.threadGoneListeners, {
          id: eventId,
          fromUserId,
          fromFullAddress,
          fromDeviceId,
          toDeviceId,
          roomId,
          timestamp: transportTimestamp,
          raw: messageStanza,
        });
        this.log("debug", "chat_thread_gone_received", {
          id: eventId,
          roomId,
          fromDeviceId,
        });
      } else {
        this.log("debug", "chat_thread_gone_ignored_missing_room", {
          id: attrs.id,
          fromDeviceId,
        });
      }
    }

    const decoded = await this.decodePayload(messageStanza);
    const body = decoded.body;
    const attachments = normalizeAttachmentPayload(decoded.attachments);
    if (
      this.config.requireEncryptedAttachments &&
      attachments?.some((attachment) => !isEncryptedChatAttachment(attachment))
    ) {
      const error = new Error("chat_attachment_encryption_required");
      this.log("warn", "chat_attachment_rejected_unencrypted", {
        id: attrs.id,
        roomId,
        fromDeviceId,
      });
      this.emit(this.errorListeners, {
        id: attrs.id,
        fromUserId: fromUserId || undefined,
        fromFullAddress: fromFullAddress || undefined,
        fromDeviceId,
        toDeviceId,
        roomId,
        error,
        raw: messageStanza,
      });
      return;
    }
    if (
      this.config.requireEncryptedAttachments &&
      attachments?.some(
        (attachment) => !hasChatAttachmentDownloadCapability(attachment),
      )
    ) {
      const error = new Error("chat_attachment_download_capability_required");
      this.log("warn", "chat_attachment_rejected_without_capability", {
        id: attrs.id,
        roomId,
        fromDeviceId,
      });
      this.emit(this.errorListeners, {
        id: attrs.id,
        fromUserId: fromUserId || undefined,
        fromFullAddress: fromFullAddress || undefined,
        fromDeviceId,
        toDeviceId,
        roomId,
        error,
        raw: messageStanza,
      });
      return;
    }
    if (!body.trim() && !attachments?.length) {
      this.log("debug", gone ? "chat_message_ignored_chat_state" : "chat_message_ignored_empty", {
        id: attrs.id,
        fromDeviceId,
        roomId,
      });
      return;
    }
    if (!roomId || !toDeviceId) {
      this.log("debug", "chat_message_ignored_missing_target_context", {
        id: attrs.id,
        fromDeviceId,
        roomId,
        hasToDeviceId: Boolean(toDeviceId),
      });
      return;
    }
    const emergencyTag = messageStanza.getChild?.("emergency", XMPP_EMERGENCY_NS);
    const emergencyTagMetadata = emergencyTag
      ? {
          messageType: CHAT_EMERGENCY_MESSAGE_TYPE,
          emergencyType: emergencyTag.attrs?.type,
          emergencyAlertId: emergencyTag.attrs?.["alert-id"],
          emergencyTriggeredAt: emergencyTag.attrs?.["triggered-at"],
        }
      : undefined;
    const originId = trimToUndefined(
      messageStanza.getChild?.("origin-id", XMPP_STABLE_ID_NS)?.attrs?.id,
    );
    const decodedMetadata: Record<string, unknown> = emergencyTagMetadata
      ? { ...(decoded.metadata ?? {}), ...emergencyTagMetadata }
      : { ...(decoded.metadata ?? {}) };
    if (originId) decodedMetadata.originId = originId;
    const metadata = normalizeMessageMetadata(
      decodedMetadata,
      inferMessageType(decodedMetadata, body),
    );
    const emittedMessageId = attrs.id || generateMessageId();
    if (transportTimestamp === undefined) {
      this.log("warn", "chat_message_server_timestamp_missing", { id: emittedMessageId, roomId });
      this.emit(this.errorListeners, {
        id: emittedMessageId, roomId, fromDeviceId,
        error: new Error("chat_message_server_timestamp_missing"), raw: messageStanza,
      });
      return;
    }
    metadata.serverTimestampMs = transportTimestamp;
    const message: ChatMessage = {
      id: emittedMessageId,
      fromUserId,
      fromFullAddress,
      fromDeviceId,
      toDeviceId,
      roomId,
      body,
      timestamp: transportTimestamp,
      metadata,
      ...(attachments?.length ? { attachments } : {}),
      raw: messageStanza,
    };
    const originalAuthorAddress = fromFullAddress || fromDeviceId;
    const receiptRequest = messageStanza.getChild?.("request", XMPP_RECEIPTS_NS);
    const receiptRequested = Boolean(
      !carbon && !isGroupMessage && attrs.id && receiptRequest && fromDeviceId,
    );
    let receiptSent = false;
    let receiptPromise: Promise<void> | null = null;
    const delivery: ChatIncomingDeliveryContext = {
      receiptRequested,
      acknowledgeDelivered: async () => {
        if (!receiptRequested || receiptSent) return;
        if (!receiptPromise) {
          receiptPromise = this.sendReceipt({
            toDeviceId: fromDeviceId,
            roomId,
            messageId: attrs.id!,
          }).then(() => {
            receiptSent = true;
            this.log("debug", "chat_delivery_receipt_sent", {
              id: attrs.id,
              roomId,
              toDeviceId: fromDeviceId,
              mode: this.config.deliveryReceiptMode,
            });
          });
        }
        try {
          await receiptPromise;
        } catch (error) {
          receiptPromise = null;
          throw error;
        }
      },
    };
    this.rememberMessageAuthor(roomId, emittedMessageId, originalAuthorAddress);
    await this.emitValidatedMessage(message, delivery);
    this.flushPendingRetraction(roomId, emittedMessageId, originalAuthorAddress);
    this.log("debug", "chat_message_received", {
      id: emittedMessageId,
      roomId,
      fromDeviceId,
      messageType: metadata.messageType,
      hasAttachments: Boolean(attachments?.length),
    });
  }

  private async sendReceipt(input: {
    toDeviceId: DeviceId;
    roomId?: string;
    messageId: string;
  }): Promise<void> {
    const xmpp = this.requireXmpp();
    const receiptId = `rcpt-${generateMessageId()}`;
    const children: XmppChild[] = [
      xml("received", { xmlns: XMPP_RECEIPTS_NS, id: input.messageId }),
    ];
    if (input.roomId) children.unshift(xml("thread", {}, input.roomId));
    if (
      this.config.awaitServerAcknowledgement &&
      (xmpp.streamManagement as XmppStreamManagementLike).enabled !== true
    ) {
      throw new Error("chat_stream_management_unavailable");
    }
    const serverAckPromise = this.config.awaitServerAcknowledgement
      ? this.createServerAckWaiter(receiptId, [input.toDeviceId])
      : null;
    try {
      await xmpp.send(
        xml("message", {
          to: input.toDeviceId,
          type: "chat",
          id: receiptId,
        }, ...children),
      );
      if (serverAckPromise) {
        this.updateServerAckExpectedTargets(receiptId, [input.toDeviceId]);
        await serverAckPromise;
      }
    } catch (error) {
      this.cancelServerAckWaiter(receiptId);
      throw error;
    }
  }

  private getEncryptionContext(): ChatEncryptionContext {
    return {
      getDeviceId: () => this.getDeviceId(),
      getBareDeviceId: () => this.getBareDeviceId(),
      sendIq: (input) => this.sendIq(input),
      logger: this.config.logger,
    };
  }

  private getAttachmentUploadContext(roomId: string): ChatAttachmentUploadContext {
    return {
      roomId,
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      requestSlot: (input) => this.requestAttachmentUploadSlot(input),
      logger: this.config.logger,
    };
  }

  private getAttachmentResolveContext(): ChatAttachmentResolveContext {
    return {
      apiKey: this.config.apiKey,
      xmppDomain: this.config.domain,
      userId: this.config.userId,
      deviceId: this.config.localDeviceId,
      logger: this.config.logger,
    };
  }

  private rememberRoomPeer(roomId?: string, peerDeviceId?: string): void {
    const normalizedRoomId = roomId?.trim();
    const normalizedPeerDeviceId = normalizeTransportAddress(peerDeviceId);
    if (!normalizedRoomId || !normalizedPeerDeviceId) return;
    if (isOwnTransportTarget(normalizedPeerDeviceId, this.getDeviceId(), this.getBareDeviceId())) return;
    const peers = this.roomPeers.get(normalizedRoomId) ?? new Set<string>();
    const previousSize = peers.size;
    peers.add(normalizedPeerDeviceId);
    this.roomPeers.set(normalizedRoomId, peers);
    if (peers.size !== previousSize) {
      this.log("debug", "chat_room_peer_remembered", {
        roomId: normalizedRoomId,
        peerDeviceId: normalizedPeerDeviceId,
        peerCount: peers.size,
      });
    }
  }

  private rememberRoomPeers(roomId?: string, peerDeviceIds?: string[]): void {
    peerDeviceIds?.forEach((peerDeviceId) => this.rememberRoomPeer(roomId, peerDeviceId));
  }

  private async resolveRoomForUserId(input: ChatRoomLookupInput): Promise<ChatRoom> {
    const userId = input.userId.trim();
    if (!userId) throw new Error("chat_user_id_required");
    const provider = this.config.roomDirectory?.getOrCreateRoom;
    if (!provider) throw new Error("chat_room_directory_get_or_create_required");
    const room = await provider({ userId, metadata: input.metadata });
    const normalizedRoomId = room.roomId.trim();
    if (!normalizedRoomId) throw new Error("chat_room_id_required");
    this.rememberRoomPeers(
      normalizedRoomId,
      deriveRoomDeviceIds(room),
    );
    return { ...room, roomId: normalizedRoomId };
  }

  private async resolveRoomTargets(input: {
    roomId?: string;
    explicitDeviceIds?: string[];
    targetScope: ChatTargetScope;
  }): Promise<string[]> {
    const explicit = normalizeTargetAddressList(
      input.explicitDeviceIds ?? [],
      input.targetScope,
    );
    if (input.roomId) this.rememberRoomPeers(input.roomId, explicit);
    const resolverDeviceIds = input.roomId ? await this.getPeerDeviceIds(input.roomId) : [];
    const cachedDeviceIds = input.roomId ? this.getCachedRoomPeers(input.roomId) : [];
    const ownTransportAddress = normalizeTransportAddress(this.getDeviceId());
    const ownBareAddress = this.getBareDeviceId();
    const targets = normalizeTargetAddressList(
      [...explicit, ...resolverDeviceIds, ...cachedDeviceIds],
      input.targetScope,
    ).filter((target) => !isOwnTransportTarget(target, ownTransportAddress, ownBareAddress));
    this.log("debug", "chat_room_targets_resolved", {
      roomId: input.roomId,
      targetScope: input.targetScope,
      explicitCount: explicit.length,
      resolverCount: resolverDeviceIds.length,
      cachedCount: cachedDeviceIds.length,
      targetCount: targets.length,
    });
    if (!targets.length) {
      const suffix = input.roomId ? `:${input.roomId}` : "";
      throw new Error(`chat_room_peer_unknown${suffix}`);
    }
    return targets;
  }

  private getGroupRoomForTransport(roomId?: string): ChatGroupRoom | undefined {
    const normalizedRoomId = roomId?.trim();
    return normalizedRoomId ? this.groupRooms.get(normalizedRoomId) : undefined;
  }

  private getGroupEncryptionRecipientJids(room: ChatGroupRoom): DeviceId[] {
    const occupantPrefix = `${normalizeBareDeviceId(room.mucJid).toLowerCase()}/`;
    const activeOccupants = Array.from(this.mucOccupantRealJids.entries())
      .filter(([occupantJid]) => occupantJid.startsWith(occupantPrefix))
      .map(([, realJid]) => normalizeBareDeviceId(realJid))
      .filter(Boolean);
    const recipients = Array.from(
      new Set(
        [...room.memberJids, ...activeOccupants]
          .map((jid) => normalizeBareDeviceId(jid))
          .filter(Boolean),
      ),
    );
    this.log("debug", "chat_muc_encryption_recipients_resolved", {
      roomId: room.roomId,
      configuredCount: room.memberJids.length,
      activeOccupantCount: activeOccupants.length,
      recipientCount: recipients.length,
    });
    return recipients;
  }

  private getCachedRoomPeers(roomId: string): string[] {
    return Array.from(this.roomPeers.get(roomId.trim()) ?? []);
  }

  private async resolveRoomDeviceIds(roomId: string): Promise<DeviceId[]> {
    const normalizedRoomId = roomId.trim();
    if (!normalizedRoomId) return [];
    if (this.config.roomDirectory?.getPeerDeviceIds) {
      const resolved = await this.config.roomDirectory.getPeerDeviceIds(normalizedRoomId);
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_directory_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length,
      });
      return normalized;
    }
    if (this.config.resolveRoomDeviceIds) {
      const resolved = await this.config.resolveRoomDeviceIds(normalizedRoomId);
      const normalized = normalizeTransportAddressList(resolved);
      this.log("debug", "chat_room_fallback_peer_devices_resolved", {
        roomId: normalizedRoomId,
        deviceCount: normalized.length,
      });
      return normalized;
    }
    this.log("debug", "chat_room_peer_devices_unresolved", { roomId: normalizedRoomId });
    return [];
  }

  private async sendToTargets(
    targetDeviceIds: string[],
    send: (targetDeviceId: string) => Promise<unknown>,
  ): Promise<string[]> {
    const targets = normalizeTransportAddressList(targetDeviceIds);
    if (!targets.length) throw new Error("chat_targets_required");

    const results = await Promise.all(
      targets.map(async (targetDeviceId) => {
        try {
          await send(targetDeviceId);
          return { ok: true as const, targetDeviceId };
        } catch (error) {
          this.log("warn", "chat_target_send_failed", { targetDeviceId, error });
          return { ok: false as const, error };
        }
      }),
    );
    const successfulTargets = results
      .filter((result): result is { ok: true; targetDeviceId: string } => result.ok)
      .map((result) => result.targetDeviceId);
    if (successfulTargets.length) return successfulTargets;
    throw results.find((result) => !result.ok)?.error ?? new Error("chat_send_failed");
  }

  private clearTypingAutoPause(roomId: string): void {
    const timer = this.typingAutoPauseTimers.get(roomId);
    if (!timer) return;
    clearTimeout(timer);
    this.typingAutoPauseTimers.delete(roomId);
  }

  private scheduleTypingAutoPause(roomId: string, delayMs: number): void {
    if (!Number.isFinite(delayMs) || delayMs <= 0) return;
    const timer = setTimeout(() => {
      this.typingAutoPauseTimers.delete(roomId);
      this.sendTyping({ roomId, isTyping: false }).catch((error: unknown) => {
        this.emit(this.errorListeners, { error, roomId });
      });
    }, delayMs);
    this.typingAutoPauseTimers.set(roomId, timer);
  }

  private async encodePayload(
    input: ChatEncryptInput,
  ): Promise<Required<ChatEncodedPayload>> {
    const encrypted = await this.config.encryption?.encrypt?.(input, this.getEncryptionContext());
    if (Array.isArray(encrypted)) {
      this.log("debug", "chat_payload_encoded_encrypted_array", {
        messageType: input.metadata.messageType,
        childCount: encrypted.length,
      });
      return { body: input.body, children: encrypted };
    }
    if (encrypted) {
      this.log("debug", "chat_payload_encoded_encrypted", {
        messageType: input.metadata.messageType,
        childCount: encrypted.children?.length ?? 0,
      });
      return {
        body: encrypted.body ?? input.body,
        children: encrypted.children ?? [],
      };
    }

    if (this.config.requireEncryptedPayloads) {
      throw new Error("chat_payload_encryption_required");
    }

    this.log("debug", "chat_payload_encoded_plain", {
      messageType: input.metadata.messageType,
      hasAttachments: Boolean(input.attachments?.length),
    });
    return {
      body: input.body,
      children: [
        xml(
          "lula",
          { xmlns: XMPP_CHAT_NS },
          encodeJsonBase64({
            metadata: input.metadata,
            ...(input.attachments?.length
              ? { attachments: serializeAttachmentsForWire(input.attachments) }
              : {}),
          }),
        ),
      ],
    };
  }

  private async decodePayload(stanza: XmppElementLike): Promise<ChatDecryptedMessage> {
    const decrypted = await this.config.encryption?.decrypt?.(
      { stanza },
      this.getEncryptionContext(),
    );
    if (decrypted) {
      this.log("debug", "chat_payload_decoded_encrypted", {
        hasBody: Boolean(decrypted.body?.trim()),
        hasAttachments: Boolean(decrypted.attachments?.length),
      });
      return decrypted;
    }

    if (this.config.requireEncryptedPayloads) {
      throw new Error("chat_payload_encryption_required");
    }

    const body = stanza.getChildText?.("body") ?? "";
    const encodedMetadata = stanza.getChild?.("lula", XMPP_CHAT_NS)?.getText?.();
    const metadataPayload = encodedMetadata ? decodeJsonBase64(encodedMetadata) : null;
    const metadata =
      metadataPayload &&
      typeof metadataPayload === "object" &&
      !Array.isArray(metadataPayload) &&
      isRecord((metadataPayload as Record<string, unknown>).metadata)
        ? (metadataPayload as { metadata: Record<string, unknown> }).metadata
        : undefined;
    const attachments =
      metadataPayload && typeof metadataPayload === "object" && !Array.isArray(metadataPayload)
        ? normalizeAttachmentPayload((metadataPayload as Record<string, unknown>).attachments)
        : undefined;

    this.log("debug", "chat_payload_decoded_plain", {
      hasBody: Boolean(body.trim()),
      hasMetadata: Boolean(metadata),
      hasAttachments: Boolean(attachments?.length),
    });
    return { body, metadata, attachments };
  }

  private setStatus(status: ChatStatus, error?: unknown): void {
    this.status = status;
    this.log(status === "error" ? "error" : "debug", "chat_status_changed", {
      status,
      deviceId: this.onlineDeviceId,
      ...(error ? { error } : {}),
    });
    this.emit(this.statusListeners, {
      status,
      deviceId: this.onlineDeviceId,
      error,
    });
  }

  private requireXmpp(): XmppClientLike {
    if (!this.xmpp) throw new Error("chat_client_not_connected");
    return this.xmpp;
  }

  private resolvePendingIq(stanza: XmppElementLike): void {
    if (!stanza.is?.("iq")) return;
    const id = stanza.attrs?.id;
    if (!id) return;

    const pending = this.pendingIqMap.get(id);
    if (!pending) return;

    this.pendingIqMap.delete(id);
    clearTimeout(pending.timeout);

    if (stanza.attrs?.type === "error") {
      pending.reject(new Error(`chat_iq_error:${toRawXmlString(stanza) || id}`));
      return;
    }

    pending.resolve(stanza);
  }

  private rejectPendingIq(error: Error): void {
    const entries = Array.from(this.pendingIqMap.values());
    this.pendingIqMap.clear();
    for (const entry of entries) {
      clearTimeout(entry.timeout);
      entry.reject(error);
    }
  }

  private async sendIq(input: {
    type: "get" | "set";
    payload: XmppChild;
    to?: string;
    timeoutMs?: number;
  }): Promise<XmppElementLike> {
    const xmpp = this.requireXmpp();
    const id = generateIqId();
    const timeoutMs = input.timeoutMs ?? DEFAULT_IQ_TIMEOUT_MS;

    return new Promise<XmppElementLike>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pendingIqMap.delete(id);
        reject(new Error(`chat_iq_timeout:${id}`));
      }, timeoutMs);

      this.pendingIqMap.set(id, { resolve, reject, timeout });
      const attrs = input.to
        ? { type: input.type, id, to: input.to }
        : { type: input.type, id };

      void xmpp.send(xml("iq", attrs, input.payload)).catch((error: unknown) => {
        clearTimeout(timeout);
        this.pendingIqMap.delete(id);
        reject(error instanceof Error ? error : new Error(String(error)));
      });
    });
  }

  private async requestAttachmentUploadSlot(
    input: ChatAttachmentUploadSlotRequest,
  ): Promise<ChatAttachmentUploadSlot> {
    const stanza = await this.sendIq({
      type: "get",
      to: this.config.uploadService,
      payload: xml("request", {
        xmlns: XMPP_HTTP_UPLOAD_NS,
        filename: input.name,
        size: String(Math.max(1, Math.floor(input.size))),
        "content-type": input.mimeType,
      }),
    });
    return parseUploadSlotResponse(stanza);
  }

  private rememberMessageAuthor(
    roomId: string,
    messageId: string,
    authorAddress?: string | null,
  ): void {
    const normalizedRoomId = roomId.trim();
    const normalizedMessageId = messageId.trim();
    const normalizedAuthor = normalizeTransportAddress(authorAddress) ||
      normalizeBareDeviceId(authorAddress);
    if (!normalizedRoomId || !normalizedMessageId || !normalizedAuthor) return;

    let roomAuthors = this.messageAuthorsByRoom.get(normalizedRoomId);
    if (!roomAuthors) {
      roomAuthors = new Map();
      this.messageAuthorsByRoom.set(normalizedRoomId, roomAuthors);
      while (this.messageAuthorsByRoom.size > MAX_RUNTIME_MESSAGE_AUTHOR_ROOMS) {
        const oldestRoomId = this.messageAuthorsByRoom.keys().next().value;
        if (!oldestRoomId) break;
        this.messageAuthorsByRoom.delete(oldestRoomId);
      }
    }

    roomAuthors.delete(normalizedMessageId);
    roomAuthors.set(normalizedMessageId, normalizedAuthor);
    while (roomAuthors.size > MAX_RUNTIME_MESSAGE_AUTHORS_PER_ROOM) {
      const oldestMessageId = roomAuthors.keys().next().value;
      if (!oldestMessageId) break;
      roomAuthors.delete(oldestMessageId);
    }
  }

  private queuePendingRetraction(event: ChatRetractionEvent): void {
    let pending = this.pendingRetractionsByRoom.get(event.roomId);
    if (!pending) {
      pending = new Map();
      this.pendingRetractionsByRoom.set(event.roomId, pending);
      while (this.pendingRetractionsByRoom.size > MAX_PENDING_RETRACTION_ROOMS) {
        const oldestRoomId = this.pendingRetractionsByRoom.keys().next().value;
        if (!oldestRoomId) break;
        this.pendingRetractionsByRoom.delete(oldestRoomId);
      }
    }

    pending.delete(event.targetMessageId);
    pending.set(event.targetMessageId, event);
    while (pending.size > MAX_PENDING_RETRACTIONS_PER_ROOM) {
      const oldestMessageId = pending.keys().next().value;
      if (!oldestMessageId) break;
      pending.delete(oldestMessageId);
    }
  }

  private emitVerifiedRetraction(
    event: ChatRetractionEvent,
    originalAuthorAddress: string,
  ): void {
    if (!isRetractionAuthorized(event, originalAuthorAddress)) {
      this.log("warn", "chat_message_retraction_rejected_author_mismatch", {
        id: event.id,
        targetMessageId: event.targetMessageId,
        roomId: event.roomId,
        retractionAuthor: event.fromFullAddress || event.fromDeviceId,
        originalAuthor: originalAuthorAddress,
      });
      return;
    }

    const original = this.editTargets.get(this.editTargetKey(event.roomId, event.targetMessageId));
    if (original) original.metadata = { ...original.metadata, retracted: true };
    this.emit(this.retractionListeners, event);
    this.log("debug", "chat_message_retraction_received", {
      id: event.id,
      targetMessageId: event.targetMessageId,
      roomId: event.roomId,
      fromDeviceId: event.fromDeviceId,
    });
  }

  private async processRetraction(event: ChatRetractionEvent): Promise<void> {
    let originalAuthor = this.messageAuthorsByRoom
      .get(event.roomId)
      ?.get(event.targetMessageId);

    if (!originalAuthor && this.config.resolveMessageAuthor) {
      try {
        originalAuthor = trimToUndefined(
          await this.config.resolveMessageAuthor({
            roomId: event.roomId,
            messageId: event.targetMessageId,
          }),
        );
      } catch (error) {
        this.log("warn", "chat_message_retraction_author_lookup_failed", {
          id: event.id,
          targetMessageId: event.targetMessageId,
          roomId: event.roomId,
          error,
        });
      }
    }

    if (!originalAuthor) {
      this.queuePendingRetraction(event);
      this.log("warn", "chat_message_retraction_queued_unknown_original_author", {
        id: event.id,
        targetMessageId: event.targetMessageId,
        roomId: event.roomId,
      });
      return;
    }

    this.rememberMessageAuthor(event.roomId, event.targetMessageId, originalAuthor);
    this.emitVerifiedRetraction(event, originalAuthor);
  }

  private flushPendingRetraction(
    roomId: string,
    messageId: string,
    originalAuthorAddress: string,
  ): void {
    const pending = this.pendingRetractionsByRoom.get(roomId);
    const event = pending?.get(messageId);
    if (!event) return;

    pending?.delete(messageId);
    if (pending?.size === 0) this.pendingRetractionsByRoom.delete(roomId);
    this.emitVerifiedRetraction(event, originalAuthorAddress);
  }

  private emit<T>(listeners: Set<(event: T) => void>, event: T): void {
    for (const listener of Array.from(listeners)) {
      try {
        listener(event);
      } catch (error) {
        this.log("error", "chat_listener_error", { error });
      }
    }
  }

  private editTargetKey(roomId: string, messageId: string): string {
    return JSON.stringify([roomId, messageId]);
  }

  private rememberEditTarget(
    roomId: string,
    messageId: string,
    target: ChatMessageEditTarget,
  ): void {
    const key = this.editTargetKey(roomId, messageId);
    // A replay of the original must never reset its timestamp or undo a tombstone.
    if (!this.editTargets.has(key)) this.editTargets.set(key, target);
    else if (this.editTargets.get(key)!.timestamp === 0 && target.timestamp > 0)
      this.editTargets.get(key)!.timestamp = target.timestamp;
    while (this.editTargets.size > 2000)
      this.editTargets.delete(this.editTargets.keys().next().value!);
  }

  private async resolveEditTarget(
    roomId: string,
    messageId: string,
  ): Promise<ChatMessageEditTarget | null | undefined> {
    // Persistent state knows about deletions and survives runtime-cache eviction.
    const persisted = await this.config.resolveMessageForEdit?.({ roomId, messageId });
    if (this.config.resolveMessageForEdit) return persisted;
    return this.editTargets.get(this.editTargetKey(roomId, messageId));
  }

  private async emitValidatedMessage(
    message: ChatMessage,
    delivery: ChatIncomingDeliveryContext,
  ): Promise<void> {
    const targetId =
      typeof message.metadata.replacesId === "string" ? message.metadata.replacesId.trim() : "";
    if (message.metadata.edited === true && targetId) {
      const original = await this.resolveEditTarget(message.roomId, targetId);
      if (!original) {
        this.pendingEdits.set(this.editTargetKey(message.roomId, message.id), {
          message,
          delivery,
        });
        while (this.pendingEdits.size > 200)
          this.pendingEdits.delete(this.pendingEdits.keys().next().value!);
        return; // No durable acknowledgement until the original can be validated.
      }
      const error = getMessageEditError(
        original,
        message.fromFullAddress || message.fromDeviceId,
        message.timestamp,
      );
      if (
        error ||
        message.metadata.messageType !== "CHAT_MESSAGE" ||
        message.attachments?.length ||
        !message.body.trim()
      ) {
        this.log("warn", "chat_edit_rejected", {
          id: message.id,
          reason: error ?? "chat_edit_not_allowed",
        });
        await delivery.acknowledgeDelivered();
        return;
      }
      this.emitMessage(message, delivery);
      if (this.config.deliveryReceiptMode === "automatic") await delivery.acknowledgeDelivered();
      return;
    }
    if (message.metadata.edited === true || (targetId && message.metadata.edited)) {
      this.log("warn", "chat_edit_rejected", { id: message.id, reason: "chat_edit_not_allowed" });
      await delivery.acknowledgeDelivered();
      return;
    }
    delete message.metadata.replacesId;
    const target: ChatMessageEditTarget = {
      authorAddress: message.fromFullAddress || message.fromDeviceId,
      timestamp: message.timestamp,
      body: message.body,
      hasAttachments: Boolean(message.attachments?.length),
      metadata: message.metadata,
    };
    this.rememberEditTarget(message.roomId, message.id, target);
    if (message.metadata.originId)
      this.rememberEditTarget(message.roomId, message.metadata.originId, target);
    this.emitMessage(message, delivery);
    if (this.config.deliveryReceiptMode === "automatic") await delivery.acknowledgeDelivered();
    // Consumers persist the original asynchronously. Runtime data is safe here:
    // the original has just arrived from transport, even before persistence ends.
    for (const [key, pending] of Array.from(this.pendingEdits)) {
      if (
        pending.message.roomId !== message.roomId ||
        ![message.id, message.metadata.originId].includes(
          String(pending.message.metadata.replacesId),
        )
      )
        continue;
      this.pendingEdits.delete(key);
      const error = getMessageEditError(
        target,
        pending.message.fromFullAddress || pending.message.fromDeviceId,
        pending.message.timestamp,
      );
      if (
        !error &&
        pending.message.metadata.messageType === "CHAT_MESSAGE" &&
        !pending.message.attachments?.length &&
        pending.message.body.trim()
      ) {
        this.emitMessage(pending.message, pending.delivery);
        if (this.config.deliveryReceiptMode === "automatic")
          await pending.delivery.acknowledgeDelivered();
      } else {
        await pending.delivery.acknowledgeDelivered();
      }
    }
  }

  private emitMessage(message: ChatMessage, delivery: ChatIncomingDeliveryContext): void {
    for (const listener of Array.from(this.messageListeners)) {
      try {
        listener(message, delivery);
      } catch (error) {
        this.log("error", "chat_listener_error", { error });
      }
    }
  }

  private log(
    level: Exclude<ChatLogLevel, "silent">,
    message: string,
    data?: Record<string, unknown>,
  ): void {
    const logger = this.config.logger;
    if (!logger) return;
    if (CHAT_LOG_LEVEL_WEIGHT[this.config.logLevel] < CHAT_LOG_LEVEL_WEIGHT[level]) return;
    logger[level]?.(message, data);
  }
}

type OmemoState = {
  bareJid: string;
  omemoDeviceId: number;
  identityPrivateKey: string;
  identityPublicKey: string;
};

type OmemoPeerSession = {
  peerDeviceId: number;
  sharedSecret: Uint8Array;
};

export function createOmemoEncryption(
  options: OmemoEncryptionOptions = {},
): ChatEncryption {
  const storage = options.storage ?? createInMemoryKeyValueStore();
  const stateKeyPrefix = options.stateKeyPrefix ?? DEFAULT_OMEMO_STATE_KEY_PREFIX;
  let cachedState: OmemoState | null = null;
  let publishedBareJid: string | null = null;
  let identityPublishPromise: Promise<void> | null = null;
  const refreshAfterMs = Math.max(1000, options.discoveryRefreshAfterMs ?? 30_000);
  let discoveryLogger: ChatLogger | undefined;
  const discoveryStore = options.discoveryCache ?? createStoredOmemoDiscoveryCache(
    storage, stateKeyPrefix,
    (error) => discoveryLogger?.warn?.("chat_omemo_cache_storage_failed", { error }),
  );
  const discovery = createOmemoDiscoveryReader(
    discoveryStore,
    { refreshAfterMs, maxAgeMs: Math.max(refreshAfterMs, options.discoveryMaxAgeMs ?? 120_000) },
  );
  const subscriptions = new Map<string, { peer: string; node: string; promise: Promise<void> }>();
  const watchedPeers = new Map<string, true>();
  let connectionEpoch = 0;

  const stateKey = (bareJid: string) => `${stateKeyPrefix}:${bareJid}`;

  const sendOmemoIq = async (
    context: ChatEncryptionContext,
    input: {
      type: "get" | "set";
      payload: XmppChild;
      to?: string;
    },
    operation: string,
  ): Promise<XmppElementLike> => {
    const startedEpoch = connectionEpoch;
    let lastError: unknown;
    for (let attempt = 1; attempt <= OMEMO_IQ_MAX_ATTEMPTS; attempt += 1) {
      if (startedEpoch !== connectionEpoch) throw new Error("xmpp_omemo_cache_reset");
      try {
        return await context.sendIq({
          ...input,
          timeoutMs: OMEMO_IQ_TIMEOUT_MS,
        });
      } catch (error) {
        if (startedEpoch !== connectionEpoch) throw new Error("xmpp_omemo_cache_reset");
        if (error instanceof Error && error.message.startsWith("chat_iq_error:")) throw error;
        lastError = error;
        if (attempt === OMEMO_IQ_MAX_ATTEMPTS) break;
        context.logger?.warn?.("chat_omemo_iq_retry", {
          operation,
          attempt,
          to: input.to,
          error,
        });
        await new Promise<void>((resolve) => {
          setTimeout(resolve, OMEMO_IQ_RETRY_DELAY_MS * attempt);
        });
      }
    }
    throw lastError instanceof Error
      ? lastError
      : new Error(`chat_omemo_iq_failed:${operation}`);
  };

  const loadOrCreateState = async (bareJid: string): Promise<OmemoState> => {
    if (cachedState?.bareJid === bareJid) return cachedState;
    const raw = await storage.getItem(stateKey(bareJid));
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as OmemoState;
        if (isValidOmemoState(parsed) && parsed.bareJid === bareJid) {
          cachedState = parsed;
          return parsed;
        }
      } catch {
        // Fall through to regeneration.
      }
    }

    const privateKey = nobleRandomBytes(32);
    const publicKey = x25519.getPublicKey(privateKey);
    const nextState: OmemoState = {
      bareJid,
      omemoDeviceId: Math.max(1, bytesToUint32(nobleRandomBytes(4))),
      identityPrivateKey: bytesToBase64(privateKey),
      identityPublicKey: bytesToBase64(publicKey),
    };
    await storage.setItem(stateKey(bareJid), JSON.stringify(nextState));
    cachedState = nextState;
    return nextState;
  };

  const fetchDeviceIds = async (
    context: ChatEncryptionContext,
    address: string,
  ): Promise<number[]> => {
    const bareJid = normalizeBareDeviceId(address);
    if (!bareJid) throw new Error("xmpp_omemo_bare_jid_required");

    context.logger?.debug?.("chat_omemo_device_discovery_started", {
      bareJid,
      node: OMEMO_DEVICELIST_NODE,
    });

    let stanza: XmppElementLike;
    try {
      stanza = await sendOmemoIq(
        context,
        {
          type: "get",
          to: bareJid,
          payload: xml(
            "pubsub",
            { xmlns: PUBSUB_NS },
            xml("items", { node: OMEMO_DEVICELIST_NODE, max_items: "1" }),
          ),
        },
        "discover-devices",
      );
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        context.logger?.debug?.("chat_omemo_devices_discovered", {
          bareJid,
          deviceIds: [],
        });
        return [];
      }
      context.logger?.warn?.("chat_omemo_device_discovery_failed", {
        bareJid,
        error,
      });
      throw error;
    }

    const deviceIds = new Set<number>();
    const pubsub =
      stanza.getChild?.("pubsub", PUBSUB_NS) ?? stanza.getChild?.("pubsub");
    const items = pubsub?.getChild?.("items");
    const itemElements = items?.getChildren?.("item") ?? [];
    for (const item of itemElements) {
      const list =
        item.getChild?.("list", OMEMO_NS) ?? item.getChild?.("list");
      const devices = list?.getChildren?.("device") ?? [];
      for (const device of devices) {
        const parsed = Number(device.attrs?.id ?? "0");
        if (Number.isSafeInteger(parsed) && parsed > 0) {
          deviceIds.add(parsed);
        }
      }
    }

    const discovered = Array.from(deviceIds);
    context.logger?.debug?.("chat_omemo_devices_discovered", {
      bareJid,
      deviceIds: discovered,
    });
    return discovered;
  };

  const fetchIdentityKey = async (
    context: ChatEncryptionContext,
    bareJid: string,
    deviceId: number,
  ): Promise<Uint8Array> => {
    const bundleNode = `${OMEMO_BUNDLE_NODE_PREFIX}${deviceId}`;
    let stanza: XmppElementLike;
    try {
      stanza = await sendOmemoIq(
        context,
        {
          type: "get",
          to: bareJid,
          payload: xml(
            "pubsub",
            { xmlns: PUBSUB_NS },
            xml("items", { node: bundleNode, max_items: "1" }),
          ),
        },
        "fetch-identity",
      );
    } catch (error) {
      const message = String(error instanceof Error ? error.message : error);
      if (message.includes("item-not-found") || message.includes("item_not_found")) {
        throw new Error("xmpp_omemo_peer_identity_key_missing");
      }
      throw error;
    }

    const raw = toRawXmlString(stanza);
    const match = raw.match(/<identityKey>([\s\S]*?)<\/identityKey>/);
    const identityKeyBase64 = match?.[1]?.trim() ?? "";
    if (!identityKeyBase64) {
      throw new Error("xmpp_omemo_peer_identity_key_missing");
    }

    return base64ToBytes(identityKeyBase64);
  };

  const publishIdentity = async (context: ChatEncryptionContext): Promise<void> => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid) return;

    const state = await loadOrCreateState(bareJid);
    const existingIds = await fetchDeviceIds(context, bareJid).catch(() => []);
    const finalDeviceIds = Array.from(new Set([state.omemoDeviceId, ...existingIds])).filter(
      (value) => Number.isFinite(value) && value > 0,
    );

    const publishOptions = xml(
      "publish-options",
      {},
      xml(
        "x",
        { xmlns: XDATA_NS, type: "submit" },
        xml(
          "field",
          { var: "FORM_TYPE", type: "hidden" },
          xml("value", {}, "http://jabber.org/protocol/pubsub#publish-options"),
        ),
        xml("field", { var: "pubsub#access_model" }, xml("value", {}, "open")),
        xml("field", { var: "pubsub#persist_items" }, xml("value", {}, "true")),
      ),
    );

    // Advertise a device after its key is available to subscribers.
    await sendOmemoIq(
      context,
      {
        type: "set",
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml(
            "publish",
            { node: `${OMEMO_BUNDLE_NODE_PREFIX}${state.omemoDeviceId}` },
            xml(
              "item",
              { id: "current" },
              xml(
                "bundle",
                { xmlns: OMEMO_NS },
                xml("identityKey", {}, state.identityPublicKey),
              ),
            ),
          ),
          publishOptions,
        ),
      },
      "publish-identity",
    );

    await sendOmemoIq(
      context,
      {
        type: "set",
        payload: xml(
          "pubsub",
          { xmlns: PUBSUB_NS },
          xml(
            "publish",
            { node: OMEMO_DEVICELIST_NODE },
            xml(
              "item",
              { id: "current" },
              xml(
                "list",
                { xmlns: OMEMO_NS },
                ...finalDeviceIds.map((deviceId) => xml("device", { id: String(deviceId) })),
              ),
            ),
          ),
          publishOptions,
        ),
      },
      "publish-devices",
    );

    publishedBareJid = bareJid;
    context.logger?.debug?.("chat_omemo_identity_published", {
      bareJid,
      deviceId: state.omemoDeviceId,
      deviceIds: finalDeviceIds,
    });
  };

  const startIdentityPublish = (
    context: ChatEncryptionContext,
  ): Promise<void> => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid || publishedBareJid === bareJid) return Promise.resolve();
    if (identityPublishPromise) return identityPublishPromise;

    const promise = publishIdentity(context)
      .catch((error) => {
        context.logger?.warn?.("chat_omemo_identity_publish_failed", {
          bareJid,
          error,
        });
      })
      .finally(() => {
        if (identityPublishPromise === promise) identityPublishPromise = null;
      });
    identityPublishPromise = promise;
    return promise;
  };

  const unsubscribe = (context: ChatEncryptionContext, peer: string, node: string): void => {
    subscriptions.delete(JSON.stringify([peer, node]));
    const subscriber = context.getDeviceId();
    if (!subscriber) return;
    void context.sendIq({
      type: "set", to: peer, timeoutMs: OMEMO_IQ_TIMEOUT_MS,
      payload: xml("pubsub", { xmlns: PUBSUB_NS }, xml("unsubscribe", { node, jid: subscriber })),
    }).catch((error) => context.logger?.warn?.("chat_omemo_unsubscribe_failed", { peer, node, error }));
  };

  const subscribe = (context: ChatEncryptionContext, peer: string, node: string): void => {
    const subscriber = context.getDeviceId();
    if (!subscriber) return;
    const subscriptionKey = JSON.stringify([peer, node]);
    if (subscriptions.has(subscriptionKey)) return;
    const promise = context.sendIq({
      type: "set",
      to: peer,
      timeoutMs: OMEMO_IQ_TIMEOUT_MS,
      payload: xml("pubsub", { xmlns: PUBSUB_NS },
        xml("subscribe", { node, jid: subscriber })),
    }).then(() => undefined).catch((error) => {
      if (subscriptions.get(subscriptionKey)?.promise === promise) subscriptions.delete(subscriptionKey);
      context.logger?.warn?.("chat_omemo_subscription_failed", { peer, node, error });
    });
    subscriptions.set(subscriptionKey, { peer, node, promise });
  };

  const fetchSnapshot = async (
    context: ChatEncryptionContext,
    peer: string,
  ): Promise<OmemoDiscoverySnapshot> => {
    const startedEpoch = connectionEpoch;
    discoveryLogger = context.logger;
    watchedPeers.delete(peer);
    watchedPeers.set(peer, true);
    if (watchedPeers.size > 128) {
      const retiredPeer = watchedPeers.keys().next().value!;
      watchedPeers.delete(retiredPeer);
      discovery.invalidate(context.getBareDeviceId()!, retiredPeer);
      for (const subscription of subscriptions.values()) {
        if (subscription.peer === retiredPeer) unsubscribe(context, retiredPeer, subscription.node);
      }
    }
    // Subscribe first. A change during discovery invalidates the pending response.
    subscribe(context, peer, OMEMO_DEVICELIST_NODE);
    const deviceIds = await fetchDeviceIds(context, peer);
    if (!deviceIds.length) throw new Error("xmpp_omemo_peer_device_not_found");
    if (deviceIds.length > 128) throw new Error("xmpp_omemo_peer_device_limit");
    const activeNodes = new Set([OMEMO_DEVICELIST_NODE, ...deviceIds.map((id) => `${OMEMO_BUNDLE_NODE_PREFIX}${id}`)]);
    for (const subscription of subscriptions.values()) {
      if (subscription.peer === peer && !activeNodes.has(subscription.node)) unsubscribe(context, peer, subscription.node);
    }
    const state = await loadOrCreateState(context.getBareDeviceId()!);
    const devices: OmemoDiscoverySnapshot["devices"] = [];
    let nextIndex = 0;
    const results = await Promise.all(
      Array.from({ length: Math.min(4, deviceIds.length) }, async () => {
        const found: OmemoDiscoverySnapshot["devices"] = [];
        for (;;) {
          const index = nextIndex++;
          if (index >= deviceIds.length) return found;
          const deviceId = deviceIds[index];
          subscribe(context, peer, `${OMEMO_BUNDLE_NODE_PREFIX}${deviceId}`);
          try {
            const identityKey = peer === state.bareJid && deviceId === state.omemoDeviceId
              ? base64ToBytes(state.identityPublicKey)
              : await fetchIdentityKey(context, peer, deviceId);
            if (identityKey.length !== 32) throw new Error("xmpp_omemo_peer_identity_key_invalid");
            found.push({ deviceId, identityKey: bytesToBase64(identityKey) });
          } catch (error) {
            if (error instanceof Error && error.message === "xmpp_omemo_peer_identity_key_missing") continue;
            throw error;
          }
        }
      }),
    );
    if (startedEpoch !== connectionEpoch) throw new Error("xmpp_omemo_cache_reset");
    devices.push(...results.flat());
    devices.sort((a, b) => a.deviceId - b.deviceId);
    if (!devices.length) throw new Error("xmpp_omemo_peer_identity_key_missing");
    return { fetchedAt: Date.now(), devices };
  };

  const establishPeerSessions = async (
    context: ChatEncryptionContext,
    toDeviceId: DeviceId,
  ): Promise<OmemoPeerSession[]> => {
    const bareJid = context.getBareDeviceId();
    if (!bareJid) {
      throw new Error("xmpp_omemo_state_missing");
    }

    const state = await loadOrCreateState(bareJid);
    const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
    const peerBareJid = normalizeBareDeviceId(toDeviceId);
    const snapshot = await discovery.get(
      bareJid, peerBareJid, () => fetchSnapshot(context, peerBareJid),
      (error) => context.logger?.warn?.("chat_omemo_background_refresh_failed", { peer: peerBareJid, error }),
    );
    return snapshot.devices.map(({ deviceId, identityKey }) => ({
      peerDeviceId: deviceId,
      sharedSecret: x25519.getSharedSecret(ownPrivateKey, base64ToBytes(identityKey)),
    }));
  };

  return {
    onConnect: async (context) => {
      const bareJid = context.getBareDeviceId();
      if (!bareJid) return;
      connectionEpoch += 1;
      discoveryLogger = context.logger;
      discovery.reset();
      subscriptions.clear();
      watchedPeers.clear();
      await startIdentityPublish(context);
      await discoveryStore.load?.(bareJid);
      const peers = discoveryStore.peers?.(bareJid).slice(-8) ?? [];
      const startedEpoch = connectionEpoch;
      let nextPeer = 0;
      // Recent conversations are refreshed off the connection readiness path.
      void Promise.all(Array.from({ length: Math.min(2, peers.length) }, async () => {
        for (;;) {
          const peer = peers[nextPeer++];
          if (!peer || startedEpoch !== connectionEpoch) return;
          await discovery.refresh(bareJid, peer, () => fetchSnapshot(context, peer))
            .catch((error) => context.logger?.warn?.("chat_omemo_background_refresh_failed", { peer, error }));
        }
      }));
    },
    onDisconnect: () => {
      connectionEpoch += 1;
      identityPublishPromise = null;
      discovery.reset();
      subscriptions.clear();
      watchedPeers.clear();
    },
    onStanza: (stanza, context) => {
      const event = stanza.getChild?.("event", "http://jabber.org/protocol/pubsub#event");
      const peer = normalizeBareDeviceId(stanza.attrs?.from);
      const owner = context.getBareDeviceId();
      if (!event || !peer || !owner) return;
      const nodes = ["items", "delete", "purge"].flatMap((name) => event.getChildren?.(name) ?? [])
        .map((child) => child.attrs?.node ?? "");
      if (nodes.some((node) => node === OMEMO_DEVICELIST_NODE || node.startsWith(OMEMO_BUNDLE_NODE_PREFIX))) {
        discovery.invalidate(owner, peer);
      }
    },
    encrypt: async (input, context) => {
      const bareJid = context.getBareDeviceId();
      if (!bareJid) {
        throw new Error("xmpp_omemo_state_missing");
      }

      if (publishedBareJid !== bareJid) {
        void startIdentityPublish(context);
      }

      const state = await loadOrCreateState(bareJid);
      const recipientBareJids = Array.from(
        new Set(
          (input.recipientJids?.length
            ? input.recipientJids
            : [input.toDeviceId]
          )
            .map((address) => normalizeBareDeviceId(address))
            .filter(Boolean),
        ),
      );
      if (!recipientBareJids.length) {
        throw new Error("xmpp_omemo_recipient_required");
      }
      const allRecipientJids = recipientBareJids.includes(bareJid)
        ? recipientBareJids : [...recipientBareJids, bareJid];
      const sessions = (
        await Promise.all(
          allRecipientJids.map((recipientBareJid) =>
            establishPeerSessions(context, recipientBareJid),
          ),
        )
      ).flat();
      const iv = nobleRandomBytes(12);
      const contentKey = nobleRandomBytes(OMEMO_AES_KEY_BYTES);
      const plaintext = new TextEncoder().encode(
        JSON.stringify({
          body: input.body,
          ...(input.metadata ? { metadata: input.metadata } : {}),
          ...(input.attachments?.length
            ? { attachments: serializeAttachmentsForWire(input.attachments) }
            : {}),
        }),
      );
      const ciphertext = gcm(contentKey, iv).encrypt(plaintext);

      const keyElements = sessions.map((session) => {
        const wrapSalt = nobleRandomBytes(OMEMO_KEY_WRAP_BYTES);
        const wrapMask = hkdf(
          sha256,
          session.sharedSecret,
          wrapSalt,
          OMEMO_WRAP_INFO,
          OMEMO_AES_KEY_BYTES,
        );
        const wrappedKey = xorBytes(contentKey, wrapMask);
        const wrappedBundle = concatBytes(wrapSalt, wrappedKey);
        return xml(
          "key",
          {
            rid: String(session.peerDeviceId),
            kex: "x25519-hkdf-sha256-aesgcm",
          },
          bytesToBase64(wrappedBundle),
        );
      });

      return {
        body: "[encrypted]",
        children: [
          xml(
            "encrypted",
            { xmlns: OMEMO_NS },
            xml(
              "header",
              { sid: String(state.omemoDeviceId) },
              ...keyElements,
              xml("iv", {}, bytesToBase64(iv)),
              xml("identity", {}, state.identityPublicKey),
            ),
            xml("payload", {}, bytesToBase64(ciphertext)),
          ),
        ],
      };
    },
    decrypt: async ({ stanza }, context) => {
      const encrypted = stanza.getChild?.("encrypted", OMEMO_NS);
      if (!encrypted) return null;

      const bareJid = context.getBareDeviceId();
      if (!bareJid) return { body: "", metadata: undefined };

      const state = await loadOrCreateState(bareJid);
      const header = encrypted.getChild?.("header");
      const payloadBase64 = encrypted.getChildText?.("payload")?.trim();
      if (!header || !payloadBase64) {
        return { body: "", metadata: undefined };
      }

      const keys = header.getChildren?.("key") ?? [];
      let selectedKeyBase64 = "";
      for (const keyElement of keys) {
        const rid = Number(keyElement.attrs?.rid ?? "0");
        if (rid !== state.omemoDeviceId) continue;
        selectedKeyBase64 = keyElement.getText?.().trim() || "";
        if (selectedKeyBase64) break;
      }

      if (!selectedKeyBase64) {
        return { body: "", metadata: undefined };
      }

      const ivBase64 = header.getChildText?.("iv")?.trim();
      const senderIdentityBase64 = header.getChildText?.("identity")?.trim();
      if (!ivBase64 || !senderIdentityBase64) {
        return { body: "", metadata: undefined };
      }

      try {
        const ownPrivateKey = base64ToBytes(state.identityPrivateKey);
        const senderPublicKey = base64ToBytes(senderIdentityBase64);
        const keyMaterial = base64ToBytes(selectedKeyBase64);
        const iv = base64ToBytes(ivBase64);
        const ciphertext = base64ToBytes(payloadBase64);
        const sharedSecret = x25519.getSharedSecret(ownPrivateKey, senderPublicKey);

        let contentKey: Uint8Array;
        if (keyMaterial.length === OMEMO_KEY_WRAP_BYTES) {
          contentKey = hkdf(
            sha256,
            sharedSecret,
            keyMaterial,
            OMEMO_INFO,
            OMEMO_AES_KEY_BYTES,
          );
        } else if (keyMaterial.length === OMEMO_KEY_WRAP_BUNDLE_BYTES) {
          const wrapSalt = keyMaterial.slice(0, OMEMO_KEY_WRAP_BYTES);
          const wrappedKey = keyMaterial.slice(OMEMO_KEY_WRAP_BYTES);
          const wrapMask = hkdf(
            sha256,
            sharedSecret,
            wrapSalt,
            OMEMO_WRAP_INFO,
            OMEMO_AES_KEY_BYTES,
          );
          contentKey = xorBytes(wrappedKey, wrapMask);
        } else {
          return { body: "", metadata: undefined };
        }

        const plaintext = gcm(contentKey, iv).decrypt(ciphertext);
        const parsed = JSON.parse(new TextDecoder().decode(plaintext)) as unknown;
        if (!isRecord(parsed)) {
          return { body: "", metadata: undefined };
        }

        return {
          body: typeof parsed.body === "string" ? parsed.body : "",
          metadata: isRecord(parsed.metadata)
            ? (parsed.metadata as Record<string, unknown>)
            : undefined,
          attachments: normalizeAttachmentPayload(parsed.attachments),
        };
      } catch {
        return { body: "", metadata: undefined };
      }
    },
  };
}

type NormalizedConfig = {
  service: string;
  uploadService: string;
  apiKey: string;
  userId: string;
  localDeviceId: DeviceId;
  username: string;
  deviceId: DeviceId;
  displayName?: string;
  password?: string;
  authType: "password" | "x-oauth2";
  domain: string;
  resource: string;
  connectTimeoutMs: number;
  deliveryReceiptMode: ChatDeliveryReceiptMode;
  requireMessageCarbons: boolean;
  requireStreamManagement: boolean;
  awaitServerAcknowledgement: boolean;
  requireEncryptedAttachments: boolean;
  requireEncryptedPayloads: boolean;
  roomDirectory?: ChatRoomDirectory;
  resolveRoomDeviceIds?: (roomId: string) => Promise<DeviceId[]> | DeviceId[];
  resolveMessageAuthor?: ChatMessageAuthorResolver;
  /** Persistent original-message lookup for edit validation after a restart. */
  resolveMessageForEdit?: (input: ChatMessageAuthorResolverInput) =>
    Promise<ChatMessageEditTarget | null | undefined> | ChatMessageEditTarget | null | undefined;
  logger?: ChatLogger;
  logLevel: ChatLogLevel;
  encryption?: ChatEncryption;
  attachmentService?: ChatAttachmentService;
};

function normalizeConfig(config: ChatClientConfig): NormalizedConfig {
  const domain = normalizeXmppDomain(config.xmppDomain);
  if (!domain) throw new Error("chat_xmpp_domain_required");

  const userId = normalizeUserIdSegment(config.userId);
  if (!userId) throw new Error("chat_user_id_required");

  const localDeviceId = normalizeDeviceIdSegment(config.deviceId);
  if (!localDeviceId) throw new Error("chat_device_id_required");

  const resource = normalizeResourceSegment(localDeviceId);
  const username = buildXmppUserLocalpart(userId);
  const deviceId = buildXmppUserResourceAddress(userId, domain, resource);

  return {
    service: buildXmppWebSocketUrl(domain, config.xmppWebSocketPath),
    uploadService: trimToUndefined(config.xmppUploadService) ?? `upload.${domain}`,
    apiKey: trimToUndefined(config.apiKey) ?? "",
    userId,
    localDeviceId,
    username,
    deviceId,
    displayName: trimToUndefined(config.displayName),
    password:
      config.authType === "x-oauth2"
        ? trimToUndefined(config.accessToken)
        : trimToUndefined(config.password),
    authType: config.authType ?? "password",
    domain,
    resource,
    connectTimeoutMs: config.connectTimeoutMs ?? DEFAULT_CONNECT_TIMEOUT_MS,
    deliveryReceiptMode: config.deliveryReceiptMode ?? "automatic",
    requireMessageCarbons: config.requireMessageCarbons ?? false,
    requireStreamManagement: config.requireStreamManagement ?? false,
    awaitServerAcknowledgement: config.awaitServerAcknowledgement ?? false,
    requireEncryptedAttachments: config.requireEncryptedAttachments ?? false,
    requireEncryptedPayloads: config.requireEncryptedPayloads ?? false,
    roomDirectory: config.roomDirectory,
    resolveRoomDeviceIds: config.resolveRoomDeviceIds,
    resolveMessageAuthor: config.resolveMessageAuthor,
    resolveMessageForEdit: config.resolveMessageForEdit,
    logger: config.logger,
    logLevel: normalizeLogLevel(config.logLevel, config.logger),
    encryption: config.encryption,
    attachmentService: config.attachmentService,
  };
}

export function extractProviderDirectMessageRoomId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : undefined;
  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.providerDirectMessageRoomId,
    lulaPayload?.providerDirectMessageRoomId,
    lulaSubmission?.providerDirectMessageRoomId,
  );
}

export function extractSubmissionId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : undefined;
  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.correlationId,
    lulaPayload?.correlationId,
    lulaSubmission?.correlationId,
  );
}

export function extractSubmissionRoomId(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : undefined;
  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.submissionRoomId,
    lulaPayload?.submissionRoomId,
    lulaSubmission?.submissionRoomId,
  );
}

export function extractDisplayName(metadata?: Record<string, unknown>): string | undefined {
  if (!metadata) return undefined;

  const lulaSubmission = isRecord(metadata.lulaSubmission)
    ? (metadata.lulaSubmission as Record<string, unknown>)
    : undefined;

  return firstString(
    metadata.displayName,
    metadata.senderDisplayName,
    lulaSubmission?.displayName,
    lulaSubmission?.senderName,
  );
}

function extractMessageType(metadata?: Record<string, unknown>): ChatMessageType | undefined {
  const rawType = firstString(metadata?.messageType, metadata?.type);
  if (
    rawType === "CHAT_MESSAGE" ||
    rawType === "FORM_SUBMISSION" ||
    rawType === CHAT_CONVERSATION_STATE_MESSAGE_TYPE ||
    rawType === CHAT_EMERGENCY_MESSAGE_TYPE ||
    rawType === CHAT_VOICE_MESSAGE_TYPE
  ) {
    return rawType;
  }
  return undefined;
}

function normalizeMessageMetadata(
  metadata: Record<string, unknown> | undefined,
  fallbackType: ChatMessageType,
): ChatMessageMetadata {
  return {
    ...(metadata ?? {}),
    messageType: extractMessageType(metadata) ?? fallbackType,
  } as ChatMessageMetadata;
}

function inferMessageType(metadata: Record<string, unknown> | undefined, body: string): ChatMessageType {
  const metadataType = extractMessageType(metadata);
  if (metadataType) return metadataType;
  if (isRecord(metadata?.lulaPayload)) return "FORM_SUBMISSION";

  const payload = parseJsonRecord(body);
  if (payload?.type === "form_submission") return "FORM_SUBMISSION";
  if (payload && (isRecord(payload.readable) || isRecord(payload.raw))) return "FORM_SUBMISSION";
  return "CHAT_MESSAGE";
}

export function buildChatMessageMetadata(input: {
  roomId?: string;
  metadata?: Record<string, unknown>;
  context?: ChatMessageContext;
  displayName?: string;
}): ChatMessageMetadata {
  const metadata = normalizeMessageMetadata(input.metadata, "CHAT_MESSAGE");
  const providerDirectMessageRoomId = firstString(
    input.context?.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata),
    input.roomId,
  );

  if (providerDirectMessageRoomId) {
    metadata.providerDirectMessageRoomId = providerDirectMessageRoomId;
  }
  const submissionRoomId = firstString(
    input.context?.submissionRoomId,
    extractSubmissionRoomId(metadata),
  );
  if (submissionRoomId) {
    metadata.submissionRoomId = submissionRoomId;
  }
  const correlationId = firstString(
    input.context?.correlationId,
    extractSubmissionId(metadata),
  );
  if (correlationId) {
    metadata.correlationId = correlationId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }

  const context = input.context;
  const displayName = firstString(
    metadata.displayName,
    context?.displayName,
    context?.senderName,
    input.displayName,
  );
  if (displayName) {
    metadata.displayName = displayName;
  }

  const shouldWriteSubmissionContext =
    context &&
    (typeof context.submissionRoomId === "string" ||
      typeof context.correlationId === "string" ||
      typeof context.senderName === "string" ||
      typeof context.displayName === "string");

  if (shouldWriteSubmissionContext) {
    const existing = isRecord(metadata.lulaSubmission)
      ? (metadata.lulaSubmission as Record<string, unknown>)
      : {};
    const { providerDirectMessageRoomId: _providerDirectMessageRoomId, ...rest } = context;
    metadata.lulaSubmission = removeUndefinedValues({
      ...existing,
      ...rest,
      ...(submissionRoomId ? { submissionRoomId } : {}),
      ...(correlationId ? { correlationId } : {}),
      ...(displayName ? { displayName } : {}),
      ...(providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}),
    });
  }

  return metadata;
}

export function buildFormSubmissionMetadata(
  input: Pick<
    ChatFormSubmissionInput,
    | "roomId"
    | "metadata"
    | "formId"
    | "providerUserId"
    | "recordId"
    | "formVersion"
    | "providerDirectMessageRoomId"
    | "submissionRoomId"
    | "correlationId"
    | "submittedAt"
  > & { displayName?: string },
): ChatMessageMetadata {
  const metadata = normalizeMessageMetadata(input.metadata, "FORM_SUBMISSION");
  const providerDirectMessageRoomId = firstString(
    input.providerDirectMessageRoomId,
    extractProviderDirectMessageRoomId(metadata),
  );
  const submissionRoomId = firstString(
    input.submissionRoomId,
    extractSubmissionRoomId(metadata),
    input.roomId,
  );
  const correlationId = firstString(
    input.correlationId,
    extractSubmissionId(metadata),
  );
  const existingPayload = isRecord(metadata.lulaPayload)
    ? (metadata.lulaPayload as Record<string, unknown>)
    : {};

  if (providerDirectMessageRoomId) {
    metadata.providerDirectMessageRoomId = providerDirectMessageRoomId;
  }
  if (submissionRoomId) {
    metadata.submissionRoomId = submissionRoomId;
  }
  if (correlationId) {
    metadata.correlationId = correlationId;
  }
  if (typeof metadata.sentAtMs !== "number") {
    metadata.sentAtMs = Date.now();
  }
  const displayName = firstString(metadata.displayName, input.displayName);
  if (displayName) {
    metadata.displayName = displayName;
  }

  metadata.lulaPayload = removeUndefinedValues({
    ...existingPayload,
    submissionRoomId,
    correlationId,
    formId: input.formId,
    providerUserId: input.providerUserId,
    recordId: input.recordId,
    formVersion: input.formVersion,
    providerDirectMessageRoomId,
    submittedAt:
      input.submittedAt ??
      (typeof existingPayload.submittedAt === "string"
        ? existingPayload.submittedAt
        : new Date().toISOString()),
  });

  return metadata;
}

export function parseConversationStateMessage(
  message: ChatMessage,
): ChatConversationStateEvent | null {
  if (
    extractMessageType(message.metadata) !==
    CHAT_CONVERSATION_STATE_MESSAGE_TYPE
  ) {
    return null;
  }
  const conversationType = firstString(message.metadata.conversationType);
  const state = firstString(message.metadata.conversationState);
  if (conversationType !== "form_submission") return null;
  if (state !== "open" && state !== "closed") return null;
  const changedAt =
    normalizeIsoDate(firstString(message.metadata.conversationChangedAt)) ??
    new Date(message.timestamp).toISOString();
  const conversationId = firstString(message.metadata.conversationId);
  return {
    id: message.id,
    fromUserId: message.fromUserId,
    fromFullAddress: message.fromFullAddress,
    fromDeviceId: message.fromDeviceId,
    toDeviceId: message.toDeviceId,
    roomId: message.roomId,
    conversationType,
    state,
    ...(conversationId ? { conversationId } : {}),
    changedAt,
    timestamp: message.timestamp,
    metadata: message.metadata,
    raw: message.raw,
  };
}

function isConversationStateMessage(message: ChatMessage): boolean {
  return Boolean(parseConversationStateMessage(message));
}

function collectTargetDeviceIds(input: {
  toDeviceId?: DeviceId;
  toDeviceIds?: DeviceId[];
  peerDeviceId?: DeviceId;
  peerDeviceIds?: DeviceId[];
}): string[] {
  return normalizeTransportAddressList([
    input.toDeviceId,
    input.peerDeviceId,
    ...(input.toDeviceIds ?? []),
    ...(input.peerDeviceIds ?? []),
  ]);
}

function normalizeTransportAddress(value?: string | null): DeviceId {
  return addressToString(value)?.trim() ?? "";
}

function normalizeTransportAddressList(values: Array<string | undefined>): DeviceId[] {
  const normalized = values
    .map((value) => normalizeTransportAddress(value))
    .filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}

function normalizeTargetAddressList(
  values: Array<string | undefined>,
  targetScope: ChatTargetScope,
): DeviceId[] {
  return targetScope === "user"
    ? normalizeDeviceIdList(values)
    : normalizeTransportAddressList(values);
}

function isOwnTransportTarget(
  target: string,
  ownTransportAddress?: string,
  ownBareAddress?: string,
): boolean {
  const normalized = normalizeTransportAddress(target);
  if (!normalized) return true;
  if (ownTransportAddress && normalized === ownTransportAddress) return true;
  if (ownBareAddress && normalized === ownBareAddress) return true;
  return false;
}

function normalizeDeviceIdList(values: Array<string | undefined>): DeviceId[] {
  const normalized = values
    .map((value) => normalizeBareDeviceId(value))
    .filter((value) => value.length > 0);
  return Array.from(new Set(normalized));
}

function pickMessageTargetInput(input: ChatFormSubmissionInput): Omit<ChatMessageInput, "body" | "metadata"> {
  return {
    toDeviceId: input.toDeviceId,
    toDeviceIds: input.toDeviceIds,
    peerDeviceId: input.peerDeviceId,
    peerDeviceIds: input.peerDeviceIds,
    attachments: input.attachments,
    roomId: input.roomId,
    targetRoomId: input.targetRoomId,
    targetScope: input.targetScope,
    id: input.id,
    requestReceipt: input.requestReceipt,
  };
}

function toChatTextMessage(message: ChatMessage): ChatTextMessage {
  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata) ?? message.fromUserId;
  const lulaSubmission = isRecord(metadata?.lulaSubmission)
    ? (metadata?.lulaSubmission as Record<string, unknown>)
    : undefined;
  const context = removeUndefinedValues({
    ...(lulaSubmission ?? {}),
    ...(providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}),
    ...(submissionRoomId ? { submissionRoomId } : {}),
    ...(correlationId ? { correlationId } : {}),
    ...(displayName ? { displayName } : {}),
  }) as ChatMessageContext;

  return {
    ...message,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...(submissionRoomId ? { submissionRoomId } : {}),
    correlationId,
    displayName,
    ...(Object.keys(context).length > 0 ? { context } : {}),
  };
}

function parseEmergencyMetadata(metadata?: Record<string, unknown>): {
  emergencyType: typeof CHAT_EMERGENCY_TYPE_SOS;
  alertId: string;
  triggeredAt: string;
} | null {
  const emergencyType = firstString(metadata?.emergencyType);
  const alertId = firstString(metadata?.emergencyAlertId);
  const triggeredAt = normalizeIsoDate(firstString(metadata?.emergencyTriggeredAt));
  if (
    emergencyType !== CHAT_EMERGENCY_TYPE_SOS ||
    !alertId ||
    !triggeredAt
  ) {
    return null;
  }
  return { emergencyType, alertId, triggeredAt };
}

export function parseChatEmergencyMessage(
  message: ChatMessage,
): ChatEmergencyMessage | null {
  const messageType = extractMessageType(message.metadata);
  const emergency = parseEmergencyMetadata(message.metadata);
  if (messageType !== CHAT_EMERGENCY_MESSAGE_TYPE || !emergency) {
    return null;
  }
  return {
    ...toChatTextMessage(message),
    ...emergency,
  };
}

export function isEmergencyMessage(message: ChatMessage): boolean {
  return Boolean(parseChatEmergencyMessage(message));
}

function toChatAttachmentMessage(message: ChatMessage): ChatAttachmentMessage {
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) {
    throw new Error("chat_attachment_message_missing_attachments");
  }

  const metadata = message.metadata;
  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const lulaSubmission = isRecord(metadata?.lulaSubmission)
    ? (metadata?.lulaSubmission as Record<string, unknown>)
    : undefined;
  const context = removeUndefinedValues({
    ...(lulaSubmission ?? {}),
    ...(providerDirectMessageRoomId ? { providerDirectMessageRoomId } : {}),
    ...(submissionRoomId ? { submissionRoomId } : {}),
    ...(correlationId ? { correlationId } : {}),
    ...(displayName ? { displayName } : {}),
  }) as ChatMessageContext;

  return {
    ...message,
    attachments,
    metadata: normalizeMessageMetadata(message.metadata, "CHAT_MESSAGE"),
    providerDirectMessageRoomId,
    ...(submissionRoomId ? { submissionRoomId } : {}),
    correlationId,
    ...(displayName ? { displayName } : {}),
    ...(Object.keys(context).length > 0 ? { context } : {}),
  };
}

function isFormSubmissionMessage(message: ChatMessage): boolean {
  const metadataType = extractMessageType(message.metadata);
  if (metadataType === "FORM_SUBMISSION") return true;
  return Boolean(parseFormSubmissionMessage(message));
}

function isAttachmentMessage(message: ChatMessage): boolean {
  // A form submission may carry an attachment manifest. It remains one typed
  // form event and must not also surface through the generic attachment
  // listener as a second logical message.
  if (isFormSubmissionMessage(message)) return false;
  const attachments = normalizeAttachmentPayload(message.attachments);
  if (!attachments?.length) return false;
  if (message.metadata.attachment === true) return true;
  const metadataType = extractMessageType(message.metadata);
  return metadataType === "CHAT_MESSAGE";
}

function parseFormSubmissionMessage(message: ChatMessage): ChatFormSubmissionMessage | null {
  const payload = parseJsonRecord(message.body);
  if (!payload) return null;

  const metadata = message.metadata;
  const metadataType = extractMessageType(metadata);
  const lulaPayload = isRecord(metadata?.lulaPayload)
    ? (metadata?.lulaPayload as Record<string, unknown>)
    : undefined;
  const isExplicitFormPayload = payload.type === "form_submission";
  const isReadableSubmissionPayload = isRecord(payload.readable) || isRecord(payload.raw);
  if (
    metadataType !== "FORM_SUBMISSION" &&
    !lulaPayload &&
    !isExplicitFormPayload &&
    !isReadableSubmissionPayload
  ) {
    return null;
  }

  const providerDirectMessageRoomId = extractProviderDirectMessageRoomId(metadata) ?? message.roomId;
  const submissionRoomId = extractSubmissionRoomId(metadata);
  const correlationId = extractSubmissionId(metadata);
  const displayName = extractDisplayName(metadata);
  const normalizedFormPayload = normalizeFormSubmissionPayload(payload);
  return {
    ...message,
    metadata: normalizeMessageMetadata(metadata, "FORM_SUBMISSION"),
    answers: normalizedFormPayload.answers,
    fields: normalizedFormPayload.fields,
    payload,
    providerDirectMessageRoomId: providerDirectMessageRoomId,
    ...(submissionRoomId ? { submissionRoomId } : {}),
    ...(correlationId ? { correlationId } : {}),
    formId: firstString(lulaPayload?.formId, payload.formId),
    providerUserId: firstString(lulaPayload?.providerUserId, payload.providerUserId),
    recordId: firstString(lulaPayload?.recordId, payload.recordId),
    formVersion:
      typeof lulaPayload?.formVersion === "number"
          ? lulaPayload.formVersion
          : typeof payload.formVersion === "number"
            ? payload.formVersion
            : undefined,
    submittedAt: firstString(lulaPayload?.submittedAt, payload.submittedAt),
    ...(displayName ? { displayName } : {}),
  };
}

function normalizeFormSubmissionPayload(payload: Record<string, unknown>): {
  answers: Record<string, string>;
  fields: ChatFormSubmissionField[];
} {
  const readable = isRecord(payload.readable) ? payload.readable : {};
  const raw = isRecord(payload.raw) ? payload.raw : {};
  const keys = Array.from(new Set([...Object.keys(raw), ...Object.keys(readable)]));
  const answers: Record<string, string> = {};
  const fields = keys.map((key) => {
    const readableEntry = isRecord(readable[key]) ? readable[key] : undefined;
    const rawValue = raw[key];
    const value = readableEntry && "value" in readableEntry ? readableEntry.value : rawValue;
    answers[key] = stringifyAnswerValue(value);

    return {
      id: firstString(readableEntry?.id, readableEntry?.fieldId, key) ?? key,
      label: firstString(readableEntry?.label, key) ?? key,
      type: firstString(readableEntry?.type, readableEntry?.fieldType) ?? inferFieldType(value),
      required: readableEntry?.required === true,
    };
  });

  return { answers, fields };
}

function stringifyAnswerValue(value: unknown): string {
  if (value === undefined || value === null) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean" || typeof value === "bigint") {
    return String(value);
  }
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

function inferFieldType(value: unknown): string {
  if (Array.isArray(value)) return "array";
  if (typeof value === "boolean") return "boolean";
  if (typeof value === "number") return "number";
  if (isRecord(value)) return "object";
  return "text";
}

function parseJsonRecord(input: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(input) as unknown;
    return isRecord(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function serializeAttachmentsForWire(attachments: ChatAttachment[]): ChatAttachment[] {
  return attachments.map((attachment) => {
    const normalized = normalizeRequiredAttachment(attachment);
    const { localUri: _localUri, ...rest } = normalized;
    return rest;
  });
}

function normalizeAttachmentPayload(value: unknown): ChatAttachment[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const attachments = value
    .map((entry) => normalizeAttachment(entry))
    .filter((entry): entry is ChatAttachment => Boolean(entry));
  return attachments.length ? attachments : undefined;
}

function normalizeRequiredAttachment(value: unknown): ChatAttachment {
  const attachment = normalizeAttachment(value);
  if (!attachment) throw new Error("chat_attachment_invalid");
  return attachment;
}

function normalizeAttachmentEncryption(value: unknown): ChatAttachmentEncryption | null {
  if (!isRecord(value) || value.v !== 1 || value.alg !== "A256GCM") return null;
  const keyB64 = firstString(value.keyB64);
  const ivB64 = firstString(value.ivB64);
  const plaintextSha256B64 = firstString(value.plaintextSha256B64);
  const ciphertextSha256B64 = firstString(value.ciphertextSha256B64);
  const plaintextSize =
    typeof value.plaintextSize === "number" && Number.isSafeInteger(value.plaintextSize)
      ? value.plaintextSize
      : -1;
  const ciphertextSize =
    typeof value.ciphertextSize === "number" && Number.isSafeInteger(value.ciphertextSize)
      ? value.ciphertextSize
      : -1;
  if (
    !keyB64 ||
    !ivB64 ||
    !plaintextSha256B64 ||
    !ciphertextSha256B64 ||
    plaintextSize < 0 ||
    ciphertextSize <= plaintextSize
  ) {
    return null;
  }
  try {
    if (
      base64ToBytes(keyB64).length !== 32 ||
      base64ToBytes(ivB64).length !== 12 ||
      base64ToBytes(plaintextSha256B64).length !== 32 ||
      base64ToBytes(ciphertextSha256B64).length !== 32
    ) {
      return null;
    }
  } catch {
    return null;
  }
  return {
    v: 1,
    alg: "A256GCM",
    keyB64,
    ivB64,
    plaintextSha256B64,
    ciphertextSha256B64,
    plaintextSize,
    ciphertextSize,
  };
}

function normalizeAttachmentDownloadCapability(
  value: unknown,
): ChatAttachmentDownloadCapability | null {
  if (!isRecord(value) || value.v !== 1 || value.scheme !== "LulaAttachment") {
    return null;
  }
  const authorization = firstString(value.authorization);
  const expiresAt = firstString(value.expiresAt);
  if (
    !authorization ||
    !/^LulaAttachment\s+v1\.[A-Za-z0-9._-]+$/.test(authorization) ||
    !expiresAt ||
    !Number.isFinite(Date.parse(expiresAt))
  ) {
    return null;
  }
  return {
    v: 1,
    scheme: "LulaAttachment",
    authorization,
    expiresAt: new Date(Date.parse(expiresAt)).toISOString(),
  };
}

function normalizeAttachment(value: unknown): ChatAttachment | null {
  if (!isRecord(value)) return null;
  const id = firstString(value.id, value.url, value.localUri, value.thumbnailUrl);
  if (!id) return null;
  const type = normalizeAttachmentType(value);
  const metadata = isRecord(value.metadata)
    ? (value.metadata as Record<string, unknown>)
    : undefined;
  const encryption = normalizeAttachmentEncryption(value.encryption);
  const downloadCapability = normalizeAttachmentDownloadCapability(
    value.downloadCapability,
  );
  return removeUndefinedValues({
    id,
    type,
    name: firstString(value.name),
    mimeType: firstString(value.mimeType),
    size:
      typeof value.size === "number" && Number.isFinite(value.size)
        ? Math.max(0, Math.floor(value.size))
        : undefined,
    url: firstString(value.url),
    thumbnailUrl: firstString(value.thumbnailUrl),
    localUri: firstString(value.localUri),
    width:
      typeof value.width === "number" && Number.isFinite(value.width)
        ? Math.max(0, Math.floor(value.width))
        : undefined,
    height:
      typeof value.height === "number" && Number.isFinite(value.height)
        ? Math.max(0, Math.floor(value.height))
        : undefined,
    metadata,
    encryption: encryption ?? undefined,
    downloadCapability: downloadCapability ?? undefined,
  }) as ChatAttachment;
}

function normalizeAttachmentType(value: Record<string, unknown>): "image" | "file" {
  const explicit = firstString(value.type)?.toLowerCase();
  if (explicit === "image" || explicit === "file") return explicit;
  const mimeType = firstString(value.mimeType)?.toLowerCase();
  if (mimeType?.startsWith("image/")) return "image";
  return "file";
}

function defaultAttachmentSource(attachment: ChatAttachment): string | null {
  const direct = firstString(attachment.localUri, attachment.url);
  if (direct) return direct;
  const id = firstString(attachment.id);
  if (id && /^(https?:|file:)/i.test(id)) return id;
  return null;
}

function removeUndefinedValues<T extends Record<string, unknown>>(input: T): Partial<T> {
  const output: Partial<T> = {};
  for (const [key, value] of Object.entries(input) as Array<[keyof T, T[keyof T]]>) {
    if (value !== undefined) {
      output[key] = value;
    }
  }
  return output;
}

function registerXOAuth2OnClient(xmpp: XmppClientLike): void {
  const candidate = xmpp as unknown as {
    saslFactory?: { use?: (name: string, mechanism: typeof XOauth2Mechanism) => void };
    sasl?: { use?: (name: string, mechanism: typeof XOauth2Mechanism) => void };
  };
  candidate.saslFactory?.use?.("X-OAUTH2", XOauth2Mechanism);
  candidate.sasl?.use?.("X-OAUTH2", XOauth2Mechanism);
}

function pickMechanism(mechanisms: string[], preferred: string[]): string | undefined {
  const offered = new Set(mechanisms.map((mechanism) => mechanism.toUpperCase()));
  return preferred.find((mechanism) => offered.has(mechanism));
}

function addListener<T>(listeners: Set<(event: T) => void>, listener: (event: T) => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

async function withTimeout<T>(promise: Promise<T>, ms: number, errorCode: string): Promise<T> {
  let timeout: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        timeout = setTimeout(() => reject(new Error(errorCode)), ms);
      }),
    ]);
  } finally {
    if (timeout) clearTimeout(timeout);
  }
}

async function safeStop(xmpp: XmppClientLike): Promise<void> {
  xmpp.reconnect.stop();
  try {
    await xmpp.stop();
  } catch {
    // The caller already has the connection failure.
  }
}

function parseStanzaError(stanza: XmppElementLike): Pick<ChatErrorEvent, "condition" | "text"> {
  const error = stanza.getChild?.("error");
  if (!error) return {};
  const text = error.getChildText?.("text");
  const raw = error.toString?.() ?? "";
  const match = raw.match(/<([a-z0-9-]+)\s+xmlns=["']urn:ietf:params:xml:ns:xmpp-stanzas["']/i);
  return {
    condition: match?.[1],
    text: text ?? undefined,
  };
}

// Millisecond epoch dates before 2000 are not plausible chat creation times;
// this also rejects the common mistake of supplying Unix seconds as milliseconds.
const MIN_MESSAGE_TIMESTAMP_MS = Date.UTC(2000, 0, 1);
const MESSAGE_CLOCK_SKEW_MS = 5 * 60 * 1000;

function isServerMessageTimestamp(value: unknown): value is number {
  return typeof value === "number" && Number.isSafeInteger(value) &&
    value >= MIN_MESSAGE_TIMESTAMP_MS && value <= 8.64e15;
}

function parseServerMessageTimestamp(stanza: XmppElementLike, domain: string): number | undefined {
  const time = stanza.getChild?.("time", XMPP_MESSAGE_TIME_NS);
  if (time?.attrs?.by?.toLowerCase() !== domain.toLowerCase()) return undefined;
  const raw = time.attrs?.ms;
  if (!raw || !/^\d+$/.test(raw)) return undefined;
  const timestamp = Number(raw);
  return isServerMessageTimestamp(timestamp) ? timestamp : undefined;
}

function parseTrustedDelayTimestamp(stanza: XmppElementLike, domain: string): number | undefined {
  const delay = stanza.getChild?.("delay", "urn:xmpp:delay");
  const from = addressToString(delay?.attrs?.from)?.toLowerCase();
  const trusted = domain.toLowerCase();
  if (from !== trusted && from !== normalizeBareDeviceId(stanza.attrs?.to).toLowerCase() &&
      !from?.endsWith(`@conference.${trusted}`)) return undefined;
  return parseDelayTimestamp(stanza);
}

function isPlausibleMessageTimestamp(value: number, referenceTime = Date.now()): boolean {
  return Number.isSafeInteger(value)
    && value >= MIN_MESSAGE_TIMESTAMP_MS
    && value <= referenceTime + MESSAGE_CLOCK_SKEW_MS;
}

function parseDelayTimestamp(stanza: XmppElementLike): number | undefined {
  const delay = stanza.getChild?.("delay", "urn:xmpp:delay");
  const stamp = delay?.attrs?.stamp;
  if (!stamp || !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(stamp)) return undefined;
  const parsed = Date.parse(stamp);
  return isServerMessageTimestamp(parsed) ? parsed : undefined;
}

/**
 * The server event a message stanza carries, or null when it carries none or
 * cannot be trusted. Trusted means sent by the bare `xmppDomain` itself: the
 * server stamps every account's stanzas with that account's address, so no
 * account can produce this sender.
 *
 * Wire format: `<event xmlns="urn:lulafi:server-event:1" type="…">` holding the
 * base64 of a JSON object, on a message with a stable `id`.
 */
export function parseChatServerEvent(
  stanza: XmppElementLike,
  xmppDomain: string,
): ChatServerEvent | null {
  const element = stanza.getChild?.("event", XMPP_SERVER_EVENT_NS);
  if (!element) return null;
  const from = addressToString(stanza.attrs?.from)?.trim().toLowerCase();
  const domain = normalizeXmppDomain(xmppDomain)?.toLowerCase();
  if (!from || !domain || from !== domain) return null;
  const id = trimToUndefined(stanza.attrs?.id);
  const type = trimToUndefined(element.attrs?.type);
  const encoded = trimToUndefined(element.getText?.());
  const data = encoded ? decodeJsonBase64(encoded) : null;
  if (!id || !type || !isRecord(data)) return null;
  return {
    id,
    type,
    data,
    timestamp: parseServerMessageTimestamp(stanza, domain) ?? parseDelayTimestamp(stanza) ?? Date.now(),
    raw: stanza,
  };
}

function parseMetadataTimestamp(
  metadata?: Record<string, unknown>,
  referenceTime = Date.now(),
): number | undefined {
  const sentAtMs = metadata?.sentAtMs;
  if (typeof sentAtMs === "number" && isPlausibleMessageTimestamp(sentAtMs, referenceTime)) return sentAtMs;
  const createdAt = metadata?.createdAt;
  // An offset is required: interpreting an unzoned string in each receiving
  // device's local timezone would assign different instants to one message.
  if (typeof createdAt !== "string" || !/(?:Z|[+-]\d{2}:?\d{2})$/i.test(createdAt)) return undefined;
  const parsed = Date.parse(createdAt);
  return isPlausibleMessageTimestamp(parsed, referenceTime) ? parsed : undefined;
}

function generateMessageId(): string {
  return `msg-${Date.now()}-${createRuntimeIdSuffix()}`;
}

function generateIqId(): string {
  return `iq-${Date.now()}-${createRuntimeIdSuffix()}`;
}

function parseUploadSlotResponse(stanza: XmppElementLike): ChatAttachmentUploadSlot {
  const raw = toRawXmlString(stanza);
  const putMatch =
    raw.match(/<put\b([^>]*)>([\s\S]*?)<\/put>/) ?? raw.match(/<put\b([^>]*)\/>/);
  const getMatch =
    raw.match(/<get\b([^>]*)\/>/) ?? raw.match(/<get\b([^>]*)>(?:[\s\S]*?)<\/get>/);
  if (!putMatch?.[1] || !getMatch?.[1]) {
    throw new Error("chat_attachment_upload_slot_invalid");
  }

  const putAttrs = parseXmlAttributes(putMatch[1]);
  const getAttrs = parseXmlAttributes(getMatch[1]);
  const putUrl = putAttrs.url?.trim();
  const getUrl = getAttrs.url?.trim();
  if (!putUrl || !getUrl) {
    throw new Error("chat_attachment_upload_slot_invalid");
  }

  const headers: Record<string, string> = {};
  const headerRegex = /<header\b([^>]*)>([\s\S]*?)<\/header>/g;
  let headerMatch: RegExpExecArray | null = null;
  while ((headerMatch = headerRegex.exec(putMatch[2] ?? "")) !== null) {
    const attrs = parseXmlAttributes(headerMatch[1] ?? "");
    const name = attrs.name?.trim();
    const value = decodeXmlEntities((headerMatch[2] ?? "").trim());
    if (name && value) headers[name] = value;
  }

  return { putUrl, getUrl, headers };
}

function buildXmppUserLocalpart(userId: string): string {
  return `i.${userId}`;
}

function buildXmppUserAddress(userId: string, xmppDomain: string): string {
  return `${buildXmppUserLocalpart(userId)}@${xmppDomain}`;
}

function buildXmppUserResourceAddress(
  userId: string,
  xmppDomain: string,
  resource: string,
): string {
  return `${buildXmppUserAddress(userId, xmppDomain)}/${resource}`;
}

function buildXmppWebSocketUrl(xmppDomain: string, path?: string): string {
  const fullUrl = trimToUndefined(path);
  if (fullUrl && /^wss?:\/\//i.test(fullUrl)) {
    return fullUrl;
  }
  const normalizedPath = normalizeXmppWebSocketPath(path);
  return `wss://${xmppDomain}${normalizedPath}`;
}

function normalizeXmppWebSocketPath(path?: string): string {
  const trimmed = trimToUndefined(path) ?? DEFAULT_XMPP_WEBSOCKET_PATH;
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}

function normalizeXmppDomain(domain?: string): string | undefined {
  const trimmed = trimToUndefined(domain);
  if (!trimmed) return undefined;
  return trimmed
    .replace(/^wss?:\/\//i, "")
    .replace(/\/.*$/, "")
    .trim();
}

function normalizeUserIdSegment(value?: string): string | undefined {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return undefined;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const withoutPrefix = localpart?.replace(/^i\./, "");
  return withoutPrefix?.replace(/\.d\..*$/, "") || undefined;
}

function getUserIdFromChatAddress(value?: string): string | undefined {
  const localpart = normalizeBareDeviceId(value).split("@")[0]?.trim();
  if (!localpart) return undefined;
  const withoutPrefix = localpart.startsWith("i.") ? localpart.slice(2) : localpart;
  const deviceMarker = withoutPrefix.indexOf(".d.");
  return (deviceMarker >= 0 ? withoutPrefix.slice(0, deviceMarker) : withoutPrefix) || undefined;
}

function normalizeDeviceIdSegment(value?: string): string | undefined {
  const trimmed = trimToUndefined(value);
  if (!trimmed) return undefined;
  const localpart = normalizeBareDeviceId(trimmed).split("@")[0]?.trim();
  const deviceMarker = localpart?.indexOf(".d.") ?? -1;
  return deviceMarker >= 0 ? localpart?.slice(deviceMarker + 3) || undefined : localpart;
}

function normalizeBareDeviceId(deviceId?: string | null): DeviceId {
  return addressToString(deviceId)?.trim().split("/")[0] ?? "";
}

function trimToUndefined(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function normalizeIsoDate(value?: string | null): string | undefined {
  const normalized = trimToUndefined(value);
  if (!normalized) return undefined;
  const timestamp = Date.parse(normalized);
  return Number.isFinite(timestamp) ? new Date(timestamp).toISOString() : undefined;
}

function normalizeResourceSegment(value: string): string {
  const resource = value.trim().replace(/\s+/g, "-").replace(/\//g, "-");
  if (!resource) throw new Error("chat_resource_invalid");
  return resource;
}

function normalizeLogLevel(level: ChatLogLevel | undefined, logger?: ChatLogger): ChatLogLevel {
  if (!logger) return "silent";
  if (!level) return "error";
  if (level in CHAT_LOG_LEVEL_WEIGHT) return level;
  throw new Error(`chat_log_level_invalid:${level}`);
}

function addressToString(address: unknown): string | undefined {
  if (typeof address === "string") return address;
  if (address && typeof address === "object" && "toString" in address) {
    const value = String(address);
    return value === "[object Object]" ? undefined : value;
  }
  return undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function normalizeChatRoomResponse(
  response: unknown,
  options: Pick<ChatRoomDirectoryOptions, "currentUserId" | "xmppDomain"> = {},
): ChatRoom {
  const roomRecord = unwrapRoomRecord(response);
  const roomId = firstString(
    roomRecord.roomId,
    roomRecord.providerDirectMessageRoomId,
    roomRecord.id,
    roomRecord._id,
  );
  if (!roomId) throw new Error("chat_room_id_required");

  const id = firstString(roomRecord.id, roomRecord._id);
  const peerDeviceIds = collectPeerDeviceIdsFromRoom(roomRecord, options);
  const ownDeviceIds = collectOwnDeviceIdsFromRoom(roomRecord, options);
  return {
    ...(id ? { id } : {}),
    roomId,
    ...(peerDeviceIds.length ? { peerDeviceIds } : {}),
    ...(ownDeviceIds.length ? { ownDeviceIds } : {}),
    raw: response,
  };
}

function deriveRoomDeviceIds(room: Pick<ChatRoom, "peerDeviceIds" | "ownDeviceIds">): DeviceId[] {
  return normalizeTransportAddressList([...(room.peerDeviceIds ?? []), ...(room.ownDeviceIds ?? [])]);
}

function unwrapRoomRecord(response: unknown): Record<string, unknown> {
  if (!isRecord(response)) throw new Error("chat_room_response_invalid");
  if (isRecord(response.data)) return response.data;
  if (isRecord(response.room)) return response.room;
  return response;
}

function collectPeerDeviceIdsFromRoom(
  room: Record<string, unknown>,
  options: Pick<ChatRoomDirectoryOptions, "currentUserId" | "xmppDomain">,
): string[] {
  const candidates: string[] = [];
  const domain = normalizeXmppDomain(options.xmppDomain);
  const roomUserId = firstString(
    room.peerUserId,
    room.peerAppUserId,
    room.userId,
    room.appUserId,
    room.providerUserId,
    room.peerProviderUserId,
  );
  pushDeviceIdCandidates(candidates, room.peerDeviceId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.peerDeviceIds, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.deviceId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.deviceIds, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.chatUserId, domain, roomUserId);
  pushDeviceIdCandidates(candidates, room.chatUserIds, domain, roomUserId);

  const current = normalizeUserName(options.currentUserId);
  const userMetadata = Array.isArray(room.userMetadata) ? room.userMetadata : [];
  for (const entry of userMetadata) {
    if (!isRecord(entry)) continue;
    const entryUserId = firstString(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId,
    );
    const entryNames = collectStringValues(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId,
      entry.deviceId,
      entry.deviceIds,
      entry.chatUserId,
      entry.chatUserIds,
    ).map(normalizeUserName);
    if (current && entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, entryUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, entryUserId);
  }

  return normalizeTransportAddressList(candidates);
}

function collectOwnDeviceIdsFromRoom(
  room: Record<string, unknown>,
  options: Pick<ChatRoomDirectoryOptions, "currentUserId" | "xmppDomain">,
): string[] {
  const candidates: string[] = [];
  const domain = normalizeXmppDomain(options.xmppDomain);
  const current = normalizeUserName(options.currentUserId);
  if (!current) {
    return [];
  }

  pushDeviceIdCandidates(candidates, room.selfDeviceId, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfDeviceIds, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfChatUserId, domain, options.currentUserId);
  pushDeviceIdCandidates(candidates, room.selfChatUserIds, domain, options.currentUserId);

  const userMetadata = Array.isArray(room.userMetadata) ? room.userMetadata : [];
  for (const entry of userMetadata) {
    if (!isRecord(entry)) continue;
    const entryNames = collectStringValues(
      entry.id,
      entry.userId,
      entry.appUserId,
      entry.providerUserId,
    ).map(normalizeUserName);
    if (!entryNames.includes(current)) continue;
    pushDeviceIdCandidates(candidates, entry.deviceId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.deviceIds, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserId, domain, options.currentUserId);
    pushDeviceIdCandidates(candidates, entry.chatUserIds, domain, options.currentUserId);
  }

  return normalizeTransportAddressList(candidates);
}

function collectStringValues(...values: unknown[]): string[] {
  const strings: string[] = [];
  values.forEach((value) => pushStrings(strings, value));
  return strings;
}

function pushStrings(target: string[], value: unknown): void {
  if (typeof value === "string" && value.trim()) {
    target.push(value.trim());
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((entry) => pushStrings(target, entry));
  }
}

function pushDeviceIdCandidates(
  target: string[],
  value: unknown,
  xmppDomain?: string,
  userId?: string,
): void {
  const values: string[] = [];
  pushStrings(values, value);
  values
    .map((entry) => expandDeviceIdCandidate(entry, xmppDomain, userId))
    .filter((entry): entry is string => Boolean(entry))
    .forEach((entry) => target.push(entry));
}

function firstString(...values: unknown[]): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return undefined;
}

function normalizeUserName(value?: string): string | undefined {
  const normalized = normalizeBareDeviceId(value);
  if (!normalized) return undefined;
  return normalizeUserIdSegment(normalized) ?? normalized.split("@")[0] ?? normalized;
}

function expandDeviceIdCandidate(
  value: string,
  xmppDomain?: string,
  userId?: string,
): string | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const domain = normalizeXmppDomain(xmppDomain);
  const targetDomain =
    normalizeXmppDomain(trimmed.includes("@") ? trimmed.split("@")[1]?.split("/")[0] : undefined) ??
    domain;
  const normalizedUserId = normalizeUserIdSegment(userId) ?? normalizeUserIdSegment(trimmed);

  if (normalizedUserId && targetDomain) {
    return getChatUserId({ username: normalizedUserId, domain: targetDomain });
  }

  if (trimmed.includes("@")) return normalizeBareDeviceId(trimmed);
  return domain ? getChatUserId({ username: trimmed, domain }) : trimmed;
}

function isValidOmemoState(value: unknown): value is OmemoState {
  if (!isRecord(value)) return false;
  return (
    typeof value.bareJid === "string" &&
    value.bareJid.length > 0 &&
    typeof value.omemoDeviceId === "number" &&
    Number.isFinite(value.omemoDeviceId) &&
    value.omemoDeviceId > 0 &&
    typeof value.identityPrivateKey === "string" &&
    value.identityPrivateKey.length > 0 &&
    typeof value.identityPublicKey === "string" &&
    value.identityPublicKey.length > 0
  );
}

function createInMemoryKeyValueStore(): ChatKeyValueStore {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

export function createMemoryStorageBackend(): ChatKeyValueStore {
  return createInMemoryKeyValueStore();
}

export function createIndexDbStorageBackend(
  options: IndexDbStorageOptions = {},
): ChatKeyValueStore {
  const dbName = options.dbName ?? "lulafi-chat-sdk";
  const storeName = options.storeName ?? "keyValue";
  let dbPromise: Promise<IDBDatabase> | null = null;

  const getDb = (): Promise<IDBDatabase> => {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (!globalThis.indexedDB) {
        reject(new Error("chat_indexeddb_unavailable"));
        return;
      }

      const request = globalThis.indexedDB.open(dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName);
        }
      };
      request.onerror = () => {
        reject(request.error ?? new Error("chat_indexeddb_open_failed"));
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
    return dbPromise;
  };

  const withStore = async <T>(
    mode: IDBTransactionMode,
    run: (store: IDBObjectStore) => IDBRequest<T>,
  ): Promise<T> => {
    const db = await getDb();
    return new Promise<T>((resolve, reject) => {
      const transaction = db.transaction(storeName, mode);
      const store = transaction.objectStore(storeName);
      const request = run(store);
      request.onerror = () => {
        reject(request.error ?? new Error("chat_indexeddb_request_failed"));
      };
      request.onsuccess = () => {
        resolve(request.result);
      };
      transaction.onerror = () => {
        reject(transaction.error ?? new Error("chat_indexeddb_transaction_failed"));
      };
    });
  };

  return {
    getItem: async (key) => {
      const value = await withStore("readonly", (store) => store.get(key));
      return typeof value === "string" ? value : null;
    },
    setItem: async (key, value) => {
      await withStore("readwrite", (store) => store.put(value, key));
    },
    removeItem: async (key) => {
      await withStore("readwrite", (store) => store.delete(key));
    },
  };
}

export function createMongoDbStorageBackend(
  options: MongoDbStorageOptions,
): ChatKeyValueStore {
  const { collection } = options;
  const keyField = options.keyField ?? "_id";
  const valueField = options.valueField ?? "value";
  const updatedAtField = options.updatedAtField ?? "updatedAt";

  return {
    getItem: async (key) => {
      const document = await collection.findOne({ [keyField]: key });
      const value = document?.[valueField];
      return typeof value === "string" ? value : null;
    },
    setItem: async (key, value) => {
      const setFields: Record<string, unknown> = {
        [valueField]: value,
        [updatedAtField]: new Date(),
      };

      if (keyField !== "_id") {
        setFields[keyField] = key;
      }

      await collection.updateOne(
        { [keyField]: key },
        { $set: setFields },
        { upsert: true },
      );
    },
    removeItem: async (key) => {
      await collection.deleteOne({ [keyField]: key });
    },
  };
}

export const storageBackends = {
  memory: createMemoryStorageBackend(),
  indexDb: createIndexDbStorageBackend(),
  mongoDb: createMongoDbStorageBackend,
  createMemory: createMemoryStorageBackend,
  createIndexDb: createIndexDbStorageBackend,
  createMongoDb: createMongoDbStorageBackend,
};

function bytesToBase64(bytes: Uint8Array): string {
  const globalWithBuffer = globalThis as typeof globalThis & {
    Buffer?: {
      from: (input: Uint8Array | ArrayBuffer | string, encoding?: string) => {
        toString: (encoding: string) => string;
      };
    };
  };
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(bytes).toString("base64");
  }

  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const globalWithBuffer = globalThis as typeof globalThis & {
    Buffer?: {
      from: (input: string, encoding: string) => Uint8Array;
    };
  };
  if (globalWithBuffer.Buffer) {
    return new Uint8Array(globalWithBuffer.Buffer.from(value, "base64"));
  }

  const binary = atob(value);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function bytesToUint32(bytes: Uint8Array): number {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(0, false);
}

function xorBytes(left: Uint8Array, right: Uint8Array): Uint8Array {
  const output = new Uint8Array(Math.min(left.length, right.length));
  for (let i = 0; i < output.length; i += 1) {
    output[i] = left[i]! ^ right[i]!;
  }
  return output;
}

function concatBytes(first: Uint8Array, second: Uint8Array): Uint8Array {
  const output = new Uint8Array(first.length + second.length);
  output.set(first, 0);
  output.set(second, first.length);
  return output;
}

function toRawXmlString(value: unknown): string {
  if (!value) return "";
  const withToString = value as { toString?: () => string };
  try {
    if (typeof withToString.toString === "function") {
      return withToString.toString();
    }
  } catch {
    return "";
  }
  return "";
}

function parseXmlAttributes(input: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /([a-zA-Z_:][\w:.-]*)\s*=\s*(['"])([\s\S]*?)\2/g;
  let match: RegExpExecArray | null = null;
  while ((match = pattern.exec(input)) !== null) {
    const name = match[1]?.trim();
    const value = decodeXmlEntities(match[3] ?? "");
    if (name) attributes[name] = value;
  }
  return attributes;
}

function decodeXmlEntities(input: string): string {
  return input
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");
}

function encodeJsonBase64(value: unknown): string {
  const json = JSON.stringify(value);
  const globalWithBuffer = globalThis as typeof globalThis & {
    Buffer?: { from: (input: string, encoding: string) => { toString: (encoding: string) => string } };
  };
  if (globalWithBuffer.Buffer) {
    return globalWithBuffer.Buffer.from(json, "utf8").toString("base64");
  }

  const bytes = new TextEncoder().encode(json);
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function decodeJsonBase64(value: string): unknown {
  try {
    const globalWithBuffer = globalThis as typeof globalThis & {
      Buffer?: { from: (input: string, encoding: string) => { toString: (encoding: string) => string } };
    };
    if (globalWithBuffer.Buffer) {
      return JSON.parse(globalWithBuffer.Buffer.from(value, "base64").toString("utf8"));
    }

    const binary = atob(value);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return null;
  }
}
