require('dotenv').config();
const Client = require('ssh2-sftp-client');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// Incremental SFTP deploy of the static export in out/.
//
// The server keeps a manifest (.deploy-manifest.json: path → content hash)
// of what the last deploy uploaded. Each run hashes out/, uploads only new or
// changed files, then removes files the previous deploy uploaded that the new
// build no longer has. Files the manifest never listed (anything put on the
// server by hand) are never touched.
//
// Order keeps the live site consistent while it uploads: assets first (Next's
// JS/CSS chunks have content-hashed names, so new ones sit beside the old),
// HTML last (the moment pages start pointing at the new assets), stale files
// deleted only after that.
//
//   node deploy.js            deploy
//   node deploy.js --dry-run  list what would change, touch nothing
//
// The first run finds no manifest, so it uploads everything once (and deletes
// nothing); later runs are incremental.

const localPath = path.join(__dirname, 'out'); // Next.js static export directory
const remotePath = '_cyrilflorita_v6';
const MANIFEST = '.deploy-manifest.json';
const CONCURRENCY = 6;
const dryRun = process.argv.includes('--dry-run');

// Finder's .DS_Store files never go up.
const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  if (e.name === '.DS_Store') return [];
  const full = path.join(dir, e.name);
  return e.isDirectory() ? walk(full) : [full];
});

const hashFile = (file) => crypto.createHash('sha1').update(fs.readFileSync(file)).digest('hex');

// Runs fn over items, at most `limit` at a time.
const pool = async (items, limit, fn) => {
  let next = 0;
  const worker = async () => {
    while (next < items.length) await fn(items[next++]);
  };
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, worker));
};

const mb = (bytes) => `${(bytes / 1024 / 1024).toFixed(1)} MB`;

// A missing manifest (first deploy) vs any other failure to read it (lost
// connection, permissions, ...), which must not be mistaken for a first deploy.
const isNoSuchFile = (err) =>
  err?.code === 2 || err?.code === 'ENOENT' || /No such file/i.test(err?.message || '');

// Manifest entries are deleted on the server, so only accept plain relative
// paths that stay inside remotePath: no absolute paths, no `..` or `.`
// segments, no backslashes or empty segments.
const isSafeRelative = (f) =>
  typeof f === 'string' &&
  f.length > 0 &&
  !f.startsWith('/') &&
  !/[\\\0]/.test(f) &&
  f.split('/').every((seg) => seg !== '' && seg !== '.' && seg !== '..');

const main = async () => {
  if (!fs.existsSync(localPath)) throw new Error('out/ not found: run `npm run build` first');

  const local = {};
  for (const file of walk(localPath)) {
    local[path.relative(localPath, file).split(path.sep).join('/')] = hashFile(file);
  }

  const sftp = new Client();
  await sftp.connect({
    host: process.env.SFTP_HOST,
    port: process.env.SFTP_PORT || 22,
    username: process.env.SFTP_USERNAME,
    password: process.env.SFTP_PASSWORD,
  });
  console.log('Connected to SFTP server');

  try {
    let remote = {};
    let raw = null;
    try {
      raw = (await sftp.get(`${remotePath}/${MANIFEST}`)).toString();
    } catch (err) {
      if (!isNoSuchFile(err)) {
        throw new Error(`Could not read the deploy manifest on the server (${err.message}); aborting rather than treating this as a first deploy.`);
      }
      console.log('No deploy manifest on the server yet: uploading everything this time.');
    }
    if (raw !== null) {
      remote = JSON.parse(raw);
      if (!remote || typeof remote !== 'object' || Array.isArray(remote)) {
        throw new Error('The deploy manifest on the server is not a path → hash object; aborting.');
      }
    }

    const changed = Object.keys(local).filter((f) => remote[f] !== local[f]);
    const unsafe = Object.keys(remote).filter((f) => !(f in local) && !isSafeRelative(f));
    for (const f of unsafe) console.warn(`  ! skipping unsafe manifest path: ${JSON.stringify(f)}`);
    const stale = Object.keys(remote).filter((f) => !(f in local) && isSafeRelative(f));
    const isHtml = (f) => f.endsWith('.html');
    const assets = changed.filter((f) => !isHtml(f));
    const pages = changed.filter(isHtml);
    const bytes = changed.reduce((n, f) => n + fs.statSync(path.join(localPath, f)).size, 0);

    console.log(`${Object.keys(local).length} files in out/ · ${changed.length} to upload (${mb(bytes)}) · ${stale.length} to remove`);
    if (dryRun) {
      for (const f of changed) console.log(`  + ${f}`);
      for (const f of stale) console.log(`  - ${f}`);
      console.log('Dry run: nothing uploaded.');
      return;
    }

    const made = new Set();
    const ensureDir = async (dir) => {
      if (dir === '.' || made.has(dir)) return;
      made.add(dir);
      await sftp.mkdir(`${remotePath}/${dir}`, true);
    };
    const dirs = [...new Set(changed.map((f) => path.posix.dirname(f)))].sort();
    for (const dir of dirs) await ensureDir(dir);

    let done = 0;
    const upload = async (f) => {
      await sftp.put(path.join(localPath, f), `${remotePath}/${f}`);
      done++;
      if (done % 50 === 0 || done === changed.length) console.log(`  uploaded ${done}/${changed.length}`);
    };
    await pool(assets, CONCURRENCY, upload);
    await pool(pages, CONCURRENCY, upload);

    await pool(stale, CONCURRENCY, (f) => sftp.delete(`${remotePath}/${f}`, true));
    if (stale.length) console.log(`  removed ${stale.length} stale files`);

    // Written last, so an interrupted deploy just re-uploads next time.
    await sftp.put(Buffer.from(JSON.stringify(local)), `${remotePath}/${MANIFEST}`);
    await sftp.put(Buffer.from(`Deployment completed at ${new Date().toISOString()}\n`), `${remotePath}/deployment-log.txt`);
    console.log('Deployment process completed successfully');
  } finally {
    await sftp.end();
  }
};

main().catch((err) => {
  console.error('Error during deployment:', err);
  process.exitCode = 1;
});
