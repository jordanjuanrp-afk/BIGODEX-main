/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Service {
  id: string;
  name: string;
  category: 'hair' | 'beard' | 'combo' | 'treatment';
  price: number;
  duration: number; // in minutes
  description: string;
}

export interface Barber {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  bio: string;
  specialties: string[];
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  text: string;
  date: string;
  reply?: string;
  avatarInitial: string;
  localUser?: boolean;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  serviceName: string;
  barberId: string;
  barberName: string;
  date: string;
  time: string;
  price: number;
  status: 'confirmed' | 'cancelled';
  code: string;
}

export interface PeakHour {
  hour: string;
  level: number; // 0 to 100 representing busy percentage
}
