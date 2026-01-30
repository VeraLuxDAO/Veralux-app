"use client";

import { memo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Author } from "@/lib/posts-data";

export type UserWithTimestamp = {
  user: Author;
  timestamp: string;
};

interface UserListModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  items: UserWithTimestamp[];
}

export const UserListModal = memo<UserListModalProps>(
  ({ open, onOpenChange, title, items }) => {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          className="max-h-[85vh] overflow-hidden flex flex-col border border-white/10 bg-[#080E11]/30 backdrop-blur-[50px]"
          style={{
            boxShadow:
              "0 10px 40px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(229, 247, 253, 0.1)",
          }}
          showCloseButton={true}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          <DialogHeader>
            <DialogTitle
              className="text-left text-lg font-semibold"
              style={{ color: "#E9F0F5" }}
            >
              {title}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-y-auto flex-1 -mx-2 px-2 py-1 min-h-0">
            {items.length === 0 ? (
              <p
                className="text-sm py-4"
                style={{ color: "#9BB6CC" }}
              >
                No one yet
              </p>
            ) : (
              items.map(({ user, timestamp }, index) => (
                <div
                  key={`${user.username}-${index}`}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <Avatar className="w-10 h-10 flex-shrink-0">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs">
                      {user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className="font-medium text-sm truncate"
                        style={{ color: "#E9F0F5" }}
                      >
                        {user.name}
                      </span>
                      {user.verified && (
                        <svg
                          className="w-3.5 h-3.5 flex-shrink-0"
                          style={{ color: "rgba(250, 222, 253, 1)" }}
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <span
                      className="text-xs truncate block"
                      style={{ color: "#9BB6CC" }}
                    >
                      {user.username}
                    </span>
                  </div>
                  <span
                    className="text-xs flex-shrink-0"
                    style={{ color: "#9BB6CC" }}
                  >
                    {timestamp}
                  </span>
                </div>
              ))
            )}
          </div>
        </DialogContent>
      </Dialog>
    );
  }
);

UserListModal.displayName = "UserListModal";
