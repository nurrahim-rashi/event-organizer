import { createBrowserRouter } from "react-router";
import { authLoader, userGuardLoader, adminGuardLoader } from "./loaders/auth";

export const router = createBrowserRouter([
  {
    path: "/",
    lazy: async () => ({
      Component: (await import("./pages/LandingPage")).default,
    }),
  },
  {
    path: "/events",
    lazy: async () => ({
      Component: (await import("./pages/BrowseEvents")).default,
    }),
  },
  {
    path: "/events/:id",
    lazy: async () => ({
      Component: (await import("./pages/EventDetail")).default,
    }),
  },
  {
    path: "/organizers/:id",
    lazy: async () => ({
      Component: (await import("./pages/OrganizerProfile")).default,
    }),
  },
  {
    path: "/events/create",
    loader: adminGuardLoader,
    lazy: async () => ({
      Component: (await import("./pages/CreateEvent")).default,
    }),
  },
  {
    path: "/events/:id/edit",
    loader: adminGuardLoader,
    lazy: async () => ({
      Component: (await import("./pages/EditEvent")).default,
    }),
  },
  {
    path: "/register",
    lazy: async () => ({
      Component: (await import("./pages/Register")).default,
    }),
  },
  {
    path: "/login",
    lazy: async () => ({ Component: (await import("./pages/Login")).default }),
  },
  {
    path: "/profile",
    loader: authLoader,
    lazy: async () => ({
      Component: (await import("./pages/Profile")).default,
    }),
  },
  {
    path: "/profile/edit",
    loader: authLoader,
    lazy: async () => ({
      Component: (await import("./components/Profile/ProfileEdit")).default,
    }),
  },
  {
    path: "/dashboard",
    loader: authLoader,
    lazy: async () => ({
      Component: (await import("./pages/DashboardPage")).default,
    }),
  },
  {
    path: "/transactions",
    loader: userGuardLoader,
    lazy: async () => ({
      Component: (await import("./pages/TransactionPage")).default,
    }),
  },
  {
    path: "/transactions/checkout",
    loader: userGuardLoader,
    lazy: async () => ({
      Component: (await import("./pages/Checkout")).default,
    }),
  },
  {
    path: "/forgot-password",
    lazy: async () => ({
      Component: (await import("./pages/ForgotPassword")).default,
    }),
  },
  {
    path: "/reset-password/:token",
    lazy: async () => ({
      Component: (await import("./pages/ResetPassword")).default,
    }),
  },
]);
