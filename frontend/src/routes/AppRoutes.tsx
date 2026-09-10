import { Route, Routes } from "react-router-dom";
import { PublicLayout } from "../layouts/PublicLayout";
import { HomePage } from "../pages/public/HomePage";
import { AboutPage } from "../pages/public/AboutPage";
import { ProjectsPage } from "../pages/public/ProjectsPage";
import { ProjectDetailPage } from "../pages/public/ProjectDetailPage";
import { ContactPage } from "../pages/public/ContactPage";
import { LoginPage } from "../pages/admin/LoginPage";
import { ProtectedRoute } from "../components/admin/ProtectedRoute";
import { AdminLayout } from "../layouts/AdminLayout";
import { DashboardPage } from "../pages/admin/DashboardPage";
import { ProfileSettingsPage } from "../pages/admin/ProfileSettingsPage";
import { AddressesSettingsPage } from "../pages/admin/AddressesSettingsPage";
import { CurriculumAdminPage } from "../pages/admin/CurriculumAdminPage";
import { ContactMessagesAdminPage } from "../pages/admin/ContactMessagesAdminPage";
import { ProjectsAdminPage } from "../pages/admin/ProjectsAdminPage";
import { ProjectFormPage } from "../pages/admin/ProjectFormPage";
import { NotFoundPage } from "../pages/public/NotFoundPage";


/**
 * Configuração de rotas isolada do restante da aplicação.
 *
 * - `/`               → área pública, totalmente dinâmica via API (PublicLayout)
 * - `/admin/login`     → autenticação por token, fora do AdminLayout protegido
 * - `/admin/*`         → painel administrativo, atrás de <ProtectedRoute> (AdminLayout)
 */
export function AppRoutes() {
  return (
    <Routes>
      {/* Área pública */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sobre" element={<AboutPage />} />
        <Route path="/projetos" element={<ProjectsPage />} />
        <Route path="/projetos/:id" element={<ProjectDetailPage />} />
        <Route path="/contato" element={<ContactPage />} />
      </Route>

      {/* Autenticação admin (fora do layout protegido) */}
      <Route path="/admin/login" element={<LoginPage />} />

      {/* Painel administrativo protegido */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<DashboardPage />} />
          <Route path="/admin/perfil" element={<ProfileSettingsPage />} />
          <Route path="/admin/enderecos" element={<AddressesSettingsPage />} />
          <Route path="/admin/curriculo" element={<CurriculumAdminPage />} />
          <Route path="/admin/mensagens" element={<ContactMessagesAdminPage />} />
          <Route path="/admin/projetos" element={<ProjectsAdminPage />} />
          <Route path="/admin/projetos/novo" element={<ProjectFormPage />} />
          <Route path="/admin/projetos/:id" element={<ProjectFormPage />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
