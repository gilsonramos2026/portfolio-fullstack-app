package com.portfolio.service.impl;

import com.portfolio.domain.Profile;
import com.portfolio.dto.profile.ProfileRequestDTO;
import com.portfolio.dto.profile.ProfileResponseDTO;
import com.portfolio.mapper.ProfileMapper;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.service.ProfileService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Implementação das regras de negócio do perfil.
 *
 * <p>O perfil é modelado como recurso único: caso ainda não exista
 * nenhum registro (situação de borda, já que o Flyway garante um seed
 * inicial), o método de leitura cria um perfil vazio na primeira consulta
 * e o método de upsert atualiza o registro existente ou cria um novo.</p>
 */
@Slf4j
@Service
@Transactional(readOnly = true)
public class ProfileServiceImpl implements ProfileService {

    private final ProfileRepository profileRepository;
    private final ProfileMapper profileMapper;

    public ProfileServiceImpl(ProfileRepository profileRepository, ProfileMapper profileMapper) {
        this.profileRepository = profileRepository;
        this.profileMapper = profileMapper;
    }

    // 🚀 ATUALIZADO: Sobrescreve o readOnly global para permitir persistir o perfil se o banco estiver vazio
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
     * Caso a tabela esteja vazia, cria um registro mínimo em memória
     * e o persiste, garantindo que a API nunca responda 404 para o perfil.
     */
    private Profile findSingletonProfileOrCreateEmpty() {
        return profileRepository.findAll().stream()
                .findFirst()
                .orElseGet(() -> profileRepository.save(
                        Profile.builder()
                                .fullName("Seu Nome Completo")
                                .email("seuemail@exemplo.com")
                                .build()));
    }
}
