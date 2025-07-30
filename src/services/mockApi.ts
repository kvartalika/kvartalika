// Mock API for testing purposes
// In a real application, this would be replaced with actual API calls

interface SocialMedia {
  id: number;
  image: string;
  link: string;
}

const mockUsers = [
  {
    id: 1,
    name: "Admin",
    surname: "User",
    patronymic: "Adminovich",
    email: "admin@example.com",
    phone: "+7 (999) 123-45-67",
    role: "ADMIN" as const,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Content",
    surname: "Manager",
    patronymic: "Contentovich",
    email: "cm@example.com",
    phone: "+7 (999) 234-56-78",
    role: "CM" as const,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

const mockApartments = [
  {
    id: 1,
    name: "2-комнатная квартира",
    description: "Уютная двухкомнатная квартира с современным ремонтом",
    images: ["/images/test.png", "/images/test.png", "/images/test.png"],
    layout: "varchar",
    address: "ул. Примерная, 10",
    price: 5500000,
    latitude: 55.7558,
    longitude: 37.6176,
    features: ["Панорамные окна", "Высокие потолки", "Балкон"],
    numberOfRooms: 2,
    homeId: 1,
    numberOfBathrooms: 1,
    hasDecoration: true,
    numberForSale: 1,
    area: 65.5,
    about: "Отличная квартира в тихом районе",
    floor: 5,
    categoryId: 1
  },
  {
    id: 2,
    name: "3-комнатная квартира",
    description: "Просторная трёхкомнатная квартира с панорамными окнами",
    images: ["/images/test.png", "/images/test.png", "/images/test.png"],
    layout: "varchar",
    address: "ул. Примерная, 10",
    price: 7800000,
    latitude: 55.7558,
    longitude: 37.6176,
    features: ["Панорамные окна", "Высокие потолки", "Лоджия"],
    numberOfRooms: 3,
    homeId: 1,
    numberOfBathrooms: 2,
    hasDecoration: false,
    numberForSale: 1,
    area: 85.2,
    about: "Просторная квартира для большой семьи",
    floor: 8,
    categoryId: 1
  }
];

const mockComplexes = [
  {
    id: 1,
    name: "ЖК Янтарный",
    description: "Современный жилой комплекс с развитой инфраструктурой",
    image: "/images/test.png",
    address: "ул. Примерная, 10",
    latitude: 55.7558,
    longitude: 37.6176,
    yearBuilt: 2022,
    history: ["Начало строительства", "Фундаментные работы", "Сдача в эксплуатацию"],
    historyImages: ["/images/test.png", "/images/test.png"],
    features: ["Подземная парковка", "Детская площадка", "Спортивная зона"],
    about: "Жилой комплекс премиум-класса",
    numberOfFloors: 25,
    storesNearby: true,
    schoolsNearby: true,
    hospitalsNearby: false,
    hasYards: true,
    yardsImages: ["/images/test.png", "/images/test.png"]
  }
];

const mockContactInfo = {
  id: 1,
  phone: "+7 (999) 123-45-67",
  email: "info@kvartalika.ru",
  footerDescription: "Ваш надежный партнер в сфере недвижимости",
  title: "Кварталика - недвижимость",
  address: "г. Москва, ул. Примерная, 1",
  description: "Профессиональные услуги в сфере недвижимости",
  published: true
};

const mockSocialMedia = [
  {
    id: 1,
    image: "/images/telegram-icon.png",
    link: "https://t.me/kvartalika"
  },
  {
    id: 2,
    image: "/images/vk-icon.png",
    link: "https://vk.com/kvartalika"
  },
  {
    id: 3,
    image: "/images/whatsapp-icon.png",
    link: "https://wa.me/79991234567"
  }
];

const mockMainPageContent = {
  id: 1,
  name: "Главная страница",
  isOnMainPage: true
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockApi = {
  // Authentication
  login: async (email: string, password: string) => {
    await delay(1000);
    
    const user = mockUsers.find(u => u.email === email);
    if (!user || password !== 'password') {
      throw new Error('Invalid credentials');
    }

    // In a real application, the server would set the refresh token as an HTTP-only cookie
    // For mock purposes, we'll simulate this behavior
    const accessToken = 'mock-access-token-' + user.id;
    
    // Simulate setting HTTP-only cookie (in real app, server would do this)
    document.cookie = `refreshToken=mock-refresh-token-${user.id}; path=/; secure; samesite=strict`;

    return {
      user,
      accessToken
    };
  },

  refreshToken: async () => {
    await delay(500);
    
    // Get refresh token from HTTP-only cookie
    const cookies = document.cookie.split(';');
    const refreshTokenCookie = cookies.find(cookie => cookie.trim().startsWith('refreshToken='));
    
    if (!refreshTokenCookie) {
      throw new Error('No refresh token available');
    }
    
    const refreshToken = refreshTokenCookie.split('=')[1];
    const userId = refreshToken.split('-').pop();
    const user = mockUsers.find(u => u.id === parseInt(userId || '0'));
    
    if (!user) {
      throw new Error('Invalid refresh token');
    }

    // Generate new access token
    const newAccessToken = 'mock-access-token-' + user.id + '-' + Date.now();
    
    // In a real application, the server would set a new refresh token as an HTTP-only cookie
    document.cookie = `refreshToken=mock-refresh-token-${user.id}-${Date.now()}; path=/; secure; samesite=strict`;

    return {
      accessToken: newAccessToken
    };
  },

  logout: async () => {
    await delay(300);
    
    // Clear the refresh token cookie
    document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    
    return true;
  },

  // Admin endpoints
  getUsers: async () => {
    await delay(500);
    return mockUsers;
  },

  createUser: async (userData: any) => {
    await delay(1000);
    const newUser = {
      id: mockUsers.length + 1,
      ...userData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockUsers.push(newUser);
    return newUser;
  },

  deleteUser: async (userId: number) => {
    await delay(500);
    const index = mockUsers.findIndex(u => u.id === userId);
    if (index === -1) {
      throw new Error('User not found');
    }
    mockUsers.splice(index, 1);
    return true;
  },

  // File management
  getFiles: async () => {
    await delay(500);
    return {
      files: [
        { id: 1, name: 'document.pdf', path: '/', size: 1024000, type: 'application/pdf', createdAt: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'image.jpg', path: '/', size: 2048000, type: 'image/jpeg', createdAt: '2024-01-01T00:00:00Z' }
      ],
      directories: [
        { id: 1, name: 'images', path: '/', createdAt: '2024-01-01T00:00:00Z' },
        { id: 2, name: 'documents', path: '/', createdAt: '2024-01-01T00:00:00Z' }
      ]
    };
  },

  uploadFile: async (file: File, path: string) => {
    await delay(2000);
    return { id: Date.now(), name: file.name, path, size: file.size, type: file.type, createdAt: new Date().toISOString() };
  },

  deleteFile: async () => {
    await delay(500);
    return true;
  },

  createDirectory: async (name: string, path: string) => {
    await delay(1000);
    return { id: Date.now(), name, path, createdAt: new Date().toISOString() };
  },

  deleteDirectory: async () => {
    await delay(500);
    return true;
  },

  // Content management
  getApartments: async () => {
    await delay(500);
    return mockApartments;
  },

  getApartment: async (id: number) => {
    await delay(500);
    const apartment = mockApartments.find(a => a.id === id);
    if (!apartment) {
      throw new Error('Apartment not found');
    }
    return apartment;
  },

  updateApartment: async (id: number, data: any) => {
    await delay(1000);
    const index = mockApartments.findIndex(a => a.id === id);
    if (index === -1) {
      throw new Error('Apartment not found');
    }
    mockApartments[index] = { ...mockApartments[index], ...data };
    return mockApartments[index];
  },

  getComplexes: async () => {
    await delay(500);
    return mockComplexes;
  },

  getComplex: async (id: number) => {
    await delay(500);
    const complex = mockComplexes.find(c => c.id === id);
    if (!complex) {
      throw new Error('Complex not found');
    }
    return complex;
  },

  updateComplex: async (id: number, data: any) => {
    await delay(1000);
    const index = mockComplexes.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Complex not found');
    }
    mockComplexes[index] = { ...mockComplexes[index], ...data };
    return mockComplexes[index];
  },

  getContactInfo: async () => {
    await delay(500);
    return mockContactInfo;
  },

  updateContactInfo: async (data: any) => {
    await delay(1000);
    Object.assign(mockContactInfo, data);
    return mockContactInfo;
  },

  getMainPageContent: async () => {
    await delay(500);
    return mockMainPageContent;
  },

  updateMainPageContent: async (data: any) => {
    await delay(1000);
    Object.assign(mockMainPageContent, data);
    return mockMainPageContent;
  },

  // Social Media endpoints
  getSocialMedia: async () => {
    await delay(500);
    return mockSocialMedia;
  },

  addSocialMedia: async (data: Omit<SocialMedia, 'id'>) => {
    await delay(1000);
    const newSocialMedia = {
      id: Date.now(),
      ...data
    };
    mockSocialMedia.push(newSocialMedia);
    return newSocialMedia;
  },

  updateSocialMedia: async (id: number, data: Partial<SocialMedia>) => {
    await delay(1000);
    const index = mockSocialMedia.findIndex(sm => sm.id === id);
    if (index === -1) {
      throw new Error('Social media item not found');
    }
    mockSocialMedia[index] = { ...mockSocialMedia[index], ...data };
    return mockSocialMedia[index];
  },

  deleteSocialMedia: async (id: number) => {
    await delay(500);
    const index = mockSocialMedia.findIndex(sm => sm.id === id);
    if (index === -1) {
      throw new Error('Social media item not found');
    }
    mockSocialMedia.splice(index, 1);
    return true;
  }
};