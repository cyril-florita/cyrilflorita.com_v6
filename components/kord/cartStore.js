"use client";

import { useSyncExternalStore } from "react";
import { local } from "@/components/safeStorage";
import { normalizeBuild, BIKES } from "@/components/kord/data";

// The cart, kept in this browser (localStorage `kd-cart`): a list of builds, each { id, ...build }.
// Read through useCart() (useSyncExternalStore), so every page and the header badge stay in step.
// Anything that isn't a valid build is dropped on read. (Named cartStore.js, not cart.js: macOS
// file names ignore case, and CartView.js is the cart page's component.)

const KEY = "kd-cart";
const listeners = new Set();
let cache = null;

function read() {
  if (cache) return cache;
  let raw = [];
  try { raw = JSON.parse(local.get(KEY) || "[]"); } catch { raw = []; }
  cache = (Array.isArray(raw) ? raw : [])
    .filter((x) => x && typeof x === "object" && BIKES.some((b) => b.id === x.bike))
    .slice(0, 10)
    .map((x) => ({ id: String(x.id || Math.random().toString(36).slice(2, 9)), ...normalizeBuild(x) }));
  return cache;
}
function write(list) { cache = list; local.set(KEY, JSON.stringify(list)); listeners.forEach((f) => f()); }

export const getCart = () => read();
export function addToCart(build) { write([...read(), { id: Math.random().toString(36).slice(2, 9), ...normalizeBuild(build) }]); }
export function removeFromCart(id) { write(read().filter((x) => x.id !== id)); }
export function clearCart() { write([]); }

const EMPTY = [];
function subscribe(f) {
  listeners.add(f);
  const onStorage = (e) => { if (e.key === KEY) { cache = null; f(); } };
  window.addEventListener("storage", onStorage);
  return () => { listeners.delete(f); window.removeEventListener("storage", onStorage); };
}
export const useCart = () => useSyncExternalStore(subscribe, read, () => EMPTY);
