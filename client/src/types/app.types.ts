export type FileStatus = 'uploading' | 'completed' | 'deleting' | 'error';

export interface IFile {
  id: string;
  name: string;
  shareLink: string;
  userId: string;
  createdAt: string;
  status: FileStatus;
  size: number;
  progress?: number;
  contentType: string;
  expiresAt: string;
}

export interface IUser {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

export type FileError = {
  code: string;
  message: string;
};
