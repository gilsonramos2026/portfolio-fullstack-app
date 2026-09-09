CREATE TABLE skill (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    category VARCHAR(60),
    proficiency INTEGER NOT NULL DEFAULT 70,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT chk_skill_proficiency CHECK (proficiency BETWEEN 0 AND 100)
);

CREATE TABLE education (
    id BIGSERIAL PRIMARY KEY,
    institution VARCHAR(150) NOT NULL,
    degree VARCHAR(150) NOT NULL,
    field_of_study VARCHAR(150),
    start_date DATE NOT NULL,
    end_date DATE,
    description TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE certification (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    issuer VARCHAR(150) NOT NULL,
    issue_date DATE NOT NULL,
    expiration_date DATE,
    credential_url VARCHAR(500),
    image_url VARCHAR(500),
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_skill_display_order ON skill(display_order);
CREATE INDEX idx_education_display_order ON education(display_order);
CREATE INDEX idx_certification_display_order ON certification(display_order);
