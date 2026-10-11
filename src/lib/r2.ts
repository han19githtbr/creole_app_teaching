// Cloudflare R2 (compatível com a API S3) — armazenamento das imagens fora do projeto.
// Só servidor. As imagens são servidas pelo próprio app (mesma origem) via rewrite em next.config.ts,
// então o canvas (exportar vídeo, cartão de conquista) continua funcionando sem configurar CORS.
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

let cached: S3Client | null = null;

export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET &&
      process.env.ASSETS_BASE_URL
  );
}

function client(): S3Client {
  if (!isR2Configured()) {
    throw new Error("Armazenamento R2 não configurado (R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET e ASSETS_BASE_URL).");
  }
  if (!cached) {
    cached = new S3Client({
      region: "auto",
      endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
      },
    });
  }
  return cached;
}

export async function r2Put(key: string, body: Buffer, contentType: string): Promise<void> {
  await client().send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

export async function r2Delete(key: string): Promise<void> {
  await client().send(new DeleteObjectCommand({ Bucket: process.env.R2_BUCKET, Key: key }));
}
