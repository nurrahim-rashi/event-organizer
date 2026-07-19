export type Role = "USER" | "ADMIN" | "SUPERADMIN";

export type TransactionStatus =
  | "WAITING_PAYMENT"
  | "CANCELLED"
  | "EXPIRED"
  | "DONE"
  | "REJECTED"
  | "WAITING_CONFIRMATION";

export type TicketName = "GOLD" | "SILVER" | "BRONZE" | "  EARLY_BIRD";

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
  name: TicketName;
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

export interface TransactionItem {
  id: number;
  transactionId: number;
  ticketTypeId: number;
  qty: number;
  price: number;
  ticketType?: TicketType;
}

export interface Transaction {
  id: number;
  userId: number;
  eventId: number;
  status: TransactionStatus;
  totalPrice: number;
  createdAt: string;
  items: TransactionItem[];
  event: {
    name: string;
  };
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    name: string;
    profilePic?: string | null;
  };
  transaction: {
    event: {
      name: string;
    };
  };
}

export interface Organizer {
  organizer: User;
  bio?: string;
  eventsCount: number;
  followersCount: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    stars: number;
    percentage: number;
  }[];
  reviews: Review[];
  organizedEvents: Event;
}
