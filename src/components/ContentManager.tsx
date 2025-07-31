import { useState, useEffect } from 'react';
import { 
  useContentStore,
  useUIStore,
  useIsAuthenticated,
  useAuthRole 
} from '../store';

interface ContentManagerProps {
  contentType: 'flat' | 'home' | 'category' | 'apartment' | 'complex';
  contentId?: number;
  onSave?: () => void;
  onCancel?: () => void;
  initialData?: any;
}

const ContentManager = ({ contentType, contentId, onSave, onCancel, initialData }: ContentManagerProps) => {
  const isAuthenticated = useIsAuthenticated();
  const role = useAuthRole();
  const { addNotification } = useUIStore();
  
  const {
    flatForm,
    homeForm,
    categoryForm,
    setFlatForm,
    setHomeForm,
    setCategoryForm,
    saveFlat,
    saveHome,
    saveCategory,
    loading,
    errors,
  } = useContentStore();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || (role !== 'admin' && role !== 'content_manager')) {
      return;
    }

    // Initialize form data
    if (initialData) {
      switch (contentType) {
        case 'flat':
        case 'apartment':
          setFlatForm(initialData);
          break;
        case 'home':
        case 'complex':
          setHomeForm(initialData);
          break;
        case 'category':
          setCategoryForm(initialData);
          break;
      }
    }
  }, [isAuthenticated, role, contentType, initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let success = false;

      switch (contentType) {
        case 'flat':
        case 'apartment':
          success = await saveFlat({
            title: flatForm.title || '',
            description: flatForm.description || '',
            price: flatForm.price || 0,
            area: flatForm.area || 0,
            rooms: flatForm.rooms || 1,
            floor: flatForm.floor || 1,
            totalFloors: flatForm.totalFloors,
            homeId: flatForm.homeId || 0,
            categoryId: flatForm.categoryId,
            photos: flatForm.photos,
          });
          break;
        case 'home':
        case 'complex':
          success = await saveHome({
            name: homeForm.name || '',
            description: homeForm.description || '',
            address: homeForm.address || '',
            categoryId: homeForm.categoryId,
            photos: homeForm.photos,
            amenities: homeForm.amenities || [],
          });
          break;
        case 'category':
          success = await saveCategory({
            name: categoryForm.name || '',
            description: categoryForm.description || '',
            parentId: categoryForm.parentId,
          });
          break;
      }

      if (success) {
        addNotification({
          type: 'success',
          title: 'Сохранено',
          message: `${getContentTypeName()} успешно сохранен`,
        });
        onSave?.();
      }
    } catch (error: any) {
      addNotification({
        type: 'error',
        title: 'Ошибка сохранения',
        message: error.message || `Не удалось сохранить ${getContentTypeName().toLowerCase()}`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getContentTypeName = () => {
    switch (contentType) {
      case 'flat':
      case 'apartment':
        return 'Квартира';
      case 'home':
      case 'complex':
        return 'Дом';
      case 'category':
        return 'Категория';
      default:
        return 'Элемент';
    }
  };

  const getCurrentForm = () => {
    switch (contentType) {
      case 'flat':
      case 'apartment':
        return flatForm as any;
      case 'home':
      case 'complex':
        return homeForm as any;
      case 'category':
        return categoryForm as any;
      default:
        return {} as any;
    }
  };

  const updateForm = (field: string, value: any) => {
    switch (contentType) {
      case 'flat':
      case 'apartment':
        setFlatForm({ [field]: value });
        break;
      case 'home':
      case 'complex':
        setHomeForm({ [field]: value });
        break;
      case 'category':
        setCategoryForm({ [field]: value });
        break;
    }
  };

  if (!isAuthenticated || (role !== 'admin' && role !== 'content_manager')) {
    return (
      <div className="p-6 bg-white rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Доступ запрещен</h2>
        <p className="text-gray-600">У вас нет прав для управления контентом.</p>
      </div>
    );
  }

  const currentForm = getCurrentForm();

  return (
    <div className="p-6 bg-white rounded-lg shadow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {contentId ? 'Редактировать' : 'Создать'} {getContentTypeName()}
        </h2>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Category Form */}
        {(contentType === 'category') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название категории
              </label>
              <input
                type="text"
                value={currentForm.name || ''}
                onChange={(e) => updateForm('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={currentForm.description || ''}
                onChange={(e) => updateForm('description', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Home Form */}
        {(contentType === 'home' || contentType === 'complex') && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название дома
              </label>
              <input
                type="text"
                value={currentForm.name || ''}
                onChange={(e) => updateForm('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Адрес
              </label>
              <input
                type="text"
                value={currentForm.address || ''}
                onChange={(e) => updateForm('address', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={currentForm.description || ''}
                onChange={(e) => updateForm('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Удобства (по одному в строке)
              </label>
              <textarea
                value={(currentForm.amenities || []).join('\n')}
                onChange={(e) => updateForm('amenities', e.target.value.split('\n').filter(line => line.trim()))}
                rows={4}
                placeholder="Парковка&#10;Детская площадка&#10;Спортзал"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Flat Form */}
        {(contentType === 'flat' || contentType === 'apartment') && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Название квартиры
                </label>
                <input
                  type="text"
                  value={currentForm.title || ''}
                  onChange={(e) => updateForm('title', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Цена (₽)
                </label>
                <input
                  type="number"
                  value={currentForm.price || ''}
                  onChange={(e) => updateForm('price', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Площадь (м²)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={currentForm.area || ''}
                  onChange={(e) => updateForm('area', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Комнат
                </label>
                <input
                  type="number"
                  value={currentForm.rooms || ''}
                  onChange={(e) => updateForm('rooms', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Этаж
                </label>
                <input
                  type="number"
                  value={currentForm.floor || ''}
                  onChange={(e) => updateForm('floor', parseInt(e.target.value) || 1)}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание
              </label>
              <textarea
                value={currentForm.description || ''}
                onChange={(e) => updateForm('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </>
        )}

        {/* Error Display */}
        {Object.keys(errors).length > 0 && (
          <div className="p-4 bg-red-50 rounded-lg">
            <h4 className="text-red-800 font-medium">Ошибки:</h4>
            <ul className="text-red-700 text-sm mt-2">
              {Object.entries(errors).map(([key, error]) => (
                error && <li key={key}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Отмена
            </button>
          )}
          <button
            type="submit"
            disabled={isLoading || loading.saving}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
          >
            {isLoading || loading.saving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ContentManager;