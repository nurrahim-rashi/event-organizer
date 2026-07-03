import {create} from "zustand";
import {persist} from "zustand/middleware";

interface UserAuth {
    id: number;
    name: string;
    email: string;
    profilePic: string | null;
    role: string;
    accessToken: string;
}

type Store = {
    user: UserAuth | null;
    login: (user: UserAuth) => void;
    logout: () => void;
};

export const userAuth = create<Store>()(
    persist(
        (set) => ({
            user: null,
            login: (user) => set({user: user}),
            logout: () => set({user: null}),
        }),
        {name: "auth"},
    ),
);