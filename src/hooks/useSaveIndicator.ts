"use client";

import { useState, useCallback } from "react";

export function useSaveIndicator(timeout = 2000) {
  const [saved, setSaved] = useState(false);

  const showSaved = useCallback(() => {
    setSaved(true);
    const timer = setTimeout(() => setSaved(false), timeout);
    return () => clearTimeout(timer);
  }, [timeout]);

  return { saved, showSaved };
}
