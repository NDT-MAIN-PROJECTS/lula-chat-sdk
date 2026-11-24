/** The window starts at the original send; corrections never extend it. */
export const CHAT_MESSAGE_EDIT_WINDOW_MS = 15 * 60 * 1000;

export type ChatMessageEditTarget = {
  authorAddress: string;
  timestamp: number;
  body: string;
  hasAttachments?: boolean;
  metadata?: Record<string, unknown>;
};

export type ChatMessageEditError =
  | "chat_edit_original_not_found"
  | "chat_edit_not_message_author"
  | "chat_edit_not_allowed"
  | "chat_edit_expired";

export function isMessageEditWithinWindow(
  originalTimestamp: number,
  editTimestamp = Date.now(),
): boolean {
  return (
    Number.isFinite(originalTimestamp) &&
    originalTimestamp > 0 &&
    Number.isFinite(editTimestamp) &&
    editTimestamp >= originalTimestamp &&
    editTimestamp - originalTimestamp < CHAT_MESSAGE_EDIT_WINDOW_MS
  );
}

function authorIdentity(address: string): string {
  const trimmed = address.trim();
  const normalized = trimmed.toLowerCase();
  const bare = normalized.split("/")[0];
  // Never collapse MUC occupants to the room's bare JID. Prefer real sender
  // JIDs supplied by the transport; otherwise require the same occupant.
  if (bare.split("@")[1]?.startsWith("conference.")) {
    const separator = trimmed.indexOf("/");
    return separator < 0 ? bare : `${bare}${trimmed.slice(separator)}`;
  }
  const [local, domain] = bare.split("@");
  const account = local.startsWith("i.") ? local.replace(/\.d\..*$/, "") : local;
  return domain ? `${account}@${domain}` : account;
}

/** Compare edit creation time on receipt, and the current time before sending. */
export function getMessageEditError(
  original: ChatMessageEditTarget | null | undefined,
  editorAddress: string,
  editTimestamp = Date.now(),
): ChatMessageEditError | undefined {
  if (!original) return "chat_edit_original_not_found";
  const author = authorIdentity(original.authorAddress);
  if (!author || author !== authorIdentity(editorAddress)) return "chat_edit_not_message_author";
  const metadata = original.metadata ?? {};
  if (
    !original.body.trim() ||
    original.hasAttachments ||
    metadata.deleted ||
    metadata.redacted ||
    metadata.retracted ||
    metadata.formId ||
    metadata.emergencyType ||
    (metadata.messageType !== undefined && metadata.messageType !== "CHAT_MESSAGE")
  ) {
    return "chat_edit_not_allowed";
  }
  if (!isMessageEditWithinWindow(original.timestamp, editTimestamp)) return "chat_edit_expired";
  return undefined;
}
