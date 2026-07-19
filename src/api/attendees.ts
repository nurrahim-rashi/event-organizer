import { axiosInstance } from "./axios";

export const getEventAttendees = async (eventId: number) => {
    const response = await axiosInstance.get(
        `/events/${eventId}/attendees`
    );

    return response.data;
};