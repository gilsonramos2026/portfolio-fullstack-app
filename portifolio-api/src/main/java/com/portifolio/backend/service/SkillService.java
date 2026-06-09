package com.portifolio.backend.service;

import java.util.List;
import java.util.Map;
import com.portifolio.backend.dto.skill.SkillRequest;
import com.portifolio.backend.dto.skill.SkillResponse;

public interface SkillService {
    Map<String, List<SkillResponse>> getPublicGroupedSkills();
    List<SkillResponse> getAllSkillsAdmin(String key);
    SkillResponse createSkillAdmin(String key, SkillRequest req);
    SkillResponse updateSkillAdmin(String key, Long id, SkillRequest req);
    void deleteSkillAdmin(String key, Long id);
}

