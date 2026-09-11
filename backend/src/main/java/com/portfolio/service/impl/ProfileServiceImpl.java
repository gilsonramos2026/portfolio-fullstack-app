package com.portfolio.service.impl;

import com.portfolio.domain.Profile;
import com.portfolio.dto.profile.ProfileRequestDTO;
import com.portfolio.dto.profile.ProfileResponseDTO;
import com.portfolio.mapper.ProfileMapper;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.service.ProfileService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementação das regras de negócio do perfil.
 */
@Service
@Transactional(readOnly = true)
public class ProfileServiceImpl implements ProfileService {

    // 🚀 Logger nativo do SLF4J (substitui o @Slf4j do Lombok)
    private static final Logger log = LoggerFactory.LoggerFactory.getLogger(ProfileServiceImpl.class);

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public ProfileServiceImpl(ProfileRepository profileRepository, ProfileMapper profileMapper) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    @Override
    @Transactional
    public ProfileResponseDTO getProfile() {
        Profile profile = findSingletonProfileOrCreateEmpty();
        return profileMapper.toResponseDTO(profile);
    }

    @Override
    @Transactional
    public ProfileResponseDTO upsertProfile(ProfileRequestDTO requestDTO) {
        Profile profile = findSingletonProfileOrCreateEmpty();
        profileMapper.updateEntityFromDto(requestDTO, profile);
        Profile saved = profileRepository.save(profile);
        log.info("Perfil atualizado pelo Admin (id={})", saved.getId());
        return profileMapper.toResponseDTO(saved);
    }

    /**
     * Retorna o primeiro (e único, por convenção) registro de perfil.
     * Caso a tabela esteja vazia, cria um registro mínimo usando instanciação nativa
     * e o persiste, garantindo que a API nunca responda 404 para o perfil.
     */
    private Profile findSingletonProfileOrCreateEmpty() {
        return profileRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> {
                    // 🚀 Instanciação nativa do Java (substitui o Profile.builder() que falhou)
                    Profile newProfile = new Profile();
                    newProfile.setFullName("Seu Nome Completo");
                    newProfile.setEmail("seuemail@exemplo.com");
                    return profileRepository.save(newProfile);
                });
    }
}
