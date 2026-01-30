/**
 * Emoji Utility Functions
 * 
 * Helper functions for detecting and working with emojis/emoticons
 */

/**
 * Detects if a message contains only emoticons (no regular text)
 * This regex pattern matches:
 * - Unicode emoji ranges (including skin tones, flags, etc.)
 * - Emoji sequences and combinations
 * - Common emoji patterns
 * - Zero-width joiners and variation selectors
 */
const EMOJI_REGEX = /^[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}\p{Emoji_Modifier}\u200d\uFE0F\s]+$/u;

/**
 * Checks if a string contains only emoticons (and whitespace).
 * Numbers-only (digits 0-9) must never be treated as emoticons — they should display as normal bubbles.
 * @param text - The text to check
 * @returns true if the text contains only emoticons, false otherwise
 */
export function isOnlyEmoticons(text: string): boolean {
  if (!text || !text.trim()) return false;
  
  const trimmed = text.trim();
  if (trimmed.length === 0) return false;
  
  // Numbers-only (digits and optional spaces) must always display as a normal bubble, not large emoticon
  if (/^[\d\s]+$/.test(trimmed)) return false;
  
  // Check if the entire string matches emoji pattern (actual emoji/emoticon characters)
  return EMOJI_REGEX.test(trimmed);
}

/**
 * Checks if a message should be displayed as an emoticon-only message
 * (i.e., contains only emoticons and no images)
 * @param content - The message content
 * @param images - Optional array of image URLs
 * @returns true if message should be displayed prominently as emoticon-only
 */
export function shouldDisplayAsEmoticonOnly(
  content: string,
  images?: string[]
): boolean {
  // Must have content
  if (!content || !content.trim()) return false;
  
  // Must not have images
  if (images && images.length > 0) return false;
  
  // Content must be only emoticons
  return isOnlyEmoticons(content);
}

