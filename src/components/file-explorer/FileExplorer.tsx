import { type FC, useMemo } from 'react';
import type { FileEntry } from "../../services";

interface FileExplorerProps {
  currentDirectory: string[];
  files: FileEntry[];
  loading: boolean;
  onDownload: (path: string[]) => void;
  onDelete: (path: string[]) => void;
  onRefresh: () => void;
}

const isImageName = (name: string) => /\.(jpe?g|png|webp|gif)$/i.test(name);

const FileExplorer: FC<FileExplorerProps> = ({
  currentDirectory,
  files,
  loading,
  onDownload,
  onDelete,
  onRefresh,
}) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL + '/files';

  const getFileUrl = (currentDirectory: string[], fileName: string) => {
    if (fileName.includes('/')) {
      return `${baseUrl}/${encodeURIComponent(fileName)}`;
    }
    const fullPath = [...currentDirectory, fileName].map(encodeURIComponent).join('/');
    return `${baseUrl}/${fullPath}`;
  };

  const displayPath = useMemo(() => `/${currentDirectory.join('/')}`, [currentDirectory]);

  return (
    <div>
      <div className="flex gap-2 mb-2 items-center flex-wrap">
        <button
          onClick={onRefresh}
          className="px-2 py-1 bg-gray-200 rounded"
        >
          Refresh
        </button>
        <div className="truncate">{displayPath}</div>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map(({ name }) => {
            const isImage = isImageName(name);
            const previewUrl = isImage ? getFileUrl(currentDirectory, name) : null;

            return (
              <div key={name} className="border rounded p-2 flex flex-col">
                <div className="truncate font-medium break-words">{name}</div>
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt={name}
                    className="h-20 w-full object-cover mt-2 rounded"
                  />
                )}
                <div className="mt-2 flex gap-2 text-xs">
                  <button
                    onClick={() => onDownload(name.includes('/') ? [name] : [...currentDirectory, name])}
                    className="px-2 py-1 bg-primary-500 text-secondary-100 rounded"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => onDelete(name.includes('/') ? [name] : [...currentDirectory, name])}
                    className="px-2 py-1 bg-red-500 text-secondary-100 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {files.length === 0 && (
            <div className="text-gray-500 col-span-full">No files</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;
