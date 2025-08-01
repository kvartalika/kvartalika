import {useEffect} from 'react';
import {usePhotoStore} from '../../store/usePhotoStore';
import type {FC} from 'react';

interface FileExplorerProps {
  currentDirectory: string[];
  files: string[];
  loading: boolean;
  onDownload: (path: string[]) => void;
  onDelete: (path: string[]) => void;
  onRefresh: () => void;
}

const FileExplorer: FC<FileExplorerProps> = ({
                                               currentDirectory,
                                               files,
                                               loading,
                                               onDownload,
                                               onDelete,
                                               onRefresh,
                                             }) => {
  const {loadPhoto, cache} = usePhotoStore();

  useEffect(() => {
    files.forEach(async (name) => {
      if (/\.(jpe?g|png|webp|gif)$/i.test(name)) {
        const path = [...currentDirectory, name].join('/');
        await loadPhoto(path);
      }
    });
  }, [files, currentDirectory, loadPhoto]);

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <button
          onClick={onRefresh}
          className="px-2 py-1 bg-gray-200 rounded"
        >Refresh
        </button>
        <div>/{currentDirectory.join('/')}</div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map(name => {
            const fullPath = [...currentDirectory, name].join('/');
            const isImage = /\.(jpe?g|png|webp|gif)$/i.test(name);
            const preview = isImage ? cache[fullPath] : null;
            return (
              <div
                key={name}
                className="border rounded p-2 flex flex-col"
              >
                <div className="truncate font-medium">{name}</div>
                {preview && (
                  <img
                    src={preview.url}
                    alt={name}
                    className="h-20 w-full object-cover mt-2 rounded"
                  />
                )}
                <div className="mt-2 flex gap-2 text-xs">
                  <button
                    onClick={() => onDownload([...currentDirectory, name])}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => onDelete([...currentDirectory, name])}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
          {files.length === 0 && <div className="text-gray-500">No files</div>}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;