-- Campos usados pela vitrine pública para sinalizar disponibilidade
-- e oferecer o download do currículo em PDF.
ALTER TABLE profile
    ADD COLUMN resume_url VARCHAR(500),
    ADD COLUMN available_for_work BOOLEAN NOT NULL DEFAULT TRUE;
