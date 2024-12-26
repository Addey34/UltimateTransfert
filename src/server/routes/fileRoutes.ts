import express, { NextFunction, Response } from 'express';
import { Document } from 'mongoose';
import { IUser } from '../../types/user';
import { upload } from '../config/multer';
import {
  downloadFile,
  getUserFiles,
  uploadFile,
} from '../controllers/fileController';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import { FileService } from '../services/fileService';

interface FileRequest extends AuthRequest {
  user: Document<unknown, object, IUser> &
    IUser &
    Required<{ _id: unknown }> & { __v: number };
  file?: Express.Multer.File;
}

const router: express.Router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Upload route with validation
router.post(
  '/upload',
  authMiddleware,
  (req: FileRequest, res: Response, next: NextFunction) => {
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.error('Multer error:', err);
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      next();
    });
  },
  async (req: FileRequest, res: Response, next: NextFunction) => {
    try {
      console.log('Processing upload for file:', req.file?.originalname);
      await uploadFile(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Download route - Public access, no authMiddleware
router.get(
  '/download/:shareLink',
  async (req: express.Request, res: Response, next: NextFunction) => {
    try {
      await downloadFile(req, res);
    } catch (err) {
      next(err);
    }
  }
);

// Get user files route
router.get(
  '/user',
  authMiddleware,
  async (req: FileRequest, res: Response, next: express.NextFunction) => {
    try {
      await getUserFiles(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

// Add delete route
router.delete(
  '/:fileId',
  authMiddleware,
  async (req: FileRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user?._id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      await FileService.deleteFile(req.params.fileId, req.user._id.toString());
      res.status(200).json({ message: 'File deleted successfully' });
    } catch (err) {
      next(err);
    }
  }
);

// Error handling for this router
router.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
  ) => {
    console.error('File Route Error:', err);
    res.status(500).json({
      error: 'File operation failed',
      message: err.message,
    });
  }
);

export default router;
