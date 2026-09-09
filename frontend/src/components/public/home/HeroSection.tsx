import { Link } from "react-router-dom";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";
import { ArrowRight, Download, Github, Linkedin, Instagram, Twitter, Mail, Code2 } from "lucide-react";
import type { Profile } from "../../../types/profile";
import type { GitHubStats } from "../../../hooks/useGitHubStats";
import { fadeRight, fadeUp, staggerContainer } from "../../../lib/motionVariants";
import { Skeleton } from "../../ui/Skeleton";

interface HeroSectionProps {
  profile?: Profile;
  profileLoading: boolean;
  projectCount: number;
  githubStats?: GitHubStats;
}

export function HeroSection({ profile, profileLoading, projectCount }: HeroSectionProps) {
  const typewriterRoles = profile?.roles?.length ? profile.roles : profile?.headline ? [profile.headline] : [];
  const typewriterSequence = typewriterRoles.flatMap((role) => [role, 2200]);

  return (
    <section className="flex min-h-[92dvh] items-center py-16 sm:py-20">
      <div className="grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <motion.div
          className="order-2 space-y-6 lg:order-1"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeUp}>
            <span className="inline-flex items-center gap-2 rounded-full border border-(--bd) bg-(--cb) px-3 py-1.5 text-sm text-(--t3)">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              {profile?.availableForWork ? "Disponível para novos projetos" : "Em projeto no momento"}
            </span>
          </motion.div>

          {profileLoading ? (
            <div className="flex flex-col gap-3">
              <Skeleton className="h-12 w-4/5" />
              <Skeleton className="h-10 w-3/5" />
            </div>
          ) : (
            <motion.div variants={fadeUp}>
              <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl xl:text-6xl">
                <span className="text-(--t1)">Olá, sou </span>
                <span className="text-gradient">{profile?.fullName?.split(" ")[0] ?? "Dev"}</span>
              </h1>
              {typewriterSequence.length > 0 && (
                <p className="mt-2 text-3xl text-(--t2) sm:text-4xl xl:text-5xl">
                  <TypeAnimation
                    sequence={typewriterSequence}
                    wrapper="span"
                    speed={55}
                    repeat={Infinity}
                  />
                </p>
              )}
            </motion.div>
          )}

          {profileLoading ? (
            <Skeleton className="h-16 w-full" />
          ) : (
            <motion.p variants={fadeUp} className="max-w-xl text-lg leading-relaxed text-(--t3)">
              {profile?.bio}
            </motion.p>
          )}

          <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
            <Link to="/projetos" className="btn-primary">
              Ver projetos <ArrowRight size={16} />
            </Link>
            <Link to="/contato" className="btn-outline">
              Falar comigo <Mail size={16} />
            </Link>
            {profile?.resumeUrl && (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer noopener" className="btn-outline">
                <Download size={16} /> Currículo
              </a>
            )}
          </motion.div>

          <motion.div variants={fadeUp} className="flex items-center gap-1 pt-1">
            {profile?.githubUrl && (
              <motion.a
                href={profile.githubUrl}
                target="_blank"
                rel="noreferrer noopener"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Github size={20} />
              </motion.a>
            )}
            {profile?.linkedinUrl && (
              <motion.a
                href={profile.linkedinUrl}
                target="_blank"
                rel="noreferrer noopener"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Linkedin size={20} />
              </motion.a>
            )}
            {profile?.instagramUrl && (
              <motion.a
                href={profile.instagramUrl}
                target="_blank"
                rel="noreferrer noopener"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Instagram size={20} />
              </motion.a>
            )}
            {profile?.twitterUrl && (
              <motion.a
                href={profile.twitterUrl}
                target="_blank"
                rel="noreferrer noopener"
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Twitter size={20} />
              </motion.a>
            )}
            {profile?.email && (
              <motion.a
                href={`mailto:${profile.email}`}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="tap text-(--t4) transition-colors hover:text-(--t1)"
              >
                <Mail size={20} />
              </motion.a>
            )}
          </motion.div>
        </motion.div>

        {/* Avatar flutuante com glow */}
        <motion.div
          className="order-1 flex justify-center lg:order-2 lg:justify-end"
          variants={fadeRight}
          initial="hidden"
          animate="visible"
        >
          <div className="relative">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: "radial-gradient(circle, rgba(14,165,233,0.25) 0%, transparent 70%)" }}
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10"
            >
              {profile?.photoUrl ? (
                <img
                  src={profile.photoUrl}
                  alt={profile?.fullName || "Avatar"}
                  className="h-52 w-52 rounded-3xl border-2 border-[rgba(14,165,233,0.3)] object-cover shadow-2xl sm:h-64 sm:w-64 lg:h-72 lg:w-72"
                  style={{ boxShadow: "0 0 60px rgba(14,165,233,0.2), 0 25px 50px rgba(0,0,0,0.4)" }}
                />
              ) : (
                <div
                  className="flex h-52 w-52 items-center justify-center rounded-3xl border-2 border-[rgba(14,165,233,0.3)] shadow-2xl sm:h-64 sm:w-64 lg:h-72 lg:w-72"
                  style={{
                    background: "linear-gradient(135deg, rgba(14,165,233,0.2), rgba(139,92,246,0.2))",
                    boxShadow: "0 0 60px rgba(14,165,233,0.2), 0 25px 50px rgba(0,0,0,0.4)",
                  }}
                >
                  <Code2 size={72} className="text-brand-400 opacity-60" />
                </div>
              )}

              {projectCount > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: 20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
                  className="absolute -bottom-4 -right-4 rounded-2xl bg-brand-500 px-3 py-2 text-center text-white shadow-lg"
                  style={{ boxShadow: "0 8px 24px rgba(14,165,233,0.4)" }}
                >
                  <p className="text-xl font-bold leading-none">{projectCount}+</p>
                  <p className="mt-0.5 text-xs opacity-90">projetos</p>
                </motion.div>
              )}

              {profile?.availableForWork && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 1, type: "spring", stiffness: 200 }}
                  className="absolute -left-4 -top-4 rounded-2xl border border-emerald-500/30 bg-(--s2) px-3 py-2 text-xs font-semibold text-emerald-400 shadow-lg"
                >
                  <span className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                    Disponível
                  </span>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}