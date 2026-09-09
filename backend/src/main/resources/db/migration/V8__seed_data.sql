-- =====================================================================
-- Seed Data - Portfolio Profissional Full-Stack
-- =====================================================================

-- 1. Atualiza o profile padrão (id = 1) com dados reais
UPDATE profile
SET full_name = 'Alexandre Silva',
    headline = 'Desenvolvedor Full-Stack & Arquiteto de Software',
    bio = 'Desenvolvedor apaixonado por criar aplicações web robustas, escaláveis e com ótima experiência de usuário. Experiência sólida com Java, Spring Boot, React e ecossistema Cloud.',
    photo_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500',
    email = 'alexandre.dev@exemplo.com',
    phone = '+55 (11) 98765-4321',
    github_url = 'https://github.com/exemplo',
    linkedin_url = 'https://linkedin.com/in/exemplo',
    website_url = 'https://alexandresilva.dev',
    resume_url = 'https://alexandresilva.dev/cv.pdf',
    available_for_work = true,
    instagram_url = 'https://instagram.com/exemplo',
    twitter_url = 'https://twitter.com/exemplo'
WHERE id = 1;

-- 1.1 Cargos/títulos para o efeito de máquina de escrever do Hero
INSERT INTO profile_roles (profile_id, role, display_order) VALUES
(1, 'Desenvolvedor Full-Stack', 1),
(1, 'Engenheiro de Software', 2),
(1, 'Especialista em Spring Boot', 3),
(1, 'Arquiteto de Soluções', 4);

-- 2. Endereço principal do perfil
INSERT INTO address (profile_id, type, street, number, complement, neighborhood, city, state, country, zip_code, primary_address)
VALUES (1, 'RESIDENTIAL', 'Avenida Paulista', '1000', 'Apto 42', 'Bela Vista', 'São Paulo', 'SP', 'Brasil', '01310-100', true);

-- 3. Projetos do Portfolio (5 projetos completos)
INSERT INTO project (id, title, short_description, description, repository_url, demo_url, image_url, status, featured, display_order, start_date, end_date)
VALUES
(1, 'E-Commerce Microservices API', 'API robusta para comércio eletrônico utilizando arquitetura de microsserviços.', 'Sistema completo de e-commerce desenvolvido com Spring Boot, Spring Cloud, mensageria com RabbitMQ e banco de dados PostgreSQL. Inclui gateway, autenticação JWT, carrinho de compras e processamento de pagamentos.', 'https://github.com/exemplo/ecommerce-microservices', 'https://ecommerce-demo.exemplo.com', 'https://images.unsplash.com/photo-1557821552-17105176678c?w=800', 'COMPLETED', true, 1, '2025-01-10', '2025-06-15'),

(2, 'Task Manager SaaS', 'Plataforma de gerenciamento de tarefas e projetos em tempo real.', 'Aplicação full-stack com painel Kanban interativo, notificações em tempo real via WebSockets, controle de equipes e relatórios de produtividade analíticos.', 'https://github.com/exemplo/task-manager-saas', 'https://tasks.exemplo.com', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800', 'COMPLETED', true, 2, '2025-07-01', '2025-11-20'),

(3, 'Portfolio Profissional Full-Stack', 'O próprio sistema de portfolio pessoal com painel administrativo seguro.', 'Backend modular desenvolvido em Spring Boot com persistência via JPA/Hibernate, controle de migrações com Flyway e documentação OpenAPI/Swagger.', 'https://github.com/exemplo/portfolio-backend', 'https://alexandresilva.dev', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800', 'IN_PROGRESS', false, 3, '2026-02-01', NULL),

(4, 'DevOps Metrics Dashboard', 'Painel de monitoramento e métricas de infraestrutura e pipelines CI/CD.', 'Dashboard interativo para acompanhamento de status de containers Docker, consumo de recursos de servidores em nuvem e histórico de builds do GitHub Actions.', 'https://github.com/exemplo/devops-metrics', 'https://metrics.exemplo.com', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 'COMPLETED', true, 4, '2025-12-01', '2026-02-15'),

(5, 'AI Code Assistant CLI', 'Ferramenta de linha de comando para auxílio na revisão de código usando LLMs.', 'CLI construída em Node.js e TypeScript que analisa diffs locais do Git, sugere melhorias de refatoração e detecta potenciais vulnerabilidades de segurança.', 'https://github.com/exemplo/ai-code-assistant', 'https://www.npmjs.com/package/@exemplo/ai-code-cli', 'https://images.unsplash.com/photo-1618401471353-b98aedd04e11?w=800', 'ARCHIVED', false, 5, '2024-08-01', '2024-11-30');

-- 4. Tecnologias associadas aos projetos (project_tech_stack)
INSERT INTO project_tech_stack (project_id, technology) VALUES
(1, 'Java'), (1, 'Spring Boot'), (1, 'Spring Cloud'), (1, 'PostgreSQL'), (1, 'RabbitMQ'), (1, 'Docker'),
(2, 'TypeScript'), (2, 'React'), (2, 'Node.js'), (2, 'Express'), (2, 'MongoDB'), (2, 'TailwindCSS'),
(3, 'Java'), (3, 'Spring Boot'), (3, 'Spring Data JPA'), (3, 'Flyway'), (3, 'PostgreSQL'), (3, 'Docker'),
(4, 'Python'), (4, 'FastAPI'), (4, 'Prometheus'), (4, 'Grafana'), (4, 'Docker'), (4, 'PostgreSQL'),
(5, 'TypeScript'), (5, 'Node.js'), (5, 'OpenAI API'), (5, 'Commander.js');

-- 5. Imagens adicionais da galeria dos projetos (project_image)
INSERT INTO project_image (project_id, url, display_order) VALUES
(1, 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800', 1),
(1, 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800', 2),
(2, 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800', 1),
(4, 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800', 1),
(4, 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800', 2);

-- 6. Habilidades técnicas (Skills) - Separadas individualmente para o Simple Icons
INSERT INTO skill (name, category, proficiency, display_order) VALUES
('Java', 'Backend', 90, 1),
('Spring Boot', 'Backend', 85, 2),
('TypeScript', 'Frontend', 80, 3),
('React', 'Frontend', 75, 4),
('PostgreSQL', 'Banco de Dados', 85, 5),
('Docker', 'DevOps', 70, 6),
('Git', 'Ferramentas', 90, 7),
('Arquitetura de Microsserviços', 'Conceitos', 80, 8);

-- 7. Histórico Acadêmico (Education)
INSERT INTO education (institution, degree, field_of_study, start_date, end_date, description, display_order) VALUES
('Universidade de São Paulo (USP)', 'Bacharelado', 'Ciência da Computação', '2019-02-01', '2023-12-15', 'Foco em engenharia de software, estruturas de dados, algoritmos e sistemas distribuídos.', 1),
('Alura Cursos Online', 'Certificação Avançada', 'Formação Arquiteto Java & Spring Boot', '2024-01-01', '2024-08-30', 'Estudo aprofundado de padrões de projeto, segurança com Spring Security e mensageria.', 2);

-- 8. Certificações profissionais (Certification)
INSERT INTO certification (name, issuer, issue_date, expiration_date, credential_url, image_url, display_order) VALUES
('AWS Certified Developer – Associate', 'Amazon Web Services', '2024-05-10', '2027-05-10', 'https://aws.amazon.com/verification', 'https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?w=300', 1),
('Oracle Certified Professional: Java SE 17 Developer', 'Oracle', '2023-10-15', NULL, 'https://catalog.oracle.com', 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=300', 2);

-- 9. Mensagens de contato simuladas (Contact Message)
INSERT INTO contact_message (name, email, message, status, created_at) VALUES
('Carla Mendes', 'carla.mendes@empresa.com', 'Olá Alexandre, vi seu portfolio e gostei muito dos seus projetos. Temos uma vaga de Backend Engineer aberta, tem interesse em conversar?', 'NEW', now() - interval '2 hours'),
('Lucas Pereira', 'lucas.recrutamento@tech.com', 'Parabéns pelo design e arquitetura do projeto de microsserviços. Gostaria de agendar uma entrevista técnica.', 'READ', now() - interval '1 day');