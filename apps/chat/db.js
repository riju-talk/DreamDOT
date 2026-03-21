const { connectToDatabase } = require('@repo/database-mongo');

async function connectDb() {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chatapp';
  await connectToDatabase(mongoUri);
}

module.exports = {
  connectDb
};
