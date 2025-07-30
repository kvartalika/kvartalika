# Кварталика - Real Estate Platform

A modern real estate platform built with React, TypeScript, and Tailwind CSS for browsing apartments and residential complexes.

## 🚀 Features

- **Modern UI/UX**: Clean, responsive design built with Tailwind CSS
- **Advanced Search**: Powerful search functionality with filters for price, rooms, finishing, etc.
- **Property Listings**: Browse apartments by categories (1-room, 2-room, 3-room, hot deals)
- **Complex Details**: Detailed pages for residential complexes with amenities and location info
- **Apartment Details**: Comprehensive apartment pages with image galleries and specifications
- **Booking System**: Integrated booking modal for property inspections
- **State Management**: Centralized state management with Zustand
- **API Ready**: Prepared for integration with existing OpenAPI-generated client

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript
- **Styling**: Tailwind CSS 4.x
- **Routing**: React Router DOM 7.x
- **State Management**: Zustand 5.x
- **HTTP Client**: Axios 1.x
- **Build Tool**: Vite 7.x
- **API**: OpenAPI-generated client (existing)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.tsx      # Navigation header
│   ├── Footer.tsx      # Site footer
│   ├── SearchBar.tsx   # Advanced search with filters
│   ├── ApartmentCard.tsx # Apartment listing card
│   ├── BookingModal.tsx # Inspection booking form
│   ├── PageLoader.tsx  # Loading screen
│   └── Logo.tsx        # Company logo component
├── pages/              # Page components
│   ├── HomePage.tsx    # Main landing page
│   ├── ComplexPage.tsx # Residential complex details
│   └── ApartmentPage.tsx # Individual apartment details
├── store/              # State management
│   └── useAppStore.ts  # Zustand store with types
├── services/           # API services
│   └── apiService.ts   # API wrapper for backend integration
├── api/                # Generated API client (existing)
└── App.tsx             # Main app component
```

## 🎨 Design System

### Tailwind v4 Configuration
This project uses **Tailwind CSS v4** with CSS-based configuration using the `@theme` directive in `index.css`:

```css
@theme {
  --font-family-sans: Montserrat, system-ui, ...;
  --color-primary-600: #2563eb;
  --spacing-18: 4.5rem;
  /* ... more custom properties */
}
```

**Important**: In Tailwind v4, use CSS variables directly (`var(--color-primary-600)`) instead of the `theme()` function when referencing theme values in custom CSS.

### Color Palette
- **Primary**: Blue (#2563EB - primary-600)
- **Secondary**: Gray (#6B7280 - secondary-500)
- **Success**: Green (#10B981 - emerald-500)
- **Warning**: Red (#EF4444 - red-500)
- **Background**: Gray (#F9FAFB - gray-50)

### Typography
- **Font Family**: Montserrat (Google Fonts)
- **Headings**: Font weight 700 (bold)
- **Body**: Font weight 400 (normal)
- **Accent**: Font weight 600 (semibold)

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd kvartalika
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
REACT_APP_API_BASE_URL=http://localhost:3000/api
```

### API Integration

The project is prepared for integration with the existing OpenAPI-generated client. To integrate:

1. **Uncomment API imports** in `src/services/apiService.ts`
2. **Configure the API client** with your base URL
3. **Replace mock implementations** with actual API calls
4. **Update types** if needed to match your API schema

Example integration:
```typescript
// In src/services/apiService.ts
import { DefaultApi, Configuration } from '../api';

const apiConfiguration = new Configuration({
  basePath: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api',
});
const apiClient = new DefaultApi(apiConfiguration);

// Replace mock implementation
static async getApartments(): Promise<Apartment[]> {
  const response = await apiClient.getApartments();
  return response.data;
}
```

## 📱 Pages Overview

### 1. Home Page (`/`)
- Hero section with search bar
- Category-based apartment listings (hot deals, 1-room, 2-room, 3-room)
- Company statistics and features
- Call-to-action sections

### 2. Complex Page (`/complex/:complexName`)
- Complex hero with details and booking CTA
- Tabbed interface (Apartments, About, Location)
- Apartment grid with filtering
- Complex amenities and characteristics

### 3. Apartment Page (`/apartment/:apartmentId`)
- Image gallery with navigation
- Detailed specifications and features
- Sticky pricing card with booking CTA
- Mortgage calculator
- Similar apartments section

## 🎯 Key Features

### Advanced Search & Filtering
- Text search by complex name or address
- Price range filtering
- Room count selection
- Finishing type filtering
- Sorting by price, rooms, or area

### Booking System
- Modal-based booking form
- Form validation
- Success/error states
- Integration ready for backend API

### State Management
The Zustand store manages:
- Apartment and complex data
- Search filters and results
- Selected apartment/complex
- Booking form state
- UI state (modals, loading)

### Responsive Design
- Mobile-first approach
- Breakpoint system: `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px)
- Touch-friendly interfaces
- Optimized for all screen sizes

## 🔄 Data Flow

1. **App initialization**: Load apartments and complexes data
2. **Search/Filter**: Update store filters → automatic re-filtering
3. **Navigation**: Update selected apartment/complex in store
4. **Booking**: Form submission → API call → success/error handling

## 🧪 Development

### Code Style
- TypeScript for type safety
- Functional components with hooks
- Tailwind CSS for styling
- ESLint for code quality

### Component Patterns
- Props interfaces for type safety
- Custom hooks for complex logic
- Compound components for complex UI
- Error boundaries for error handling

## 🚀 Deployment

### Build Optimization
- Tree shaking for smaller bundles
- Code splitting by routes
- Image optimization
- CSS purging

### Deployment Platforms
- **Vercel**: Zero-config deployment
- **Netlify**: Static site hosting
- **AWS S3 + CloudFront**: Enterprise hosting

## 📈 Performance

### Optimization Techniques
- Lazy loading of images
- Virtual scrolling for large lists
- Memoization of expensive calculations
- Debounced search inputs

### Core Web Vitals
- **LCP**: < 2.5s (optimized images and fonts)
- **FID**: < 100ms (minimal JavaScript)
- **CLS**: < 0.1 (stable layouts)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@kvartalika.ru or create an issue in the repository.

---

**Built with ❤️ by the Kvartalika Team**