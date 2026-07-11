import { userAuth } from "../stores/useAuth";
import { redirect } from "react-router";

export const authLoader = () => {
    const {user} = userAuth.getState();

    if (!user) {
        return redirect("/login");
    }

    return {};
};

export const userGuardLoader = () => {
    const {user} = userAuth.getState();

    if (user?.role !== "USER") {
        return redirect("/login")
    }

    return {};
}

export const adminGuardLoader = () => {
    const {user} = userAuth.getState();

    if (user?.role !== "ADMIN") {
        return redirect("/login")
    }

    return {};
}