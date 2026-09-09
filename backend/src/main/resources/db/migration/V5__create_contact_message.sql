CREATE TABLE contact_message (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    message VARCHAR(2000) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT now(),
    updated_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE INDEX idx_contact_message_is_read ON contact_message(is_read);
CREATE INDEX idx_contact_message_created_at ON contact_message(created_at DESC);
