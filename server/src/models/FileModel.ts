import mongoose from 'mongoose';
import { IFileMongoose } from '../types/mongoose.types';
const { Schema } = mongoose;

const fileSchema = new Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  shareLink: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['uploading', 'completed', 'error'],
    default: 'completed',
  },
  size: { type: Number, required: true },
  progress: { type: Number, default: 100 },
  contentType: { type: String, required: true },
  data: { type: Buffer, required: true },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0,
  },
});

fileSchema.pre('save', async function (next) {
  try {
    await this.collection.createIndex(
      { expiresAt: 1 },
      {
        expireAfterSeconds: 0,
        background: true,
      }
    );
    next();
  } catch (error) {
    next(error as Error);
  }
});

fileSchema.statics.forceCleanExpiredFiles = async function () {
  const now = new Date();
  const result = await this.deleteMany({
    expiresAt: { $lt: now },
  });
  console.log(`Manually cleaned ${result.deletedCount} expired files`);
  return result;
};

fileSchema.statics.cleanExpiredFiles = async function () {
  const now = new Date();
  const result = await this.deleteMany({
    expiresAt: { $lt: now },
  });
  console.log(`Cleaned ${result.deletedCount} expired files`);
  return result;
};

export const FileModel = mongoose.model<IFileMongoose>('File', fileSchema);
