import { api } from "./axios";

export const eventApi = {
  getAll: () => api.get("/events"),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post("/events", data),
  update: (id: number, data: any) => api.patch(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};
