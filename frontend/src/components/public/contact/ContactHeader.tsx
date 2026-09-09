import { Seo } from "../../ui/Seo";

export function ContactHeader() {
  return (
    <>
      <Seo title="Contato" description="Vamos conversar sobre uma oportunidade ou projeto." />
      <h1 className="text-3xl font-bold text-(--t1) sm:text-4xl">Vamos conversar</h1>
      <p className="mt-3 text-(--t3)">
        Tem uma vaga, projeto ou ideia? Preencha o formulário abaixo — respondo o quanto antes.
      </p>
    </>
  );
}