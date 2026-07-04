export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export type TransactionStatus =
  "WAITING_PAYMENT" | "PAID" | "CANCELLED" | "EXPIRED" | "DONE";

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
  profilePic?: string | null;
  role: Role;
  referralCode: string;
  createdAt: string;
}

export interface TicketType {
  id: number;
  name: string;
  price: number;
  booked: number;
  totalTicket: number;
  eventId: number;
  deletedAt?: string | null;
}

export interface Event {
  id: number;
  name: string;
  description: string;
  location: string;
  category: EventCategory;
  bannerImage: string;
  startDate: string;
  endDate: string;
  organizerId: number;
  organizer?: User;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  ticketTypes?: TicketType[];
  city?: string;
}

export interface EventFormState {
  name: string;
  category: EventCategory | "";
  location: string;
  description: string;
  bannerImage: File | null;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  ticketTypes: {
    name: string;
    price: number;
    totalTicket: number;
  }[];
}
