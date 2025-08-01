import {type FC} from 'react';
import {usePhotoStore} from '../../store/usePhotoStore';

interface FileItemCardProps {
  name: string;
  currentDirectory: string[];
  onDownload: (path: string[]) => void;
  onDelete: (path: string[]) => void;
}

const imageRegex = /\.(jpe?g|png|webp|gif)$/i;

const FileItemCard: FC<FileItemCardProps> = ({
                                               name,
                                               currentDirectory,
                                               onDownload,
                                               onDelete,
                                             }) => {
  const {cache} = usePhotoStore.getState(); // синхронно уже загруженные preview'и
  const fullPath = [...currentDirectory, name].join('/');
  const isImage = imageRegex.test(name);
  const preview = isImage ? cache[fullPath] : null;

  return (
    <div className="border rounded p-2 flex flex-col">
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
};

export default FileItemCard;