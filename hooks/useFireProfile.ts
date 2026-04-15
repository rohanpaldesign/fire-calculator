"use client";
import { useState, useCallback } from "react";
import type { FireProfile } from "@/types/fire";
import { DEFAULT_PROFILE, STORAGE_KEY } from "@/lib/constants";

function loadFromStorage(): FireProfile {
  if (typeof window === "undefined") return DEFAULT_PROFILE;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_PROFILE;
    return { ...DEFAULT_PROFILE, ...JSON.parse(stored) };
  } catch { return DEFAULT_PROFILE; }
}

export function useFireProfile() {
  const [profile, setProfileState] = useState<FireProfile>(DEFAULT_PROFILE);
  const [hydrated, setHydrated] = useState(false);

  const hydrate = useCallback(() => {
    if (hydrated) return;
    setProfileState(loadFromStorage());
    setHydrated(true);
  }, [hydrated]);

  const updateProfile = useCallback((patch: Partial<FireProfile>) => {
    setProfileState((prev) => {
      const next = { ...prev, ...patch };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, []);

  const resetProfile = useCallback(() => {
    try { localStorage.removeItem(STORAGE_KEY); } catch {}
    setProfileState(DEFAULT_PROFILE);
  }, []);

  return { profile, hydrate, updateProfile, resetProfile, hydrated };
}
