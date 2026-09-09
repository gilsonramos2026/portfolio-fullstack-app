package com.portfolio.mapper;

import com.portfolio.domain.Profile;
import com.portfolio.dto.profile.ProfileRequestDTO;
import com.portfolio.dto.profile.ProfileResponseDTO;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    private final AddressMapper addressMapper;

    public ProfileMapper(AddressMapper addressMapper) {
        this.addressMapper = addressMapper;
    }

    public void updateEntityFromDto(ProfileRequestDTO dto, Profile profile) {
        profile.setFullName(dto.fullName());
        profile.setHeadline(dto.headline());
        profile.setBio(dto.bio());
        profile.setPhotoUrl(dto.photoUrl());
        profile.setEmail(dto.email());
        profile.setPhone(dto.phone());
        profile.setGithubUrl(dto.githubUrl());
        profile.setLinkedinUrl(dto.linkedinUrl());
        profile.setInstagramUrl(dto.instagramUrl());
        profile.setTwitterUrl(dto.twitterUrl());
        profile.setWebsiteUrl(dto.websiteUrl());
        profile.setResumeUrl(dto.resumeUrl());
        profile.setRoles(dto.roles() != null ? dto.roles() : java.util.List.of());
        profile.setAvailableForWork(dto.availableForWork());
    }

    public ProfileResponseDTO toResponseDTO(Profile profile) {
        return new ProfileResponseDTO(
                profile.getId(),
                profile.getFullName(),
                profile.getHeadline(),
                profile.getBio(),
                profile.getPhotoUrl(),
                profile.getEmail(),
                profile.getPhone(),
                profile.getGithubUrl(),
                profile.getLinkedinUrl(),
                profile.getInstagramUrl(),
                profile.getTwitterUrl(),
                profile.getWebsiteUrl(),
                profile.getResumeUrl(),
                profile.getRoles(),
                profile.isAvailableForWork(),
                addressMapper.toResponseDTOList(profile.getAddresses()),
                profile.getCreatedAt(),
                profile.getUpdatedAt());
    }
}
