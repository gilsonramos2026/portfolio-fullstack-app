import { TechStackSection } from "../../components/public/about/TechStackSection";
import { FeaturedProjectsSection } from "../../components/public/home/FeaturedProjectsSection";
import { HeroSection } from "../../components/public/home/HeroSection";
import { HomeCtaSection } from "../../components/public/home/HomeCtaSection";
import { StatsSection } from "../../components/public/home/StatsSection";
import { Seo } from "../../components/ui/Seo";
import { useGitHubStats } from "../../hooks/useGitHubStats";
import { useProfile } from "../../hooks/useProfile";
import { useFeaturedProjects, useProjects } from "../../hooks/useProjects";
import { useTechStackSummary } from "../../hooks/useTechStackSummary";

import type { Profile } from "../../types/profile";
import type { PageResponse } from "../../types/api";
import type { Project } from "../../types/project";
import type { GitHubStats } from "../../hooks/useGitHubStats";

export function HomePage() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const profile = profileData as Profile | undefined;

  const { data: featuredData, isLoading: featuredLoading } = useFeaturedProjects({ size: 3 });
  const featured = featuredData as PageResponse<Project> | undefined;

  const { data: allProjectsData } = useProjects({ size: 100 });
  const allProjects = allProjectsData as PageResponse<Project> | undefined;

  const { techStack, isLoading: techLoading } = useTechStackSummary();

  const projectCount = allProjects?.totalElements ?? 0;
  
  const { data: githubStatsData } = useGitHubStats(profile?.githubUrl);
  const githubStats = githubStatsData as GitHubStats | undefined;

  return (
    <div className="content-container">
      <Seo
        title={profile?.fullName ?? "Início"}
        description={profile?.headline || profile?.bio}
        image={profile?.photoUrl}
      />

      <HeroSection
        profile={profile}
        profileLoading={profileLoading}
        projectCount={projectCount}
        githubStats={githubStats}
      />

      {(projectCount > 0 || techStack.length > 0) && (
        <StatsSection
          projectCount={projectCount}
          techStackLength={techStack.length}
          githubStats={githubStats}
        />
      )}

      <TechStackSection techStack={techStack} isLoading={techLoading} />

      <FeaturedProjectsSection featured={featured} isLoading={featuredLoading} />

      <HomeCtaSection linkedinUrl={profile?.linkedinUrl} />
    </div>
  );
}