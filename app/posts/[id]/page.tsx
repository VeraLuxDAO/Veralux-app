"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { PostView } from "@/components/post-view";
import { getAllPosts, getCommentsForPost, getPostById, FlowPost } from "@/lib/posts-data";
import { usePosts } from "@/contexts/posts-context";

type PostPageProps = {
  params: { id: string };
};

export default function PostPage({ params }: PostPageProps) {
  const router = useRouter();
  const { getPost: getUserPost } = usePosts();
  const [post, setPost] = useState<FlowPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check static posts first
    let foundPost = getPostById(params.id);
    
    // If not found, check user posts from context
    if (!foundPost) {
      foundPost = getUserPost(params.id);
    }

    if (foundPost) {
      setPost(foundPost);
    } else {
      // Post not found, redirect to 404 or home
      router.push("/");
    }
    setIsLoading(false);
  }, [params.id, getUserPost, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!post) {
    return null; // Router will handle redirect
  }

  const comments = getCommentsForPost(params.id);

  return <PostView post={{ ...post, replies: comments.length }} comments={comments} />;
}
