# API Services Documentation

This directory contains the axios-based API services for the Kvartalica application, providing a clean interface to interact with the backend API.

## Structure

```
services/
├── api.config.ts      # Axios configuration with bearer token support
├── api.types.ts       # TypeScript types extracted from OpenAPI
├── auth.service.ts    # Authentication services
├── admin.service.ts   # Admin-only operations
├── content.service.ts # Content management operations
├── public.service.ts  # Public API endpoints
├── apiService.ts      # Legacy service (updated to use new services)
├── index.ts          # Main export file
└── README.md         # This file
```

## Setup

1. **Environment Variables**: Create a `.env` file based on `.env.example`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

2. **Import Services**: Import what you need from the services:
   ```typescript
   // Import specific functions
   import { adminLogin, getCategories, createFlat } from '@/services';
   
   // Or import entire services
   import { AuthService, PublicService } from '@/services';
   ```

## API Configuration

The `api.config.ts` file provides:

- **Axios Instance**: Pre-configured with base URL, timeout, and interceptors
- **Bearer Token Management**: Automatic token injection based on endpoint
- **Error Handling**: Global error handling with token refresh logic
- **Token Persistence**: Automatic save/load from localStorage

### Token Management

The API client automatically handles bearer tokens:

- **Admin endpoints** (`/admin/*`): Uses `admin_token`
- **Content endpoints** (`/content/*`): Uses `content_token`
- **Public endpoints**: No authentication required

Tokens are automatically:
- Added to request headers
- Saved to localStorage
- Cleared on 401 errors

## Services Overview

### AuthService

Handles authentication for both admin and content managers:

```typescript
// Admin authentication
const adminAuth = await adminLogin({ username: 'admin', password: 'password' });
await adminRegister({ username: 'admin', email: 'admin@example.com', password: 'password' });

// Content manager authentication
const contentAuth = await contentManagerLogin({ username: 'manager', password: 'password' });

// Token management
logout(); // Clears all tokens
const isAuthenticated = isAdminAuthenticated();
```

### AdminService

Admin-only operations:

```typescript
// Content manager management
const managers = await getContentManagers();
await createContentManager({ username: 'manager', email: 'manager@example.com', password: 'password' });
await updateContentManager('id', { username: 'newname' });
await deleteContentManager('id');

// System operations
const stats = await getDashboardStats();
const logs = await getSystemLogs({ page: 1, limit: 10 });
```

### ContentService

Content management operations (requires content manager authentication):

```typescript
// Categories
await createCategory({ name: 'Apartments', description: 'Apartment listings' });
await updateCategory(1, { name: 'Updated Name' });
await deleteCategory(1);

// Flats
await createFlat({
  title: 'Beautiful Apartment',
  description: 'A lovely 2-bedroom apartment',
  price: 5500000,
  area: 65.5,
  rooms: 2,
  floor: 5,
  homeId: 1
});

// Photos
const photo = await uploadPhoto(file, 'Alt text');
await updatePhoto(1, newFile, 'New alt text');
await deletePhoto(1);

// Bulk operations
await bulkUploadPhotos([file1, file2, file3]);
await bulkDeletePhotos([1, 2, 3]);
```

### PublicService

Public endpoints (no authentication required):

```typescript
// Get data
const categories = await getCategories();
const homes = await getHomes();
const flats = await getFlats();
const footer = await getFooter();

// Get by ID
const home = await getHomeById(1);
const flat = await getFlatById(1);

// Search
const searchResults = await searchHomes({
  query: 'apartment',
  minPrice: 1000000,
  maxPrice: 10000000,
  rooms: [2, 3]
});

// Create requests
await createRequest({
  name: 'John Doe',
  phone: '+1234567890',
  email: 'john@example.com',
  message: 'Interested in apartment',
  flatId: 1
});

// Featured content
const featured = await getFeaturedHomes(5);
const popular = await getPopularFlats(10);
```

## Usage Examples

### Authentication Flow

```typescript
import { adminLogin, isAdminAuthenticated, logout } from '@/services';

// Login
try {
  const auth = await adminLogin({
    username: 'admin',
    password: 'password'
  });
  console.log('Logged in:', auth.user);
} catch (error) {
  console.error('Login failed:', error.message);
}

// Check if authenticated
if (isAdminAuthenticated()) {
  // User is authenticated
}

// Logout
logout();
```

### Content Management

```typescript
import { createHome, uploadPhoto, createFlat } from '@/services';

// Create a new home
const home = await createHome({
  name: 'Green Valley Complex',
  description: 'Modern residential complex',
  address: '123 Main Street',
  amenities: ['Parking', 'Gym', 'Pool']
});

// Upload photos
const photos = await bulkUploadPhotos([photo1, photo2, photo3]);

// Create flats
await createFlat({
  title: 'Luxury Apartment',
  description: 'Spacious 3-bedroom apartment',
  price: 8500000,
  area: 120.5,
  rooms: 3,
  floor: 10,
  homeId: home.id,
  photos: photos.map(p => p.id)
});
```

### Search and Filtering

```typescript
import { searchHomes, getFilterOptions } from '@/services';

// Get available filter options
const filters = await getFilterOptions();

// Perform search
const results = await searchHomes({
  query: 'luxury',
  minPrice: 5000000,
  maxPrice: 15000000,
  rooms: [2, 3, 4],
  minArea: 80,
  maxArea: 200
});
```

## Error Handling

All services include error handling with descriptive messages:

```typescript
try {
  const homes = await getHomes();
} catch (error) {
  // Error is always a string with a descriptive message
  console.error('Failed to load homes:', error.message);
}
```

Common error scenarios:
- **401 Unauthorized**: Token expired/invalid (automatically handled)
- **404 Not Found**: Resource doesn't exist
- **409 Conflict**: Resource already exists
- **400 Bad Request**: Invalid data

## Type Safety

All services are fully typed with TypeScript interfaces:

```typescript
import type { 
  Flat, 
  Home, 
  Category, 
  SearchRequest, 
  ApiResponse 
} from '@/services';

const searchParams: SearchRequest = {
  query: 'apartment',
  minPrice: 1000000,
  rooms: [2, 3]
};

const results: Home[] = await searchHomes(searchParams);
```

## Migration from Legacy API

The `apiService.ts` file has been updated to use the new services while maintaining backward compatibility:

```typescript
// Old usage still works
import { ApiService } from '@/services';
const apartments = await ApiService.getApartments();

// New usage
import { getFlats } from '@/services';
const flats = await getFlats();
```

## Best Practices

1. **Use specific imports** for better tree-shaking:
   ```typescript
   import { getHomes, createFlat } from '@/services';
   ```

2. **Handle errors appropriately**:
   ```typescript
   try {
     const data = await getData();
   } catch (error) {
     showErrorToast(error.message);
   }
   ```

3. **Check authentication status** before protected operations:
   ```typescript
   if (!isAdminAuthenticated()) {
     redirect('/login');
     return;
   }
   ```

4. **Use TypeScript types** for better development experience:
   ```typescript
   const home: Home = await getHomeById(1);
   ```

## Environment Configuration

Configure the API base URL in your environment:

- **Development**: `VITE_API_BASE_URL=http://localhost:8080`
- **Staging**: `VITE_API_BASE_URL=https://staging-api.kvartalica.com`
- **Production**: `VITE_API_BASE_URL=https://api.kvartalica.com`