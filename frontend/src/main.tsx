
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes' // Importa a árvore de rotas separada

export default function App() {
  return (
    <BrowserRouter>
      {/* O Roteador fica aqui para alimentar as rotas que isolamos no outro arquivo */}
      <AppRoutes />
    </BrowserRouter>
  )
}
