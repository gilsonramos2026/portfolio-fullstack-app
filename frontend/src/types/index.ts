// ============================================================
// PORTFOLIO TYPES - CENTRALIZED CONTRACTS
// ============================================================

export interface Profile {
  id: number
  name: string
  title: string
  tagline?: string
  bio: string
  email: string
  phone?: string
  location?: string
  avatarUrl?: string
  resumeUrl?: string
  githubUrl?: string
  linkedinUrl?: string
  twitterUrl?: string
  websiteUrl?: string
  yearsExp?: number
  available?: boolean
  updatedAt?: string
}

export interface ProjectImage {
  id: number
  url: string
  altText?: string
  sortOrder?: number
}

export interface Project {
  id: number
  title: string
  slug: string
  shortDesc: string
  description: string
  thumbnailUrl?: string
  demoUrl?: string
  githubUrl?: string
  featured?: boolean
  status?: 'completed' | 'in_progress' | 'archived'
  sortOrder?: number
  tags?: string[] // Casará perfeitamente com o Set do Java convertido em Array JSON
  images?: ProjectImage[]
  startedAt?: string
  finishedAt?: string
  createdAt?: string
}

export interface Skill {
  id: number
  name: string
  category: string
  proficiency: number
  iconName?: string
  sortOrder?: number
}

export interface Experience {
  id: number
  company: string
  role: string
  description: string
  logoUrl?: string
  location?: string
  type?: string
  startedAt: string
  endedAt?: string
  current?: boolean
  sortOrder?: number
  technologies?: string[]
}

export interface Education {
  id: number
  institution: string
  degree: string
  fieldOfStudy?: string
  description?: string
  logoUrl?: string
  grade?: string
  startedAt: string
  endedAt?: string
  current?: boolean
  sortOrder?: number
}

export interface Certification {
  id: number
  name: string
  issuer: string
  credentialId?: string
  credentialUrl?: string
  imageUrl?: string
  issuedAt: string
  expiresAt?: string
  sortOrder?: number
}

export interface Testimonial {
  id: number
  name: string
  role: string
  company?: string
  content: string
  avatarUrl?: string
  rating?: number
  featured?: boolean
  sortOrder?: number
}

export interface Contact {
  id: number
  name: string
  email: string
  subject?: string
  message: string
  phone?: string
  status?: string
  createdAt?: string
}

export interface ContactForm {
  name: string
  email: string
  subject?: string
  message: string
  phone?: string
}
