export type EventCategory =
  | "MUSIC"
  | "SPORTS"
  | "BUSINESS"
  | "EDUCATION"
  | "TECHNOLOGY"
  | "FOOD"
  | "ART"
  | "HEALTH"
  | "OTHER";

export interface TicketType {
  id: number;
  name: string;
  price: number;
}

export interface EventData {
  id?: number;
  title: string;
  category: string;
  capacity: number;
  location: string;
  description: string;
  mediaUrl?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isPaid: boolean;
  price: number;
  organizerId: number;
}

export interface EventFormState {
  name: string;
  category: string;
  capacity: number;
  location: string;
  description: string;
  bannerImage: File | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isPaid: boolean;
  price: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}
