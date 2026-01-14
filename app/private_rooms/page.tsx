"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PrivateRoomsPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/?private_rooms");
  }, [router]);

  return null;
}
