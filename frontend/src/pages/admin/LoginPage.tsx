import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Code2 } from "lucide-react";
import { useAdminAuth } from "../../hooks/useAdminAuth";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";

interface AdminAuthContextType {
  isAuthenticated: boolean;
  signIn: (token: string) => Promise<void>;
  authError?: string | null;
}

export function LoginPage() {
  const { isAuthenticated, signIn, authError } = useAdminAuth() as unknown as AdminAuthContextType;
  const [token, setToken] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  if (isAuthenticated) {
    const from = (location.state as { from?: Location })?.from?.pathname ?? "/admin";
    return <Navigate to={from} replace />;
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setLocalError(null);
    setIsSubmitting(true);
    try {
      await signIn(token);
      navigate("/admin", { replace: true });
    } catch {
      setLocalError("Não foi possível autenticar. Confira o token e tente de novo.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card w-full max-w-sm p-8"
      >
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500 text-white shadow-lg">
            <Code2 size={20} />
          </span>
          <div>
            <h1 className="text-lg font-bold text-(--t1)">Acesso administrativo</h1>
            <p className="mt-1 text-sm text-(--t4)">Informe o token para gerenciar o portfólio</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Token administrativo"
            type="password"
            required
            autoFocus
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="••••••••••••"
            error={localError ?? authError ?? undefined}
          />
          <Button type="submit" isLoading={isSubmitting} className="w-full justify-center">
            <Lock size={15} />
            Entrar
          </Button>
        </form>
      </motion.div>
    </div>
  );
}