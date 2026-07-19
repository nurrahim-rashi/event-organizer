import { axiosInstance } from "../api/axios";

export const transactionApi = {
  create: (data: {
    eventId: number;
    items: { ticketTypeId: number; qty: number }[];
    voucherId?: number;
    couponId?: number;
    usePoints?: number;
  }) => axiosInstance.post("/transactions/checkout", data),
  cancel: (id: number) => axiosInstance.patch(`/transactions/${id}/cancel`),
  getActive: () => axiosInstance.get("/transactions/checkout"),
  getAll: () => axiosInstance.get("/transactions"),
  getById: (id: number) => axiosInstance.get(`/transactions/${id}`),
  getByEvent: (eventId: number) =>
    axiosInstance.get(`/transactions/event/${eventId}`),
  uploadPayment: (id: number, file: File) => {
    const formData = new FormData();
    formData.append("paymentProof", file);
    return axiosInstance.patch(`/transactions/${id}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
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
  newStatus: "DONE" | "REJECTED",
  token: string,
) => {
  const response = await axiosInstance.patch(
    `/transactions/${transactionId}/status`,
    { newStatus },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};
