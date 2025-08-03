import { type FC } from 'react';
import type { FileEntry } from '../../services';

interface FileItemCardProps {
  file: FileEntry;
  onDownload: () => void;
  onDelete: () => void;
}

const FileItemCard: FC<FileItemCardProps> = ({ file, onDownload, onDelete }) => {
  const isImage = /\.(jpe?g|png|webp|gif)$/i.test(file.name);
  const preview = isImage ? { url: URL.createObjectURL(file.blob) } : null;

  return (
    <div className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
      <div className="mb-2">
        <div className="font-medium text-gray-900 truncate">{file.name}</div>
        {preview && (
          <img
            src={preview.url || ''}
            alt={file.name}
            className="h-20 w-full object-cover mt-2 rounded"
          />
        )}
      </div>
      
      <div className="flex gap-2 text-xs">
        <button
          onClick={onDownload}
          className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Download
        </button>
        <button
          onClick={onDelete}
          className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default FileItemCard;