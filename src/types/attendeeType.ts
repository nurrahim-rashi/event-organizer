export type Attendee = {
    id: number;
    createdAt: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
};

export type GetEventAttendeesResponse = {
    success: boolean;
    data: Attendee[];
};