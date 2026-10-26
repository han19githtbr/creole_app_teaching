// Cloudflare R2 (compatível com a API S3) — armazenamento das imagens fora do projeto.
// Só servidor. As imagens são servidas pelo próprio app (mesma origem) via rewrite em next.config.ts,
// então o canvas (exportar vídeo, cartão de conquista) continua funcionando sem configurar CORS.
import {
  DeleteObjectCommand,
  ListObjectsV2Command,
  type ListObjectsV2CommandOutput,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";

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
      forcePathStyle: true,
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

export interface R2StorageStats {
  configured: boolean;
  bucket?: string;
  totalBytes: number;
  totalFormatted: string;
  objectCount: number;
  freeTierLimitBytes: number;
  freeTierLimitGB: number;
  remainingBytes: number;
  remainingFormatted: string;
  percentUsed: number;
  updatedAt: string;
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(2)} KB`;
  const mb = kb / 1024;
  if (mb < 1024) return `${mb.toFixed(2)} MB`;
  const gb = mb / 1024;
  return `${gb.toFixed(2)} GB`;
}

/**
 * Consulta em tempo real o uso do Cloudflare R2 no bucket configurado,
 * somando o tamanho de todos os objetos e calculando o saldo restante do plano gratuito (10 GB).
 */
export async function getR2StorageStats(): Promise<R2StorageStats> {
  const FREE_TIER_LIMIT_BYTES = 10 * 1024 * 1024 * 1024; // 10 GB no plano gratuito do Cloudflare R2
  const now = new Date().toISOString();

  if (!isR2Configured()) {
    return {
      configured: false,
      totalBytes: 0,
      totalFormatted: "0 B",
      objectCount: 0,
      freeTierLimitBytes: FREE_TIER_LIMIT_BYTES,
      freeTierLimitGB: 10,
      remainingBytes: FREE_TIER_LIMIT_BYTES,
      remainingFormatted: "10.00 GB",
      percentUsed: 0,
      updatedAt: now,
    };
  }

  try {
    let totalBytes = 0;
    let objectCount = 0;
    let continuationToken: string | undefined = undefined;

    do {
      const res: ListObjectsV2CommandOutput = await client().send(
        new ListObjectsV2Command({
          Bucket: process.env.R2_BUCKET,
          ContinuationToken: continuationToken,
        })
      );
      if (res.Contents) {
        for (const obj of res.Contents) {
          totalBytes += obj.Size ?? 0;
          objectCount++;
        }
      }
      continuationToken = res.NextContinuationToken;
    } while (continuationToken);

    const remainingBytes = Math.max(0, FREE_TIER_LIMIT_BYTES - totalBytes);
    const percentUsed = Math.min(100, Number(((totalBytes / FREE_TIER_LIMIT_BYTES) * 100).toFixed(2)));

    return {
      configured: true,
      bucket: process.env.R2_BUCKET,
      totalBytes,
      totalFormatted: formatBytes(totalBytes),
      objectCount,
      freeTierLimitBytes: FREE_TIER_LIMIT_BYTES,
      freeTierLimitGB: 10,
      remainingBytes,
      remainingFormatted: formatBytes(remainingBytes),
      percentUsed,
      updatedAt: now,
    };
  } catch (error) {
    console.error("Erro ao consultar armazenamento do Cloudflare R2:", error);
    return {
      configured: true,
      bucket: process.env.R2_BUCKET,
      totalBytes: 0,
      totalFormatted: "Erro ao consultar",
      objectCount: 0,
      freeTierLimitBytes: FREE_TIER_LIMIT_BYTES,
      freeTierLimitGB: 10,
      remainingBytes: FREE_TIER_LIMIT_BYTES,
      remainingFormatted: "10.00 GB",
      percentUsed: 0,
      updatedAt: now,
    };
  }
}
