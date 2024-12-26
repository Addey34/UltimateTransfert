import mongoose from 'mongoose';

// Définition des statuts possibles pour un fichier
export type FileStatus = 'uploading' | 'completed' | 'deleting' | 'error';

// Interface représentant un fichier côté serveur
export interface IFile {
  id: mongoose.Types.ObjectId;
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

// Options de configuration pour l'upload de fichiers
export interface UploadOptions {
  maxSize: number;
  allowedTypes: string[];
  compressionEnabled: boolean;
}

// Type représentant une erreur liée aux fichiers
export type FileError = {
  code: string;
  message: string;
};
