import { eventApi } from "../../api/event.api";

export const getEvents = async () => {
  const res = await eventApi.getAll();
  return res.data;
};

export const getEvent = async (id: number) => {
  const res = await eventApi.getById(id);
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
