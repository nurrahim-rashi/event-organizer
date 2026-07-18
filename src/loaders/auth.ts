import { userAuth } from "../stores/useAuth";
import { redirect } from "react-router";

const getToken = () => localStorage.getItem("token");

export const authLoader = () => {
  const { user } = userAuth.getState();

  if (!user) {
    return redirect("/login");
  }

  return {};
};

export const userGuardLoader = () => {
  const { user } = userAuth.getState();

  if (!user && !getToken()) {
    return redirect("/login");
  }

  return {};
};

export const adminGuardLoader = () => {
  const { user } = userAuth.getState();

  if (user?.role !== "ADMIN") {
    return redirect("/login");
  }

  return {};
};
