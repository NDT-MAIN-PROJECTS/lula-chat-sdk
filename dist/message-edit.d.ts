/** The window starts at the original send; corrections never extend it. */
export declare const CHAT_MESSAGE_EDIT_WINDOW_MS: number;
export type ChatMessageEditTarget = {
    authorAddress: string;
    timestamp: number;
    body: string;
    hasAttachments?: boolean;
    metadata?: Record<string, unknown>;
};
export type ChatMessageEditError = "chat_edit_original_not_found" | "chat_edit_not_message_author" | "chat_edit_not_allowed" | "chat_edit_expired";
export declare function isMessageEditWithinWindow(originalTimestamp: number, editTimestamp?: number): boolean;
/** Compare edit creation time on receipt, and the current time before sending. */
export declare function getMessageEditError(original: ChatMessageEditTarget | null | undefined, editorAddress: string, editTimestamp?: number): ChatMessageEditError | undefined;
//# sourceMappingURL=message-edit.d.ts.map