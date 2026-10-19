import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

// Um único cache por processo (sobrevive ao hot reload do dev e é reaproveitado entre requisições na Vercel).
const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

/**
 * Conexão única e estável com o MongoDB Atlas.
 *
 * Por que o alerta "connections exceeded your threshold" aparecia no cluster M0 (limite de 500 conexões):
 *  - o listener de "disconnected" zerava o cache; como o driver já se reconecta sozinho, a requisição seguinte
 *    abria um SEGUNDO pool sem fechar o anterior (vazamento de conexões a cada oscilação de rede);
 *  - cada instância serverless abria um pool grande (e cada pool ainda mantém conexões de monitoramento).
 * Agora: a promessa só é descartada se a conexão FALHAR; reconexões ficam por conta do driver; o pool é mínimo.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn && mongoose.connection.readyState === 1) return cached.conn;
  if (cached.promise) return cached.promise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI não está definida. Configure-a no arquivo .env.local (veja README.md).");
  }

  cached.promise = mongoose
    .connect(uri, {
      // Plano M0: 500 conexões no total para TODAS as instâncias. Pool pequeno e ocioso fechado rápido.
      maxPoolSize: 2,
      minPoolSize: 0,
      maxConnecting: 1,
      maxIdleTimeMS: 5_000,
      // Em serverless não mantém monitores em streaming (menos conexões abertas por instância).
      serverMonitoringMode: "poll",
      heartbeatFrequencyMS: 30_000,
      serverSelectionTimeoutMS: 8_000,
      connectTimeoutMS: 8_000,
      socketTimeoutMS: 45_000,
      waitQueueTimeoutMS: 10_000,
      bufferCommands: true,
    })
    .then((m) => {
      cached.conn = m;
      return m;
    })
    .catch((err) => {
      // Só descarta quando a conexão falhou: a próxima requisição tenta de novo (sem abrir pools extras).
      cached.promise = null;
      cached.conn = null;
      throw err;
    });

  return cached.promise;
}
