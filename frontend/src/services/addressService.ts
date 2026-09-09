import { apiClient } from "./apiClient";
import type { Address, AddressPayload } from "@/types/address";

/** Endereços/contatos são um sub-recurso do perfil: /api/profile/addresses */
export const addressService = {
  async list(): Promise<Address[]> {
    const { data } = await apiClient.get<Address[]>("/profile/addresses");
    return data;
  },

  async create(payload: AddressPayload): Promise<Address> {
    const { data } = await apiClient.post<Address>("/profile/addresses", payload);
    return data;
  },

  async update(id: number, payload: AddressPayload): Promise<Address> {
    const { data } = await apiClient.put<Address>(`/profile/addresses/${id}`, payload);
    return data;
  },

  async remove(id: number): Promise<void> {
    await apiClient.delete(`/profile/addresses/${id}`);
  },
};
