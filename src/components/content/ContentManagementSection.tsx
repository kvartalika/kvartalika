import {useState, useMemo, useEffect} from 'react';
import {
  type BidForm,
  useContentManagerStore,
  useContentStore,
  useFlatsStore
} from '../../store';
import type {
  FlatWithCategoryRequest,
  HomeRequest,
  Category
} from '../../services';
import ContentEditor, {type ContentType} from "./ContentEditor.tsx";
import {useDebounce} from "../../hooks/useDebounce.ts";

const TABS: Array<ContentType | 'bid'> = ['flat', 'home', 'category', 'bid'];
type PayLoadType = FlatWithCategoryRequest | HomeRequest | Category | BidForm;

const ContentManagementSection = () => {
  const {
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
    loading
  } = useContentStore();

  const {loadFlats, loadHomes, loadCategories} = useFlatsStore();

  const {
    bids,
    selectedBid,
    getBids,
    editBid,
    saveBid,
    removeBid,
    isLoadingBids,
  } = useContentManagerStore();

  const {flats, homes, categories} = useFlatsStore();

  const [editorType, setEditorType] = useState<ContentType>('flat');

  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 250);


  const switchTab = (type: ContentType | 'bid') => {
    setEditorType(type);
    if (type === 'flat') setActiveTab('flats');
    if (type === 'home') setActiveTab('homes');
    if (type === 'category') setActiveTab('categories');
    if (type === 'bid') setActiveTab('bids');
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
    if (type === 'bid') editBid((payload as BidForm));
    setEditMode(true);
    setShowForm(true);
    switchTab(type);
  };

  const handleSave = async (payload: PayLoadType) => {
    if (editorType === 'flat') await saveFlat(payload as FlatWithCategoryRequest);
    if (editorType === 'home') await saveHome(payload as HomeRequest);
    if (editorType === 'category') await saveCategory(payload as Category);
    if (editorType === 'bid') await saveBid(payload as BidForm);
  };

  const handleDelete = async () => {
    if (editorType === 'flat' && selectedFlat?.flat.id) await removeFlat(selectedFlat.flat.id);
    if (editorType === 'home' && selectedHome?.id) await removeHome(selectedHome.id);
    if (editorType === 'category' && selectedCategory?.id) await removeCategory(selectedCategory.id);
    if (editorType === 'bid' && selectedBid?.id) await removeBid(selectedBid.id);

    setShowForm(false);
  };

  const currentList = useMemo(() => {
    let base: Array<{
      type: ContentType;
      payload: PayLoadType;
      label: string
    }> = [];

    if (editorType === 'bid') {
      base = bids.map(b => ({
        type: 'bid' as const,
        payload: b,
        label: `${b.id}-${b.name || ''} ${b.email || ''}`.trim(),
      }));
    } else if (editorType === 'flat') {
      base = flats.map(f => ({
        type: 'flat' as const,
        payload: f,
        label: `${f.flat.id} ${f.flat.address || ''} ${f.flat.homeId || ''}`.trim(),
      }));
    } else if (editorType === 'home') {
      base = homes.map(h => ({
        type: 'home' as const,
        payload: h,
        label: `${h.id} ${h.address || ''}`.trim(),
      }));
    } else if (editorType === 'category') {
      base = categories.map(c => ({
        type: 'category' as const,
        payload: c,
        label: c.name ?? `${c.id}`,
      }));
    }

    if (!debouncedFilter) return base;
    const lowered = debouncedFilter.toLowerCase();
    return base.filter(i => i.label.toLowerCase().includes(lowered));
  }, [editorType, debouncedFilter, bids, flats, homes, categories]);

  useEffect(() => {
    if (editorType === 'bid') {
      void getBids();
    } else if (editorType === 'flat') {
      void loadFlats();
    } else if (editorType === 'home') {
      void loadHomes();
    } else if (editorType === 'category') {
      void loadCategories();
    }
    setFilter('');
  }, [editorType, getBids, loadFlats, loadHomes, loadCategories]);


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
              (t === 'category' && ui.activeTab === 'categories') ||
              (t === 'bid' && ui.activeTab === 'bids')
            ) ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
          >
            {t === 'flat' ? 'Квартиры' : t === 'home' ? 'Комплексы' : t === 'category' ? 'Категории' : 'Заявки'}
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
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {editorType === 'bid' && ui.activeTab === 'bids' && 'Список заявок'}
              {editorType === 'flat' && ui.activeTab === 'flats' && 'Список квартир'}
              {editorType === 'home' && ui.activeTab === 'homes' && 'Список комплексов'}
              {editorType === 'category' && ui.activeTab === 'categories' && 'Список категорий'}
            </h3>
            {editorType === 'bid' && (
              <div className="text-sm text-gray-500">
                {isLoadingBids ? 'Загрузка...' : `${bids.length} заявок`}
              </div>
            )}
            {editorType === 'flat' && (
              <div className="text-sm text-gray-500">
                {loading.flats ? 'Загрузка...' : `${flats.length} квартир`}
              </div>
            )}
            {editorType === 'home' && (
              <div className="text-sm text-gray-500">
                {loading.homes ? 'Загрузка...' : `${homes.length} ЖК`}
              </div>
            )}
            {editorType === 'category' && (
              <div className="text-sm text-gray-500">
                {loading.categories ? 'Загрузка...' : `${categories.length} категорий`}
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-2">
            <input
              placeholder="Поиск..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="flex-grow px-3 py-2 border rounded"
            />
            {editorType === 'bid' && (
              <button
                onClick={() => void getBids()}
                className="px-3 py-2 bg-gray-200 rounded"
                disabled={isLoadingBids}
              >
                Обновить
              </button>
            )}
          </div>

          {currentList.length === 0 &&
            <div className="text-gray-500">Нет данных</div>}
          {currentList.map(item => {
            const isBid = item.type === 'bid';
            const bid = item.payload as BidForm;
            const isChecked = isBid && bid?.isChecked;

            return (
              <div
                key={`${item.label}-${item.type}`}
                onClick={() => openEdit(item.type, item.payload)}
                className={`flex justify-between items-center p-2 border rounded hover:shadow-sm transition cursor-pointer ${
                  isBid
                    ? isChecked
                      ? 'bg-green-50'
                      : 'bg-yellow-50 font-semibold'
                    : ''
                }`}
              >
                <div className="flex flex-col">
                  <div>{item.label}</div>
                  {isBid && (
                    <div className="text-xs text-gray-600">
                      {(bid.phone || '')} — {(bid.email || '')}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 items-center">
                  {isBid && (
                    <div
                      className={`text-sm px-2 py-1 rounded text-white mr-4 ${
                        isChecked ? 'bg-green-600' : 'bg-red-500'
                      }`}
                    >
                      {isChecked ? 'Просмотрено' : 'Не просмотрено'}
                    </div>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEdit(item.type, item.payload);
                    }}
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border rounded bg-white">
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
          initialBid={editorType === 'bid' ? selectedBid || undefined : undefined}
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