package com.portifolio.backend.service.impl;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.portifolio.backend.repository.SkillRepository;
import com.portifolio.backend.service.SkillService;
import com.portifolio.backend.dto.skill.SkillRequest;
import com.portifolio.backend.dto.skill.SkillResponse;
import com.portifolio.backend.mapper.SkillMapper;
import com.portifolio.backend.model.Skill;

@Service
public class SkillServiceImpl implements SkillService {

    @Autowired
    private SkillRepository skillRepo;

    @Autowired
    private SkillMapper skillMapper;

    @Value("${app.admin.secret-key:portfolio-admin-key-2026}")
    private String adminSecretKey;

    private void checkAdminKey(String key) {
        if (key == null || !key.equals(adminSecretKey)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Administrative access denied. Invalid key.");
        }
    }

    @Override
    public Map<String, List<SkillResponse>> getPublicGroupedSkills() {
        List<Skill> skills = skillRepo.findByActiveTrueOrderBySortOrderAscNameAsc();
        return skills.stream()
                .collect(Collectors.groupingBy(Skill::getCategory,
                        Collectors.mapping(skillMapper::toResponse, Collectors.toList())));
    }

    @Override
    public List<SkillResponse> getAllSkillsAdmin(String key) {
        checkAdminKey(key);
        return skillRepo.findAll().stream().map(skillMapper::toResponse).toList();
    }

    @Override
    public SkillResponse createSkillAdmin(String key, SkillRequest req) {
        checkAdminKey(key);
        Skill s = new Skill();
        skillMapper.updateEntity(s, req);
        return skillMapper.toResponse(skillRepo.save(s));
    }

    @Override
    public SkillResponse updateSkillAdmin(String key, Long id, SkillRequest req) {
        checkAdminKey(key);
        Skill s = skillRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found."));
        skillMapper.updateEntity(s, req);
        return skillMapper.toResponse(skillRepo.save(s));
    }

    @Override
    public void deleteSkillAdmin(String key, Long id) {
        checkAdminKey(key);
        if (!skillRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Skill not found.");
        }
        skillRepo.deleteById(id);
    }
}
