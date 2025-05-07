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
  mongoUri: process.env.MONGO_CONNECT_URL as string,
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    url: process.env.SERVER_URL as string,
  },
  client: {
    url: process.env.CLIENT_URL as string,
  },
  auth: {
    jwtSecret: process.env.JWT_SECRET as string,
    googleClientId: process.env.GOOGLE_CLIENT_ID as string,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
  },
  file: {
    expiryHours: 24,
    maxSize: 1024 * 1024 * 1024,
  },
};
