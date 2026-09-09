import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/services/profileService";
import { queryKeys } from "@/lib/queryClient";

export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000, // dados do perfil mudam raramente
  });
}
