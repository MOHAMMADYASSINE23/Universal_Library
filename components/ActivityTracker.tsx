"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";

const ActivityTracker = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.id) {
      // Call the activity API to update last activity date
      fetch("/api/user/activity", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).catch((error) => {
        console.error("Failed to update activity:", error);
      });
    }
  }, [session]);

  return null; // This component doesn't render anything
};

export default ActivityTracker;