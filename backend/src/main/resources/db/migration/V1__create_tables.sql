-- =====================================================================
-- V1__create_tables.sql
-- Schema inicial do Portfolio Profissional Full-Stack
-- =====================================================================

-- ---------------------------------------------------------------------
-- Tabela: profile
-- Representa os dados pessoais/públicos exibidos no portfolio.
-- Modelada como "singleton": em regra, existirá uma única linha,
-- mantida (upsert) pelo Admin através do painel.
-- ---------------------------------------------------------------------
CREATE TABLE profile (
    id              BIGSERIAL PRIMARY KEY,
    full_name       VARCHAR(150)  NOT NULL,
    headline        VARCHAR(200),
    bio             TEXT,
    photo_url       VARCHAR(500),
    email           VARCHAR(150)  NOT NULL,
    phone           VARCHAR(30),
    github_url      VARCHAR(300),
    linkedin_url    VARCHAR(300),
    website_url     VARCHAR(300),
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);

COMMENT ON TABLE profile IS 'Dados pessoais e de contato exibidos publicamente no portfolio';

-- ---------------------------------------------------------------------
-- Tabela: address
-- Endereços/contatos vinculados ao perfil (1 perfil -> N endereços).
-- ---------------------------------------------------------------------
CREATE TABLE address (
    id              BIGSERIAL PRIMARY KEY,
    profile_id      BIGINT        NOT NULL REFERENCES profile(id) ON DELETE CASCADE,
    type            VARCHAR(30)   NOT NULL, -- RESIDENTIAL, COMMERCIAL, CONTACT ...
    street          VARCHAR(200)  NOT NULL,
    number          VARCHAR(20),
    complement      VARCHAR(100),
    neighborhood    VARCHAR(100),
    city            VARCHAR(100)  NOT NULL,
    state           VARCHAR(100)  NOT NULL,
    country         VARCHAR(100)  NOT NULL,
    zip_code        VARCHAR(20)   NOT NULL,
    primary_address BOOLEAN       NOT NULL DEFAULT false,
    created_at      TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at      TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_address_profile_id ON address(profile_id);

COMMENT ON TABLE address IS 'Endereços e contatos adicionais vinculados ao perfil';

-- ---------------------------------------------------------------------
-- Tabela: project
-- CRUD completo de projetos exibidos no portfolio.
-- ---------------------------------------------------------------------
CREATE TABLE project (
    id                  BIGSERIAL PRIMARY KEY,
    title               VARCHAR(150)  NOT NULL,
    short_description   VARCHAR(300)  NOT NULL,
    description         TEXT,
    repository_url      VARCHAR(300),
    demo_url            VARCHAR(300),
    image_url           VARCHAR(500),
    status              VARCHAR(30)   NOT NULL DEFAULT 'COMPLETED', -- IN_PROGRESS, COMPLETED, ARCHIVED
    featured            BOOLEAN       NOT NULL DEFAULT false,
    display_order       INTEGER       NOT NULL DEFAULT 0,
    start_date          DATE,
    end_date            DATE,
    created_at          TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at          TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_featured ON project(featured);
CREATE INDEX idx_project_status ON project(status);

COMMENT ON TABLE project IS 'Projetos exibidos no portfolio, com CRUD completo via painel administrativo';

-- ---------------------------------------------------------------------
-- Tabela: project_tech_stack
-- Coleção de tecnologias associadas a cada projeto (ElementCollection).
-- ---------------------------------------------------------------------
CREATE TABLE project_tech_stack (
    project_id      BIGINT        NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    technology      VARCHAR(60)   NOT NULL
);

CREATE INDEX idx_project_tech_stack_project_id ON project_tech_stack(project_id);

-- ---------------------------------------------------------------------
-- Seed inicial: garante que exista sempre 1 registro de profile (id = 1)
-- para que o endpoint público GET /api/profile nunca retorne 404.
-- ---------------------------------------------------------------------
INSERT INTO profile (full_name, headline, bio, email)
VALUES ('Seu Nome Completo', 'Desenvolvedor(a) Full-Stack Júnior',
        'Atualize esta biografia através do painel administrativo.',
        'seuemail@exemplo.com');
