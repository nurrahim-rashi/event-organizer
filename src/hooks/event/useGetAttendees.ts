import { useQuery } from "@tanstack/react-query";
import { getEventAttendees } from "../../api/attendees";
import type { GetEventAttendeesResponse } from "../../types/attendeeType";

function useEventAttendees(eventId: number) {
  return useQuery<GetEventAttendeesResponse>({
    queryKey: ["event-attendees", eventId],
    queryFn: () => getEventAttendees(eventId),
    enabled: eventId > 0,
  });
}

export default useEventAttendees;