-- Galeria de múltiplas imagens por projeto (screenshots), com ordem de exibição.
CREATE TABLE project_image (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES project(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_project_image_project_id ON project_image(project_id, display_order);

-- Mensagens de contato passam de um booleano "lida" para um status com
-- workflow completo (Nova/Lida/Respondida/Arquivada), como no restante
-- do painel administrativo.
ALTER TABLE contact_message ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'NEW';
UPDATE contact_message SET status = 'READ' WHERE is_read = TRUE;
ALTER TABLE contact_message DROP COLUMN is_read;

CREATE INDEX idx_contact_message_status ON contact_message(status);
