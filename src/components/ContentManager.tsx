import React, {
  type FormEvent,
  useEffect,
  useState,
  useCallback,
  type FC,
} from 'react';
import {useAuthStore, useUIStore, useContentStore} from '../store';
import type {
  Category,
  CategoryRequest,
  FlatWithCategoryRequest,
  HomeRequest,
} from '../services';

export type ContentType = 'flat' | 'home' | 'category';

export interface ContentManagerProps {
  contentType: ContentType;
  initialData?: Partial<CategoryRequest> | Partial<FlatWithCategoryRequest> | Partial<HomeRequest>;
  onClose: () => void;
}

const emptyCategory: Partial<CategoryRequest> = {
  name: '',
  isOnMainPage: false,
};

const emptyFlat: Partial<FlatWithCategoryRequest> = {
  flat: {
    name: '',
    description: '',
    price: 0,
    area: 0,
    numberOfRooms: 1,
    floor: 1,
    homeId: 0,
  },
  categories: [],
};

const emptyHome: Partial<HomeRequest> = {
  name: '',
  description: '',
  address: '',
  yearBuilt: new Date().getFullYear(),
};

const ContentManager: FC<ContentManagerProps> = ({
                                                   contentType,
                                                   initialData,
                                                   onClose,
                                                 }) => {
  const {role, isAuthenticated} = useAuthStore();
  const addNotification = useUIStore(state => state.addNotification);
  const {
    // state
    categoryForm,
    flatForm,
    homeForm,
    selectedCategory,
    selectedFlat,
    selectedHome,
    loading,
    errors,
    ui,

    // actions
    saveCategory,
    editCategory,
    removeCategory,
    saveFlat,
    editFlat,
    removeFlat,
    saveHome,
    editHome,
    removeHome,
    setCategoryForm,
    setFlatForm,
    setHomeForm,
    resetForms,
    setShowForm,
    setEditMode,
    clearErrors,
  } = useContentStore();

  const [localLoading, setLocalLoading] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // Initialize form when receiving initialData or type
  useEffect(() => {
    clearErrors();
    setEditMode(false);
    if (contentType === 'category') {
      setCategoryForm(initialData as Partial<CategoryRequest> || emptyCategory);
      if ((initialData as Category)?.id) {
        // editing existing
        editCategory(initialData as Category);
        setEditMode(true);
      }
    } else if (contentType === 'flat') {
      setFlatForm(initialData as Partial<FlatWithCategoryRequest> || emptyFlat);
      if ((initialData as FlatWithCategoryRequest)?.flat?.id) {
        editFlat(initialData as FlatWithCategoryRequest as FlatWithCategoryRequest);
        setEditMode(true);
      }
    } else if (contentType === 'home') {
      setHomeForm(initialData as Partial<HomeRequest> || emptyHome);
      if ((initialData as HomeRequest)?.id) {
        editHome(initialData as HomeRequest as HomeRequest);
        setEditMode(true);
      }
    }
    setShowForm(true);
  }, [contentType, initialData, editCategory, editFlat, editHome, setCategoryForm, setFlatForm, setHomeForm, clearErrors, setEditMode, setShowForm]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLocalLoading(true);
    try {
      let ok = false;
      if (contentType === 'category') {
        ok = await saveCategory(categoryForm as CategoryRequest);
        if (ok) addNotification({
          type: 'success',
          title: 'Категория сохранена'
        });
      } else if (contentType === 'flat') {
        ok = await saveFlat(flatForm as FlatWithCategoryRequest);
        if (ok) addNotification({type: 'success', title: 'Квартира сохранена'});
      } else if (contentType === 'home') {
        ok = await saveHome(homeForm as HomeRequest);
        if (ok) addNotification({type: 'success', title: 'Дом сохранён'});
      }
      if (ok) {
        resetForms();
        onClose();
      }
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Ошибка',
        message: (err as Error).message
      });
    } finally {
      setLocalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить?')) return;
    setLocalLoading(true);
    try {
      let ok = false;
      if (contentType === 'category' && selectedCategory) {
        ok = await removeCategory(selectedCategory.id);
        if (ok) addNotification({type: 'success', title: 'Категория удалена'});
      } else if (contentType === 'flat' && selectedFlat?.flat?.id) {
        ok = await removeFlat(selectedFlat.flat.id);
        if (ok) addNotification({type: 'success', title: 'Квартира удалена'});
      } else if (contentType === 'home' && selectedHome?.id) {
        ok = await removeHome(selectedHome.id);
        if (ok) addNotification({type: 'success', title: 'Дом удалён'});
      }
      if (ok) {
        resetForms();
        onClose();
      }
    } catch (err) {
      addNotification({
        type: 'error',
        title: 'Ошибка при удалении',
        message: (err as Error).message
      });
    } finally {
      setLocalLoading(false);
    }
  };

  if (!isAuthenticated || (role !== 'CONTENT_MANAGER' && role !== 'ADMIN')) {
    return null;
  }

  // Determine current form state & error/loading
  const currentForm =
    contentType === 'category'
      ? categoryForm
      : contentType === 'flat'
        ? flatForm
        : homeForm;

  const currentError =
    contentType === 'category'
      ? errors.saveCategory || errors.removeCategory
      : contentType === 'flat'
        ? errors.saveFlat || errors.removeFlat
        : errors.saveHome || errors.removeHome;

  const isSaving = loading.saving || localLoading;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-start justify-center z-50 overflow-auto py-10 px-4">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full relative">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {contentType === 'category'
              ? selectedCategory
                ? 'Edit Category'
                : 'Create Category'
              : contentType === 'flat'
                ? selectedFlat
                  ? 'Edit Flat'
                  : 'Create Flat'
                : selectedHome
                  ? 'Edit Home'
                  : 'Create Home'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {currentError && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {currentError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Category form */}
          {contentType === 'category' && (
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={categoryForm.name || ''}
                  onChange={(e) => setCategoryForm({name: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  required
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="onMain"
                  type="checkbox"
                  checked={!!categoryForm.isOnMainPage}
                  onChange={(e) => setCategoryForm({isOnMainPage: e.target.checked})}
                  className="mr-2"
                />
                <label
                  htmlFor="onMain"
                  className="text-sm"
                >
                  Show on main page
                </label>
              </div>
            </div>
          )}

          {/* Flat form */}
          {contentType === 'flat' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={flatForm.flat?.name || ''}
                    onChange={(e) =>
                      setFlatForm({
                        flat: {...(flatForm.flat || {}), name: e.target.value},
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Price</label>
                  <input
                    type="number"
                    value={flatForm.flat?.price ?? 0}
                    onChange={(e) =>
                      setFlatForm({
                        flat: {
                          ...(flatForm.flat || {}),
                          price: Number(e.target.value)
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={flatForm.flat?.description || ''}
                  onChange={(e) =>
                    setFlatForm({
                      flat: {
                        ...(flatForm.flat || {}),
                        description: e.target.value
                      },
                    })
                  }
                  className="w-full border rounded px-3 py-2 h-20"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Area</label>
                  <input
                    type="number"
                    step="0.1"
                    value={flatForm.flat?.area ?? 0}
                    onChange={(e) =>
                      setFlatForm({
                        flat: {
                          ...(flatForm.flat || {}),
                          area: Number(e.target.value)
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Number of Rooms
                  </label>
                  <input
                    type="number"
                    value={flatForm.flat?.numberOfRooms ?? 1}
                    onChange={(e) =>
                      setFlatForm({
                        flat: {
                          ...(flatForm.flat || {}),
                          numberOfRooms: Number(e.target.value)
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Floor</label>
                  <input
                    type="number"
                    value={flatForm.flat?.floor ?? 1}
                    onChange={(e) =>
                      setFlatForm({
                        flat: {
                          ...(flatForm.flat || {}),
                          floor: Number(e.target.value)
                        },
                      })
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* Home form */}
          {contentType === 'home' && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Name</label>
                  <input
                    type="text"
                    value={homeForm.name || ''}
                    onChange={(e) => setHomeForm({name: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input
                    type="text"
                    value={homeForm.address || ''}
                    onChange={(e) => setHomeForm({address: e.target.value})}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={homeForm.description || ''}
                  onChange={(e) => setHomeForm({description: e.target.value})}
                  className="w-full border rounded px-3 py-2 h-20"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Year Built</label>
                  <input
                    type="number"
                    value={homeForm.yearBuilt || new Date().getFullYear()}
                    onChange={(e) =>
                      setHomeForm({yearBuilt: Number(e.target.value)})
                    }
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              </div>
            </>
          )}

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-4 border-t">
            <div>
              {contentType !== 'category' && selectedFlat || selectedHome || selectedCategory ? (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={isSaving}
                  className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Delete
                </button>
              ) : null}
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  resetForms();
                  onClose();
                }}
                className="px-4 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContentManager;