import type { Address } from "./address";

export interface Profile {
  id: number;
  fullName: string;
  headline: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  resumeUrl: string;
  /** Cargos/títulos que alternam no efeito de máquina de escrever do hero. */
  roles: string[];
  availableForWork: boolean;
  addresses: Address[];
  createdAt: string;
  updatedAt: string;
}

export interface ProfilePayload {
  fullName: string;
  headline: string;
  bio: string;
  photoUrl: string;
  email: string;
  phone: string;
  githubUrl: string;
  linkedinUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  websiteUrl: string;
  resumeUrl: string;
  roles: string[];
  availableForWork: boolean;
}
