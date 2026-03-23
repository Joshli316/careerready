"use client";

import { LocalStorageAdapter } from "@/lib/storage/local";
import type { StorageAdapter } from "@/lib/storage/adapter";

// Module-level singleton — LocalStorageAdapter is stateless, no need to recreate per mount
const storageAdapter = new LocalStorageAdapter();

export function useStorage(): StorageAdapter {
  return storageAdapter;
}
