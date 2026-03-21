"use client";

import { useCallback } from "react";
import { useStorage } from "./useStorage";
import { useSaveIndicator } from "./useSaveIndicator";
import { useToast } from "@/components/ui/Toast";
import type { UserProfile } from "@/types/profile";

/**
 * Handles the common get-merge-set profile save pattern used across
 * Know Yourself, Applications, Job Search, Social Media, and Landing the Job pages.
 *
 * Returns { saved, save } where save() merges the given partial into
 * the existing profile and persists it.
 */
export function useProfileSave() {
  const storage = useStorage();
  const { saved, showSaved } = useSaveIndicator();
  const { toast } = useToast();

  const save = useCallback(
    async (patch: Partial<UserProfile>) => {
      try {
        const profile = (await storage.getProfile()) ?? {};
        await storage.setProfile({ ...profile, ...patch });
        showSaved();
        toast("Saved successfully", "success");
      } catch {
        toast("Failed to save. Please try again.", "error");
      }
    },
    [storage, showSaved, toast]
  );

  return { saved, save, storage };
}
