import { Request, Response, NextFunction } from 'express';
import { IUser } from '../../types/user';
import { FileService } from '../services/fileService';
import { FileModel } from '../models/FileModel';

interface AuthRequest extends Request {
  user?: IUser & { _id: string };
  file?: Express.Multer.File;
}

export const uploadFile = async (req: AuthRequest, res: Response) => {
  try {
    console.log('Upload request received:', { 
      file: req.file, 
      user: req.user?._id,
      body: req.body 
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

    console.log('File saved successfully:', savedFile);
    return res.status(201).json(savedFile);
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ 
      error: 'Upload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    const shareLink = req.params.shareLink;
    const file = await FileModel.findOne({ shareLink });
    
    if (!file) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Force le téléchargement du fichier
    res.setHeader('Content-Type', file.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(file.name)}"`);
    res.setHeader('Cache-Control', 'no-cache');
    if (!file.data) {
      return res.status(500).json({ error: 'File data is missing' });
    }
    res.setHeader('Content-Length', file.data.length);
    return res.send(file.data);
  } catch (error) {
    console.error('Download error:', error);
    return res.status(500).json({ error: 'Download failed' });
  }
};

export const getUserFiles = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user as IUser;
    if (!user?.id) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const files = await FileService.getUserFiles(user.id);
    return res.status(200).json(files);
  } catch (error) {
    next(error);
  }
};
