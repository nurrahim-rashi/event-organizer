import { axiosInstance } from "../../api/axios";
import type { Event } from "../../types/event";
import type { PageableResponse } from "../../types/pagination";
import { useQuery } from "@tanstack/react-query";

interface GetEventsQuery {
  page: number;
  search?: string;
  location?: string;
  category?: string;
  sortBy?: string;
  sortOrder?: string;
}

export function useGetEvents(params: GetEventsQuery) {
  return useQuery({
    queryKey: ["events", params],
    queryFn: async () => {
      const { data } = await axiosInstance.get<PageableResponse<Event>>(
        "/events",
        {
          params: {
            page: params.page,
            search: params.search,
            location: params.location,
            category: params.category,
            sortBy: params.sortBy,
            sortOrder: params.sortOrder,
          },
        },
      );
      return data;
    },
  });
}
