export type ContactMessageStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export const CONTACT_STATUS_LABEL: Record<ContactMessageStatus, string> = {
  NEW: "Nova",
  READ: "Lida",
  REPLIED: "Respondida",
  ARCHIVED: "Arquivada",
};

export const CONTACT_STATUS_CLASSES: Record<ContactMessageStatus, string> = {
  NEW: "bg-(--color-brand-500)/15 text-(--color-brand-400) border-(--color-brand-500)/25",
  READ: "bg-(--chb) text-(--t3) border-(--chbd)",
  REPLIED: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  ARCHIVED: "bg-(--chb) text-(--t5) border-(--chbd)",
};

export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
}

export interface ContactMessagePayload {
  name: string;
  email: string;
  message: string;
  /** Honeypot anti-spam — deve permanecer vazio; ver ContactForm.tsx. */
  website?: string;
}
