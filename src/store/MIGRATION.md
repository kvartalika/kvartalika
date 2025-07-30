# Store Migration Guide

This guide helps you migrate from the old monolithic store system to the new modular store architecture.

## Overview

The old store system consisted of:
- `useAppStore` - Single large store for all app state
- `useAuthStore` - Authentication store

The new system is organized into focused, modular stores:
- `useAuthStore` - Authentication with admin/content manager support
- `usePropertiesStore` - Properties, flats, homes, apartments
- `useSearchStore` - Search functionality and filters
- `useUIStore` - UI state, modals, notifications, forms
- `useContentStore` - Content management (admin/content manager only)

## Migration Steps

### 1. Update Imports

**OLD:**
```typescript
import { useAppStore } from '@/store/useAppStore';
import { useAuthStore } from '@/store/useAuthStore';
```

**NEW:**
```typescript
// Import specific hooks
import { 
  useApartments, 
  useSearchStore, 
  useAuthStore,
  useUIStore 
} from '@/store';

// Or import stores directly
import { 
  usePropertiesStore,
  useSearchStore,
  useAuthStore,
  useUIStore 
} from '@/store';
```

### 2. Properties and Apartments

**OLD:**
```typescript
const { 
  apartments, 
  complexes, 
  setApartments, 
  selectedApartment,
  setSelectedApartment 
} = useAppStore();
```

**NEW:**
```typescript
// Using selectors (recommended)
const apartments = useApartments();
const complexes = useComplexes();
const selectedApartment = useSelectedApartment();

// Or using store directly
const { 
  apartments, 
  complexes, 
  fetchFlats,
  selectedApartment,
  setSelectedApartment 
} = usePropertiesStore();

// Load data
useEffect(() => {
  fetchFlats();
  fetchHomes();
}, []);
```

### 3. Search and Filters

**OLD:**
```typescript
const { 
  searchFilters, 
  setSearchFilters, 
  filteredApartments,
  filterApartments 
} = useAppStore();
```

**NEW:**
```typescript
// Using selectors (recommended)
const filters = useSearchFilters();
const searchResults = useSearchResults();
const isSearching = useSearchLoading();

// Or using store directly
const { 
  filters, 
  setFilters, 
  performSearch,
  searchResultsApartments 
} = useSearchStore();

// Perform search
const handleSearch = async () => {
  await performSearch();
};
```

### 4. Authentication

**OLD:**
```typescript
const { 
  user, 
  login, 
  logout, 
  isAuthenticated 
} = useAuthStore();

await login('email@example.com', 'password');
```

**NEW:**
```typescript
// Using selectors (recommended)
const user = useAuthUser();
const isAuthenticated = useIsAuthenticated();
const role = useAuthRole();

// Or using store directly
const { 
  user, 
  loginAsAdmin, 
  loginAsContentManager, 
  logout,
  isAuthenticated 
} = useAuthStore();

// Login as admin
await loginAsAdmin({ 
  username: 'admin', 
  password: 'password' 
});

// Login as content manager
await loginAsContentManager({ 
  username: 'manager', 
  password: 'password' 
});
```

### 5. UI State and Modals

**OLD:**
```typescript
const { 
  showBookingModal, 
  setShowBookingModal,
  bookingForm,
  setBookingForm,
  isLoading 
} = useAppStore();
```

**NEW:**
```typescript
// Using selectors (recommended)
const modals = useModals();
const bookingForm = useBookingForm();
const loading = useLoading();
const notifications = useNotifications();

// Or using store directly
const { 
  openModal, 
  closeModal,
  bookingForm,
  setBookingForm,
  submitBooking,
  addNotification 
} = useUIStore();

// Open booking modal
openModal('booking', { apartmentId: 123 });

// Submit booking
const success = await submitBooking();
if (success) {
  addNotification({
    type: 'success',
    title: 'Заявка отправлена',
    message: 'Мы свяжемся с вами в ближайшее время'
  });
}
```

### 6. Homepage Sections

**OLD:**
```typescript
const { 
  homepageSections, 
  setHomepageSections,
  updateHomepageSection 
} = useAppStore();
```

**NEW:**
```typescript
// Using selectors (recommended)
const homepageSections = useHomepageSections();

// Or using store directly
const { 
  homepageSections, 
  setHomepageSections,
  updateHomepageSection 
} = useUIStore();
```

## Store-Specific Migration

### Properties Store

The properties store manages both new API data (flats, homes) and legacy data (apartments, complexes) for backward compatibility.

```typescript
// NEW: API data
const flats = useFlats();
const homes = useHomes();

// LEGACY: Transformed data (for backward compatibility)
const apartments = useApartments();
const complexes = useComplexes();

// Load data
const { fetchFlats, fetchHomes, fetchFeaturedContent } = usePropertiesStore();

useEffect(() => {
  fetchFlats();
  fetchHomes();
  fetchFeaturedContent();
}, []);
```

### Search Store

Enhanced search capabilities with history, quick filters, and pagination.

```typescript
const { 
  filters, 
  setFilters, 
  performSearch, 
  performAdvancedSearch,
  searchResults,
  searchHistory,
  quickFilters,
  setQuickFilter 
} = useSearchStore();

// Set filters
setFilters({ 
  query: 'apartment', 
  minPrice: 1000000, 
  rooms: [2, 3] 
});

// Perform search
await performSearch();

// Use quick filter
setQuickFilter('affordable');

// Advanced search with pagination
await performAdvancedSearch(1);
```

### UI Store

Centralized UI state management.

```typescript
const { 
  // Modals
  openModal, 
  closeModal, 
  modals,
  
  // Forms
  bookingForm, 
  setBookingForm, 
  submitBooking,
  
  // Notifications
  addNotification, 
  removeNotification,
  
  // Theme
  theme, 
  setTheme,
  
  // Layout
  layout, 
  setSidebarOpen 
} = useUIStore();

// Show notification
addNotification({
  type: 'success',
  title: 'Success!',
  message: 'Operation completed',
  duration: 5000
});

// Open gallery
openGallery(['image1.jpg', 'image2.jpg'], 0);

// Set theme
setTheme('dark');
```

### Content Store (Admin/Content Manager)

New store for content management operations.

```typescript
// Only available for authenticated admin/content managers
const { 
  flats, 
  homes, 
  photos,
  saveFlat, 
  saveHome, 
  uploadPhotos,
  loading,
  ui 
} = useContentStore();

// Save flat
const success = await saveFlat({
  title: 'New Apartment',
  description: 'Beautiful apartment',
  price: 5000000,
  area: 65,
  rooms: 2,
  floor: 5,
  homeId: 1
});

// Upload photos
const files = [file1, file2, file3];
await uploadPhotos(files);
```

## Component Examples

### Search Component

**OLD:**
```tsx
import { useAppStore } from '@/store/useAppStore';

function SearchComponent() {
  const { 
    searchFilters, 
    setSearchFilters, 
    filteredApartments, 
    filterApartments 
  } = useAppStore();

  const handleSearch = () => {
    filterApartments();
  };

  return (
    <input 
      value={searchFilters.query}
      onChange={(e) => setSearchFilters({ query: e.target.value })}
    />
  );
}
```

**NEW:**
```tsx
import { useSearchStore, useSearchResults } from '@/store';

function SearchComponent() {
  const { filters, setFilters, performSearch } = useSearchStore();
  const { apartments } = useSearchResults();

  const handleSearch = async () => {
    await performSearch();
  };

  return (
    <input 
      value={filters.query}
      onChange={(e) => setFilters({ query: e.target.value })}
    />
  );
}
```

### Booking Modal

**OLD:**
```tsx
import { useAppStore } from '@/store/useAppStore';

function BookingModal() {
  const { 
    showBookingModal, 
    setShowBookingModal,
    bookingForm,
    setBookingForm 
  } = useAppStore();

  if (!showBookingModal) return null;

  return (
    <div>
      <input 
        value={bookingForm.name}
        onChange={(e) => setBookingForm({ name: e.target.value })}
      />
      <button onClick={() => setShowBookingModal(false)}>
        Close
      </button>
    </div>
  );
}
```

**NEW:**
```tsx
import { useModals, useBookingForm, useUIStore } from '@/store';

function BookingModal() {
  const modals = useModals();
  const bookingForm = useBookingForm();
  const { setBookingForm, closeModal, submitBooking } = useUIStore();

  if (!modals.booking) return null;

  const handleSubmit = async () => {
    const success = await submitBooking();
    if (success) {
      closeModal('booking');
    }
  };

  return (
    <div>
      <input 
        value={bookingForm.name}
        onChange={(e) => setBookingForm({ name: e.target.value })}
      />
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={() => closeModal('booking')}>
        Close
      </button>
    </div>
  );
}
```

## Store Initialization

Add store initialization to your app:

```tsx
// main.tsx or App.tsx
import { initializeStores } from '@/store';

function App() {
  useEffect(() => {
    initializeStores();
  }, []);

  return <YourApp />;
}
```

## Breaking Changes

1. **Authentication**: New auth store supports multiple user types (admin, content manager)
2. **Search**: Search now returns API data structure, not just filtered apartments
3. **Forms**: Form submission now handled by stores with proper error handling
4. **Data Loading**: Data fetching is now explicit and cached
5. **Modals**: Modal state is now centralized in UI store

## Benefits of New System

1. **Modularity**: Each store has a clear responsibility
2. **Type Safety**: Better TypeScript support
3. **Performance**: Selective re-renders with targeted selectors
4. **API Integration**: Built-in API integration with error handling
5. **Caching**: Automatic data caching and invalidation
6. **Developer Experience**: Better debugging and testing
7. **Scalability**: Easy to extend and maintain

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure to import from `@/store` not the old paths
2. **Missing Data**: Call fetch methods in useEffect
3. **Authentication**: Use appropriate login method for user type
4. **Type Errors**: Update types to use new interfaces

### Debug Store State

```typescript
import { debugStores } from '@/store';

// In development, log all store states
debugStores();
```

### Reset Stores (Testing)

```typescript
import { resetAllStores } from '@/store';

// Reset all stores for testing
resetAllStores();
```

## Legacy Support

The old stores are still available as `.legacy.ts` files but will show deprecation warnings. They will be removed in a future version.

To use legacy stores temporarily:
```typescript
import { useAppStore } from '@/store/useAppStore.legacy';
```

## Need Help?

If you encounter issues during migration:

1. Check this migration guide
2. Look at the new store documentation
3. Check the TypeScript errors for guidance
4. Use the debug utilities to inspect store state