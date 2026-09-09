export type AddressType = "RESIDENTIAL" | "COMMERCIAL" | "CONTACT";

export const ADDRESS_TYPE_LABEL: Record<AddressType, string> = {
  RESIDENTIAL: "Residencial",
  COMMERCIAL: "Comercial",
  CONTACT: "Contato",
};

export interface Address {
  id: number;
  type: AddressType;
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  primaryAddress: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AddressPayload {
  type: AddressType;
  street: string;
  number?: string;
  complement?: string;
  neighborhood?: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  primaryAddress: boolean;
}
