import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  getLocalProgressList,
  syncReadingProgressOnLogin,
} from "@/lib/reading-progress";

/**
 * On mount: if logged in and local progress exists, merge to cloud once.
 * Covers email dialog success and OAuth redirect returns.
 */
export function ReadingProgressSync() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    async function maybeSync() {
      const local = getLocalProgressList(1);
      if (local.length === 0) return;

      const { data: session } = await authClient.getSession();
      if (!session) return;

      const ok = await syncReadingProgressOnLogin();
      if (ok) {
        toast.success("Progress synced");
      }
    }

    maybeSync();
  }, []);

  return null;
}
