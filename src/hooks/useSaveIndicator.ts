"use client";

import { useState, useCallback, useRef, useEffect } from "react";

export function useSaveIndicator(timeout = 2000) {
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showSaved = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSaved(true);
    timerRef.current = setTimeout(() => setSaved(false), timeout);
  }, [timeout]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { saved, showSaved };
}
