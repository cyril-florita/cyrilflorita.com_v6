// Bakes Viteo's 3D pills into images for every pill on the site except the
// live hero scene: renders components/viteo/pillModels.js for each product in
// components/viteo/data.js in headless Chrome (scripts/render-pills.html) and
// writes public/img/viteo/pills/<id>.png. Re-run after changing a product's
// color/form or the models:  node scripts/render-pills.mjs
// Needs Google Chrome installed (CHROME env var to override its path).
import { spawn } from "node:child_process";
import { createServer } from "node:http";
import { mkdirSync, readFileSync, writeFileSync, existsSync, mkdtempSync } from "node:fs";
import { join, extname } from "node:path";
import { tmpdir } from "node:os";
import sharp from "sharp";

const ROOT = process.cwd();
const OUT = join(ROOT, "public/img/viteo/pills");
const CHROME = process.env.CHROME || "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript" };

const server = createServer((req, res) => {
  const file = join(ROOT, decodeURIComponent(req.url.split("?")[0]));
  if (!file.startsWith(ROOT) || !existsSync(file)) return res.writeHead(404).end();
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" }).end(readFileSync(file));
}).listen(0);
const port = await new Promise((r) => server.on("listening", () => r(server.address().port)));

const profile = mkdtempSync(join(tmpdir(), "pills-"));
const chrome = spawn(CHROME, ["--headless=new", "--remote-debugging-port=0", `--user-data-dir=${profile}`, "about:blank"], { stdio: ["ignore", "ignore", "pipe"] });
const wsUrl = await new Promise((resolve, reject) => {
  chrome.stderr.on("data", (d) => { const m = String(d).match(/ws:\/\/\S+/); if (m) resolve(m[0]); });
  setTimeout(() => reject(new Error("Chrome did not start")), 15000);
});
const { port: dp } = new URL(wsUrl);
const target = await (await fetch(`http://127.0.0.1:${dp}/json/new?about:blank`, { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((r) => (ws.onopen = r));
let id = 0;
const pending = new Map();
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pending.has(d.id)) { pending.get(d.id)(d); pending.delete(d.id); } };
const send = (method, params = {}) => new Promise((r) => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expression) => {
  const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (r.result?.exceptionDetails) throw new Error(r.result.exceptionDetails.exception?.description);
  return r.result?.result?.value;
};

try {
  await send("Page.navigate", { url: `http://localhost:${port}/scripts/render-pills.html` });
  for (let i = 0; i < 100 && !(await ev("!!window.__ready")); i++) await new Promise((r) => setTimeout(r, 100));
  const images = await ev("window.__render()");
  mkdirSync(OUT, { recursive: true });
  for (const [pid, url] of Object.entries(images)) {
    const png = Buffer.from(url.split(",")[1], "base64");
    await sharp(png).png({ compressionLevel: 9, palette: false }).toFile(join(OUT, `${pid}.png`));
    const { width, height } = await sharp(png).metadata();
    console.log(`img/viteo/pills/${pid}.png  ${width}×${height}`);
  }
} finally {
  ws.close();
  chrome.kill();
  server.close();
}
