# Portfolio Profissional Full-Stack — Backend

API REST em **Java 21 + Spring Boot 3** que centraliza o conteúdo de um portfolio profissional. Um painel administrativo (a ser consumido por um front-end) gerencia **absolutamente tudo**: dados pessoais, foto de perfil, endereços/contatos, habilidades, formação acadêmica, certificações e o CRUD completo de projetos.

## 1. Arquitetura corporativa (visão geral)

```
┌─────────────────────────┐        HTTPS/JSON        ┌──────────────────────────────┐
│   Front-end (SPA/App)   │ ────────────────────────▶ │        Portfolio API          │
│  - Área pública          │                            │  Spring Boot 3 / Java 21      │
│  - Painel Admin          │ ◀──────────────────────── │  (Controller→Service→Repo)    │
└─────────────────────────┘   X-Admin-Token (mutação)  └───────────────┬───────────────┘
                                                                        │ Spring Data JPA
                                                                        ▼
                                                          ┌──────────────────────────┐
                                                          │   PostgreSQL (Flyway)     │
                                                          │  profile / address /      │
                                                          │  project / skill /        │
                                                          │  education / certification│
                                                          └──────────────────────────┘
```

### Recursos da API

| Recurso | Rota base | GET | POST/PUT/DELETE |
|---|---|---|---|
| Perfil | `/api/profile` | público | Admin |
| Endereços/contatos | `/api/profile/addresses` | público | Admin |
| Projetos | `/api/projects` | público | Admin |
| Galeria de imagens do projeto | `/api/projects/{id}/images` | — | Admin |
| Habilidades | `/api/skills` | público | Admin |
| Formação acadêmica | `/api/educations` | público | Admin |
| Certificações | `/api/certifications` | público | Admin |
| Mensagens de contato | `/api/contact-messages` | **Admin** ⚠️ | **público (só POST)** ⚠️ |
| Uploads | `/api/uploads/{images,documents}` | — | Admin |
| Sessão admin | `/api/admin/session/validate` | — | Admin |

> ⚠️ **Único recurso com a regra invertida**: o formulário de contato do
> site precisa funcionar para qualquer visitante, então `POST` é público;
> as mensagens recebidas são privadas, então `GET` exige `X-Admin-Token`.
> Essa exceção está isolada e documentada diretamente no
> `AdminTokenFilter`. O `POST` também é limitado a 5 envios por IP a
> cada 30 minutos (`ContactRateLimiter`, em memória).

**Decisões de arquitetura:**

- **Sem tabela de usuários**: aplicação single-tenant (1 dono de portfolio). A autenticação do Admin é feita por **token estático** (`X-Admin-Token`), validado em um `Filter` de baixo nível, sem overhead de Spring Security/JWT — adequado ao escopo do projeto.
- **Leitura pública / escrita protegida**: todo `GET` é público (o portfolio precisa ser visto por recrutadores sem login); todo `POST/PUT/PATCH/DELETE` exige o token.
- **Perfil como singleton**: a tabela `profile` guarda uma única linha lógica, atualizada via *upsert* (`PUT /api/profile`), evitando a complexidade de múltiplos perfis para um caso de uso pessoal.
- **Camadas estritas**: `Controller` (HTTP/Swagger) → `Service` (interface, regra de negócio) → `ServiceImpl` → `Repository` (JPA) → `Entity`. `DTO`s isolam a API do modelo de persistência; `Mapper`s fazem a tradução.
- **Auditoria automática**: `@CreatedDate`/`@LastModifiedDate` via `@EntityListeners(AuditingEntityListener.class)` + `@EnableJpaAuditing`.
- **Schema como código**: Flyway é a única fonte de verdade do banco (`ddl-auto: validate`), garantindo migrações rastreáveis e reproduzíveis.

### Upload de arquivos

Foto de perfil, capa de projeto e currículo em PDF são enviados via
`multipart/form-data` para `POST /api/uploads/images` (JPG/PNG/WEBP, até
5MB) ou `POST /api/uploads/documents` (PDF, até 10MB) — ambas rotas POST,
logo já protegidas pelo `AdminTokenFilter`. A resposta traz só a URL
pública do arquivo; o Admin ainda envia essa URL no payload de
`PUT /profile` ou `POST/PUT /projects` para associá-la ao registro —
upload e persistência de dados ficam desacoplados.

A implementação (`LocalFileStorageService`) grava em disco local, num
diretório configurável (`app.upload.dir`, padrão `./uploads`), organizado
em `images/` e `documents/`, e serve os arquivos estaticamente em
`/uploads/**` via `WebConfig`. Trocar para um provider de object storage
(S3, GCS, Cloudinary) significa apenas criar uma nova implementação de
`FileStorageService` — controllers e regras de negócio não mudam.

> Em produção, aponte `APP_UPLOAD_DIR` para um volume persistente (o
> filesystem de containers efêmeros como Heroku/Render em plano free é
> apagado a cada deploy) e `APP_UPLOAD_PUBLIC_URL` para o domínio público
> do backend.

## 2. Árvore de diretórios do backend

```
portfolio-backend/
├── .github/
│   └── workflows/
│       └── ci.yml
├── src/
│   ├── main/
│   │   ├── java/com/portfolio/backend/
│   │   │   ├── PortfolioBackendApplication.java
│   │   │   ├── config/
│   │   │   │   ├── JpaAuditingConfig.java
│   │   │   │   ├── OpenApiConfig.java
│   │   │   │   └── WebConfig.java              (CORS + estático de /uploads/**)
│   │   │   ├── security/
│   │   │   │   ├── AdminTokenFilter.java
│   │   │   │   └── FilterConfig.java
│   │   │   ├── domain/
│   │   │   │   ├── Profile.java
│   │   │   │   ├── Address.java
│   │   │   │   ├── AddressType.java
│   │   │   │   ├── Project.java
│   │   │   │   ├── ProjectStatus.java
│   │   │   │   ├── Skill.java
│   │   │   │   ├── Education.java
│   │   │   │   ├── Certification.java
│   │   │   │   ├── ContactMessage.java
│   │   │   │   ├── ContactMessageStatus.java   (NEW / READ / REPLIED / ARCHIVED)
│   │   │   │   ├── ProjectImage.java           (galeria de screenshots)
│   │   │   │   └── UploadKind.java             (IMAGE / DOCUMENT)
│   │   │   ├── repository/
│   │   │   │   ├── ProfileRepository.java
│   │   │   │   ├── AddressRepository.java
│   │   │   │   ├── ProjectRepository.java
│   │   │   │   ├── SkillRepository.java
│   │   │   │   ├── EducationRepository.java
│   │   │   │   ├── CertificationRepository.java
│   │   │   │   ├── ContactMessageRepository.java
│   │   │   │   └── ProjectImageRepository.java
│   │   │   ├── dto/
│   │   │   │   ├── profile/
│   │   │   │   │   ├── ProfileRequestDTO.java
│   │   │   │   │   └── ProfileResponseDTO.java
│   │   │   │   ├── address/
│   │   │   │   │   ├── AddressRequestDTO.java
│   │   │   │   │   └── AddressResponseDTO.java
│   │   │   │   ├── project/
│   │   │   │   │   ├── ProjectRequestDTO.java
│   │   │   │   │   ├── ProjectResponseDTO.java         (inclui a galeria)
│   │   │   │   │   └── ProjectImageResponseDTO.java
│   │   │   │   ├── skill/
│   │   │   │   │   ├── SkillRequestDTO.java
│   │   │   │   │   └── SkillResponseDTO.java
│   │   │   │   ├── education/
│   │   │   │   │   ├── EducationRequestDTO.java
│   │   │   │   │   └── EducationResponseDTO.java
│   │   │   │   ├── certification/
│   │   │   │   │   ├── CertificationRequestDTO.java
│   │   │   │   │   └── CertificationResponseDTO.java
│   │   │   │   ├── contact/
│   │   │   │   │   ├── ContactMessageRequestDTO.java   (inclui honeypot anti-spam)
│   │   │   │   │   ├── ContactMessageResponseDTO.java
│   │   │   │   │   └── ContactMessageStatusUpdateDTO.java
│   │   │   │   ├── upload/
│   │   │   │   │   └── UploadResponseDTO.java
│   │   │   │   └── error/
│   │   │   │       └── ApiErrorResponse.java
│   │   │   ├── mapper/
│   │   │   │   ├── ProfileMapper.java
│   │   │   │   ├── AddressMapper.java
│   │   │   │   ├── ProjectMapper.java           (mapeia a galeria também)
│   │   │   │   ├── SkillMapper.java
│   │   │   │   ├── EducationMapper.java
│   │   │   │   ├── CertificationMapper.java
│   │   │   │   └── ContactMessageMapper.java
│   │   │   ├── service/
│   │   │   │   ├── ProfileService.java
│   │   │   │   ├── AddressService.java
│   │   │   │   ├── ProjectService.java
│   │   │   │   ├── ProjectImageService.java     (galeria: add/remover/reordenar)
│   │   │   │   ├── SkillService.java
│   │   │   │   ├── EducationService.java
│   │   │   │   ├── CertificationService.java
│   │   │   │   ├── ContactMessageService.java
│   │   │   │   ├── FileStorageService.java
│   │   │   │   └── impl/
│   │   │   │       ├── ProfileServiceImpl.java
│   │   │   │       ├── AddressServiceImpl.java
│   │   │   │       ├── ProjectServiceImpl.java
│   │   │   │       ├── ProjectImageServiceImpl.java
│   │   │   │       ├── SkillServiceImpl.java
│   │   │   │       ├── EducationServiceImpl.java
│   │   │   │       ├── CertificationServiceImpl.java
│   │   │   │       ├── ContactMessageServiceImpl.java
│   │   │   │       └── LocalFileStorageService.java
│   │   │   ├── ratelimit/
│   │   │   │   └── ContactRateLimiter.java      (sliding window em memória, 5/30min por IP)
│   │   │   ├── controller/
│   │   │   │   ├── ProfileController.java
│   │   │   │   ├── AddressController.java
│   │   │   │   ├── ProjectController.java
│   │   │   │   ├── ProjectImageController.java
│   │   │   │   ├── SkillController.java
│   │   │   │   ├── EducationController.java
│   │   │   │   ├── CertificationController.java
│   │   │   │   ├── ContactMessageController.java
│   │   │   │   ├── UploadController.java
│   │   │   │   └── AdminSessionController.java
│   │   │   └── exception/
│   │   │       ├── ResourceNotFoundException.java
│   │   │       ├── BusinessException.java
│   │   │       ├── FileStorageException.java
│   │   │       ├── RateLimitExceededException.java
│   │   │       └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── db/migration/
│   │           ├── V1__create_tables.sql
│   │           ├── V2__add_resume_and_availability.sql
│   │           ├── V3__create_skill_education_certification.sql
│   │           ├── V4__add_social_links.sql
│   │           ├── V5__create_contact_message.sql
│   │           ├── V6__project_images_and_message_status.sql
│   │           └── V7__profile_roles.sql
│   └── test/
│       ├── java/com/portfolio/backend/
│       │   ├── service/
│       │   │   ├── ProjectServiceImplTest.java      (JUnit 5 + Mockito)
│       │   │   └── LocalFileStorageServiceTest.java (JUnit 5 + AssertJ)
│       │   └── integration/
│       │       └── ProjectControllerIntegrationTest.java (Testcontainers)
│       └── resources/
│           └── application-test.yml
├── pom.xml
├── .gitignore
└── README.md
```

## 3. Modelo de dados (resumo)

| Tabela               | Descrição                                                          |
|----------------------|----------------------------------------------------------------------|
| `profile`            | Dados pessoais, foto, bio e links de contato (registro único)       |
| `address`             | Endereços/contatos vinculados ao perfil (1:N)                       |
| `project`             | Projetos exibidos no portfolio (CRUD completo)                      |
| `project_tech_stack`  | Tecnologias de cada projeto (`@ElementCollection`)                  |

## 4. Segurança das rotas administrativas

Toda rota de mutação (`POST`, `PUT`, `PATCH`, `DELETE`) sob `/api/**` exige o header:

```
X-Admin-Token: <valor configurado em admin.token>
```

O token é validado pelo `AdminTokenFilter`, registrado via `FilterRegistrationBean` apenas para `/api/*`. Requisições sem o header, ou com valor divergente do configurado, recebem `401 Unauthorized` no formato JSON padronizado da API — sem sequer chegar ao Controller. A comparação usa `MessageDigest.isEqual` (tempo constante), para não vazar o token por diferença de latência entre tentativas.

**Exceção deliberada — `/api/contact-messages`**: é o único recurso onde
a regra se inverte. `POST` é público (o formulário de contato do site
precisa funcionar para qualquer visitante); `GET` exige o token (as
mensagens recebidas são privadas). O request de envio também inclui um
campo honeypot (`website`) — invisível para humanos via CSS no frontend,
mas frequentemente preenchido por bots de spam automatizados; se vier
preenchido, a mensagem é descartada silenciosamente.

O envio também passa por um rate limiter em memória
(`ContactRateLimiter`): no máximo 5 mensagens por IP a cada 30 minutos,
excedido isso a API responde `429 Too Many Requests`. Por ser em
memória local da instância, esse limite **não é compartilhado entre
réplicas** em um deploy horizontalmente escalado — para esse cenário,
troque por um contador centralizado (Redis, ex: Bucket4j com backend
Redis).

**Nunca** faça commit do token real. Em produção, sobrescreva via variável de ambiente `ADMIN_TOKEN`.

## 5. Guia de execução local (sem Docker para a aplicação)

Pré-requisitos: **JDK 21**, **Maven 3.9+** e **PostgreSQL 14+** instalados localmente.

### Passo 1 — Instalar e subir o PostgreSQL localmente

**Linux (apt):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

**macOS (Homebrew):**
```bash
brew install postgresql@16
brew services start postgresql@16
```

**Windows:** baixe o instalador em https://www.postgresql.org/download/windows/ e conclua o wizard (mantenha o serviço "postgresql" em execução).

### Passo 2 — Criar o banco e o usuário da aplicação

Acesse o `psql` como superusuário e execute:

```sql
CREATE DATABASE portfolio_db;
CREATE USER portfolio_user WITH ENCRYPTED PASSWORD 'portfolio_pass';
GRANT ALL PRIVILEGES ON DATABASE portfolio_db TO portfolio_user;
ALTER DATABASE portfolio_db OWNER TO portfolio_user;
```

> Os valores acima já são o *default* do `application.yml`. Se usar credenciais diferentes, exporte as variáveis de ambiente `DB_URL`, `DB_USERNAME` e `DB_PASSWORD` antes do próximo passo.

### Passo 3 — Definir o token administrativo

```bash
export ADMIN_TOKEN=meu-token-super-secreto-local
```

(No Windows PowerShell: `$env:ADMIN_TOKEN="meu-token-super-secreto-local"`)

> Opcional: `APP_UPLOAD_DIR` (padrão `./uploads`, relativo à pasta onde o
> Maven roda) e `APP_UPLOAD_PUBLIC_URL` (padrão
> `http://localhost:8080/uploads`) controlam onde os arquivos enviados
> pelo Admin (foto, capa de projeto, currículo) são salvos e a partir de
> qual URL ficam acessíveis. Os defaults já funcionam para rodar local.

### Passo 4 — Compilar e subir o backend via Maven

Na raiz do projeto (`portfolio-backend/`):

```bash
mvn clean install
mvn spring-boot:run
```

O Flyway executa `V1__create_tables.sql`, `V2__add_resume_and_availability.sql`,
`V3__create_skill_education_certification.sql`, `V4__add_social_links.sql`,
`V5__create_contact_message.sql`, `V6__project_images_and_message_status.sql`
e `V7__profile_roles.sql` automaticamente na primeira subida, criando as
tabelas e o registro inicial de `profile`.

A aplicação sobe em: **http://localhost:8080**

### Passo 5 — Acessar o Swagger UI

Abra no navegador:

```
http://localhost:8080/swagger-ui.html
```

Para testar as rotas administrativas, clique em **Authorize**, informe o valor de `X-Admin-Token` definido no Passo 3 e execute normalmente `POST`, `PUT` ou `DELETE` nos endpoints de perfil, endereços, projetos e uploads.

### Passo 6 — Rodar os testes

```bash
# Testes unitários (Service, JUnit 5 + Mockito)
mvn test -Dtest=ProjectServiceImplTest

# Suíte completa, incluindo o teste de integração com Testcontainers
# (requer Docker em execução, apenas para os testes)
mvn test
```

## 6. Principais endpoints

| Método | Rota                              | Acesso   | Descrição                          |
|--------|------------------------------------|----------|--------------------------------------|
| GET    | `/api/profile`                     | Público  | Consultar perfil                     |
| PUT    | `/api/profile`                     | Admin    | Criar/atualizar perfil (upsert)      |
| GET    | `/api/profile/addresses`           | Público  | Listar endereços/contatos            |
| POST   | `/api/profile/addresses`           | Admin    | Criar endereço/contato               |
| PUT    | `/api/profile/addresses/{id}`      | Admin    | Atualizar endereço/contato           |
| DELETE | `/api/profile/addresses/{id}`      | Admin    | Remover endereço/contato             |
| GET    | `/api/projects`                    | Público  | Listar projetos (paginado)           |
| GET    | `/api/projects/featured`           | Público  | Listar projetos em destaque          |
| GET    | `/api/projects/{id}`               | Público  | Detalhe do projeto                   |
| POST   | `/api/projects`                    | Admin    | Criar projeto                        |
| PUT    | `/api/projects/{id}`                | Admin    | Atualizar projeto                    |
| DELETE | `/api/projects/{id}`                | Admin    | Remover projeto                      |

## 7. CI/CD

O workflow `.github/workflows/ci.yml` executa, a cada push/PR em `main`/`develop`: build com Maven, testes (unitários + integração com PostgreSQL de serviço), publicação do relatório de testes e empacotamento do `.jar`.
