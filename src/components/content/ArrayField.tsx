import type {FC} from "react";

const ArrayField: FC<{
  label: string;
  values?: string[];
  placeholder?: string;
  onChange: (newArray: string[]) => void;
}> = ({label, values = [], onChange, placeholder}) => {
  const handleUpdate = (idx: number, v: string) => {
    onChange(values.map((it, i) => (i === idx ? v : it)));
  };
  const handleAdd = () => onChange([...values, '']);
  const handleRemove = (idx: number) => onChange(values.filter((_, i) => i !== idx));

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <button
          type="button"
          onClick={handleAdd}
          className="text-sm text-blue-600 hover:underline"
        >
          + Добавить
        </button>
      </div>
      {values.map((v, i) => (
        <div
          key={i}
          className="flex gap-2 mb-2"
        >
          <input
            type="text"
            value={v}
            placeholder={placeholder}
            onChange={(e) => handleUpdate(i, e.target.value)}
            className="flex-1 border rounded px-3 py-2"
          />
          <button
            type="button"
            onClick={() => handleRemove(i)}
            className="text-red-600 hover:text-red-800"
          >
            Удалить
          </button>
        </div>
      ))}
      {values.length === 0 && (
        <div className="text-sm text-gray-500">Пока ничего не добавлено</div>
      )}
    </div>
  );
};

export default ArrayField;