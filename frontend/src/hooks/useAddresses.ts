import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addressService } from "@/services/addressService";
import { queryKeys } from "@/lib/queryClient";
import type { AddressPayload } from "@/types/address";

export function useAddresses() {
  return useQuery({
    queryKey: queryKeys.addresses,
    queryFn: addressService.list,
  });
}

export function useCreateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: AddressPayload) => addressService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AddressPayload }) =>
      addressService.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => addressService.remove(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.addresses }),
  });
}
