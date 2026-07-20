import { axiosInstance } from "../api/axios";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop";

export const eventApi = {
  get: (url: string) => axiosInstance.get(url),
  getAll: () => axiosInstance.get("/events"),
  getById: (id: number) => axiosInstance.get(`/events/${id}`),
  create: (data: any) => axiosInstance.post("/events", data),
  update: (id: number, data: any) => axiosInstance.patch(`/events/${id}`, data),
  delete: (id: number) => axiosInstance.delete(`/events/${id}`),
};

const withFallbackImage = (event: any) => {
  return {
    ...event,
    bannerImage:
      event.bannerImage && event.bannerImage.trim() !== ""
        ? event.bannerImage
        : FALLBACK_IMAGE,
  };
};

export const getEvents = async (page: number = 1) => {
  const res = await eventApi.get(`/events?page=${page}&take=8`);
  const data = res.data.data || [];

  return {
    ...res.data,
    data: data.map(withFallbackImage),
  };
};

export const getEvent = async (id: number) => {
  const res = await eventApi.getById(id);
  const data = res.data?.data || res.data;
  return withFallbackImage(data);
};

export const createEvent = async (data: any) => {
  const res = await eventApi.create(data);
  return res.data;
};

export const updateEvent = async (id: number, data: any) => {
  const payload = { ...data };
  if (payload.bannerImage === FALLBACK_IMAGE) {
    delete payload.bannerImage;
  }

  const res = await eventApi.update(id, payload);
  return res.data;
};

export const deleteEvent = async (id: number) => {
  const res = await eventApi.delete(id);
  return res.data;
};

export const uploadPayment = async (
  transactionId: number,
  file: File,
  bank: string,
) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("bank", bank);

  const res = await axiosInstance.patch(
    `/transactions/${transactionId}/payment`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return res.data;
};
