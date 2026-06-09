package com.portifolio.backend.mapper;

import org.springframework.stereotype.Component;
import com.portifolio.backend.dto.profile.ProfileRequest;
import com.portifolio.backend.dto.profile.ProfileResponse;
import com.portifolio.backend.model.Profile;

@Component
public class ProfileMapper {

    public ProfileResponse toResponse(Profile p) {
        if (p == null) return null;
        return ProfileResponse.builder()
                .id(p.getId())
                .name(p.getName())
                .title(p.getTitle())
                .tagline(p.getTagline())
                .bio(p.getBio())
                .email(p.getEmail())
                .phone(p.getPhone())
                .location(p.getLocation())
                .avatarUrl(p.getAvatarUrl())
                .resumeUrl(p.getResumeUrl())
                .githubUrl(p.getGithubUrl())
                .linkedinUrl(p.getLinkedinUrl())
                .twitterUrl(p.getTwitterUrl())
                .websiteUrl(p.getWebsiteUrl())
                .yearsExp(p.getYearsExp())
                .available(p.getAvailable())
                .updatedAt(p.getUpdatedAt())
                .build();
    }

    public void updateEntity(Profile p, ProfileRequest req) {
        if (req == null) return;
        p.setName(req.getName());
        p.setTitle(req.getTitle());
        p.setTagline(req.getTagline());
        p.setBio(req.getBio());
        p.setEmail(req.getEmail());
        p.setPhone(req.getPhone());
        p.setLocation(req.getLocation());
        p.setAvatarUrl(req.getAvatarUrl());
        p.setResumeUrl(req.getResumeUrl());
        p.setGithubUrl(req.getGithubUrl());
        p.setLinkedinUrl(req.getLinkedinUrl());
        p.setTwitterUrl(req.getTwitterUrl());
        p.setWebsiteUrl(req.getWebsiteUrl());
        p.setYearsExp(req.getYearsExp());
        if (req.getAvailable() != null) p.setAvailable(req.getAvailable());
    }
}
