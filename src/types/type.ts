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

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface Organizer {
  id: number;
  name: string;
  logo: string;
  rating: number;
  reviewsCount: string;
  bio: string;
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  description: string;
  isAvailable: boolean;
}

export interface Event {
  id: number;
  title: string;
  category: EventCategory;
  capacity: number;
  location: string;
  city: string;
  description: string;
  mediaUrl?: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isPaid: boolean;
  price: number;
  organizerId: number;
  isTrending?: boolean;
  ticketsLeft?: number;
  perks?: string[];
  accessibilityDesc?: string;
  parkingDesc?: string;
  serviceFeeFixed?: number;
  tickets?: TicketType[];
  organizer?: Organizer;
}

export interface EventFormState {
  name: string;
  category: EventCategory | "";
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
