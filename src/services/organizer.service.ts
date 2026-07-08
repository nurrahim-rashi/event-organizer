import { api } from "../api/axios";
import { userAuth } from "../stores/useAuth";
import type { Organizer } from "../types/type";

api.interceptors.request.use((config) => {
  const token = userAuth.getState().user?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getOrganizerProfile = async (id: string): Promise<Organizer> => {
  const response = await api.get(`/organizers/${id}`);
  return response.data;
};
