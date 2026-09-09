import toast from "react-hot-toast";
import { useState, type FormEvent } from "react";
import { Pencil, Star, Trash2 } from "lucide-react";
import { ADDRESS_TYPE_LABEL, type Address, type AddressPayload, type AddressType } from "../../types/address";
import { useAddresses, useCreateAddress, useDeleteAddress, useUpdateAddress } from "../../hooks/useAddresses";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { Skeleton } from "../ui/Skeleton";

const EMPTY_FORM: AddressPayload = {
  type: "RESIDENTIAL",
  street: "",
  number: "",
  complement: "",
  neighborhood: "",
  city: "",
  state: "",
  country: "Brasil",
  zipCode: "",
  primaryAddress: false,
};

export function AddressFormList() {
  const { data: addresses, isLoading } = useAddresses() as { data: Address[] | undefined; isLoading: boolean };
  const createAddress = useCreateAddress();
  const updateAddress = useUpdateAddress();
  const deleteAddress = useDeleteAddress();

  const [form, setForm] = useState<AddressPayload>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<number | null>(null);

  function updateField<K extends keyof AddressPayload>(key: K, value: AddressPayload[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function startEdit(address: Address) {
    setEditingId(address.id);
    setForm({
      type: address.type,
      street: address.street,
      number: address.number ?? "",
      complement: address.complement ?? "",
      neighborhood: address.neighborhood ?? "",
      city: address.city,
      state: address.state,
      country: address.country,
      zipCode: address.zipCode,
      primaryAddress: address.primaryAddress,
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(EMPTY_FORM);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (editingId !== null) {
      await updateAddress.mutateAsync({ id: editingId, payload: form });
    } else {
      await createAddress.mutateAsync(form);
    }
    cancelEdit();
  }

  async function handleDelete(id: number) {
    if (!confirm("Remover este endereço/contato? Ele deixará de aparecer no site.")) return;
    try {
      await deleteAddress.mutateAsync(id);
      toast.success("Endereço removido.");
    } catch {
      toast.error("Não foi possível remover.");
    }
  }

  const isSaving = createAddress.isPending || updateAddress.isPending;

  return (
    <div>
      <section className="card p-6">
        <h2 className="text-base font-bold text-(--t1)">
          {editingId !== null ? "Editar endereço" : "Novo endereço/contato"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-(--t2)" htmlFor="address-type">
              Tipo
            </label>
            <select
              id="address-type"
              value={form.type}
              onChange={(e) => updateField("type", e.target.value as AddressType)}
              className="input"
            >
              {Object.entries(ADDRESS_TYPE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <label className="flex items-center gap-2.5 self-end pb-2.5 text-sm text-(--t2)">
            <input
              type="checkbox"
              checked={form.primaryAddress}
              onChange={(e) => updateField("primaryAddress", e.target.checked)}
              className="h-4 w-4 accent-brand-500"
            />
            Definir como principal
          </label>

          <Input
            label="Rua/Logradouro"
            required
            value={form.street}
            onChange={(e) => updateField("street", e.target.value)}
          />
          <Input
            label="Número"
            value={form.number}
            onChange={(e) => updateField("number", e.target.value)}
          />
          <Input
            label="Complemento"
            value={form.complement}
            onChange={(e) => updateField("complement", e.target.value)}
          />
          <Input
            label="Bairro"
            value={form.neighborhood}
            onChange={(e) => updateField("neighborhood", e.target.value)}
          />
          <Input
            label="Cidade"
            required
            value={form.city}
            onChange={(e) => updateField("city", e.target.value)}
          />
          <Input
            label="Estado"
            required
            value={form.state}
            onChange={(e) => updateField("state", e.target.value)}
          />
          <Input
            label="CEP"
            required
            value={form.zipCode}
            onChange={(e) => updateField("zipCode", e.target.value)}
          />
          <Input
            label="País"
            required
            value={form.country}
            onChange={(e) => updateField("country", e.target.value)}
          />

          <div className="flex items-center gap-3 sm:col-span-2">
            <Button type="submit" isLoading={isSaving}>
              {editingId !== null ? "Salvar alterações" : "Adicionar endereço"}
            </Button>
            {editingId !== null && (
              <Button type="button" variant="ghost" onClick={cancelEdit}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </section>

      <section className="mt-6">
        <h2 className="mb-3 text-base font-bold text-(--t1)">
          Endereços cadastrados
        </h2>

        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : addresses?.length ? (
          <div className="overflow-hidden rounded-2xl border border-(--bd) bg-(--s1)">
            {addresses.map((address: Address) => (
              <div
                key={address.id}
                className="flex items-center justify-between gap-4 border-b border-(--bd) px-5 py-4 last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  {address.primaryAddress && (
                    <Star size={14} className="text-amber-400" fill="currentColor" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-(--t1)">
                      {address.street}
                      {address.number ? `, ${address.number}` : ""}
                    </p>
                    <p className="text-xs text-(--t4)">
                      {ADDRESS_TYPE_LABEL[address.type as AddressType]} — {address.city}, {address.state}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => startEdit(address)}
                    className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-(--cb) hover:text-(--t1)"
                    aria-label="Editar"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="rounded-lg p-2 text-(--t4) transition-colors hover:bg-red-500/10 hover:text-red-400"
                    aria-label="Excluir"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-(--bd) p-6 text-center text-sm text-(--t4)">
            Nenhum endereço cadastrado ainda.
          </p>
        )}
      </section>
    </div>
  );
}