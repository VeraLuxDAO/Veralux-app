import type { RefObject } from "react";
import { Plus, type LucideIcon } from "lucide-react";

type MenuAction = {
  label: string;
  icon: LucideIcon;
};

interface MessageContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  emojiOptions: string[];
  actions: MenuAction[];
  onEmojiSelect: (emoji: string) => void;
  onActionSelect: (label: string) => void;
  onAddReaction: () => void;
  reactionButtonRef: RefObject<HTMLButtonElement>;
}

export function MessageContextMenu({
  isOpen,
  position,
  emojiOptions,
  actions,
  onEmojiSelect,
  onActionSelect,
  onAddReaction,
  reactionButtonRef,
}: MessageContextMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed z-[1000] flex items-center gap-3 px-4 py-3"
        style={{
          top: position.y,
          left: position.x,
          width: "362px",
          height: "60px",
          borderRadius: "16px",
          background: "#0000004A",
          backdropFilter: "blur(16px)",
          border: "1px solid #FFFFFF0F",
        }}
      >
        {emojiOptions.map((emoji, idx) => (
          <button
            key={idx}
            className="h-9 w-9 rounded-[10px] bg-[#E5F7FD0F] flex items-center justify-center text-lg text-white hover:bg-white/10 transition-all"
            onClick={() => onEmojiSelect(emoji)}
            title={`React with ${emoji}`}
          >
            {emoji}
          </button>
        ))}
        <button
          ref={reactionButtonRef}
          className="h-9 w-9 rounded-full bg-[#E5F7FD0F] flex items-center justify-center text-white hover:bg-white/10 transition-all"
          onClick={onAddReaction}
          title="Add reaction"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div
        className="fixed z-[999] flex flex-col overflow-hidden px-2 py-3 gap-2"
        style={{
          top: position.y + 60 + 8,
          left: position.x,
          width: "130px",
          borderRadius: "16px",
          background: "#0000004A",
          border: "1px solid #FFFFFF0F",
          backdropFilter: "blur(16px)",
        }}
      >
        {actions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            className="flex items-center gap-3 text-sm px-2 py-2 rounded-lg text-[#9BB6CC] hover:bg-white/5 transition-colors"
            onClick={() => onActionSelect(label)}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
