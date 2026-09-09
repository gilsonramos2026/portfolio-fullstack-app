import { Outlet } from "react-router-dom";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";

export function PublicLayout() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />
      <main className="flex-1 pt-14 sm:pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
