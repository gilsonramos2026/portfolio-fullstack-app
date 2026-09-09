import { CertificationsSection } from "../../components/admin/about/CertificationsSection";
import { EducationSection } from "../../components/admin/about/EducationSection";
import { ProfileHeader } from "../../components/admin/about/ProfileHeader";
import { SkillsSection } from "../../components/admin/about/SkillsSection";
import { TechStackSection } from "../../components/admin/about/TechStackSection";
import { Seo } from "../../components/ui/Seo";
import { useCertifications } from "../../hooks/useCertifications";
import { useEducations } from "../../hooks/useEducations";
import { useProfile } from "../../hooks/useProfile";
import { useSkills } from "../../hooks/useSkills";
import { useTechStackSummary } from "../../hooks/useTechStackSummary";
import type { Certification } from "../../types/certification";
import type { Education } from "../../types/education";

import type { Profile } from "../../types/profile";
import type { Skill } from "../../types/skill";

export function AboutPage() {
  const { data: profileData, isLoading: profileLoading } = useProfile();
  const profile = profileData as Profile | undefined;

  const { techStack, isLoading: techLoading } = useTechStackSummary();

  const { data: skillsData, isLoading: skillsLoading } = useSkills();
  const skills = skillsData as Skill[] | undefined;

  const { data: eduData, isLoading: eduLoading } = useEducations();
  const educations = eduData as Education[] | undefined;

  const { data: certData, isLoading: certLoading } = useCertifications();
  const certifications = certData as Certification[] | undefined;

  return (
    <div className="content-container py-12 sm:py-20">
      <Seo title="Sobre" description={profile?.bio} image={profile?.photoUrl} />
      
      <ProfileHeader profile={profile} isLoading={profileLoading} />
      <TechStackSection techStack={techStack} isLoading={techLoading} />
      <SkillsSection skills={skills} isLoading={skillsLoading} />
      <EducationSection educations={educations} isLoading={eduLoading} />
      <CertificationsSection certifications={certifications} isLoading={certLoading} />
    </div>
  );
}