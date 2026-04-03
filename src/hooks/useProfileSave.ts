"use client";

import { useCallback } from "react";
import { useStorage } from "./useStorage";
import { useSaveIndicator } from "./useSaveIndicator";
import { useToast } from "@/components/ui/Toast";
import { useLanguage } from "@/lib/i18n/LanguageContext";
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
  const { t } = useLanguage();

  const save = useCallback(
    async (patch: Partial<UserProfile>) => {
      try {
        const profile = (await storage.getProfile()) ?? {};
        await storage.setProfile({ ...profile, ...patch });
        showSaved();
        toast(t("common.savedSuccessfully"), "success");
      } catch {
        toast(t("common.saveFailed"), "error");
      }
    },
    [storage, showSaved, toast, t]
  );

  return { saved, save, storage };
}
