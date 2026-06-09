import axios from 'axios'
import type {
  Profile, Project, Skill, Experience, Education,
  Certification, Testimonial, Contact, ContactForm
} from '../types'

// Como configuramos o 'context-path: /api' no Spring, o recuo padrão local do Vite será este
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

const api = axios.create({ baseURL: BASE_URL })
const adminApi = axios.create({ baseURL: BASE_URL })

// Interceptor injeta perfeitamente o cabeçalho X-Admin-Key que criamos em Java
adminApi.interceptors.request.use(config => {
  const key = localStorage.getItem('admin_key') || import.meta.env.VITE_ADMIN_KEY || ''
  config.headers['X-Admin-Key'] = key
  return config
})

// ============================================================
// PUBLIC API (Rotas abertas sem autenticação)
// ============================================================
export const publicApi = {
  getProfile: () =>
    api.get<Profile>('/profile').then(r => r.data),

  getProjects: (featured?: boolean) =>
    api.get<Project[]>('/projects', {
      params: featured != null ? { featured } : {}
    }).then(r => r.data),

  getProject: (slug: string) =>
    api.get<Project>(`/projects/${slug}`).then(r => r.data),

  // Devolve o mapa de chaves agrupado por strings que fizemos na SkillServiceImpl
  getSkills: () =>
    api.get<Record<string, Skill[]>>('/skills').then(r => r.data),

  getExperiences: () =>
    api.get<Experience[]>('/experiences').then(r => r.data),

  getEducations: () =>
    api.get<Education[]>('/educations').then(r => r.data),

  getCertifications: () =>
    api.get<Certification[]>('/certifications').then(r => r.data),

  getTestimonials: (featured?: boolean) =>
    api.get<Testimonial[]>('/testimonials', {
      params: featured != null ? { featured } : {}
    }).then(r => r.data),

  // Rota unificada do formulário de mensagens mapeada no ContactController
  sendContact: (data: ContactForm) =>
    api.post('/contacts', data).then(r => r.data),
}

// ============================================================
// ADMIN API (Operações protegidas por chave de acesso)
// ============================================================
export const adminApiService = {
  // Profile (Mapeado como PUT /profile fazendo o Upsert inteligente no Java)
  updateProfile: (data: Partial<Profile>) =>
    adminApi.put<Profile>('/profile', data).then(r => r.data),

  // Projects
  getProjects: () =>
    adminApi.get<Project[]>('/projects/all').then(r => r.data),
  createProject: (data: Partial<Project>) =>
    adminApi.post<Project>('/projects', data).then(r => r.data),
  updateProject: (id: number, data: Partial<Project>) =>
    adminApi.put<Project>(`/projects/${id}`, data).then(r => r.data),
  deleteProject: (id: number) =>
    adminApi.delete(`/projects/${id}`),

  // Skills
  getSkills: () =>
    adminApi.get<Skill[]>('/skills/all').then(r => r.data),
  createSkill: (data: Partial<Skill>) =>
    adminApi.post<Skill>('/skills', data).then(r => r.data),
  updateSkill: (id: number, data: Partial<Skill>) =>
    adminApi.put<Skill>(`/skills/${id}`, data).then(r => r.data),
  deleteSkill: (id: number) =>
    adminApi.delete(`/skills/${id}`),

  // Experiences
  getExperiences: () =>
    adminApi.get<Experience[]>('/experiences/all').then(r => r.data),
  createExperience: (data: Partial<Experience>) =>
    adminApi.post<Experience>('/experiences', data).then(r => r.data),
  updateExperience: (id: number, data: Partial<Experience>) =>
    adminApi.put<Experience>(`/experiences/${id}`, data).then(r => r.data),
  deleteExperience: (id: number) =>
    adminApi.delete(`/experiences/${id}`),

  // Educations
  getEducations: () =>
    adminApi.get<Education[]>('/educations/all').then(r => r.data),
  createEducation: (data: Partial<Education>) =>
    adminApi.post<Education>('/educations', data).then(r => r.data),
  updateEducation: (id: number, data: Partial<Education>) =>
    adminApi.put<Education>(`/educations/${id}`, data).then(r => r.data),
  deleteEducation: (id: number) =>
    adminApi.delete(`/educations/${id}`),

  // Certifications
  getCertifications: () =>
    adminApi.get<Certification[]>('/certifications/all').then(r => r.data),
  createCertification: (data: Partial<Certification>) =>
    adminApi.post<Certification>('/certifications', data).then(r => r.data),
  updateCertification: (id: number, data: Partial<Certification>) =>
    adminApi.put<Certification>(`/certifications/${id}`, data).then(r => r.data),
  deleteCertification: (id: number) =>
    adminApi.delete(`/certifications/${id}`),

  // Testimonials
  getTestimonials: () =>
    adminApi.get<Testimonial[]>('/testimonials/all').then(r => r.data),
  createTestimonial: (data: Partial<Testimonial>) =>
    adminApi.post<Testimonial>('/testimonials', data).then(r => r.data),
  updateTestimonial: (id: number, data: Partial<Testimonial>) =>
    adminApi.put<Testimonial>(`/testimonials/${id}`, data).then(r => r.data),
  deleteTestimonial: (id: number) =>
    adminApi.delete(`/testimonials/${id}`),

  // Contacts
  getContacts: (status?: string) =>
    adminApi.get<Contact[]>('/contacts', {
      params: status ? { status } : {}
    }).then(r => r.data),
  updateContactStatus: (id: number, status: string) =>
    adminApi.patch<Contact>(`/contacts/${id}/status`, { status }).then(r => r.data),
  countNewContacts: () =>
    adminApi.get<{ count: number }>('/contacts/count-new').then(r => r.data),
}
