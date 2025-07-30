import { useAuthStore } from '../store/useAuthStore';

const getAuthHeaders = () => {
  const token = localStorage.getItem('auth-storage') ? 
    JSON.parse(localStorage.getItem('auth-storage')!).state.accessToken : null;
  
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

export const contentApi = {
  // Get all apartments
  getApartments: async () => {
    try {
      const response = await fetch('/api/content/apartments');
      if (!response.ok) {
        throw new Error('Failed to fetch apartments');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching apartments:', error);
      throw error;
    }
  },

  // Get apartment by ID
  getApartment: async (id: number) => {
    try {
      const response = await fetch(`/api/content/apartments/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch apartment');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching apartment:', error);
      throw error;
    }
  },

  // Update apartment
  updateApartment: async (id: number, data: any) => {
    try {
      const response = await fetch(`/api/content/apartments/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update apartment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating apartment:', error);
      throw error;
    }
  },

  // Create apartment
  createApartment: async (data: any) => {
    try {
      const response = await fetch('/api/content/apartments', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create apartment');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating apartment:', error);
      throw error;
    }
  },

  // Delete apartment
  deleteApartment: async (id: number) => {
    try {
      const response = await fetch(`/api/content/apartments/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete apartment');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting apartment:', error);
      throw error;
    }
  },

  // Get all complexes
  getComplexes: async () => {
    try {
      const response = await fetch('/api/content/complexes');
      if (!response.ok) {
        throw new Error('Failed to fetch complexes');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching complexes:', error);
      throw error;
    }
  },

  // Get complex by ID
  getComplex: async (id: number) => {
    try {
      const response = await fetch(`/api/content/complexes/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch complex');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching complex:', error);
      throw error;
    }
  },

  // Update complex
  updateComplex: async (id: number, data: any) => {
    try {
      const response = await fetch(`/api/content/complexes/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update complex');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating complex:', error);
      throw error;
    }
  },

  // Create complex
  createComplex: async (data: any) => {
    try {
      const response = await fetch('/api/content/complexes', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create complex');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating complex:', error);
      throw error;
    }
  },

  // Delete complex
  deleteComplex: async (id: number) => {
    try {
      const response = await fetch(`/api/content/complexes/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete complex');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting complex:', error);
      throw error;
    }
  },

  // Get categories
  getCategories: async () => {
    try {
      const response = await fetch('/api/content/categories');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Get contact information
  getContactInfo: async () => {
    try {
      const response = await fetch('/api/content/contact');
      if (!response.ok) {
        throw new Error('Failed to fetch contact info');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching contact info:', error);
      throw error;
    }
  },

  // Update contact information
  updateContactInfo: async (data: any) => {
    try {
      const response = await fetch('/api/content/contact', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update contact info');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating contact info:', error);
      throw error;
    }
  },

  // Get main page content
  getMainPageContent: async () => {
    try {
      const response = await fetch('/api/content/main-page');
      if (!response.ok) {
        throw new Error('Failed to fetch main page content');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching main page content:', error);
      throw error;
    }
  },

  // Update main page content
  updateMainPageContent: async (data: any) => {
    try {
      const response = await fetch('/api/content/main-page', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update main page content');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating main page content:', error);
      throw error;
    }
  },

  // Social Media endpoints
  getSocialMedia: async () => {
    try {
      const response = await fetch('/api/content/social-media');
      if (!response.ok) {
        throw new Error('Failed to fetch social media');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching social media:', error);
      throw error;
    }
  },

  addSocialMedia: async (data: { image: string; link: string }) => {
    try {
      const response = await fetch('/api/content/social-media', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to add social media');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error adding social media:', error);
      throw error;
    }
  },

  updateSocialMedia: async (id: number, data: Partial<{ image: string; link: string }>) => {
    try {
      const response = await fetch(`/api/content/social-media/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update social media');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating social media:', error);
      throw error;
    }
  },

  deleteSocialMedia: async (id: number) => {
    try {
      const response = await fetch(`/api/content/social-media/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete social media');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting social media:', error);
      throw error;
    }
  }
};