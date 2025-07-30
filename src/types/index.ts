export interface User {
  id: number;
  name: string;
  surname: string;
  email: string;
  role: 'ADMIN' | 'CM';
}

export interface Apartment {
  id: number;
  name: string;
  address: string;
  description: string;
  numberOfRooms: number;
  numberOfBathrooms: number;
  floor: number;
  price: number;
  area: number;
  latitude: number;
  longitude: number;
  images: string[];
}

export interface Complex {
  id: number;
  name: string;
  address: string;
  description: string;
  yearBuilt: number;
  numberOfFloors: number;
  latitude: number;
  longitude: number;
  images: string[];
  apartments: Apartment[];
}

export interface ContactInfo {
  id: number;
  phone: string;
  email: string;
  footerDescription: string;
  title: string;
  address: string;
  description: string;
  published: boolean;
}

export interface SocialMedia {
  id: number;
  image: string;
  link: string;
}

export interface MainPageContent {
  id: number;
  heroTitle: string;
  heroSubtitle: string;
  heroDescription: string;
  aboutTitle: string;
  aboutDescription: string;
  servicesTitle: string;
  servicesDescription: string;
}

export interface FileItem {
  id: number;
  name: string;
  type: 'file' | 'directory';
  size?: number;
  path: string;
}

export interface DirectoryItem {
  id: number;
  name: string;
  path: string;
}

export type ContentType = 'apartment' | 'complex';

export interface FormData {
  name: string;
  address: string;
  description: string;
  latitude: number;
  longitude: number;
  // Apartment specific fields
  numberOfRooms?: number;
  numberOfBathrooms?: number;
  floor?: number;
  price?: number;
  area?: number;
  // Complex specific fields
  yearBuilt?: number;
  numberOfFloors?: number;
  // Additional fields used in forms
  images?: string[];
  features?: string[];
  hasDecoration?: boolean;
  storesNearby?: boolean;
  schoolsNearby?: boolean;
  hospitalsNearby?: boolean;
  hasYards?: boolean;
  about?: string;
  [key: string]: any; // Allow additional properties
}