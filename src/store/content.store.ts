import {create} from 'zustand';
import type {
  Category,
  CategoryRequest,
  ContentManager,
  ContentManagerRequest,
  Description,
  DescriptionRequest,
  Flat,
  FlatRequest,
  FooterRequest,
  Home,
  HomeRequest,
  Photo,
} from '../services';
import {
  bulkDeletePhotos,
  createCategory,
  createDescription,
  createFlat,
  createHome,
  deleteCategory,
  deleteDescription,
  deleteFlat,
  deleteHome,
  deletePhoto,
  updateCategory,
  updateDescription,
  updateFlat,
  updateHome,
  updatePhoto,
} from '../services';

export interface ContentState {
  categories: Category[];
  descriptions: Description[];
  flats: Flat[];
  homes: Home[];
  photos: Photo[];

  selectedCategory: Category | null;
  selectedDescription: Description | null;
  selectedFlat: Flat | null;
  selectedHome: Home | null;
  selectedPhoto: Photo | null;
  selectedContentManager: ContentManager | null;

  categoryForm: Partial<CategoryRequest>;
  descriptionForm: Partial<DescriptionRequest>;
  flatForm: Partial<FlatRequest>;
  homeForm: Partial<HomeRequest>;
  contentManagerForm: Partial<ContentManagerRequest>;

  loading: {
    categories: boolean;
    descriptions: boolean;
    flats: boolean;
    homes: boolean;
    photos: boolean;
    contentManagers: boolean;
    uploading: boolean;
    saving: boolean;
    deleting: boolean;
  };

  errors: {
    [key: string]: string | null;
  };

  ui: {
    activeTab: 'flats' | 'homes' | 'categories' | 'descriptions' | 'photos' | 'footer' | 'managers';
    showForm: boolean;
    editMode: boolean;
    selectedPhotoIds: number[];
    bulkActionMode: boolean;
  };

  stats: {
    totalFlats: number;
    totalHomes: number;
    totalCategories: number;
    totalPhotos: number;
    lastUpdated: number | null;
  };
}

export interface ContentActions {
  loadCategories: () => Promise<void>;
  saveCategory: (data: CategoryRequest) => Promise<boolean>;
  removeCategory: (id: number) => Promise<boolean>;
  editCategory: (category: Category) => void;

  loadDescriptions: () => Promise<void>;
  saveDescription: (data: DescriptionRequest) => Promise<boolean>;
  removeDescription: (id: number) => Promise<boolean>;
  editDescription: (description: Description) => void;

  loadFlats: () => Promise<void>;
  saveFlat: (data: FlatRequest) => Promise<boolean>;
  removeFlat: (id: number) => Promise<boolean>;
  editFlat: (flat: Flat) => void;

  loadHomes: () => Promise<void>;
  saveHome: (data: HomeRequest) => Promise<boolean>;
  removeHome: (id: number) => Promise<boolean>;
  editHome: (home: Home) => void;

  loadPhotos: () => Promise<void>;
  uploadPhotos: (files: File[]) => Promise<boolean>;
  updatePhotoData: (id: number, altText: string) => Promise<boolean>;
  removePhoto: (id: number) => Promise<boolean>;
  removeSelectedPhotos: () => Promise<boolean>;
  selectPhoto: (id: number, selected: boolean) => void;
  selectAllPhotos: (selected: boolean) => void;

  setCategoryForm: (form: Partial<CategoryRequest>) => void;
  setDescriptionForm: (form: Partial<DescriptionRequest>) => void;
  setFlatForm: (form: Partial<FlatRequest>) => void;
  setHomeForm: (form: Partial<HomeRequest>) => void;
  setContentManagerForm: (form: Partial<ContentManagerRequest>) => void;
  resetForms: () => void;

  setActiveTab: (tab: ContentState['ui']['activeTab']) => void;
  setShowForm: (show: boolean) => void;
  setEditMode: (edit: boolean) => void;
  setBulkActionMode: (mode: boolean) => void;

  setError: (key: string, error: string | null) => void;
  clearErrors: () => void;

  updateStats: () => void;

  setLoading: (key: keyof ContentState['loading'], loading: boolean) => void;
  refreshAll: () => Promise<void>;
}

const initialCategoryForm: Partial<CategoryRequest> = {
  name: '',
  isOnMainPage: false,
};

const initialDescriptionForm: Partial<DescriptionRequest> = {
  title: '',
  content: '',
  type: '',
};

const initialFlatForm: Partial<FlatRequest> = {
  name: '',
  description: '',
  price: 0,
  area: 0,
  numberOfRooms: 1,
  floor: 1,
  homeId: 0,
};

const initialHomeForm: Partial<HomeRequest> = {
  name: '',
  description: '',
  address: '',
  yearBuilt: 2025
};

const initialContentManagerForm: Partial<ContentManagerRequest> = {
  name: '',
  surname: '',
  email: '',
  password: '',
  role: 'CONTENT_MANAGER'
};

export const useContentStore = create<ContentState & ContentActions>((set, get) => ({
  categories: [],
  descriptions: [],
  flats: [],
  homes: [],
  photos: [],
  contentManagers: [],

  selectedCategory: null,
  selectedDescription: null,
  selectedFlat: null,
  selectedHome: null,
  selectedPhoto: null,
  selectedContentManager: null,

  categoryForm: initialCategoryForm,
  descriptionForm: initialDescriptionForm,
  flatForm: initialFlatForm,
  homeForm: initialHomeForm,
  contentManagerForm: initialContentManagerForm,

  loading: {
    categories: false,
    descriptions: false,
    flats: false,
    homes: false,
    photos: false,
    contentManagers: false,
    uploading: false,
    saving: false,
    deleting: false,
  },

  errors: {},

  ui: {
    activeTab: 'flats',
    showForm: false,
    editMode: false,
    selectedPhotoIds: [],
    bulkActionMode: false,
  },

  stats: {
    totalFlats: 0,
    totalHomes: 0,
    totalCategories: 0,
    totalPhotos: 0,
    lastUpdated: null,
  },

  loadCategories: async () => {
    set({loading: {...get().loading, categories: true}});

    try {

      set({
        loading: {...get().loading, categories: false},
        categories: [],
      });
      get().updateStats();
    } catch {
      set({
        loading: {...get().loading, categories: false},
        errors: {...get().errors, categories: 'Error'},
      });
    }
  },

  saveCategory: async (data: CategoryRequest) => {
    set({loading: {...get().loading, saving: true}});

    try {
      const {selectedCategory} = get();

      if (selectedCategory) {
        await updateCategory(selectedCategory.id, data);
      } else {
        await createCategory(data);
      }

      await get().loadCategories();
      get().resetForms();
      get().setShowForm(false);

      set({loading: {...get().loading, saving: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, saving: false},
        errors: {...get().errors, saveCategory: error},
      });
      return false;
    }
  },

  removeCategory: async (id: number) => {
    set({loading: {...get().loading, deleting: true}});

    try {
      await deleteCategory(id);
      await get().loadCategories();

      set({loading: {...get().loading, deleting: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, deleting: false},
        errors: {...get().errors, deleteCategory: error.message},
      });
      return false;
    }
  },

  editCategory: (category: Category) => {
    console.log(category);
  },

  loadDescriptions: async () => {
    set({loading: {...get().loading, descriptions: true}});

    try {
      // Would load from API
      set({
        loading: {...get().loading, descriptions: false},
        descriptions: [],
      });
    } catch (error: any) {
      set({
        loading: {...get().loading, descriptions: false},
        errors: {...get().errors, descriptions: error.message},
      });
    }
  },

  saveDescription: async (data: DescriptionRequest) => {
    set({loading: {...get().loading, saving: true}});

    try {
      const {selectedDescription} = get();

      if (selectedDescription) {
        await updateDescription(selectedDescription.id, data);
      } else {
        await createDescription(data);
      }

      await get().loadDescriptions();
      get().resetForms();
      get().setShowForm(false);

      set({loading: {...get().loading, saving: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, saving: false},
        errors: {...get().errors, saveDescription: error.message},
      });
      return false;
    }
  },

  removeDescription: async (id: number) => {
    set({loading: {...get().loading, deleting: true}});

    try {
      await deleteDescription(id);
      await get().loadDescriptions();

      set({loading: {...get().loading, deleting: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, deleting: false},
        errors: {...get().errors, deleteDescription: error.message},
      });
      return false;
    }
  },

  editDescription: (description: Description) => {
    set({
      selectedDescription: description,
      descriptionForm: {
        title: description.title,
        content: description.content,
        type: description.type,
      },
      ui: {...get().ui, showForm: true, editMode: true},
    });
  },

  // Flats
  loadFlats: async () => {
    set({loading: {...get().loading, flats: true}});

    try {
      // Would load from API
      set({
        loading: {...get().loading, flats: false},
        flats: [],
      });
      get().updateStats();
    } catch (error: any) {
      set({
        loading: {...get().loading, flats: false},
        errors: {...get().errors, flats: error.message},
      });
    }
  },

  saveFlat: async (data: FlatRequest) => {
    set({loading: {...get().loading, saving: true}});

    try {
      const {selectedFlat} = get();

      if (selectedFlat) {
        await updateFlat(selectedFlat.id, data);
      } else {
        await createFlat(data);
      }

      await get().loadFlats();
      get().resetForms();
      get().setShowForm(false);

      set({loading: {...get().loading, saving: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, saving: false},
        errors: {...get().errors, saveFlat: error.message},
      });
      return false;
    }
  },

  removeFlat: async (id: number) => {
    set({loading: {...get().loading, deleting: true}});

    try {
      await deleteFlat(id);
      await get().loadFlats();

      set({loading: {...get().loading, deleting: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, deleting: false},
        errors: {...get().errors, deleteFlat: error.message},
      });
      return false;
    }
  },

  editFlat: (flat: Flat) => {
    set({
      selectedFlat: flat,
      flatForm: {
        ...flat,
      },
      ui: {...get().ui, showForm: true, editMode: true},
    });
  },

  // Homes
  loadHomes: async () => {
    set({loading: {...get().loading, homes: true}});

    try {
      // Would load from API
      set({
        loading: {...get().loading, homes: false},
        homes: [],
      });
      get().updateStats();
    } catch (error: any) {
      set({
        loading: {...get().loading, homes: false},
        errors: {...get().errors, homes: error.message},
      });
    }
  },

  saveHome: async (data: HomeRequest) => {
    set({loading: {...get().loading, saving: true}});

    try {
      const {selectedHome} = get();

      if (selectedHome) {
        await updateHome(selectedHome.id, data);
      } else {
        await createHome(data);
      }

      await get().loadHomes();
      get().resetForms();
      get().setShowForm(false);

      set({loading: {...get().loading, saving: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, saving: false},
        errors: {...get().errors, saveHome: error.message},
      });
      return false;
    }
  },

  removeHome: async (id: number) => {
    set({loading: {...get().loading, deleting: true}});

    try {
      await deleteHome(id);
      await get().loadHomes();

      set({loading: {...get().loading, deleting: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, deleting: false},
        errors: {...get().errors, deleteHome: error.message},
      });
      return false;
    }
  },

  editHome: (home: Home) => {
    set({
      selectedHome: home,
      homeForm: {
        name: home.name,
        description: home.description,
        address: home.address,
        categoryId: home.categoryId,
        photos: home.photos?.map(p => p.id),
        amenities: home.amenities,
      },
      ui: {...get().ui, showForm: true, editMode: true},
    });
  },

  // Photos
  loadPhotos: async () => {
    set({loading: {...get().loading, photos: true}});

    try {
      // Would load from API
      set({
        loading: {...get().loading, photos: false},
        photos: [],
      });
      get().updateStats();
    } catch (error: any) {
      set({
        loading: {...get().loading, photos: false},
        errors: {...get().errors, photos: error.message},
      });
    }
  },

  uploadPhotos: async (files: File[]) => {
    console.log(files);
    return true;
  },

  updatePhotoData: async (id: number, altText: string) => {
    try {
      await updatePhoto(id, undefined, altText);
      await get().loadPhotos();
      return true;
    } catch (error: any) {
      set({
        errors: {...get().errors, updatePhoto: error.message},
      });
      return false;
    }
  },

  removePhoto: async (id: number) => {
    set({loading: {...get().loading, deleting: true}});

    try {
      await deletePhoto(id);
      await get().loadPhotos();

      set({loading: {...get().loading, deleting: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, deleting: false},
        errors: {...get().errors, deletePhoto: error.message},
      });
      return false;
    }
  },

  removeSelectedPhotos: async () => {
    const {ui} = get();
    set({loading: {...get().loading, deleting: true}});

    try {
      await bulkDeletePhotos(ui.selectedPhotoIds);
      await get().loadPhotos();

      set({
        loading: {...get().loading, deleting: false},
        ui: {...ui, selectedPhotoIds: [], bulkActionMode: false},
      });
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, deleting: false},
        errors: {...get().errors, deletePhotos: error.message},
      });
      return false;
    }
  },

  selectPhoto: (id: number, selected: boolean) => {
    const {ui} = get();
    const selectedIds = selected
      ? [...ui.selectedPhotoIds, id]
      : ui.selectedPhotoIds.filter(photoId => photoId !== id);

    set({
      ui: {...ui, selectedPhotoIds: selectedIds},
    });
  },

  selectAllPhotos: (selected: boolean) => {
    const {photos, ui} = get();
    const selectedIds = selected ? photos.map(p => p.id) : [];

    set({
      ui: {...ui, selectedPhotoIds: selectedIds},
    });
  },

  // Footer
  loadFooter: async () => {
    set({loading: {...get().loading, footer: true}});

    try {
      // Would load from API
      set({
        loading: {...get().loading, footer: false},
        footer: null,
      });
    } catch (error: any) {
      set({
        loading: {...get().loading, footer: false},
        errors: {...get().errors, footer: error.message},
      });
    }
  },

  saveFooter: async (data: FooterRequest) => {
    set({loading: {...get().loading, saving: true}});

    try {
      const {footer} = get();

      if (footer) {
        await updateFooter(footer.id, data);
      } else {
        await createFooter(data);
      }

      get().resetForms();

      set({loading: {...get().loading, saving: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, saving: false},
        errors: {...get().errors, saveFooter: error.message},
      });
      return false;
    }
  },

  // Content Managers
  loadContentManagers: async () => {
    set({loading: {...get().loading, contentManagers: true}});

    try {
      const managers = await getContentManagers();
      set({
        loading: {...get().loading, contentManagers: false},
        contentManagers: managers,
      });
    } catch (error: any) {
      set({
        loading: {...get().loading, contentManagers: false},
        errors: {...get().errors, contentManagers: error.message},
      });
    }
  },

  saveContentManager: async (data: ContentManagerRequest) => {
    set({loading: {...get().loading, saving: true}});

    try {
      const {selectedContentManager} = get();

      if (selectedContentManager) {
        await updateContentManager(selectedContentManager.id, data);
      } else {
        await createContentManager(data);
      }

      await get().loadContentManagers();
      get().resetForms();
      get().setShowForm(false);

      set({loading: {...get().loading, saving: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, saving: false},
        errors: {...get().errors, saveContentManager: error.message},
      });
      return false;
    }
  },

  removeContentManager: async (id: string) => {
    set({loading: {...get().loading, deleting: true}});

    try {
      await deleteContentManager(id);
      await get().loadContentManagers();

      set({loading: {...get().loading, deleting: false}});
      return true;
    } catch (error: any) {
      set({
        loading: {...get().loading, deleting: false},
        errors: {...get().errors, deleteContentManager: error.message},
      });
      return false;
    }
  },

  editContentManager: (manager: ContentManager) => {
    set({
      selectedContentManager: manager,
      contentManagerForm: {
        username: manager.username,
        email: manager.email,
        role: manager.role,
        // Don't populate password for security
      },
      ui: {...get().ui, showForm: true, editMode: true},
    });
  },

  // Forms
  setCategoryForm: (form) => {
    set(state => ({
      categoryForm: {...state.categoryForm, ...form},
    }));
  },

  setDescriptionForm: (form) => {
    set(state => ({
      descriptionForm: {...state.descriptionForm, ...form},
    }));
  },

  setFlatForm: (form) => {
    set(state => ({
      flatForm: {...state.flatForm, ...form},
    }));
  },

  setHomeForm: (form) => {
    set(state => ({
      homeForm: {...state.homeForm, ...form},
    }));
  },

  setContentManagerForm: (form) => {
    set(state => ({
      contentManagerForm: {...state.contentManagerForm, ...form},
    }));
  },

  resetForms: () => {
    set({
      categoryForm: initialCategoryForm,
      descriptionForm: initialDescriptionForm,
      flatForm: initialFlatForm,
      homeForm: initialHomeForm,
      footerForm: initialFooterForm,
      contentManagerForm: initialContentManagerForm,
      selectedCategory: null,
      selectedDescription: null,
      selectedFlat: null,
      selectedHome: null,
      selectedPhoto: null,
      selectedContentManager: null,
    });
  },

  // UI actions
  setActiveTab: (activeTab) => {
    set(state => ({
      ui: {...state.ui, activeTab},
    }));
  },

  setShowForm: (showForm) => {
    set(state => ({
      ui: {
        ...state.ui,
        showForm,
        editMode: showForm ? state.ui.editMode : false
      },
    }));

    if (!showForm) {
      get().resetForms();
    }
  },

  setEditMode: (editMode) => {
    set(state => ({
      ui: {...state.ui, editMode},
    }));
  },

  setBulkActionMode: (bulkActionMode) => {
    set(state => ({
      ui: {...state.ui, bulkActionMode, selectedPhotoIds: []},
    }));
  },

  // Error handling
  setError: (key, error) => {
    set(state => ({
      errors: {...state.errors, [key]: error},
    }));
  },

  clearErrors: () => {
    set({errors: {}});
  },

  // Stats
  updateStats: () => {
    const {flats, homes, categories, photos} = get();

    set({
      stats: {
        totalFlats: flats.length,
        totalHomes: homes.length,
        totalCategories: categories.length,
        totalPhotos: photos.length,
        lastUpdated: Date.now(),
      },
    });
  },

  // General actions
  setLoading: (key, loading) => {
    set(state => ({
      loading: {...state.loading, [key]: loading},
    }));
  },

  refreshAll: async () => {
    const actions = [
      get().loadCategories,
      get().loadDescriptions,
      get().loadFlats,
      get().loadHomes,
      get().loadPhotos,
    ];

    await Promise.all(actions.map(action => action()));
  },
}));