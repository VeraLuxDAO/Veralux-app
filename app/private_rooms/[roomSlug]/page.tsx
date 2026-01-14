"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function PrivateRoomSlugPage() {
  const router = useRouter();
  const params = useParams<{ roomSlug?: string }>();

  useEffect(() => {
    const slug = params?.roomSlug ? `/?private_rooms=${params.roomSlug}` : "/?private_rooms";
    router.replace(slug);
  }, [params?.roomSlug, router]);

  return null;
}
