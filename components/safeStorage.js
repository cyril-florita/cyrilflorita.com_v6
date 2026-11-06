// Web Storage that never throws: private windows, blocked site data or a full
// quota make localStorage/sessionStorage throw on access, which would break
// the effects that use them. Reads fall back to null; writes are best effort.
const wrap = (name) => ({
  get(key) {
    try { return window[name].getItem(key); } catch { return null; }
  },
  set(key, value) {
    try { window[name].setItem(key, value); } catch { /* ignore */ }
  },
  remove(key) {
    try { window[name].removeItem(key); } catch { /* ignore */ }
  },
});

export const local = wrap("localStorage");
export const session = wrap("sessionStorage");

// decodeURIComponent that falls back to the raw string on malformed input
// (e.g. a hand-edited "#zoom-%E0" link) instead of throwing.
export const safeDecode = (value) => {
  try { return decodeURIComponent(value); } catch { return value; }
};
