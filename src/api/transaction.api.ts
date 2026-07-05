import { api } from "./axios";

export const transactionApi = {
  create: (data: {
    eventId: number;
    items: { ticketTypeId: number; qty: number }[];
  }) => api.post("/transactions", data),

  getByEvent: (eventId: number) => api.get(`/transactions/event/${eventId}`),
};
