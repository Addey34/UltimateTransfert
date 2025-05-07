import { NextFunction, Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { FileModel } from '../models/FileModel';
import { FileService } from '../services/fileService';

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Upload request received:', {
      file: req.file,
      user: req.user?._id,
      body: req.body,
    });
    if (!req.file) {
      return res.status(400).json({ error: 'No file provided' });
    }
    if (!req.user?._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const savedFile = await FileService.saveFile({
      file: req.file,
      userId: req.user._id,
      name: req.file.originalname,
    });
    return res.status(201).json(savedFile);
  } catch (error) {
    return res.status(500).json({
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const shareLink = req.params.shareLink;
    if (!shareLink || typeof shareLink !== 'string') {
      return res.status(400).json({ error: 'Invalid share link' });
    }
    const file = await FileModel.findOne({ shareLink }).select('+data');
    if (!file) {
      return res.status(404).json({ 
        error: 'File not found',
        code: 'FILE_NOT_FOUND'
      });
    }
    if (!file.data || file.data.length === 0) {
      return res.status(410).json({ 
        error: 'File content no longer available',
        code: 'FILE_CONTENT_GONE'
      });
    }
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Length', file.data.length);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader('Cache-Control', 'no-store');
    return res.send(file.data);
  } catch (error) {
    console.error('Download error:', error);
    if (error instanceof Error) {
      return res.status(500).json({ 
        error: 'Download failed',
        details: error.message,
        code: 'DOWNLOAD_ERROR'
      });
    }
    return res.status(500).json({ 
      error: 'Unexpected download error',
      code: 'UNEXPECTED_ERROR'
    });
  }
};

export const getUserFiles = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const files = await FileService.getUserFiles(req.user._id.toString());
    res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};
