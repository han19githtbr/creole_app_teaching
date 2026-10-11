// Envia as imagens de public/ghibli e public/c-quoi para o Cloudflare R2 mantendo os MESMOS caminhos.
// Uso:  node scripts/storage/migrate-to-r2.mjs --dry-run   (só lista)
//       node scripts/storage/migrate-to-r2.mjs             (envia o que ainda não está no bucket)
// Depois de conferir o site, apague as pastas locais (veja o README da entrega).
import fs from "node:fs";
import path from "node:path";
import dotenv from "dotenv";
import { HeadObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

dotenv.config({ path: ".env.local" });
const dryRun = process.argv.includes("--dry-run");
const { R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, ASSETS_BASE_URL } = process.env;
if (!dryRun && !(R2_ACCOUNT_ID && R2_ACCESS_KEY_ID && R2_SECRET_ACCESS_KEY && R2_BUCKET)) {
  console.error("Configure R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY e R2_BUCKET no .env.local.");
  process.exit(1);
}

const TYPES = { ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".gif": "image/gif" };
const FOLDERS = ["ghibli", "c-quoi"];

function* walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else yield full;
  }
}

const s3 = dryRun ? null : new S3Client({
  region: "auto",
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: { accessKeyId: R2_ACCESS_KEY_ID, secretAccessKey: R2_SECRET_ACCESS_KEY },
  forcePathStyle: true, // usa sempre o mesmo endereço (conta.r2.cloudflarestorage.com), sem DNS por bucket
  maxAttempts: 6,
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Tenta de novo quando a internet cai por alguns instantes (DNS, timeout, conexão resetada).
async function withRetry(task, label) {
  for (let attempt = 1; ; attempt++) {
    try {
      return await task();
    } catch (error) {
      if (attempt >= 5) throw error;
      const wait = attempt * 3000;
      console.warn(`  falha em ${label} (${error.code ?? error.name}); nova tentativa ${attempt}/4 em ${wait / 1000}s`);
      await sleep(wait);
    }
  }
}

let sent = 0, skipped = 0, bytes = 0;
const failures = [];
const sent_keys = [];
for (const folder of FOLDERS) {
  const root = path.join("public", folder);
  if (!fs.existsSync(root)) continue;
  for (const file of walk(root)) {
    const type = TYPES[path.extname(file).toLowerCase()];
    if (!type) continue;
    const key = path.relative("public", file).split(path.sep).join("/");
    const body = fs.readFileSync(file);
    if (dryRun) { console.log("enviaria", key, `${(body.length / 1024).toFixed(0)} KB`); sent++; bytes += body.length; continue; }
    try {
      let exists = false;
      try {
        const head = await withRetry(() => s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET, Key: key })), key);
        exists = head.ContentLength === body.length;
      } catch (error) {
        if (error?.$metadata?.httpStatusCode !== 404 && error?.name !== "NotFound") throw error;
      }
      if (exists) { skipped++; continue; }
      await withRetry(
        () => s3.send(new PutObjectCommand({ Bucket: R2_BUCKET, Key: key, Body: body, ContentType: type, CacheControl: "public, max-age=31536000, immutable" })),
        key
      );
      sent++; bytes += body.length; sent_keys.push(key);
      if (sent % 25 === 0) console.log(`... ${sent} arquivos`);
    } catch (error) {
      failures.push(key);
      console.error(`ERRO em ${key}: ${error.code ?? error.name}`);
    }
  }
}
console.log(`\nConcluído: ${sent} enviados (${(bytes / 1024 / 1024).toFixed(1)} MB), ${skipped} já estavam no bucket, ${failures.length} com erro.`);
if (failures.length) {
  console.error("Arquivos com erro (rode o script de novo; ele só envia o que falta):\n" + failures.join("\n"));
  process.exitCode = 1;
}

if (!dryRun && ASSETS_BASE_URL && sent_keys.length) {
  const sample = sent_keys[0];
  const res = await fetch(`${ASSETS_BASE_URL.replace(/\/+$/, "")}/${encodeURI(sample)}`);
  console.log(res.ok ? `Verificação pública OK: ${sample}` : `ATENÇÃO: ${sample} respondeu ${res.status} em ASSETS_BASE_URL — ative o acesso público do bucket.`);
}
