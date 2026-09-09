-- Lista de cargos/títulos que alternam no efeito de máquina de escrever
-- do hero da Home (ex: "Desenvolvedor Full Stack", "Engenheiro de Software").
-- Mesmo padrão de coleção usado em project_tech_stack.
CREATE TABLE profile_roles (
    profile_id BIGINT NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    role VARCHAR(80) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX idx_profile_roles_profile_id ON profile_roles(profile_id, display_order);
