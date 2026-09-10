import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ADMIN_TOKEN_STORAGE_KEY, apiClient } from "../services/apiClient";

interface AdminAuthContextValue {
  isAuthenticated: boolean;
  /** Valida o token contra uma rota protegida e, se aceito, persiste a sessão. */
  signIn: (token: string) => Promise<void>;
  signOut: () => void;
  authError: string | null;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) !== null,
  );
  const [authError, setAuthError] = useState<string | null>(null);

  const signOut = useCallback(() => {
    sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    setIsAuthenticated(false);
  }, []);

  const signIn = useCallback(async (token: string) => {
    setAuthError(null);
    // Salva otimisticamente para o interceptor injetar o header na chamada de validação.
    sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    try {
      // POST sem efeito colateral: o AdminTokenFilter já rejeita com 401
      // antes de chegar no controller caso o token seja inválido.
      await apiClient.post("/admin/session/validate");
      setIsAuthenticated(true);
    } catch {
      sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
      setIsAuthenticated(false);
      setAuthError("Token administrativo inválido. Verifique e tente novamente.");
      throw new Error("invalid-token");
    }
  }, []);

  useEffect(() => {
    const handleUnauthorized = () => {
      signOut();
      setAuthError("Sua sessão expirou ou o token é inválido. Entre novamente.");
    };
    window.addEventListener("admin-unauthorized", handleUnauthorized);
    return () => window.removeEventListener("admin-unauthorized", handleUnauthorized);
  }, [signOut]);

  const value = useMemo(
    () => ({ isAuthenticated, signIn, signOut, authError }),
    [isAuthenticated, signIn, signOut, authError],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}