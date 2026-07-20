import type { TicketType } from "./ticketType";
import type { User } from "./user";

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
}
