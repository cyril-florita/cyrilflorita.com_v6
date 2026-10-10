"use client";
import { useSyncExternalStore } from "react";

// Tiny localStorage store for the Viteo prototype (quiz answers, cart,
// order). Everything stays in the visitor's browser; nothing is sent
// anywhere. useStored() re-renders on writes from any component.

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
    value = raw ? JSON.parse(raw) : null;
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

export const useStored = (key) => useSyncExternalStore(subscribe, () => snapshot(key), () => null);

// True once hydrated on the client (server snapshot is false).
const noop = () => () => {};
export const useHydrated = () => useSyncExternalStore(noop, () => true, () => false);
