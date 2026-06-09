import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes' // Puxa a árvore isolada de caminhos

export default function App() {
  return (
    <BrowserRouter>
      {/* O Roteador DEVE morar aqui para fornecer contexto para o AppRoutes */}
      <AppRoutes />
    </BrowserRouter>
  )
}
