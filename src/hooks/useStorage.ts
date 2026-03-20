"use client";

import { useMemo } from "react";
import { LocalStorageAdapter } from "@/lib/storage/local";
import type { StorageAdapter } from "@/lib/storage/adapter";

export function useStorage(): StorageAdapter {
  return useMemo(() => new LocalStorageAdapter(), []);
}
