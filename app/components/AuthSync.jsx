"use client";
import { useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { syncServerSession } from "@/lib/api";

// Keeps the server's JWT cookie in step with the BetterAuth login
export default function AuthSync() {
  const { data: session } = useSession();
  const email = session?.user?.email;

  useEffect(() => {
    if (!email) return;
    (async () => {
      try {
        const res = await fetch("/server/me", { cache: "no-store" });
        const me = res.ok ? await res.json() : null;
        if (!me || me.email !== email) await syncServerSession();
      } catch {
        /* the next API call will retry */
      }
    })();
  }, [email]);

  return null;
}