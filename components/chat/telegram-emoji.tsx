"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface TelegramEmojiProps {
  content: string;
  className?: string;
  size?: number;
}

// Regex to match emojis (including sequences with zero-width joiners)
const EMOJI_REGEX = /[\p{Emoji}\p{Emoji_Presentation}\p{Emoji_Modifier_Base}\p{Emoji_Component}\p{Emoji_Modifier}\u200d\uFE0F]+/gu;

// Twemoji CDN base URL (using latest version)
const TWEMOJI_BASE = "https://cdn.jsdelivr.net/npm/twemoji@latest/assets";

/**
 * Converts Unicode emoji to Twemoji image URL
 * Handles emoji sequences, skin tones, and zero-width joiners
 */
function getTwemojiUrl(emoji: string, size: number = 72): string {
  // Convert emoji to array of code points
  const codePoints: number[] = [];
  
  // Iterate through the string handling surrogate pairs
  for (let i = 0; i < emoji.length; i++) {
    const code = emoji.codePointAt(i);
    if (code !== undefined) {
      codePoints.push(code);
      // If it's a surrogate pair, skip the next character
      if (code > 0xFFFF) {
        i++;
      }
    }
  }

  if (codePoints.length === 0) return "";

  // Convert code points to hex and join with hyphens (Twemoji format)
  const codePointString = codePoints
    .map((cp) => cp.toString(16).toLowerCase())
    .join("-");

  // Twemoji uses PNG format
  return `${TWEMOJI_BASE}/${size}x${size}/${codePointString}.png`;
}

/**
 * Parses text and replaces emojis with Twemoji images
 */
function parseTelegramEmojis(
  text: string,
  size: number = 72
): (string | { type: "emoji"; url: string; original: string })[] {
  const parts: (string | { type: "emoji"; url: string; original: string })[] = [];
  let lastIndex = 0;

  const matches = Array.from(text.matchAll(EMOJI_REGEX));

  matches.forEach((match) => {
    // Add text before emoji
    if (match.index !== undefined && match.index > lastIndex) {
      const textPart = text.substring(lastIndex, match.index);
      if (textPart) {
        parts.push(textPart);
      }
    }

    // Add emoji as Twemoji image
    const emoji = match[0];
    const url = getTwemojiUrl(emoji, size);

    if (url) {
      parts.push({
        type: "emoji",
        url,
        original: emoji,
      });
    } else {
      // Fallback to original emoji if conversion fails
      parts.push(emoji);
    }

    lastIndex = (match.index || 0) + emoji.length;
  });

  // Add remaining text
  if (lastIndex < text.length) {
    const textPart = text.substring(lastIndex);
    if (textPart) {
      parts.push(textPart);
    }
  }

  // If no emojis found, return original text
  if (parts.length === 0) {
    return [text];
  }

  return parts;
}

export function TelegramEmoji({
  content,
  className,
  size = 72,
}: TelegramEmojiProps) {
  const parsedContent = useMemo(() => {
    return parseTelegramEmojis(content, size);
  }, [content, size]);

  return (
    <span className={cn("inline", className)}>
      {parsedContent.map((part, index) => {
        if (typeof part === "string") {
          return <span key={index} className="inline">{part}</span>;
        }

        return (
          <img
            key={index}
            src={part.url}
            alt={part.original}
            className="inline-block"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              display: "inline-block",
              verticalAlign: "text-bottom",
              lineHeight: 1,
            }}
            draggable={false}
            loading="lazy"
            onError={(e) => {
              // Fallback to original emoji if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              const fallback = document.createTextNode(part.original);
              target.parentNode?.insertBefore(fallback, target);
            }}
          />
        );
      })}
    </span>
  );
}

