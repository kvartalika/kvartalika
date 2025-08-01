import {
  type FC,
  type FormEvent,
  useState,
  useEffect,
  useMemo,
} from 'react';
import type {
  HomeRequest,
  CategoryRequest,
  FlatWithCategoryRequest,
  Category,
} from '../../services';
import ArrayField from "./ArrayField.tsx";

export type ContentType = 'flat' | 'home' | 'category';

interface ContentEditorUnifiedProps {
  contentType: ContentType;
  initialFlat?: FlatWithCategoryRequest;
  initialHome?: HomeRequest;
  initialCategory?: Category;
  allCategories?: Category[];
  onSave: (payload: FlatWithCategoryRequest | HomeRequest | CategoryRequest) => Promise<void> | void;
  onDelete?: () => Promise<void> | void;
  onCancel: () => void;
  isEditing?: boolean;
}

const ContentEditor: FC<ContentEditorUnifiedProps> = ({
                                                        contentType,
                                                        initialFlat,
                                                        initialHome,
                                                        initialCategory,
                                                        allCategories = [],
                                                        onSave,
                                                        onDelete,
                                                        onCancel,
                                                        isEditing = false,
                                                      }) => {
  const [flatPayload, setFlatPayload] = useState<FlatWithCategoryRequest>(
    initialFlat || {
      flat: {},
      categories: [],
    }
  );
  const [homePayload, setHomePayload] = useState<HomeRequest>(initialHome || {});
  const [categoryPayload, setCategoryPayload] = useState<CategoryRequest>(
    initialCategory
      ? {
        id: initialCategory.id,
        name: initialCategory.name,
        isOnMainPage: initialCategory.isOnMainPage,
      }
      : {id: 0, name: '', isOnMainPage: false}
  );
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (initialFlat) setFlatPayload(initialFlat);
  }, [initialFlat]);
  useEffect(() => {
    if (initialHome) setHomePayload(initialHome);
  }, [initialHome]);
  useEffect(() => {
    if (initialCategory) {
      setCategoryPayload({
        id: initialCategory.id,
        name: initialCategory.name,
        isOnMainPage: initialCategory.isOnMainPage,
      });
    }
  }, [initialCategory]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      if (contentType === 'flat') {
        if (!flatPayload.flat.name) throw new Error('Название квартиры обязательно');
        await onSave(flatPayload);
      } else if (contentType === 'home') {
        if (!homePayload.name) throw new Error('Название комплекса обязательно');
        await onSave(homePayload);
      } else if (contentType === 'category') {
        if (!categoryPayload.name) throw new Error('Название категории обязательно');
        await onSave(categoryPayload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setSaving(false);
    }
  };

  const toggleCategory = (category: Category) => {
    setFlatPayload((prev) => {
      const exists = prev.categories.find((c) => c.id === category.id);
      if (exists) {
        return {
          ...prev,
          categories: prev.categories.filter((c) => c.id !== category.id),
        };
      } else {
        return {
          ...prev,
          categories: [...prev.categories, {
            id: category.id,
            name: category.name,
            isOnMainPage: category.isOnMainPage
          }],
        };
      }
    });
  };
  const isCategorySelected = (category: Category) =>
    flatPayload.categories.some((c) => c.id === category.id);

  const renderFlatForm = () => {
    const f = flatPayload.flat;
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={f.name || ''}
              onChange={(e) => setFlatPayload((p) => ({
                ...p,
                flat: {...p.flat, name: e.target.value}
              }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цена</label>
            <input
              type="number"
              value={f.price ?? ''}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, price: Number(e.target.value)}
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea
            value={f.description || ''}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: {...p.flat, description: e.target.value}
              }))
            }
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        <ArrayField
          label="Изображения"
          values={f.images}
          placeholder="https://..."
          onChange={(arr) => setFlatPayload((p) => ({
            ...p,
            flat: {...p.flat, images: arr}
          }))}
        />

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Площадь</label>
            <input
              type="number"
              step="0.1"
              value={f.area ?? ''}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, area: Number(e.target.value)}
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Комнат</label>
            <input
              type="number"
              value={f.numberOfRooms ?? ''}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, numberOfRooms: Number(e.target.value)}
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Этаж</label>
            <input
              type="number"
              value={f.floor ?? ''}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, floor: Number(e.target.value)}
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <ArrayField
          label="Фичи"
          values={f.features}
          placeholder="например: балкон"
          onChange={(arr) => setFlatPayload((p) => ({
            ...p,
            flat: {...p.flat, features: arr}
          }))}
        />

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              id="hasDecoration"
              type="checkbox"
              checked={!!f.hasDecoration}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, hasDecoration: e.target.checked}
                }))
              }
              className="mr-1"
            />
            <label htmlFor="hasDecoration">Декорирован</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="published"
              type="checkbox"
              checked={!!f.published}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, published: e.target.checked}
                }))
              }
              className="mr-1"
            />
            <label htmlFor="published">Опубликовать</label>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Широта</label>
            <input
              type="number"
              step="any"
              value={f.latitude ?? ''}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, latitude: Number(e.target.value)}
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Долгота</label>
            <input
              type="number"
              step="any"
              value={f.longitude ?? ''}
              onChange={(e) =>
                setFlatPayload((p) => ({
                  ...p,
                  flat: {...p.flat, longitude: Number(e.target.value)}
                }))
              }
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Планировка (URL)</label>
          <input
            type="text"
            value={f.layout || ''}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: {...p.flat, layout: e.target.value}
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
          <input
            type="text"
            value={f.address || ''}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: {...p.flat, address: e.target.value}
              }))
            }
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">О себе</label>
          <textarea
            value={f.about || ''}
            onChange={(e) =>
              setFlatPayload((p) => ({
                ...p,
                flat: {...p.flat, about: e.target.value}
              }))
            }
            className="w-full border rounded px-3 py-2 h-20"
          />
        </div>

        <div>
          <div className="block text-sm font-medium text-gray-700 mb-1">Категории</div>
          <div className="flex flex-wrap gap-3">
            {allCategories.map((cat) => (
              <label
                key={cat.id}
                className="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  checked={isCategorySelected(cat)}
                  onChange={() => toggleCategory(cat)}
                />
                <span>{cat.name}</span>
              </label>
            ))}
            {allCategories.length === 0 && (
              <div className="text-xs text-gray-500">Нет доступных категорий</div>
            )}
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={() => void onDelete()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderHomeForm = () => {
    const h = homePayload;
    return (
      <form
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Название</label>
            <input
              type="text"
              value={h.name || ''}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                name: e.target.value
              }))}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Адрес</label>
            <input
              type="text"
              value={h.address || ''}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                address: e.target.value
              }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea
            value={h.description || ''}
            onChange={(e) => setHomePayload((p) => ({
              ...p,
              description: e.target.value
            }))}
            className="w-full border rounded px-3 py-2 h-24"
          />
        </div>

        <ArrayField
          label="Изображения"
          values={h.images}
          placeholder="https://..."
          onChange={(arr) => setHomePayload((p) => ({...p, images: arr}))}
        />

        <ArrayField
          label="История (тексты)"
          values={h.history}
          placeholder="Событие"
          onChange={(arr) => setHomePayload((p) => ({...p, history: arr}))}
        />

        <ArrayField
          label="Изображения Истории"
          values={h.historyImages}
          placeholder="https://..."
          onChange={(arr) => setHomePayload((p) => ({
            ...p,
            historyImages: arr
          }))}
        />

        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-2">
            <input
              id="hasYards"
              type="checkbox"
              checked={!!h.hasYards}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                hasYards: e.target.checked
              }))}
              className="mr-1"
            />
            <label htmlFor="hasYards">Есть дворы</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="storesNearby"
              type="checkbox"
              checked={!!h.storesNearby}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                storesNearby: e.target.checked
              }))}
              className="mr-1"
            />
            <label htmlFor="storesNearby">Магазины рядом</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="schoolsNearby"
              type="checkbox"
              checked={!!h.schoolsNearby}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                schoolsNearby: e.target.checked
              }))}
              className="mr-1"
            />
            <label htmlFor="schoolsNearby">Школы рядом</label>
          </div>
          <div className="flex items-center gap-2">
            <input
              id="hospitalsNearby"
              type="checkbox"
              checked={!!h.hospitalsNearby}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                hospitalsNearby: e.target.checked
              }))}
              className="mr-1"
            />
            <label htmlFor="hospitalsNearby">Больницы рядом</label>
          </div>
        </div>

        <ArrayField
          label="Изображения дворов"
          values={h.yardsImages}
          placeholder="https://..."
          onChange={(arr) => setHomePayload((p) => ({...p, yardsImages: arr}))}
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Широта</label>
            <input
              type="number"
              step="any"
              value={h.latitude ?? ''}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                latitude: Number(e.target.value)
              }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Долгота</label>
            <input
              type="number"
              step="any"
              value={h.longitude ?? ''}
              onChange={(e) => setHomePayload((p) => ({
                ...p,
                longitude: Number(e.target.value)
              }))}
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <input
            id="publishedHome"
            type="checkbox"
            checked={!!h.published}
            onChange={(e) => setHomePayload((p) => ({
              ...p,
              published: e.target.checked
            }))}
            className="mr-1"
          />
          <label htmlFor="publishedHome">Опубликовать</label>
        </div>

        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={() => void onDelete()}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Удалить
              </button>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border rounded"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </div>
      </form>
    );
  };

  const renderCategoryForm = () => (
    <form
      onSubmit={handleSubmit}
      className="space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Название</label>
        <input
          type="text"
          value={categoryPayload.name}
          onChange={(e) => setCategoryPayload((c) => ({
            ...c,
            name: e.target.value
          }))}
          className="w-full border rounded px-3 py-2"
          required
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          id="isOnMainPage"
          type="checkbox"
          checked={categoryPayload.isOnMainPage}
          onChange={(e) => setCategoryPayload((c) => ({
            ...c,
            isOnMainPage: e.target.checked
          }))}
          className="mr-1"
        />
        <label htmlFor="isOnMainPage">Показывать на главной</label>
      </div>
      <div className="flex justify-between items-center pt-4 border-t">
        <div>
          {isEditing && onDelete && (
            <button
              type="button"
              onClick={() => void onDelete()}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Удалить
            </button>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border rounded"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </div>
    </form>
  );

  const title = useMemo(() => {
    if (contentType === 'flat') return isEditing ? 'Редактировать квартиру' : 'Создать квартиру';
    if (contentType === 'home') return isEditing ? 'Редактировать комплекс' : 'Создать комплекс';
    return isEditing ? 'Редактировать категорию' : 'Создать категорию';
  }, [contentType, isEditing]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 overflow-auto py-10 px-4">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {contentType === 'flat' && renderFlatForm()}
        {contentType === 'home' && renderHomeForm()}
        {contentType === 'category' && renderCategoryForm()}
      </div>
    </div>
  );
};

export default ContentEditor;