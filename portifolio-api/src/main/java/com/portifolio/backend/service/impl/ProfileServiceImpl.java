package com.portifolio.backend.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.ProfileRepository;
import com.portifolio.backend.service.ProfileService;
import com.portifolio.backend.dto.profile.ProfileMapper;
import com.portifolio.backend.dto.profile.ProfileRequest;
import com.portifolio.backend.dto.profile.ProfileResponse;
import com.portifolio.backend.model.Profile;

@Service
public class ProfileServiceImpl implements ProfileService {

    @Autowired
    private ProfileRepository profileRepo;

    @Autowired
    private ProfileMapper profileMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public ProfileResponse getPublicProfile() {
        Profile p = profileRepo.findFirstByOrderByIdAsc()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Profile metadata not found."));
        return profileMapper.toResponse(p);
    }

    @Override
    public ProfileResponse upsertProfile(String key, ProfileRequest req) {
        checkAdminKey(key);
        // Lógica de Upsert: Busca o primeiro registro, se não existir, instancia um novo objeto Profile
        Profile p = profileRepo.findFirstByOrderByIdAsc().orElse(new Profile());
        profileMapper.updateEntity(p, req);
        return profileMapper.toResponse(profileRepo.save(p));
    }
}
