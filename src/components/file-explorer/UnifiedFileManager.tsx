import {
  type ChangeEvent,
  type Dispatch,
  type FC, type SetStateAction,
  useMemo,
} from 'react';
import type {FileEntry} from "../../services";
import Breadcrumbs from "../admin/Breadcrumbs.tsx";

interface UnifiedFileManagerProps {
  currentPath: string[];
  directories: string[];
  files: FileEntry[];
  isLoadingDirectories: boolean;
  isLoadingFiles: boolean;
  newDirectoryName: string;
  setNewDirectoryName: (name: string) => void;
  onNavigate: (nextPath: string[]) => void;
  onCreateDirectory: () => void;
  onDeleteDirectory: (name: string) => void;
  handleFileSelect: (e: ChangeEvent<HTMLInputElement>) => void;
  handleUploadClick: () => void;
  onDownload: (path: string[]) => void;
  onDeleteFile: (path: string[]) => void;
  onRefresh: () => void;

  pendingFile: File | null;
  setPendingFile: Dispatch<SetStateAction<File | null>>;
}

const isImageName = (name: string) => /\.(jpe?g|png|webp|gif)$/i.test(name);

const btnBase = "inline-flex items-center gap-1 px-3 py-1 rounded shadow-sm font-medium transition";
const btnPrimary = "bg-indigo-600 text-white hover:bg-indigo-700";
const btnSecondary = "bg-gray-100 text-gray-800 hover:bg-gray-200";
const btnSuccess = "bg-green-600 text-white hover:bg-green-700";
const btnDanger = "bg-red-500 text-white hover:bg-red-600";
const btnDisabled = "opacity-50 cursor-not-allowed";


const UnifiedFileManager: FC<UnifiedFileManagerProps> = ({
                                                           currentPath,
                                                           directories,
                                                           files,
                                                           isLoadingDirectories,
                                                           isLoadingFiles,
                                                           newDirectoryName,
                                                           setNewDirectoryName,
                                                           onNavigate,
                                                           onCreateDirectory,
                                                           onDeleteDirectory,
                                                           handleFileSelect,
                                                           onDownload,
                                                           onDeleteFile,
                                                           onRefresh,
                                                           pendingFile,
                                                           setPendingFile,
                                                           handleUploadClick
                                                         }) => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL + '/files';

  const getFileUrl = (currentDirectory: string[], fileName: string) => {
    if (fileName.includes('/')) {
      return `${baseUrl}/${encodeURIComponent(fileName)}`;
    }
    const fullPath = [...currentDirectory, fileName].map(encodeURIComponent).join('/');
    return `${baseUrl}/${fullPath}`;
  };

  const displayPath = useMemo(() => `/${currentPath.join('/')}`, [currentPath]);
  const breadcrumbs = useMemo(() => ['root', ...currentPath], [currentPath]);

  const navigateTo = (idx: number) => {
    if (idx === 0) onNavigate([]);
    else onNavigate(currentPath.slice(0, idx));
  };

  const handleDirectoryClick = (dirName: string) => {
    onNavigate(dirName.split('/'));
  };

  const isLoading = isLoadingDirectories || isLoadingFiles;

  return (
    <div className="space-y-6 flex flex-col">

      <div className="flex justify-between items-center gap-4 flex-wrap flex-1">
        <div className="flex items-start gap-4 flex-col bg-gray-200/30 rounded-md px-4 py-2">
          <Breadcrumbs
            segments={breadcrumbs}
            onCrumbClick={navigateTo}
          />
          <button
            onClick={onRefresh}
            className={`${btnBase} ${btnSecondary}`}
            type="button"
          >
            Перезагрузить
          </button>
        </div>

        <div className="flex gap-4 lg:flex-row flex-col justify-between bg-gray-200/30 p-2 rounded-md">
          <div className="flex flex-wrap gap-3">
            <label
              htmlFor="file-upload"
              className={`cursor-pointer ${btnBase} ${btnSecondary}`}
            >
              {pendingFile ? "Выбран: " : "Выбрать файл"}
              <input
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
            </label>

            {pendingFile && (
              <div className="bg-gray-100 px-3 py-1 rounded text-sm">
                <span className="truncate max-w-[140px]">{pendingFile.name}</span>
                <button
                  onClick={() => setPendingFile(null)}
                  aria-label="Отменить выбор"
                  type="button"
                  className={`cursor-pointer ${btnBase} ${btnDanger}`}
                >
                  ×
                </button>
              </div>
            )}

            <button
              onClick={handleUploadClick}
              disabled={!pendingFile}
              type="button"
              className={`ml-auto ${btnBase} ${btnSuccess} ${!pendingFile ? btnDisabled : ""}`}
            >
              Загрузить
            </button>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              placeholder="Имя директории"
              value={newDirectoryName}
              onChange={(e) => setNewDirectoryName(e.target.value)}
              className="border px-2 py-1 rounded text-sm"
            />
            <button
              onClick={onCreateDirectory}
              disabled={!newDirectoryName.trim()}
              className={`${btnBase} ${btnPrimary} ${!newDirectoryName.trim() ? btnDisabled : ""}`}
              type="button"
            >
              Создать папку
            </button>
          </div>
        </div>
      </div>

      {/* Current path display */}
      <div className="bg-gray-50 p-3 rounded-lg flex gap-2">
        <span className="text-sm font-medium text-gray-700">Текущая директория:</span>
        <span className="text-sm text-gray-900 ml-2 font-mono">{displayPath}</span>
      </div>

      {/* Content grid */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Directories */}
          {directories.map((dir) => (
            <div
              key={dir}
              className="border rounded-lg p-4 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className="cursor-pointer flex items-center gap-2 text-blue-700 hover:text-blue-800 font-medium"
                  onClick={() => handleDirectoryClick(dir)}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  {dir}
                </div>
                <button
                  onClick={() => onDeleteDirectory(dir)}
                  className="text-red-600 hover:text-red-700 text-xs p-1"
                  title="Удалить директорию"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-xs text-blue-600">Папка</div>
            </div>
          ))}

          {/* Files */}
          {files.map(({name}) => {
            const isImage = isImageName(name);
            const previewUrl = isImage ? getFileUrl(currentPath, name) : null;

            return (
              <div
                key={name}
                className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors"
              >
                <div className="mb-2">
                  <div className="font-medium text-gray-900 truncate">{name}</div>
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt={name}
                      className="h-20 w-full object-cover mt-2 rounded"
                    />
                  )}
                </div>

                <div className="flex gap-2 text-xs">
                  <button
                    onClick={() => onDownload(name.includes('/') ? [name] : [...currentPath, name])}
                    className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                  >
                    Скачать
                  </button>
                  <button
                    onClick={() => onDeleteFile(name.includes('/') ? [name] : [...currentPath, name])}
                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Удалить
                  </button>
                </div>
              </div>
            );
          })}

          {/* Empty state */}
          {directories.length === 0 && files.length === 0 && (
            <div className="col-span-full text-center py-8 text-gray-500">
              <svg
                className="w-12 h-12 mx-auto mb-4 text-gray-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                  clipRule="evenodd"
                />
              </svg>
              <p>В этой директории пока ничего нет</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UnifiedFileManager;