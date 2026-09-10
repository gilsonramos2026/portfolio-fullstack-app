import type { Profile, ProfilePayload } from "../types/profile";
import { apiClient } from "./apiClient";

export const profileService = {
  /** Rota pública — consumida pelo Header, Footer e Home. */
  async getProfile(): Promise<Profile> {
    const { data } = await apiClient.get<Profile>("/profile");
    return data;
  },

  /**
   * Rota admin — upsert completo dos dados pessoais (inclui foto e
   * currículo). O backend não expõe um endpoint isolado para a foto;
   * ela viaja como campo `photoUrl` dentro do mesmo payload.
   */
  async updateProfile(payload: ProfilePayload): Promise<Profile> {
    const { data } = await apiClient.put<Profile>("/profile", payload);
    return data;
  },
};
