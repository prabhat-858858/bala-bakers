import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let memoryServer = null;

export const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && !uri.includes('<username>')) {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 6000,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return { isMemory: false, uri };
    } catch (error) {
      console.warn(`⚠️ Could not connect to configured MONGODB_URI (${error.message}).`);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
      console.log('🔄 Falling back to local embedded MongoDB server for development...');
    }
  } else {
    console.log('ℹ️ No external MONGODB_URI configured. Starting embedded MongoDB server for local development...');
  }

  memoryServer = await MongoMemoryServer.create();
  const memoryUri = memoryServer.getUri('bela-bakers');
  const conn = await mongoose.connect(memoryUri);
  console.log(`✅ Embedded MongoDB Connected: ${conn.connection.host} (Database: bela-bakers)`);
  return { isMemory: true, uri: memoryUri };
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServer) {
    await memoryServer.stop();
  }
};
