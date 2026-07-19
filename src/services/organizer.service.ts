import { axiosInstance } from "../api/axios";
import { userAuth } from "../stores/useAuth";
import type { Organizer } from "../types/organizer";

axiosInstance.interceptors.request.use((config) => {
  const token = userAuth.getState().user?.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getOrganizerProfile = async (id: string): Promise<Organizer> => {
  try {
    const response = await axiosInstance.get(`/organizers/${id}`);

    const result = response.data.data || response.data;

    return result;
  } catch (error) {
    console.error("Error in getOrganizerProfile:", error);
    throw error;
  }
};
