import { IFile } from '@/types/app.types';
import { AxiosError } from 'axios';
import api from '../../../api/axios';

export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<IFile> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<IFile>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress?.(progress);
        }
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Upload error details:', axiosError.response?.data);
    const errorMessage =
      (axiosError.response?.data as { error?: string })?.error ||
      'Upload failed';
    throw new Error(errorMessage);
  }
};

export const deleteFile = async (fileId: string): Promise<void> => {
  if (!fileId) {
    throw new Error('File ID is required');
  }

  try {
    await api.delete(`/files/${fileId}`);
  } catch (error) {
    console.error('Delete error details:', error);
    throw new Error('Failed to delete file');
  }
};

export const getFileUrl = (shareLink: string): string => {
  return `${import.meta.env.VITE_SERVER_URL}/files/download/${shareLink}`;
};

export const fetchUserFiles = async (): Promise<IFile[]> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const response = await api.get('/files/user', {
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.data) {
      throw new Error('No data received from server');
    }

    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Full error details:', {
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      config: axiosError.config,
    });
    if (axiosError.response?.status === 404) {
      throw new Error('Endpoint not found: Check your API route configuration');
    }
    if (axiosError.response?.status === 401) {
      throw new Error('Unauthorized: Please login to access your files');
    }
    console.error('Error fetching user files:', axiosError);
    throw new Error('Failed to fetch user files');
  }
};
