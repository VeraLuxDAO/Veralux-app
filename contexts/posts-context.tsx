"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { FlowPost } from "@/lib/posts-data";

interface PostsContextType {
  userPosts: FlowPost[];
  addPost: (post: FlowPost) => void;
  updatePost: (postId: string, updates: Partial<FlowPost>) => void;
  getPost: (postId: string) => FlowPost | undefined;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const STORAGE_KEY = "veralux_user_posts";

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [userPosts, setUserPosts] = useState<FlowPost[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage whenever userPosts changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(userPosts));
      } catch (error) {
        console.error("Failed to save posts to localStorage:", error);
      }
    }
  }, [userPosts]);

  const addPost = useCallback((post: FlowPost) => {
    setUserPosts((prev) => [post, ...prev]);
  }, []);

  const updatePost = useCallback((postId: string, updates: Partial<FlowPost>) => {
    setUserPosts((prev) =>
      prev.map((post) => (post.id === postId ? { ...post, ...updates } : post))
    );
  }, []);

  const getPost = useCallback(
    (postId: string) => {
      return userPosts.find((post) => post.id === postId);
    },
    [userPosts]
  );

  return (
    <PostsContext.Provider value={{ userPosts, addPost, updatePost, getPost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts(): PostsContextType {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within PostsProvider");
  }
  return context;
}
