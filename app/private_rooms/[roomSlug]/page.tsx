"use client";

import { NavigationLayout } from "@/components/navigation-layout";
import { RoomsSlidingPanel } from "@/components/rooms-sliding-panel";
import { useRouter } from "next/navigation";

export default function PrivateRoomSlugPage() {
  const router = useRouter();

  return (
    <NavigationLayout className="bg-transparent" hideDesktopSidebar>
      <div className="w-full h-full flex flex-col min-h-0">
        <RoomsSlidingPanel
          isOpen
          variant="page"
          onClose={() => router.push("/")}
        />
      </div>
    </NavigationLayout>
  );
}
