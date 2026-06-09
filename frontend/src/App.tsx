import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AppRoutes } from './routes' // Importa a malha que acabamos de isolar

// Inicializa o gerenciador de estado e cache de requisições do TanStack Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Evita requisições repetidas ao trocar de aba
      retry: 1, // Tenta reexecutar chamadas falhas apenas 1 vez
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {/* Renderiza a árvore de páginas isolada */}
        <AppRoutes />
      </BrowserRouter>
      
      {/* Injeta o componente global de notificações e alertas em Tailwind */}
      <Toaster position="top-right" reverseOrder={false} />
    </QueryClientProvider>
  )
}
