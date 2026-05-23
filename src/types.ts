/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type MotorcycleCategory = 'sport' | 'cruiser' | 'adventure' | 'scooter' | 'naked';

export interface Motorcycle {
  id: string;
  nameAr: string;
  nameEn: string;
  brandAr: string;
  brandEn: string;
  category: MotorcycleCategory;
  price: number; // in SAR (ر.س)
  condition: 'new' | 'used';
  year: number;
  mileage: number; // in km
  engineSize: number; // in CC
  power: number; // in HP
  weight: number; // in kg
  fuelCapacity: number; // in Liters
  colorAr: string;
  colorEn: string;
  image: string;
  descriptionAr: string;
  descriptionEn: string;
  keySpecsAr: string[];
  keySpecsEn: string[];
  featured: boolean;
  qty: number;
}

export interface FilterState {
  category: MotorcycleCategory | 'all';
  brand: string | 'all';
  condition: 'all' | 'new' | 'used';
  minPrice: number;
  maxPrice: number;
  searchQuery: string;
  sortBy: 'price_asc' | 'price_desc' | 'year_desc' | 'cc_desc';
}

export interface Inquiry {
  id: string;
  bikeId: string;
  bikeName: string;
  clientName: string;
  phone: string;
  email: string;
  type: 'buy' | 'test_drive' | 'finance';
  notes: string;
  createdAt: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}
