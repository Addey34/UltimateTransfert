import mongoose from 'mongoose';
import { FileModel } from '../models/FileModel';
import { UserModel } from '../models/UserModel';

export class FileService {
  static async saveFile({
    name,
    file,
    userId,
  }: {
    name: string;
    file: Express.Multer.File;
    userId: string;
  }) {
    try {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);

      const shareLink = new mongoose.Types.ObjectId().toString();
      const buffer = file.buffer;

      const savedFile = await FileModel.create({
        name,
        path: `/files/${shareLink}`,
        contentType: file.mimetype,
        size: buffer.length,
        data: buffer,
        userId: new mongoose.Types.ObjectId(userId),
        shareLink,
        status: 'completed',
        progress: 100,
        createdAt: new Date(),
        expiresAt: expirationDate,
      });

      // Vérification immédiate de l'index TTL
      await mongoose.connection.collection('files').indexes();

      return {
        id: savedFile._id.toString(),
        name: savedFile.name,
        path: savedFile.path,
        shareLink: savedFile.shareLink,
        size: savedFile.size,
        status: savedFile.status,
        progress: savedFile.progress,
        expiresAt: savedFile.expiresAt,
      };
    } catch (error) {
      console.error('Error saving file:', error);
      throw new Error('File save failed');
    }
  }

  static async getUserFiles(userId: string) {
    const files = await FileModel.find({
      userId: new mongoose.Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .lean();

    return files.map((file) => ({
      ...file,
      id: file._id.toString(),
      _id: file._id.toString(),
    }));
  }

  static async deleteFile(fileId: string, userId: string) {
    if (!fileId || !mongoose.Types.ObjectId.isValid(fileId)) {
      throw new Error('Invalid file ID');
    }

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const file = await FileModel.findOne({
        _id: fileId,
        userId: new mongoose.Types.ObjectId(userId),
      });

      if (!file) {
        throw new Error('File not found or unauthorized');
      }

      await FileModel.deleteOne({ _id: file._id }).session(session);
      await UserModel.updateOne(
        { _id: userId },
        { $pull: { files: file._id } }
      ).session(session);

      await session.commitTransaction();
      return true;
    } catch (error) {
      await session.abortTransaction();
      console.error('Error deleting file:', error);
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async deleteExpiredFiles() {
    try {
      const expiredFiles = await FileModel.find({
        expiresAt: { $lt: new Date() },
      });
      for (const file of expiredFiles) {
        try {
          await FileModel.deleteOne({ _id: file._id });
          await UserModel.findByIdAndUpdate(file.userId, {
            $pull: { files: file._id },
          });
        } catch (err) {
          console.error(`Error deleting expired file ${file.name}:`, err);
        }
      }
    } catch (error) {
      console.error('Error in deleting expired files:', error);
    }
  }
}
