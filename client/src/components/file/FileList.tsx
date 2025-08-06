import { useFile } from '@/hooks/useFile';
import { IFile } from '@/types/app.types';
import { Check, File, RefreshCw, X } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useFileActions } from '../../hooks/useFileActions';

const FileList: React.FC = () => {
  const { files, fetchFiles } = useFile();
  const { copiedFiles, removeFile, handleCopyLink } = useFileActions();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const handleFetch = React.useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      await fetchFiles();
    } catch (error) {
      setError('Unable to load files. Please try again.');
      console.error('Error fetching user files:', error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFiles]);

  useEffect(() => {
    if (isAuthenticated) {
      handleFetch();
    }
  }, [handleFetch, isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-500">Please login to view your files</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <RefreshCw className="w-6 h-6 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {files.length === 0 ? (
        <p className="text-center text-gray-500 p-4">No files uploaded yet</p>
      ) : (
        files.map((file: IFile) => (
          <div
            key={file.id.toString()}
            className="flex items-center justify-between p-4 bg-white rounded-lg shadow"
          >
            <div className="flex items-center gap-3">
              <File className="w-6 h-6 text-blue-500" />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {Math.round(file.size / 1024)} Ko
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {file.status === 'uploading' && (
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${file.progress ?? 0}%` }}
                  />
                </div>
              )}

              {file.status === 'completed' && (
                <button
                  onClick={() => handleCopyLink(file)}
                  className="p-2 hover:bg-gray-100 rounded"
                >
                  {copiedFiles.includes(file.id.toString()) ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    'Copier le lien'
                  )}
                </button>
              )}

              <button
                onClick={() => removeFile(file.id.toString())}
                className="p-2 hover:bg-gray-100 rounded text-red-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FileList;
