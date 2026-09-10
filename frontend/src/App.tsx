import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { MotionConfig } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./context/ThemeContext";
import { queryClient } from "./lib/queryClient";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import { ScrollToTop } from "./components/ui/ScrollToTop";
import { AppRoutes } from "./routes/AppRoutes";

export function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <MotionConfig reducedMotion="user">
          <QueryClientProvider client={queryClient}>
            <BrowserRouter
              future={{
                v7_startTransition: true,
                v7_relativeSplatPath: true,
              }}
            >
              <AdminAuthProvider>
                <ScrollToTop />
                <AppRoutes />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 3500,
                    style: {
                      background: "var(--s2)",
                      color: "var(--t1)",
                      border: "1px solid var(--bd)",
                      borderRadius: "0.75rem",
                      fontSize: "0.875rem",
                    },
                    success: { iconTheme: { primary: "#34d399", secondary: "var(--s2)" } },
                    error: { iconTheme: { primary: "#f87171", secondary: "var(--s2)" } },
                  }}
                />
              </AdminAuthProvider>
            </BrowserRouter>
          </QueryClientProvider>
        </MotionConfig>
      </HelmetProvider>
    </ThemeProvider>
  );
}