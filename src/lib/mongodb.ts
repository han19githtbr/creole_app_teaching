import mongoose from "mongoose";

interface MongooseCache {
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

// Um único cache por processo: reaproveita a mesma conexão em todas as requisições (e no hot reload do dev).
const cached: MongooseCache = global._mongooseCache ?? { promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  // Já conectado: reaproveita.
  if (mongoose.connection.readyState === 1) return mongoose;

  // Conexão em andamento: espera a mesma promessa (nunca abre uma segunda).
  if (cached.promise) return cached.promise;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI não está definida. Configure-a no arquivo .env.local (veja README.md).");
  }

  // Se a conexão cair, limpa o cache para a próxima requisição reconectar.
  if (!mongoose.connection.listeners("disconnected").length) {
    mongoose.connection.on("disconnected", () => {
      cached.promise = null;
    });
  }

  cached.promise = mongoose
    .connect(uri, {
      // Serverless (Vercel): cada instância da função abre o SEU pool. Pool pequeno + conexões ociosas
      // fechadas rápido evitam estourar o limite de 500 conexões do plano gratuito (M0) do Atlas.
      maxPoolSize: 3,
      minPoolSize: 0,
      maxIdleTimeMS: 10_000,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      bufferCommands: true,
    })
    .catch((err) => {
      cached.promise = null;
      throw err;
    });

  return cached.promise;
}
