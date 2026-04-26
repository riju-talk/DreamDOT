import {
  connectToDatabase as connectShared,
  disconnectDatabase as disconnectShared,
} from '@repo/database-mongo';

export async function connectToDatabase() {
  await connectShared(process.env.MONGODB_URI || process.env.MONGO_CLUSTER);
  return {};
}

export async function closeDatabaseConnection() {
  await disconnectShared();
}
