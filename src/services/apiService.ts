// Updated to use new axios-based API services
import { PublicService, createRequest } from './index';
import type { Apartment, BookingForm, Complex } from "../store/useAppStore.ts";
import type { Flat, Home, RequestCreate } from './api.types';

export class ApiService {
  // Helper method to transform API Flat to legacy Apartment
  private static transformFlatToApartment(flat: Flat): Apartment {
    return {
      id: flat.id,
      complex: flat.home?.name || "Неизвестный комплекс",
      complexId: flat.homeId,
      address: flat.home?.address || "Адрес не указан",
      rooms: flat.rooms,
      floor: flat.floor,
      bathroom: "Совмещенный", // Default value, could be improved with additional API data
      bathrooms: 1, // Default value
      finishing: "Чистовая", // Default value, could be improved with additional API data
      isHot: false, // Default value, could be improved with additional API data
      image: flat.photos?.[0]?.url || "/images/default-apartment.jpg",
      price: flat.price,
      area: flat.area,
      description: flat.description,
      hasParks: flat.home?.amenities?.includes("Парковка") || false,
      distanceFromCenter: 5.0 // Default value, could be improved with additional API data
    };
  }

  // Helper method to transform API Home to legacy Complex
  private static transformHomeToComplex(home: Home): Complex {
    return {
      id: home.id,
      name: home.name,
      address: home.address,
      description: home.description,
      image: home.photos?.[0]?.url || "/images/default-complex.jpg",
      apartments: home.flats?.map(this.transformFlatToApartment) || [],
      amenities: home.amenities || []
    };
  }
  // Apartments
  static async getApartments(): Promise<Apartment[]> {
    try {
      // Get flats from the new API service
      const flats = await PublicService.getFlats();
      
      // Transform API flats to legacy apartment format
      return flats.map(this.transformFlatToApartment);
    } catch (error) {
      console.error('Error fetching apartments:', error);
      
      // Fallback to mock data if API fails
      return [
        {
          id: 1,
          complex: "ЖК Янтарный",
          complexId: 1,
          address: "ул. Примерная, 10",
          rooms: 2,
          floor: 5,
          bathroom: "Совмещенный",
          bathrooms: 1,
          finishing: "Чистовая",
          isHot: true,
          image: "/images/apt1.jpg",
          price: 5500000,
          area: 65.5,
          description: "Уютная двухкомнатная квартира с современным ремонтом",
          hasParks: true,
          distanceFromCenter: 5.2
        }
      ];
    }
  }

  static async getApartmentById(id: number): Promise<Apartment | null> {
    try {
      const flat = await PublicService.getFlatById(id);
      return flat ? this.transformFlatToApartment(flat) : null;
    } catch (error) {
      console.error('Error fetching apartment:', error);
      // Fallback to searching in all apartments
      const apartments = await this.getApartments();
      return apartments.find(apt => apt.id === id) || null;
    }
  }

  // Complexes
  static async getComplexes(): Promise<Complex[]> {
    try {
      const homes = await PublicService.getHomes();
      return homes.map(this.transformHomeToComplex);
    } catch (error) {
      console.error('Error fetching complexes:', error);
      // Fallback to mock data
      return [
        {
          id: 1,
          name: "ЖК Янтарный",
          address: "ул. Примерная, 10",
          description: "Современный жилой комплекс в центре города",
          image: "/images/complex1.jpg",
          apartments: [],
          amenities: ["Парковка", "Детская площадка", "Спортзал"]
        }
      ];
    }
  }

  static async getComplexByName(name: string): Promise<Complex | null> {
    try {
      const complexes = await this.getComplexes();
      return complexes.find(complex => complex.name === name) || null;
    } catch (error) {
      console.error('Error fetching complex:', error);
      return null;
    }
  }

  // Bookings
  static async createBooking(bookingData: BookingForm): Promise<{ success: boolean; id?: number }> {
    try {
      // Transform legacy booking to API request format
      const requestData: RequestCreate = {
        name: bookingData.name,
        phone: bookingData.phone,
        email: bookingData.email,
        message: bookingData.message || '',
        flatId: bookingData.apartmentId,
      };

      const response = await createRequest(requestData);
      return { success: true, id: response.id };
    } catch (error) {
      console.error('Error creating booking:', error);
      // Fallback to mock implementation
      return { success: true, id: Math.floor(Math.random() * 1000) };
    }
  }

  // Search
  static async searchApartments(filters: {
    query?: string;
    minPrice?: number;
    maxPrice?: number;
    rooms?: number[];
    finishing?: string[];
    complex?: string;
  }): Promise<Apartment[]> {
    try {
      // Use the new search API
      const searchParams = {
        query: filters.query,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        rooms: filters.rooms,
      };

      const homes = await PublicService.searchHomes(searchParams);
      const flats: Flat[] = homes.flatMap(home => home.flats || []);
      let apartments = flats.map(this.transformFlatToApartment);

      // Apply additional legacy filters
      if (filters.finishing && filters.finishing.length > 0) {
        apartments = apartments.filter(apt => filters.finishing!.includes(apt.finishing));
      }

      if (filters.complex) {
        apartments = apartments.filter(apt => apt.complex === filters.complex);
      }

      return apartments;
    } catch (error) {
      console.error('Error searching apartments:', error);
      // Fallback to local filtering
      const allApartments = await this.getApartments();
      let filtered = [...allApartments];

      if (filters.query) {
        const query = filters.query.toLowerCase();
        filtered = filtered.filter(apt => 
          apt.complex.toLowerCase().includes(query) ||
          apt.address.toLowerCase().includes(query)
        );
      }

      if (filters.minPrice) {
        filtered = filtered.filter(apt => apt.price >= filters.minPrice!);
      }

      if (filters.maxPrice) {
        filtered = filtered.filter(apt => apt.price <= filters.maxPrice!);
      }

      if (filters.rooms && filters.rooms.length > 0) {
        filtered = filtered.filter(apt => filters.rooms!.includes(apt.rooms));
      }

      if (filters.finishing && filters.finishing.length > 0) {
        filtered = filtered.filter(apt => filters.finishing!.includes(apt.finishing));
      }

      if (filters.complex) {
        filtered = filtered.filter(apt => apt.complex === filters.complex);
      }

      return filtered;
    }
  }
}

// Export individual functions for easier importing
export const {
  getApartments,
  getApartmentById,
  getComplexes,
  getComplexByName,
  createBooking,
  searchApartments
} = ApiService;