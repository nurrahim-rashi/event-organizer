import { api } from "../api/axios";

export const eventApi = {
  getAll: () => api.get("/events"),
  getById: (id: number) => api.get(`/events/${id}`),
  create: (data: any) => api.post("/events", data),
  update: (id: number, data: any) => api.patch(`/events/${id}`, data),
  delete: (id: number) => api.delete(`/events/${id}`),
};

export const getEvents = async () => {
  const res = await eventApi.getAll();
  return res.data;
};

export const getEvent = async (id: number) => {
  const res = await eventApi.getById(id);
  if (res.data && res.data.data) {
    return res.data.data;
  }
  return res.data;
};

export const createEvent = async (data: any) => {
  const res = await eventApi.create(data);
  return res.data;
};

export const updateEvent = async (id: number, data: any) => {
  const res = await eventApi.update(id, data);
  return res.data;
};

export const deleteEvent = async (id: number) => {
  const res = await eventApi.delete(id);
  return res.data;
};
