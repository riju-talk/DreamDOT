import mongoose from 'mongoose';

type GlobalMongooseCache = {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  __dreamdot_mongoose?: GlobalMongooseCache;
};

const cache: GlobalMongooseCache = globalWithMongoose.__dreamdot_mongoose ?? {
  conn: null,
  promise: null,
};

globalWithMongoose.__dreamdot_mongoose = cache;

export const connectToDatabase = async (uri?: string) => {
  const mongoUri = uri || process.env.MONGODB_URI || process.env.MONGO_CLUSTER;

  if (!mongoUri) {
    throw new Error('MongoDB URI is missing. Set MONGODB_URI or MONGO_CLUSTER.');
  }

  if (cache.conn) {
    return cache.conn;
  }

  if (!cache.promise) {
    cache.promise = mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 20,
      minPoolSize: 5,
      retryWrites: true,
      appName: 'dreamdot',
    });
  }

  cache.conn = await cache.promise;
  return cache.conn;
};

export const disconnectDatabase = async () => {
  if (cache.conn) {
    await mongoose.disconnect();
    cache.conn = null;
    cache.promise = null;
  }
};
