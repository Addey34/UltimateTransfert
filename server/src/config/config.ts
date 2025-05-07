import * as dotenv from 'dotenv';

dotenv.config();

export interface Config {
  mongoUri: string;
  server: {
    port: number;
    url: string;
  };
  client: {
    url: string;
  };
  auth: {
    jwtSecret: string;
    googleClientId: string;
    googleClientSecret: string;
  };
  file: {
    expiryHours: number;
    maxSize: number;
  };
}

export const config: Config = {
  mongoUri:
    process.env.MONGO_CONNECT_URL || 'mongodb://localhost:27017/filetransfer',
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    url: process.env.SERVER_URL || 'http://localhost:3000',
  },
  client: {
    url: process.env.CLIENT_URL || 'http://localhost:5173',
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET || 'default-secret-key',
    googleClientId: process.env.GOOGLE_CLIENT_ID || '',
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
  },
  file: {
    expiryHours: 24,
    maxSize: 1024 * 1024 * 1024,
  },
};
