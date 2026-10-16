import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? { conn: null, promise: null };
global._mongooseCache = cached;

export async function connectDB(): Promise<typeof mongoose> {
  // Se já estiver conectado (readyState === 1), reaproveita a conexão ativa
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  // Se já estiver em processo de conexão (readyState === 2), aguarda a promessa existente
  if (mongoose.connection.readyState === 2 && cached.promise) {
    return cached.promise;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI não está definida. Configure-a no arquivo .env.local (veja README.md)."
    );
  }

  // Configura listeners para limpar o cache caso a conexão caia ou ocorra erro
  if (!mongoose.connection.listeners("disconnected").length) {
    mongoose.connection.on("disconnected", () => {
      cached.conn = null;
      cached.promise = null;
    });
  }
  if (!mongoose.connection.listeners("error").length) {
    mongoose.connection.on("error", () => {
      cached.conn = null;
      cached.promise = null;
    });
  }

  cached.conn = null;
  cached.promise = mongoose
    .connect(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      bufferCommands: true,
    })
    .then((m) => {
      cached.conn = m;
      return m;
    })
    .catch((err) => {
      cached.promise = null;
      cached.conn = null;
      throw err;
    });

  return cached.promise;
}

