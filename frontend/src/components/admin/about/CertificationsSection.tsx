import { Award, ExternalLink } from "lucide-react";
import { FadeIn } from "../../ui/FadeIn";
import { formatMonthYear } from "../../../utils/formatters";

interface Certification {
  id: string | number;
  imageUrl?: string;
  issuer: string;
  name: string;
  issueDate: string;
  credentialUrl?: string;
}

interface CertificationsSectionProps {
  certifications?: Certification[];
  isLoading: boolean;
}

export function CertificationsSection({ certifications, isLoading }: CertificationsSectionProps) {
  if (isLoading || !certifications?.length) return null;

  return (
    <FadeIn className="mt-16 border-t border-(--bd) pt-12">
      <h2 className="mb-8 flex items-center gap-2 text-xl font-bold text-(--t1)">
        <Award size={20} className="text-brand-400" />
        Certificações
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {certifications.map((cert) => (
          <div key={cert.id} className="card flex items-start gap-3 p-4">
            {cert.imageUrl ? (
              <img src={cert.imageUrl} alt={cert.issuer} className="h-10 w-10 shrink-0 rounded-lg object-contain" />
            ) : (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-(--chb)">
                <Award size={18} className="text-brand-400" />
              </span>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-(--t1)">{cert.name}</p>
              <p className="text-xs text-(--t4)">
                {cert.issuer} · {formatMonthYear(cert.issueDate)}
              </p>
              {cert.credentialUrl && (
                <a
                  href={cert.credentialUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs text-brand-400 hover:underline"
                >
                  Ver credencial <ExternalLink size={11} />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </FadeIn>
  );
}