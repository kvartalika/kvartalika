import {useState, useMemo} from 'react';
import {useContentStore} from '../../store';
import type {
  FlatWithCategoryRequest,
  HomeRequest,
  CategoryRequest,
  Category
} from '../../services';
import ContentEditor, {type ContentType} from "./ContentEditor.tsx";

const TABS: ContentType[] = ['flat', 'home', 'category'];
type PayLoadType = FlatWithCategoryRequest | HomeRequest | CategoryRequest;

const ContentManagementSection = () => {
  const {
    flats,
    homes,
    categories,
    ui,
    selectedFlat,
    selectedHome,
    selectedCategory,
    saveFlat,
    saveHome,
    saveCategory,
    editFlat,
    editHome,
    editCategory,
    removeFlat,
    removeHome,
    removeCategory,
    setActiveTab,
    setShowForm,
    setEditMode,
  } = useContentStore();

  const [editorType, setEditorType] = useState<ContentType>('flat');

  const switchTab = (type: ContentType) => {
    setEditorType(type);
    setActiveTab(type === 'flat' ? 'flats' : type === 'home' ? 'homes' : 'categories');
  };

  const openNew = (type: ContentType) => {
    setEditorType(type);
    setEditMode(false);
    setShowForm(true);
    switchTab(type);
  };

  const openEdit = (type: ContentType, payload: PayLoadType) => {
    setEditorType(type);
    if (type === 'flat') editFlat(payload as FlatWithCategoryRequest);
    if (type === 'home') editHome(payload as HomeRequest);
    if (type === 'category') editCategory(payload as Category);
    setEditMode(true);
    setShowForm(true);
    switchTab(type);
  };

  const handleSave = async (payload: PayLoadType) => {
    if (editorType === 'flat') await saveFlat(payload as FlatWithCategoryRequest);
    if (editorType === 'home') await saveHome(payload as HomeRequest);
    if (editorType === 'category') await saveCategory(payload as CategoryRequest);
  };

  const handleDelete = async () => {
    if (editorType === 'flat' && selectedFlat?.flat.id) await removeFlat(selectedFlat.flat.id);
    if (editorType === 'home' && selectedHome?.id) await removeHome(selectedHome.id);
    if (editorType === 'category' && selectedCategory?.id) await removeCategory(selectedCategory.id);
  };

  const currentList = useMemo(() => {
    if (ui.activeTab === 'flats') return flats.map(f => ({
      type: 'flat' as const,
      payload: f,
      label: f.flat.name || `#${f.flat.id}`
    }));
    if (ui.activeTab === 'homes') return homes.map(h => ({
      type: 'home' as const,
      payload: h,
      label: h.name || `#${h.id}`
    }));
    if (ui.activeTab === 'categories') return categories.map(c => ({
      type: 'category' as const,
      payload: c,
      label: c.name ?? c.id
    }));
    return [];
  }, [flats, homes, categories, ui.activeTab]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-3 py-1 rounded ${(
              (t === 'flat' && ui.activeTab === 'flats') ||
              (t === 'home' && ui.activeTab === 'homes') ||
              (t === 'category' && ui.activeTab === 'categories')
            ) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {t === 'flat' ? 'Квартиры' : t === 'home' ? 'Комплексы' : 'Категории'}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button
            onClick={() => openNew('flat')}
            className="btn"
          >Новая квартира
          </button>
          <button
            onClick={() => openNew('home')}
            className="btn"
          >Новый комплекс
          </button>
          <button
            onClick={() => openNew('category')}
            className="btn"
          >Новая категория
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="space-y-2">
          <h3 className="font-semibold">
            {ui.activeTab === 'flats' && 'Список квартир'}
            {ui.activeTab === 'homes' && 'Список комплексов'}
            {ui.activeTab === 'categories' && 'Список категорий'}
          </h3>
          {currentList.length === 0 &&
            <div className="text-gray-500">Нет данных</div>}
          {currentList.map(item => (
            <div
              key={item.label}
              className="flex justify-between items-center p-2 border rounded"
            >
              <div>{item.label}</div>
              <div className="flex gap-2">
                <button
                  onClick={() => openEdit(item.type, item.payload)}
                  className="text-blue-600 hover:underline text-sm"
                >Edit
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 border rounded bg-white">
          <div className="mb-2">
            <strong>Выбран:</strong>{' '}
            {editorType === 'flat' && selectedFlat ? selectedFlat.flat.name || `#${selectedFlat.flat.id}` : null}
            {editorType === 'home' && selectedHome ? selectedHome.name || `#${selectedHome.id}` : null}
            {editorType === 'category' && selectedCategory ? selectedCategory.name : null}
          </div>
          <div className="flex flex-col gap-2">
            <div>
              <button
                onClick={() => openNew(editorType)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm"
              >
                {editorType === 'flat' ? 'Новая квартира' : editorType === 'home' ? 'Новый комплекс' : 'Новая категория'}
              </button>
            </div>
            {ui.editMode && (
              <div>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm"
                >
                  Удалить текущий
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {ui.showForm && (
        <ContentEditor
          contentType={editorType}
          initialFlat={editorType === 'flat' ? selectedFlat || undefined : undefined}
          initialHome={editorType === 'home' ? selectedHome || undefined : undefined}
          initialCategory={editorType === 'category' ? selectedCategory || undefined : undefined}
          allCategories={categories}
          isEditing={ui.editMode}
          onSave={handleSave}
          onDelete={ui.editMode ? handleDelete : undefined}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
};

export default ContentManagementSection;