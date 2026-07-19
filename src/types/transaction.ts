import type { TransactionItem } from "./transactionItem";

export type TransactionStatus =
  | "WAITING_PAYMENT"
  | "CANCELLED"
  | "EXPIRED"
  | "DONE"
  | "REJECTED"
  | "WAITING_CONFIRMATION";

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
