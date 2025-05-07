import express, { NextFunction, Response } from 'express';
import { upload } from '../config/multer';
import {
  downloadFile,
  getUserFiles,
  uploadFile,
} from '../controllers/fileController';
import { authMiddleware, AuthRequest } from '../middlewares/authMiddleware';
import { FileModel } from '../models/FileModel';
import { FileService } from '../services/fileService';


const router: express.Router = express.Router();

router.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      await uploadFile(req, res);
    } catch (err) {
      next(err);
    }
  }
);

router.use('/download/:shareLink', async (req, res, next) => {
  try {
    const shareLink = req.params.shareLink;
    const fileExists = await FileModel.exists({ shareLink });
    
    if (!fileExists) {
      return res.status(404).json({ 
        error: 'File not found or already deleted',
        code: 'FILE_NOT_FOUND'
      });
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

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

router.get(
  '/user',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await getUserFiles(req, res, next);
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  '/:fileId',
  authMiddleware,
  async (req: AuthRequest, res: Response, next: NextFunction) => {
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
