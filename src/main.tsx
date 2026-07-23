import React from "react";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NuqsAdapter } from "nuqs/adapters/react";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { router } from "./router";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      {" "}
      <NuqsAdapter>
        <RouterProvider router={router} />
        <Toaster />{" "}
      </NuqsAdapter>
    </QueryClientProvider>
  </React.StrictMode>,
);
