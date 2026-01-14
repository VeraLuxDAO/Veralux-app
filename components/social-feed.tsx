"use client";

import { useState, useCallback, useEffect } from "react";
import { PostCard } from "@/components/post-card";
import { PostCreator } from "@/components/post-creator";
import { useAuth } from "@/contexts/auth-context";
import { usePosts } from "@/contexts/posts-context";
import {
  FlowPost,
  MediaFile,
  getAllPosts,
  generatePostLink,
} from "@/lib/posts-data";

export function SocialFeed() {
  const { user, isAuthenticated } = useAuth();
  const { userPosts, addPost, updatePost } = usePosts();
  const [posts, setPosts] = useState<FlowPost[]>(() => getAllPosts());

  const handleGlow = useCallback(
    (postId: string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const updated = {
              ...post,
              hasGlowed: !post.hasGlowed,
              glows: post.hasGlowed ? post.glows - 1 : post.glows + 1,
            };
            // Update in context if it's a user post
            if (post.id.startsWith("user-")) {
              updatePost(postId, {
                hasGlowed: updated.hasGlowed,
                glows: updated.glows,
              });
            }
            return updated;
          }
          return post;
        })
      );
    },
    [updatePost]
  );

  const handleTip = useCallback(
    (postId: string) => {
      setPosts((prevPosts) =>
        prevPosts.map((post) => {
          if (post.id === postId) {
            const updated = {
              ...post,
              hasTipped: !post.hasTipped,
              tips: post.hasTipped ? post.tips - 1 : post.tips + 1,
            };
            // Update in context if it's a user post
            if (post.id.startsWith("user-")) {
              updatePost(postId, {
                hasTipped: updated.hasTipped,
                tips: updated.tips,
              });
            }
            return updated;
          }
          return post;
        })
      );
    },
    [updatePost]
  );

  const handleCreatePost = useCallback((content: string, files?: File[]) => {
    if (!content.trim() && (!files || files.length === 0)) return;

    // Convert files to media objects with object URLs
    // In a real implementation, you would:
    // 1. Upload files to your storage (e.g., IPFS, AWS S3, etc.)
    // 2. Get the file URLs from the storage service
    // 3. Store them in the post data
    const supportedVideoMimes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
    ];

    const media: MediaFile[] | undefined = files?.map((file) => {
      const type = file.type.startsWith("image/")
        ? "image"
        : file.type.startsWith("video/")
        ? "video"
        : "audio";
      const url = URL.createObjectURL(file);
      const mime = file.type || undefined;
      const playable =
        type !== "video" ||
        !mime ||
        supportedVideoMimes.some((m) => mime.includes(m.split("/")[1]) || mime === m);

      return { type, url, mime, playable };
    });

    const newPost: FlowPost = {
      id: `user-${Date.now()}`,
      author: {
        name: user?.name || "Anonymous User",
        username: user?.email?.split("@")[0] 
          ? `@${user.email.split("@")[0]}` 
          : "@user",
        avatar: user?.picture || "/placeholder.svg",
        verified: false,
        badges: [],
      },
      content,
      timestamp: "now",
      glows: 0,
      tips: 0,
      replies: 0,
      hasGlowed: false,
      hasTipped: false,
      tags: [],
      attachments: [],
      media,
    };

    // Add new post to context (for persistence)
    addPost(newPost);
    // Add new post at the beginning of the feed
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  }, [user, addPost]);

  // Sync user posts from context
  useEffect(() => {
    const basePosts = getAllPosts();
    // Combine base posts with user posts, avoiding duplicates
    const allPosts = [
      ...userPosts,
      ...basePosts.filter((bp) => !userPosts.some((up) => up.id === bp.id)),
    ];
    setPosts(allPosts);
  }, [userPosts]);

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Post Creator - at the top (only show when authenticated) */}
      {isAuthenticated && user && (
        <PostCreator onCreatePost={handleCreatePost} />
      )}

      {/* Posts Feed */}
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onGlow={handleGlow}
          onTip={handleTip}
          href={generatePostLink(post.id)}
        />
      ))}
    </div>
  );
}
