import { axiosInstance } from "../../api/axios";
import type { Event } from "../../types/type";
import { useQuery } from "@tanstack/react-query";

interface GetEventsQuery {
  search?: string;
  location?: string;
  category?: string[];
  sortBy?: string;
  price?: number;
  date?: string;
}

export function useGetEvents(params: GetEventsQuery) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get("/events", {
        params: {
          search: params.search,
          location: params.location,
          category: params.category?.join(","),
          sortBy: params.sortBy,
          price: params.price,
          date: params.date,
        },
      });

      if (data && typeof data === "object" && "data" in data) {
        return Array.isArray(data.data) ? data.data : [];
      }
      return Array.isArray(data) ? data : [];
    },
    initialData: [],
  });
}
