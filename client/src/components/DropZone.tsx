import { useCallback, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useFileActions } from '../hooks/useFileActions';

const DropZone: React.FC = () => {
  const { uploadFile } = useFileActions();
  const { isAuthenticated } = useAuth();
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file) return;

      if (!isAuthenticated) {
        alert('Please log in to upload files');
        return;
      }

      const maxSize = 1024 * 1024 * 1024;
      if (file.size > maxSize) {
        alert('Le fichier est trop volumineux. La taille maximum est de 1GB.');
        return;
      }

      try {
        await uploadFile(file);
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        alert("Une erreur est survenue lors de l'upload du fichier");
      }
    },
    [uploadFile, isAuthenticated]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
        ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-blue-400'
        }`}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onClick={() => document.getElementById('fileInput')?.click()}
    >
      <input
        id="fileInput"
        type="file"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
        }}
      />
      <p className="text-gray-600">
        {isDragging
          ? 'Déposez le fichier ici'
          : 'Glissez un fichier ou cliquez pour sélectionner'}
      </p>
    </div>
  );
};

export default DropZone;
