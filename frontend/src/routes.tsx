import { Routes, Route } from "react-router-dom";

// Public pages
import HomePage from "./pages/public/HomePage";
import ProjectsPage from "./pages/public/ProjectsPage";
import ProjectDetail from "./pages/public/ProjectDetail";
import AboutPage from "./pages/public/AboutPage";
import ContactPage from "./pages/public/ContactPage";

// Admin pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminSkills from "./pages/admin/AdminSkills";
import AdminExperiences from "./pages/admin/AdminExperiences";
import AdminEducations from "./pages/admin/AdminEducations";
import AdminCertifications from "./pages/admin/AdminCertifications";
import AdminTestimonials from "./pages/admin/AdminTestimonials";
import AdminContacts from "./pages/admin/AdminContacts";
import AdminProfile from "./pages/admin/AdminProfile";

// Layouts
import PublicLayout from "./components/shared/PublicLayout";
import AdminLayout from "./components/shared/AdminLayout";

export function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC APPLICATION FLOW */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ADMINISTRATIVE BACKOFFICE FLOW */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="profile" element={<AdminProfile />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="experiences" element={<AdminExperiences />} />
        <Route path="educations" element={<AdminEducations />} />
        <Route path="certifications" element={<AdminCertifications />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="contacts" element={<AdminContacts />} />
      </Route>
    </Routes>
  );
}
