"use client";

import { useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Drop this anywhere in the app (e.g. layout) and it will silently run
 * the seedAdmins mutation once. It's idempotent – safe to call on every boot.
 */
export default function AdminSeeder() {
  const seedAdmins = useMutation(api.admin.seedAdmins);

  useEffect(() => {
    seedAdmins().catch((err) =>
      console.error("Failed to seed admins:", err)
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null; // renders nothing
}
