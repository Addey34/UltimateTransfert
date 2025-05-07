import mongoose from 'mongoose';

export type FileStatus = 'uploading' | 'completed' | 'deleting' | 'error';

export interface IFile {
  name: string;
  path: string;
  shareLink: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  status: FileStatus;
  size: number;
  progress?: number;
  contentType: string;
  data?: Buffer;
  expiresAt: Date;
}

export interface IFileMongoose extends IFile, mongoose.Document {}

export interface IUser {
  email: string;
  name: string;
  googleId: string;
  picture?: string;
  files: mongoose.Types.ObjectId[];
}

export interface IUserMongoose extends IUser, mongoose.Document {}