import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { contactMessageService } from "@/services/contactMessageService";
import type { ContactMessagePayload, ContactMessageStatus } from "@/types/contactMessage";

const KEY = ["contact-messages"] as const;
const UNREAD_KEY = ["contact-messages", "unread-count"] as const;

/** Mutation pública — não depende de autenticação admin. */
export function useSubmitContactMessage() {
  return useMutation({
    mutationFn: (payload: ContactMessagePayload) => contactMessageService.submit(payload),
  });
}

export function useContactMessages() {
  return useQuery({ queryKey: KEY, queryFn: contactMessageService.list });
}

export function useUnreadContactCount() {
  return useQuery({ queryKey: UNREAD_KEY, queryFn: contactMessageService.unreadCount });
}

export function useUpdateMessageStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: ContactMessageStatus }) =>
      contactMessageService.updateStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: UNREAD_KEY });
    },
  });
}

export function useDeleteContactMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => contactMessageService.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: KEY });
      qc.invalidateQueries({ queryKey: UNREAD_KEY });
    },
  });
}
