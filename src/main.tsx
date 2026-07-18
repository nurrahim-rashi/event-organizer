import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import Register from "./pages/Register";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProfileEdit from "./components/Profile/ProfileEdit";
import EventDetail from "./pages/EventDetail";
import BrowseEvents from "./pages/BrowseEvents";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import OrganizerProfile from "./pages/OrganizerProfile";
import DashboardPage from "./pages/DashboardPage";
// import EventStatistics from "./components/Profile/EventStatistics";
import CheckoutPage from "./pages/Checkout";
import { authLoader, userGuardLoader, adminGuardLoader } from "./loaders/auth";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/events",
    element: <BrowseEvents />,
  },
  {
    path: "/events/:id",
    element: <EventDetail />,
  },
  {
    path: "/organizers/:id",
    element: <OrganizerProfile />,
  },
  {
    path: "/events/create",
    element: <CreateEvent />,
    loader: adminGuardLoader,
  },
  {
    path: "/events/:id/edit",
    element: <EditEvent />,
    loader: adminGuardLoader,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/profile",
    element: <Profile />,
    loader: authLoader,
  },
  {
    path: "/profile/edit",
    element: <ProfileEdit />,
    loader: authLoader,
  },
  {
    path: "/dashboard",
    element: <DashboardPage />,
    loader: authLoader,
  },
  {
    path: "/transactions/checkout",
    element: <CheckoutPage />,
    loader: userGuardLoader,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password/:token",
    element: <ResetPassword />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
);
