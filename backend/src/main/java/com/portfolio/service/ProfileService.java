package com.portfolio.service;


import com.portfolio.dto.profile.ProfileRequestDTO;
import com.portfolio.dto.profile.ProfileResponseDTO;

/**
 * Regras de negócio para o perfil (dados pessoais e foto).
 * O perfil é tratado como recurso único (singleton) da aplicação.
 */
public interface ProfileService {

    ProfileResponseDTO getProfile();

    ProfileResponseDTO upsertProfile(ProfileRequestDTO requestDTO);
}
