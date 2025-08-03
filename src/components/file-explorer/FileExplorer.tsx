import {type FC, useEffect, useMemo, useState} from 'react';
import type {FileEntry} from "../../services";


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
  const [urls, setUrls] = useState<Record<string, string>>({});

  useEffect(() => {
    const newUrls: Record<string, string> = {};
    files.forEach(({name, blob}) => {
      const key = name;
      if (isImageName(name)) {
        newUrls[key] = URL.createObjectURL(blob);
      }
    });
    Object.entries(urls).forEach(([k, v]) => {
      if (!newUrls[k]) {
        URL.revokeObjectURL(v);
      }
    });
    setUrls(newUrls);
    return () => {
      Object.values(newUrls).forEach(u => URL.revokeObjectURL(u));
    };
  }, [files]);

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
        <div className="truncate">/{displayPath}</div>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map(({name, blob}) => {
            const isImage = isImageName(name);
            const previewUrl = isImage ? urls[name] : null;

            return (
              <div
                key={`${name}`}
                className="border rounded p-2 flex flex-col"
              >
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
                    onClick={() => onDownload([name])}
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => onDelete([name])}
                    className="px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
                <div className="mt-1 text-[10px] text-gray-500">
                  {(blob.size / 1024).toFixed(1)} KB • {blob.type || 'unknown'}
                </div>
              </div>
            );
          })}
          {files.length === 0 &&
            <div className="text-gray-500 col-span-full">No files</div>}
        </div>
      )}
    </div>
  );
};

export default FileExplorer;