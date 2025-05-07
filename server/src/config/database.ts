import mongoose from 'mongoose';
import { config } from './config';
import { initGridFS } from './multer';

export const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(config.mongoUri);
    console.log('MongoDB connected');
    initGridFS(connection.connection);
    return connection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
