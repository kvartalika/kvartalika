import {useState, useMemo, useCallback, useEffect} from 'react';
import {
  type BidForm,
} from '../../store/ui.store.ts';
import type {
  FlatWithCategoryRequest,
  HomeRequest,
  Category
} from '../../services';
import ContentEditor, {type ContentType} from "./ContentEditor.tsx";
import {useDebounce} from "../../hooks/useDebounce.ts";
import {useContentStore} from "../../store/content.store.ts";
import {useFlatsStore} from "../../store/flats.store.ts";
import {useContentManagerStore} from "../../store/contentManager.store.ts";

const TABS: Array<ContentType> = ['flat', 'home', 'category', 'bid'];
type PayLoadType = FlatWithCategoryRequest | HomeRequest | Category | BidForm;

const GUIDE: Record<string, string> = {
  flats: "Квартиры: создавайте, редактируйте и удаляйте квартиры. Используйте поиск для фильтрации по адресу или ID.",
  homes: "Комплексы: управляйте жилыми комплексами, сопоставляйте квартиры с комплексами.",
  categories: "Категории: держите классификацию актуальной. Назначайте категории на объекты.",
  bids: "Заявки: просматривайте входящие заявки, отмечайте как просмотренные и редактируйте."
};

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

  const {
    loadFlats,
    loadHomes,
    loadCategories,
    flats,
    homes,
    categories
  } = useFlatsStore();

  const {
    bids,
    selectedBid,
    getBids,
    editBid,
    saveBid,
    removeBid,
    isLoadingBids,
  } = useContentManagerStore();

  const [filter, setFilter] = useState('');
  const debouncedFilter = useDebounce(filter, 250);

  const activeContentType: ContentType = useMemo(() => {
    if (ui.activeTab === 'flats') return 'flat';
    if (ui.activeTab === 'homes') return 'home';
    if (ui.activeTab === 'categories') return 'category';
    if (ui.activeTab === 'bids') return 'bid';
    return 'flat';
  }, [ui.activeTab]);

  const refreshCurrent = useCallback(() => {
    if (ui.activeTab === 'bids') {
      void getBids();
    } else if (ui.activeTab === 'flats') {
      void loadFlats(true);
    } else if (ui.activeTab === 'homes') {
      void loadHomes(true);
    } else if (ui.activeTab === 'categories') {
      void loadCategories(true);
    }
    setFilter('');
  }, [ui.activeTab, getBids, loadFlats, loadHomes, loadCategories]);

  useEffect(() => {
    refreshCurrent();
  }, [refreshCurrent]);

  const switchTab = useCallback((type: ContentType) => {
    if (type === 'flat') setActiveTab('flats');
    if (type === 'home') setActiveTab('homes');
    if (type === 'category') setActiveTab('categories');
    if (type === 'bid') setActiveTab('bids');
    setFilter('');
  }, [setActiveTab]);

  const openNew = useCallback((type: ContentType) => {
    setEditMode(false);
    setShowForm(true);
    switchTab(type);
  }, [setEditMode, setShowForm, switchTab]);

  const openEdit = useCallback((type: ContentType, payload: PayLoadType) => {
    if (type === 'flat') editFlat(payload as FlatWithCategoryRequest);
    if (type === 'home') editHome(payload as HomeRequest);
    if (type === 'category') editCategory(payload as Category);
    if (type === 'bid') editBid(payload as BidForm);
    setEditMode(true);
    setShowForm(true);
    switchTab(type);
  }, [editFlat, editHome, editCategory, editBid, setEditMode, setShowForm, switchTab]);

  const handleSave = useCallback(async (payload: PayLoadType) => {
    if (activeContentType === 'flat') await saveFlat(payload as FlatWithCategoryRequest);
    if (activeContentType === 'home') await saveHome(payload as HomeRequest);
    if (activeContentType === 'category') await saveCategory(payload as Category);
    if (activeContentType === 'bid') await saveBid(payload as BidForm);
    refreshCurrent();
  }, [refreshCurrent, activeContentType, saveFlat, saveHome, saveCategory, saveBid]);

  const handleDelete = useCallback(async () => {
    if (activeContentType === 'flat' && selectedFlat?.flat.id) await removeFlat(selectedFlat.flat.id);
    if (activeContentType === 'home' && selectedHome?.id) await removeHome(selectedHome.id);
    if (activeContentType === 'category' && selectedCategory?.id) await removeCategory(selectedCategory.id);
    if (activeContentType === 'bid' && selectedBid?.id) await removeBid(selectedBid.id);
    setShowForm(false);
    refreshCurrent();
  }, [
    refreshCurrent,
    activeContentType,
    selectedFlat,
    selectedHome,
    selectedCategory,
    selectedBid,
    removeFlat,
    removeHome,
    removeCategory,
    removeBid,
    setShowForm,
  ]);

  const currentList = useMemo(() => {
    let base: Array<{
      type: ContentType | 'bid';
      payload: PayLoadType;
      label: string;
    }> = [];

    if (activeContentType === 'bid') {
      base = bids.map(b => ({
        type: 'bid' as const,
        payload: b,
        label: `${b.id}-${b.name || ''} ${b.email || ''}`.trim(),
      }));
    } else if (activeContentType === 'flat') {
      base = flats.map(f => ({
        type: 'flat' as const,
        payload: f,
        label: `${f.flat.id} ${f.flat.address || ''} ${f.flat.homeId || ''}`.trim(),
      }));
    } else if (activeContentType === 'home') {
      base = homes.map(h => ({
        type: 'home' as const,
        payload: h,
        label: `${h.id} ${h.address || ''}`.trim(),
      }));
    } else if (activeContentType === 'category') {
      base = categories.map(c => ({
        type: 'category' as const,
        payload: c,
        label: c.name ?? `${c.id}`,
      }));
    }

    if (!debouncedFilter) return base;
    const lowered = debouncedFilter.toLowerCase();
    return base.filter(i => i.label.toLowerCase().includes(lowered));
  }, [activeContentType, debouncedFilter, bids, flats, homes, categories]);

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4 flex-wrap">
        {TABS.map(t => (
          <button
            key={t}
            onClick={() => switchTab(t)}
            className={`px-3 py-1 rounded ${
              (t === 'flat' && ui.activeTab === 'flats') ||
              (t === 'home' && ui.activeTab === 'homes') ||
              (t === 'category' && ui.activeTab === 'categories') ||
              (t === 'bid' && ui.activeTab === 'bids')
                ? 'bg-primary-600 text-secondary-100'
                : 'bg-gray-100'
            }`}
            type="button"
          >
            {t === 'flat'
              ? 'Квартиры'
              : t === 'home'
                ? 'Комплексы'
                : t === 'category'
                  ? 'Категории'
                  : 'Заявки'}
          </button>
        ))}
        <div className="ml-auto flex gap-2 flex-wrap">
          <button
            onClick={() => openNew('flat')}
            className="px-3 py-1 bg-green-600 text-secondary-100 rounded text-sm"
            type="button"
          >
            Новая квартира
          </button>
          <button
            onClick={() => openNew('home')}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новый комплекс
          </button>
          <button
            onClick={() => openNew('category')}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новая категория
          </button>
          <button
            onClick={() => openNew('bid')}
            className="px-3 py-1 bg-green-600 text-white rounded text-sm"
            type="button"
          >
            Новая заявка
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              {ui.activeTab === 'bids' && 'Список заявок'}
              {ui.activeTab === 'flats' && 'Список квартир'}
              {ui.activeTab === 'homes' && 'Список комплексов'}
              {ui.activeTab === 'categories' && 'Список категорий'}
            </h3>
            {ui.activeTab === 'bids' && (
              <div className="text-sm text-gray-500">
                {isLoadingBids ? 'Загрузка...' : `${bids.length} заявок`}
              </div>
            )}
            {ui.activeTab === 'flats' && (
              <div className="text-sm text-gray-500">
                {loading.flats ? 'Загрузка...' : `${flats.length} квартир`}
              </div>
            )}
            {ui.activeTab === 'homes' && (
              <div className="text-sm text-gray-500">
                {loading.homes ? 'Загрузка...' : `${homes.length} ЖК`}
              </div>
            )}
            {ui.activeTab === 'categories' && (
              <div className="text-sm text-gray-500">
                {loading.categories ? 'Загрузка...' : `${categories.length} категорий`}
              </div>
            )}
          </div>

          <div className="flex gap-2 mb-2 flex-wrap">
            <input
              placeholder="Поиск..."
              value={filter}
              onChange={e => setFilter(e.target.value)}
              className="flex-grow px-3 py-2 border rounded"
              type="text"
            />
            <button
              onClick={refreshCurrent}
              className="px-3 py-2 bg-gray-200 rounded"
              disabled={
                (ui.activeTab === 'flats' && loading.flats) ||
                (ui.activeTab === 'homes' && loading.homes) ||
                (ui.activeTab === 'categories' && loading.categories) ||
                (ui.activeTab === 'bids' && isLoadingBids)
              }
              type="button"
            >
              Обновить
            </button>
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
                  isBid ? (isChecked ? 'bg-green-50' : 'bg-yellow-50 font-semibold') : ''
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
                    onClick={e => {
                      e.stopPropagation();
                      openEdit(item.type, item.payload);
                    }}
                    className="text-primary-600 hover:underline text-sm"
                    type="button"
                  >
                    Изменить
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 border rounded bg-white flex flex-col gap-4">
          <div className="flex-1">
            <h4 className="font-semibold mb-2">Руководство</h4>
            <p className="text-sm text-gray-700 whitespace-pre-line">
              {GUIDE[ui.activeTab] || "Выберите вкладку, чтобы увидеть руководство."}
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div>
              <button
                onClick={() => openNew(activeContentType)}
                className="px-3 py-1 bg-green-600 text-white rounded text-sm w-full"
                type="button"
              >
                {ui.activeTab === 'flats'
                  ? 'Новая квартира'
                  : ui.activeTab === 'homes'
                    ? 'Новый комплекс'
                    : ui.activeTab === 'categories'
                      ? 'Новая категория'
                      : 'Новая заявка'}
              </button>
            </div>
            {ui.editMode && (
              <div>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 bg-red-600 text-white rounded text-sm w-full"
                  type="button"
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
          contentType={activeContentType}
          initialFlat={activeContentType === 'flat' ? selectedFlat || undefined : undefined}
          initialHome={activeContentType === 'home' ? selectedHome || undefined : undefined}
          initialCategory={activeContentType === 'category' ? selectedCategory || undefined : undefined}
          initialBid={activeContentType === 'bid' ? selectedBid || undefined : undefined}
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