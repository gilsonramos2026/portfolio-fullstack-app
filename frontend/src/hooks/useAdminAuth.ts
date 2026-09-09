import { useContext } from "react";
import { AdminAuthContext } from "../context/AdminAuthContext";

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth deve ser usado dentro de <AdminAuthProvider>");
  }
  return ctx;
}
