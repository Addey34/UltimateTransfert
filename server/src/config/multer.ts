import mongoose from 'mongoose';
import multer from 'multer';

let bucket: mongoose.mongo.GridFSBucket;

export const initGridFS = (connection: mongoose.Connection) => {
  if (!connection.db) {
    throw new Error('Database connection is not established');
  }
  bucket = new mongoose.mongo.GridFSBucket(connection.db, {
    bucketName: 'uploads',
  });
};

const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 1024,
  },
});

export const getExpirationDate = () => {
  const date = new Date();
  date.setHours(date.getHours() + 24);
  return date;
};

export const saveToGridFS = async (
  file: Express.Multer.File
): Promise<string> => {
  if (!bucket) {
    throw new Error('GridFS bucket not initialized');
  }
  return new Promise((resolve, reject) => {
    const filename = `${Date.now()}-${file.filename}`;
    const uploadStream = bucket.openUploadStream(filename);
    uploadStream.on('error', reject);
    uploadStream.on('finish', () => resolve(filename));
    uploadStream.end(file.buffer);
  });
};

import { Response } from 'express';

export const getFileStream = (filename: string, res: Response) => {
  if (!bucket) {
    throw new Error('GridFS bucket not initialized');
  }
  return bucket.openDownloadStreamByName(filename).pipe(res);
};
