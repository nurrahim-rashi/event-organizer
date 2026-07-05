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
import ProtectedRoute from "./routes/ProtectedRoute";
import CreateEvent from "./pages/CreateEvent";
import EditEvent from "./pages/EditEvent";
import OwnerProtectedRoute from "./routes/OwnerProtectedRoute";

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
    path: "/create-event",
    element: (
      <ProtectedRoute>
        <CreateEvent />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-event/:id",
    element: (
      <OwnerProtectedRoute>
        <EditEvent />
      </OwnerProtectedRoute>
    ),
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
  },
  {
    path: "/profile/edit",
    element: <ProfileEdit />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
