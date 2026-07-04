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
  id: number;
  name: string;
  description: string;
  location: string;
  category: EventCategory;
  bannerImage: string;
  startDate: string;
  endDate: string;
  organizerId: number;
  createdAt: string;
  updatedAt: string;
  ticketTypes?: TicketType[];
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
