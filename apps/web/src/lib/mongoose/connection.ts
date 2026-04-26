import {
  connectToDatabase as connectShared,
  disconnectDatabase as disconnectShared,
} from '@repo/database-mongo';

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGO_CLUSTER;
  if (!uri) {
    throw new Error(
      '[DreamDot] MongoDB URI is not set. Add MONGODB_URI or MONGO_CLUSTER to your .env file.'
    );
  }
  await connectShared(uri);
  return {};
}

export async function closeDatabaseConnection() {
  await disconnectShared();
}
