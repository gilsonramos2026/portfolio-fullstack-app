import { AddressFormList } from "../../components/admin/AddressFormList";

export function AddressesSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-(--t1)">Endereços & Contatos</h1>
      <p className="mt-1 text-sm text-(--t4)">
        Esses dados aparecem no rodapé e na página Sobre do site público.
      </p>
      <div className="mt-8">
        <AddressFormList />
      </div>
    </div>
  );
}
