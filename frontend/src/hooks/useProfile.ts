import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "../lib/queryClient";
import { profileService } from "../services/profileService";


export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile,
    queryFn: profileService.getProfile,
    staleTime: 5 * 60 * 1000, // dados do perfil mudam raramente
  });
}
