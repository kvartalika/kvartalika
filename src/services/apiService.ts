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
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
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