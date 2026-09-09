import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { ProfilePayload } from "../types/profile";
import { profileService } from "../services/profileService";
import { queryKeys } from "../lib/queryClient";


export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProfilePayload) => profileService.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKeys.profile, updated);
    },
  });
}
