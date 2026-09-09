import { Download, Mail, MapPin, UserPlus } from "lucide-react";
import { FadeIn } from "../../ui/FadeIn";
import type { Profile } from "../../../types/profile";
import { Skeleton } from "../../ui/Skeleton";
import { downloadVCard } from "../../../utils/vcard";

interface ProfileHeaderProps {
  profile?: Profile;
  isLoading: boolean;
}

export function ProfileHeader({ profile, isLoading }: ProfileHeaderProps) {
  const primaryAddress = profile?.addresses?.find((a) => a.primaryAddress) ?? profile?.addresses?.[0];

  return (
    <>
      <FadeIn className="mb-10">
        <h1 className="text-3xl font-bold text-(--t1) sm:text-4xl">Sobre mim</h1>
        <p className="mt-2 max-w-xl text-(--t3)">Conheça minha trajetória, habilidades e formação.</p>
      </FadeIn>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          <Skeleton className="h-32 w-32 rounded-2xl" />
          <div className="flex flex-col gap-3 sm:col-span-2">
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        </div>
      ) : (
        profile && (
          <FadeIn className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <div className="flex flex-col items-center gap-4 sm:col-span-1 sm:items-start">
              {profile.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile.fullName}
                  className="h-32 w-32 rounded-2xl border-2 border-(--bd) object-cover"
                />
              ) : (
                <div
                  className="flex h-32 w-32 items-center justify-center rounded-2xl text-4xl font-bold text-white"
                  style={{ background: "linear-gradient(135deg, var(--color-brand-500), var(--color-accent-500))" }}
                >
                  {profile.fullName.charAt(0)}
                </div>
              )}

              <div className="space-y-2 text-center sm:text-left">
                {primaryAddress && (
                  <p className="flex items-center justify-center gap-1.5 text-sm text-(--t3) sm:justify-start">
                    <MapPin size={13} />
                    {primaryAddress.city}, {primaryAddress.state}
                  </p>
                )}
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="flex items-center justify-center gap-1.5 text-sm text-(--t3) transition-colors hover:text-brand-400 sm:justify-start"
                  >
                    <Mail size={13} />
                    {profile.email}
                  </a>
                )}
                {profile.availableForWork && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Disponível
                  </span>
                )}
              </div>
            </div>

            <div className="sm:col-span-2">
              <h2 className="mb-1 text-xl font-semibold text-(--t1)">{profile.fullName}</h2>
              <p className="mb-4 font-medium text-brand-400">{profile.headline}</p>
              <p className="whitespace-pre-line text-balance leading-relaxed text-(--t2)">{profile.bio}</p>

              <div className="mt-6 flex flex-wrap gap-3">
                {profile.resumeUrl && (
                  <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" download className="btn-primary">
                    <Download size={15} />
                    Baixar currículo
                  </a>
                )}
                <button onClick={() => downloadVCard(profile)} className="btn-outline">
                  <UserPlus size={15} />
                  Salvar contato
                </button>
              </div>
            </div>
          </FadeIn>
        )
      )}
    </>
  );
}