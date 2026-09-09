import { Link } from "react-router-dom";
import { Github, Linkedin, Instagram, Twitter, Mail, Code2, MapPin } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";

const LINKS = [
  { to: "/", label: "Início" },
  { to: "/projetos", label: "Projetos" },
  { to: "/sobre", label: "Sobre" },
  { to: "/contato", label: "Contato" },
];

export function Footer() {
  const { data: profile } = useProfile();
  const primaryAddress = profile?.addresses?.find((a) => a.primaryAddress) ?? profile?.addresses?.[0];

  return (
    <footer className="mt-20 border-t border-(--bd) bg-(--s1)/60 sm:mt-28">
      <div className="content-container py-10 sm:py-14">
        <div className="mb-10 grid grid-cols-1 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <Link to="/" className="group flex w-fit items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-(--color-brand-500) transition-colors group-hover:bg-(--color-brand-400)">
                <Code2 size={15} className="text-white" />
              </div>
              <span className="font-semibold text-(--t1)">{profile?.fullName?.split(" ")[0] ?? "Dev"}</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-(--t4)">
              {profile?.headline ?? "Desenvolvedor(a) Full Stack apaixonado(a) por código."}
            </p>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-(--t1)">Navegação</p>
            <ul className="list-none space-y-2">
              {LINKS.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-(--t4) transition-colors hover:text-(--color-brand-400)"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-4 text-sm font-semibold text-(--t1)">Contato</p>
            <div className="space-y-2">
              {profile?.email && (
                <a
                  href={`mailto:${profile.email}`}
                  className="flex items-center gap-2 text-sm text-(--t4) transition-colors hover:text-(--t1)"
                >
                  <Mail size={13} />
                  {profile.email}
                </a>
              )}
              {primaryAddress && (
                <p className="flex items-center gap-2 text-sm text-(--t4)">
                  <MapPin size={13} />
                  {primaryAddress.city}, {primaryAddress.state}
                </p>
              )}
              {profile?.availableForWork && (
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                  Disponível para projetos
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-(--bd) pt-6 sm:flex-row">
          <p className="text-xs text-(--t5)">
            © {new Date().getFullYear()} {profile?.fullName ?? "Portfólio"}. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-1">
            {profile?.githubUrl && (
              <a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Github size={18} />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Linkedin size={18} />
              </a>
            )}
            {profile?.instagramUrl && (
              <a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Instagram size={18} />
              </a>
            )}
            {profile?.twitterUrl && (
              <a
                href={profile.twitterUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Twitter size={18} />
              </a>
            )}
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Mail size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
