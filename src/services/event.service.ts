import { api } from "../api/axios";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000&auto=format&fit=crop";

export const eventApi = {
  getAll: () => api.get("/events"),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post("/events", data),
  update: (id: number, data: any) => api.patch(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
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

export const getEvents = async () => {
  const res = await eventApi.getAll();
  const events = Array.isArray(res.data) ? res.data : res.data.data || [];

  return events.map(withFallbackImage);
};

export const getEvent = async (id: number) => {
  const res = await eventApi.getById(id);
  const data = res.data?.data || res.data;
  // Memastikan satu event punya gambar
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
