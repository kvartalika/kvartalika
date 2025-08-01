import type {UserRole} from "./unified";

export interface User {
  id: number;
  name: string;
  surname: string;
  patronymic?: string;
  email: string;
  phone?: string;
  createdAt?: string;
  updatedAt?: string;
  role: UserRole;
  telegramId?: string;
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

  numberOfRooms?: number;
  numberOfBathrooms?: number;
  floor?: number;
  price?: number;
  area?: number;

  yearBuilt?: number;
  numberOfFloors?: number;

  images?: string[];
  features?: string[];
  hasDecoration?: boolean;
  storesNearby?: boolean;
  schoolsNearby?: boolean;
  hospitalsNearby?: boolean;
  hasYards?: boolean;
  about?: string;
}