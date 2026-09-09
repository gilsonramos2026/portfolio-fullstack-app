-- Redes sociais adicionais exibidas no Header, Footer e Home.
ALTER TABLE profile
    ADD COLUMN instagram_url VARCHAR(300),
    ADD COLUMN twitter_url VARCHAR(300);
