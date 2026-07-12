import { create } from "zustand";

interface CheckoutStore {
  selectedEvent: any | null; // Ganti 'any' dengan interface Event jika sudah ada
  selectedTicket: any | null; // Ganti 'any' dengan interface Ticket jika sudah ada
  transaction: any | null; // Tambahkan ini agar bisa dipakai di OrderSummary
  setCheckoutData: (event: any, ticket: any, transaction: any) => void;
  clearCheckoutData: () => void;
}

export const useCheckoutStore = create<CheckoutStore>((set) => ({
  selectedEvent: null,
  selectedTicket: null,
  transaction: null,
  setCheckoutData: (event, ticket, transaction) =>
    set({ selectedEvent: event, selectedTicket: ticket, transaction }),
  clearCheckoutData: () =>
    set({ selectedEvent: null, selectedTicket: null, transaction: null }),
}));
