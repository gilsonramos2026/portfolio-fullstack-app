package com.portifolio.backend.service;

import com.portifolio.backend.dto.profile.ProfileRequest;
import com.portifolio.backend.dto.profile.ProfileResponse;

public interface ProfileService {
    ProfileResponse getPublicProfile();
    ProfileResponse upsertProfile(String key, ProfileRequest req);
}

