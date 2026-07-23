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

export const createEvent = async (data: any, file: File) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (key === "ticketTypes" || key === "vouchers") {
      formData.append(key, JSON.stringify(data[key]));
    } else {
      formData.append(key, data[key]);
    }
  });
  formData.append("file", file);

  // Hapus manual Content-Type agar browser menangani boundary-nya
  const res = await axiosInstance.post("/events", formData);
  return res.data;
};

export const updateEvent = async (id: number, data: any, file?: File) => {
  const formData = new FormData();

  Object.keys(data).forEach((key) => {
    if (data[key] !== undefined && data[key] !== null) {
      if (typeof data[key] === "object" && !(data[key] instanceof File)) {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
  });

  if (file) {
    formData.append("file", file); // Key harus "file"
  }

  // Gunakan PATCH sesuai dengan route di backend
  const res = await axiosInstance.patch(`/events/${id}`, formData);
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
