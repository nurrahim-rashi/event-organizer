import type { TicketType } from "./ticketType";

export interface TransactionItem {
  id: number;
  transactionId: number;
  ticketTypeId: number;
  qty: number;
  price: number;
  ticketType?: TicketType;
}
