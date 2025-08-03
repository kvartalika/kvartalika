import {type FC, useMemo} from 'react';
import Breadcrumbs from "../admin/Breadcrumbs.tsx";

interface DirectoryBrowserProps {
  segments: string[];
  directories: string[];
  loading: boolean;
  onNavigate: (next: string[]) => void;
  onCreate: (name: string) => void;
  onDelete: (name: string) => void;
  newDirName: string;
  setNewDirName: (v: string) => void;
}

const DirectoryBrowser: FC<DirectoryBrowserProps> = ({
                                                       segments,
                                                       directories,
                                                       loading,
                                                       onNavigate,
                                                       onCreate,
                                                       onDelete,
                                                       newDirName,
                                                       setNewDirName,
                                                     }) => {
  const breadcrumbs = useMemo(() => ['root', ...segments], [segments]);

  const navigateTo = (idx: number) => {
    if (idx === 0) onNavigate([]);
    else onNavigate(segments.slice(0, idx));
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New directory name"
            value={newDirName}
            onChange={(e) => setNewDirName(e.target.value)}
            className="border px-2 py-1 rounded"
          />
          <button
            onClick={() => onCreate(newDirName)}
            disabled={!newDirName.trim()}
            className="px-3 py-1 bg-indigo-600 text-white rounded"
          >
            Create
          </button>
        </div>
        <div className="flex gap-2">
          <Breadcrumbs
            segments={breadcrumbs}
            onCrumbClick={navigateTo}
          />
          <button
            onClick={() => onNavigate(segments)}
            className="px-2 py-1 bg-gray-200 rounded"
          >
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div>Loading directories...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.isArray(directories) && directories.map(dir => (
            <div
              key={dir}
              className="border rounded p-3 flex justify-between items-center"
            >
              <div
                className="cursor-pointer"
                onClick={() => onNavigate([...segments, dir])}
              >
                📁 {dir}
              </div>
              <button
                onClick={() => onDelete(dir)}
                className="text-red-600 text-xs"
              >
                Delete
              </button>
            </div>
          ))}
          {directories.length === 0 && (
            <div className="text-gray-500">No directories</div>
          )}
        </div>
      )}
    </div>
  );
};

export default DirectoryBrowser;