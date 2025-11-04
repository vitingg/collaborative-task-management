import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./context/query-client";
import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import { App } from "./app";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <App />
    </QueryClientProvider>
  </StrictMode>
);
