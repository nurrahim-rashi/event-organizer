import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";
import OwnerProtectedRoute from "./routes/OwnerProtectedRoute";
import LandingPage from "./pages/LandingPage";
import CreateEventPage from "./pages/CreateEvent";
import EditEventPage from "./pages/EditEvent";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/create-event",
    element: (
      <ProtectedRoute>
        <CreateEventPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/edit-event/:id",
    element: (
      <OwnerProtectedRoute>
        <EditEventPage />
      </OwnerProtectedRoute>
    ),
  },
  {
    path: "*",
    element: (
      <div className="h-screen w-screen bg-[#171021] flex flex-col items-center justify-center text-[#eadef6]">
        <h1 className="text-4xl font-black text-[#ddb7ff] mb-2">404</h1>
        <p className="text-[#cfc2d6]">Page Not Found</p>
        <a href="/" className="mt-4 text-sm text-[#5de6ff] underline">
          Back to Home
        </a>
      </div>
    ),
  },
]);

export default function App() {
  return (
    <main>
      <RouterProvider router={router} />
    </main>
  );
}
