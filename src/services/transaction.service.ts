import { transactionApi } from "../api/transaction.api";

export const createTransaction = async (data: {
  eventId: number;
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
