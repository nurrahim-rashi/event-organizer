import { api } from "../api/axios";

export const transactionApi = {
  create: (data: {
    eventId: number;
    items: { ticketTypeId: number; qty: number }[];
  }) => api.post("/transactions/checkout", data),

  getByEvent: (eventId: number) => api.get(`/transactions/event/${eventId}`),
};

export const createTransaction = async (data: {
  eventId: number;
  voucherId?: number;
  items: { ticketTypeId: number; qty: number }[];
}) => {
  const res = await transactionApi.create(data);
  return res.data;
};

export const getTransactionsByEvent = async (eventId: number) => {
  try {
    const res = await transactionApi.getByEvent(eventId);
    return res.data?.data || [];
  } catch (error) {
    console.error("Error fetching event transactions:", error);
    return [];
  }
};

export const updateTransactionStatus = async (
  transactionId: number,
  newStatus: "DONE" | "CANCELLED",
  token: string,
) => {
  const response = await api.patch(
    `/transactions/${transactionId}/status`,
    {newStatus},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};