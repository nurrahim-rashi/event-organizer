export type TicketName = "GOLD" | "SILVER" | "BRONZE" | "  EARLY_BIRD";

export interface TicketType {
  id: number;
  name: TicketName;
  price: number;
  booked: number;
  totalTicket: number;
  eventId: number;
  deletedAt?: string | null;
}
