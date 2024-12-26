import { createContext, ReactNode, useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { fetchUserFiles } from '../services/api/fileService';
import { IFile } from '../types/file';

interface FileContextType {
  files: IFile[];
  setFiles: React.Dispatch<React.SetStateAction<IFile[]>>;
  fetchFiles: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const FileContext = createContext<FileContextType | undefined>(
  undefined
);

export const FileProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [files, setFiles] = useState<IFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const fetchFiles = useCallback(async () => {
    if (!isAuthenticated) {
      setFiles([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const fetchedFiles = await fetchUserFiles();
      setFiles(fetchedFiles);
    } catch (error) {
      setError('Unable to load files. Please try again.');
      console.error('Error fetching user files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  return (
    <FileContext.Provider
      value={{ files, setFiles, fetchFiles, isLoading, error }}
    >
      {children}
    </FileContext.Provider>
  );
};
