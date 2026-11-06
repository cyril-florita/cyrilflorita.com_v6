"use client";
import { useSyncExternalStore } from "react";
import { normalizeStored } from "./data";

// Tiny localStorage store for the Viteo prototype (answers, cart,
// order). Everything stays in the visitor's browser; nothing is sent
// anywhere. useStored() re-renders on writes from any component. Values are
// normalized on read (normalizeStored in data.js), so data from an older
// version, or edited by hand, can't crash a page; the result is cached by the
// raw string, so the snapshot stays the same object between writes.

const PREFIX = "dl.";
const listeners = new Set();
const cache = new Map();

const rawFor = (key) => {
  try {
    return localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
};

const snapshot = (key) => {
  const raw = rawFor(key);
  const hit = cache.get(key);
  if (hit && hit.raw === raw) return hit.value;
  let value = null;
  try {
    value = raw ? normalizeStored(key, JSON.parse(raw)) : null;
  } catch {
    value = null;
  }
  cache.set(key, { raw, value });
  return value;
};

const subscribe = (listener) => {
  listeners.add(listener);
  const onStorage = (e) => e.key?.startsWith(PREFIX) && listener();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
};

export const read = (key) => (typeof window === "undefined" ? null : snapshot(key));

export const write = (key, value) => {
  try {
    if (value === null || value === undefined) localStorage.removeItem(PREFIX + key);
    else localStorage.setItem(PREFIX + key, JSON.stringify(value));
  } catch {}
  listeners.forEach((l) => l());
};

// Clears everything the prototype saved (answers, cart, order, session,
// referral; every "dl." key). The theme and mode ("dl-theme", "dl-mode") stay.
export const resetPreview = () => {
  try {
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(PREFIX)) keys.push(k);
    }
    keys.forEach((k) => localStorage.removeItem(k));
  } catch {}
  cache.clear();
  listeners.forEach((l) => l());
};

export const useStored = (key) => useSyncExternalStore(subscribe, () => snapshot(key), () => null);

// True once hydrated on the client (server snapshot is false).
const noop = () => () => {};
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);
