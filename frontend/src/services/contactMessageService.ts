import type { ContactMessage, ContactMessagePayload, ContactMessageStatus } from "../types/contactMessage";
import { apiClient } from "./apiClient";

export const contactMessageService = {
  /** Rota pública — usada pelo formulário de contato do site. */
  async submit(payload: ContactMessagePayload): Promise<void> {
    await apiClient.post("/contact-messages", payload);
  },

  /** Rotas admin — caixa de entrada. */
  async list(): Promise<ContactMessage[]> {
    const { data } = await apiClient.get<ContactMessage[]>("/contact-messages");
    return data;
  },

  async unreadCount(): Promise<number> {
    const { data } = await apiClient.get<{ unread: number }>("/contact-messages/unread-count");
    return data.unread;
  },

  async updateStatus(id: number, status: ContactMessageStatus): Promise<ContactMessage> {
    const { data } = await apiClient.patch<ContactMessage>(`/contact-messages/${id}/status`, { status });
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/contact-messages/${id}`);
  },
};
