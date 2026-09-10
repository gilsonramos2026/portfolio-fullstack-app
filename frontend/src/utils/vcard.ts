import type { Profile } from "../types/profile";

/** Escapa caracteres reservados do formato vCard (RFC 6350). */
function escapeVCardValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
}

/** Monta o conteúdo de um arquivo .vcf a partir do Perfil, pronto para importar em qualquer agenda. */
export function buildVCard(profile: Profile): string {
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${escapeVCardValue(profile.fullName)}`,
    `N:${escapeVCardValue(profile.fullName)};;;;`,
  ];

  if (profile.headline) lines.push(`TITLE:${escapeVCardValue(profile.headline)}`);
  if (profile.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardValue(profile.email)}`);
  if (profile.phone) lines.push(`TEL;TYPE=CELL:${escapeVCardValue(profile.phone)}`);
  if (profile.websiteUrl) lines.push(`URL:${escapeVCardValue(profile.websiteUrl)}`);
  if (profile.githubUrl) lines.push(`URL;TYPE=GitHub:${escapeVCardValue(profile.githubUrl)}`);
  if (profile.linkedinUrl) lines.push(`URL;TYPE=LinkedIn:${escapeVCardValue(profile.linkedinUrl)}`);

  const primaryAddress = profile.addresses?.find((a) => a.primaryAddress) ?? profile.addresses?.[0];
  if (primaryAddress) {
    lines.push(
      `ADR;TYPE=WORK:;;${escapeVCardValue(primaryAddress.street ?? "")};${escapeVCardValue(
        primaryAddress.city,
      )};${escapeVCardValue(primaryAddress.state)};;${escapeVCardValue(primaryAddress.country)}`,
    );
  }

  lines.push("END:VCARD");
  return lines.join("\r\n");
}

/** Gera o .vcf e dispara o download no navegador — um clique salva o contato na agenda. */
export function downloadVCard(profile: Profile): void {
  const vcard = buildVCard(profile);
  const blob = new Blob([vcard], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${profile.fullName.replace(/\s+/g, "-").toLowerCase()}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}
