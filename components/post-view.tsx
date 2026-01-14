"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PostCard } from "@/components/post-card";
import { NavigationLayout } from "@/components/navigation-layout";
import { FlowPost, Comment, Attachment } from "@/lib/posts-data";
import { Code2, FileText, Image as ImageIcon, Link2, Paperclip, Video } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PostViewProps = {
  post: FlowPost;
  comments: Comment[];
};

const attachmentIcon = (type: Attachment["type"]) => {
  switch (type) {
    case "document":
      return <FileText className="w-4 h-4 text-veralux-yellow" />;
    case "image":
      return <ImageIcon className="w-4 h-4 text-electric-blue" />;
    case "code":
      return <Code2 className="w-4 h-4 text-veralux-green" />;
    case "video":
      return <Video className="w-4 h-4 text-veralux-yellow" />;
    case "link":
    default:
      return <Link2 className="w-4 h-4 text-veralux-green" />;
  }
};

const AttachmentList = ({ attachments }: { attachments?: Attachment[] }) => {
  if (!attachments?.length) return null;

  return (
    <Card
      className="rounded-xl border px-3 sm:px-4 md:px-[16px] py-2 sm:py-3 md:py-[12px] border-white/10 bg-black/0"
    >
      <CardHeader className="pb-2 sm:pb-3">
        <CardTitle className="text-xs sm:text-sm font-medium text-[rgba(229,247,253,0.85)]">
          Attachments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 sm:space-y-3 px-0">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center justify-between gap-2 sm:gap-3 rounded-lg border border-white/10 bg-black/10 px-2 sm:px-3 py-1.5 sm:py-2"
          >
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
              <div className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 rounded-md bg-white/5 border border-white/10 flex-shrink-0">
                {attachmentIcon(attachment.type)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-white truncate">
                  {attachment.label}
                </p>
                {attachment.meta && (
                  <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 sm:mt-1 truncate">
                    {attachment.meta}
                  </p>
                )}
              </div>
            </div>
            {attachment.url ? (
              <a
                href={attachment.url}
                target="_blank"
                rel="noreferrer"
                className="text-[10px] sm:text-xs font-medium text-electric-blue hover:underline whitespace-nowrap flex-shrink-0"
              >
                Open
              </a>
            ) : (
              <Badge variant="outline" className="text-[10px] sm:text-xs border-white/15 text-white/80 flex-shrink-0">
                {attachment.type}
              </Badge>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const CommentList = ({ comments }: { comments: Comment[] }) => {
  if (!comments.length) {
    return null;
  }

  return (
    <div>
      <div className="pt-1 flex items-center gap-1.5 sm:gap-2 mb-2">
        <svg className="w-4 h-4 sm:w-[17px] sm:h-[17px] flex-shrink-0" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.75 8.25C15.75 12.3921 12.3921 15.75 8.25 15.75C7.25238 15.75 6.30025 15.5552 5.42958 15.2016C5.26294 15.1339 5.17962 15.1001 5.11227 15.085C5.04638 15.0702 4.99763 15.0648 4.93011 15.0648C4.86109 15.0648 4.78591 15.0773 4.63554 15.1024L1.67063 15.5966C1.36015 15.6483 1.20491 15.6742 1.09265 15.626C0.994402 15.5839 0.916108 15.5056 0.873967 15.4073C0.825819 15.2951 0.851692 15.1398 0.903439 14.8294L1.39759 11.8645C1.42265 11.7141 1.43518 11.6389 1.43517 11.5699C1.43516 11.5024 1.42976 11.4536 1.415 11.3877C1.3999 11.3204 1.36606 11.2371 1.29839 11.0704C0.94478 10.1997 0.75 9.24762 0.75 8.25C0.75 4.10786 4.10786 0.75 8.25 0.75C12.3921 0.75 15.75 4.10786 15.75 8.25Z" stroke="#F2F2F7" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <p className="text-base sm:text-lg md:text-[20px] font-medium text-[rgba(229,247,253,0.9)]">Comments <span className="text-base sm:text-lg md:text-[20px] font-semibold text-[#9BB6CC]">{comments.length}</span></p>
      </div>
      {comments.map((comment, index) => (
        <div key={comment.id} className="pt-4 first:pt-4">
          <div className="flex gap-3">
            <Avatar className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 flex-shrink-0">
              <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xs sm:text-sm">
                {comment.author.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 space-y-1.5 sm:space-y-2">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <span className="text-xs sm:text-sm font-semibold text-white">{comment.author.name}</span>
                <span className="text-[10px] sm:text-xs text-muted-foreground">{comment.author.username}</span>
                {comment.author.verified && (
                  <Badge className="bg-veralux-yellow/20 text-veralux-yellow border-veralux-yellow/40">
                    Verified
                  </Badge>
                )}
                <span className="text-xs text-muted-foreground">• {comment.timestamp}</span>
              </div>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed whitespace-pre-line">
                {comment.content}
              </p>
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-[10px] sm:text-xs text-muted-foreground flex-wrap">
                <div className="flex items-center gap-1">
                  <Paperclip className="w-3 h-3" />
                  <span>{comment.glows}</span>
                </div>
                <button className="hover:text-white transition-colors">Reply</button>
                <button className="hover:text-white transition-colors">Show Reply</button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export function PostView({ post, comments }: PostViewProps) {
  const router = useRouter();
  const [postState, setPostState] = useState<FlowPost>(post);
  const commentCount = useMemo(() => comments.length, [comments]);

  const handleGlow = (postId: string) => {
    if (postId !== postState.id) return;
    setPostState((prev) => ({
      ...prev,
      hasGlowed: !prev.hasGlowed,
      glows: prev.hasGlowed ? prev.glows - 1 : prev.glows + 1,
    }));
  };

  const handleTip = (postId: string) => {
    if (postId !== postState.id) return;
    setPostState((prev) => ({
      ...prev,
      hasTipped: !prev.hasTipped,
      tips: prev.hasTipped ? prev.tips - 1 : prev.tips + 1,
    }));
  };

  return (
    <>
      <NavigationLayout className="bg-transparent relative z-[2]">
        <div className="w-full flex flex-col lg:flex-row px-2 sm:px-4 md:px-6 lg:px-8">
          <div className="flex-1 min-w-0 space-y-4 w-full max-w-full mx-auto lg:mx-0">
            <div className="flex items-center gap-2 sm:gap-3 text-white px-1 sm:px-0">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-1.5 sm:gap-2 text-sm font-medium text-white hover:text-veralux-yellow transition-colors"
                aria-label="Back"
              >
                <span className="text-base sm:text-lg leading-none">‹</span>
                <span className="text-base sm:text-[20px]">Post</span>
              </button>
            </div>
            <div className="w-full">
              <PostCard
                post={{ ...postState, replies: commentCount }}
                onGlow={handleGlow}
                onTip={handleTip}
              />
            </div>
            <div className="space-y-4 px-1 sm:px-2 md:px-4">
              <AttachmentList attachments={postState.attachments || []} />
              <CommentList comments={comments} />
            </div>
          </div>
          <div className="hidden lg:block w-[320px] xl:w-[360px] flex-shrink-0" aria-hidden />
        </div>
      </NavigationLayout>
    </>
  );
}
