# Portfólio Profissional — Frontend

SPA em **React + TypeScript (Vite)** que consome a API do `portfolio-backend`.
Área pública 100% dinâmica (perfil, endereços e projetos vêm da API) e painel
administrativo protegido por token (`X-Admin-Token`) para gerenciar tudo:
dados pessoais, foto de perfil, endereços/contatos e o CRUD de projetos.

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 (100% CSS-first, via `@theme` em `src/index.css` — sem `tailwind.config.js`)
- React Router DOM v6
- TanStack Query v5 (cache, paginação, `keepPreviousData`)
- Axios com interceptors (injeção de `X-Admin-Token` + tratamento global de 401)
- Ícones de tecnologia via CDN do [simple-icons](https://simpleicons.org)
  (`cdn.simpleicons.org/{slug}`) — logos reais de marca, sem custo de bundle
- `lucide-react` para os ícones de interface (nav, botões, formulários)
- `framer-motion` + `react-type-animation` + `react-intersection-observer`
  para as animações (ver seção [Animações](#animações))
- `react-hot-toast` para notificações de feedback no painel admin

## Identidade visual

A UI foi **clonada 1:1** de um projeto de referência fornecido pelo usuário
(a pedido explícito) — cores, tipografia, componentes e tema claro/escuro
seguem exatamente esse sistema, com apenas os *dados* vindos da nossa API:

- **Paleta**: navy escuro (`--bg #020617`) com acento "sky blue"
  (`--color-brand-500 #0ea5e9`) + violeta (`--color-accent-500 #8b5cf6`).
  Tema claro em `[data-theme="light"]`, alternável via `ThemeToggle`
  (persistido em `localStorage`, sem flash no primeiro paint — script
  inline em `index.html`).
- **Tipografia**: `Syne` (display/headlines), `Plus Jakarta Sans` (corpo),
  `JetBrains Mono` (dados/código).
- **Componentes utilitários** em `index.css` (`@layer components`): `.card`,
  `.btn-primary`/`.btn-outline`/`.btn-danger`, `.input`, `.nav-link`, `.tag`,
  `.chip`, `.theme-toggle`, `.admin-table`, `.text-gradient`.
- **Contexto próprio**: `context/ThemeContext.tsx` + `hooks/useTheme.ts`.

> Nosso backend não tem os mesmos campos/entidades do projeto de referência
> (ele tinha Skills, Experiences, Educations, Certifications, Testimonials
> — nós não). O clone é fiel à *estilização*; a estrutura de conteúdo é a
> do nosso domínio real (Perfil, Endereços, Projetos).

## Árvore de diretórios

```
portfolio-frontend/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json / tsconfig.app.json / tsconfig.node.json
├── .env.example
├── public/
│   └── favicon.svg
└── src/
    ├── main.tsx
    ├── App.tsx                        → providers globais (Router, QueryClient, AdminAuth)
    ├── index.css                      → Tailwind v4 @theme (design tokens)
    ├── vite-env.d.ts
    │
    ├── routes/
    │   └── AppRoutes.tsx               → toda a configuração de rotas
    │
    ├── layouts/
    │   ├── PublicLayout.tsx            → Header + <Outlet/> + Footer
    │   └── AdminLayout.tsx             → Sidebar + <Outlet/>
    │
    ├── components/
    │   ├── ui/                         → Button, Input, Textarea, Badge, Skeleton, Seo,
    │   │                                  ScrollToTop, ImageUploadField, DocumentUploadField, FadeIn
    │   ├── public/
    │   │   ├── Header.tsx              → nav + dados do perfil
    │   │   ├── Footer.tsx              → contato + endereços dinâmicos + badge de disponibilidade
    │   │   ├── AvailabilityBadge.tsx   → selo "disponível para oportunidades"
    │   │   ├── ProjectCard.tsx         → card de grid (capa: galeria[0] ou imageUrl)
    │   │   ├── ProjectCardSkeleton.tsx
    │   │   ├── ProjectGallery.tsx      → galeria pública com lightbox (teclado, miniaturas)
    │   │   ├── AvailabilityBadge.tsx
    │   │   └── ContactForm.tsx
    │   └── admin/
    │       ├── Sidebar.tsx
    │       ├── ProtectedRoute.tsx      → guarda de rota autenticada
    │       ├── StatCard.tsx
    │       ├── ProjectTable.tsx
    │       ├── AddressFormList.tsx
    │       ├── SkillManager.tsx
    │       ├── EducationManager.tsx
    │       ├── CertificationManager.tsx
    │       └── ProjectImageManager.tsx → upload múltiplo + drag-to-reorder + apagar
    │
    ├── pages/
    │   ├── public/
    │   │   ├── HomePage.tsx
    │   │   ├── AboutPage.tsx           → bio, stack, habilidades, formação, certificações
    │   │   ├── ProjectsPage.tsx        → grid + busca + filtro por tag
    │   │   ├── ProjectDetailPage.tsx   → rota dinâmica /projetos/:id
    │   │   ├── ContactPage.tsx
    │   │   └── NotFoundPage.tsx
    │   └── admin/
    │       ├── LoginPage.tsx
    │       ├── DashboardPage.tsx
    │       ├── ProfileSettingsPage.tsx → dados pessoais + foto + currículo
    │       ├── AddressesSettingsPage.tsx
    │       ├── CurriculumAdminPage.tsx → abas: habilidades / formação / certificações
    │       ├── ContactMessagesAdminPage.tsx → status Nova/Lida/Respondida/Arquivada + filtro
    │       ├── ProjectsAdminPage.tsx
    │       └── ProjectFormPage.tsx     → criar/editar (/admin/projetos/novo|:id)
    │
    ├── hooks/                          → useProfile, useProjects, useFeaturedProjects,
    │                                      useProject, useAddresses, useSkills, useEducations,
    │                                      useCertifications, useContactMessages, useGitHubStats,
    │                                      useTechStackSummary, useUpload (imagem/documento),
    │                                      use*Mutations (inclui galeria: useAddProjectImage,
    │                                      useRemoveProjectImage, useReorderProjectImages),
    │                                      useAdminAuth
    ├── context/
    │   ├── AdminAuthContext.tsx        → sessão do token admin (sessionStorage)
    │   └── ThemeContext.tsx            → tema claro/escuro (localStorage)
    ├── services/
    │   ├── apiClient.ts                → instância Axios + interceptors
    │   ├── profileService.ts
    │   ├── addressService.ts
    │   ├── projectService.ts
    │   ├── skillService.ts
    │   ├── educationService.ts
    │   ├── certificationService.ts
    │   ├── contactMessageService.ts
    │   └── uploadService.ts            → multipart upload (imagens/documentos)
    ├── types/                          → Profile, Project, Address, Skill, Education,
    │                                      Certification, ContactMessage, PageResponse,
    │                                      ApiErrorResponse
    ├── utils/
    │   ├── techIcons.tsx               → ícones de marca via CDN simpleicons.org
    │   ├── formatters.ts
    │   └── vcard.ts                    → gera e baixa um .vcf a partir do Perfil
    └── lib/
        ├── queryClient.ts              → instância do TanStack Query + query keys
        └── motionVariants.ts           → variantes reutilizáveis do framer-motion
```

## Como a autenticação admin funciona no frontend

O backend **não tem tabela de usuários** — só um token fixo validado via header
`X-Admin-Token`. O frontend replica esse modelo simples:

1. Na tela `/admin/login`, o token digitado é testado contra
   `POST /api/admin/session/validate` (endpoint sem efeito colateral,
   protegido pelo `AdminTokenFilter` do backend).
2. Se aceito, o token é guardado em `sessionStorage` (não em `localStorage`,
   para não sobreviver ao fechamento do navegador) e o Axios injeta o header
   `X-Admin-Token` em toda requisição subsequente via interceptor.
3. Um 401 vindo de qualquer chamada dispara um evento global
   (`admin-unauthorized`) que desloga automaticamente e redireciona ao login.
4. `<ProtectedRoute>` guarda todas as rotas `/admin/*` (exceto `/admin/login`).

> ⚠️ Isso é adequado para um portfólio pessoal de uso único. Não é um
> substituto de autenticação multiusuário — não reuse esse padrão em produtos
> com mais de um administrador.

## Features voltadas para recrutadores

Pensadas para o momento em que alguém abre o link do portfólio pela
primeira vez (LinkedIn, e-mail, currículo):

- **Formulário de contato com backend real** (não mais `mailto:`) — evita
  o problema real de links `mailto:` simplesmente não abrirem em
  computadores corporativos sem cliente de e-mail configurado. As
  mensagens chegam em `/admin/mensagens` com workflow completo de status
  (Nova → Lida → Respondida, ou Arquivada a qualquer momento), filtro por
  status, botão de resposta rápida por e-mail e contador de novas na
  sidebar. Limitado a 5 envios por IP a cada 30 min no backend, e o
  formulário inclui um campo honeypot invisível como proteção anti-spam
  básica.
- **Galeria de screenshots por projeto** (`/admin/projetos/:id`) — upload
  múltiplo, reordenação por arrastar-e-soltar e remoção individual
  (`ProjectImageManager.tsx`); a primeira imagem vira a capa. Na página
  pública do projeto, a galeria abre em um lightbox fullscreen com
  navegação por teclado (`ProjectGallery.tsx`).
- **Notificações toast** (`react-hot-toast`) — feedback consistente em
  todas as ações de exclusão/edição do painel admin, estilizado com os
  tokens do tema ativo.
- **Estatísticas reais do GitHub** (`hooks/useGitHubStats.ts`) — busca
  repositórios públicos e seguidores direto da API pública do GitHub, no
  navegador do visitante, sem precisar de chave de API nem passar pelo
  nosso backend. Aparece na grade de estatísticas da Home quando
  `githubUrl` está preenchido no Perfil.
- **Salvar contato (vCard)** — botão em Sobre que gera um `.vcf` a partir
  dos dados do Perfil e baixa na hora; um clique e o recrutador já tem
  seu contato salvo na agenda do celular/computador.
- **Habilidades, Formação acadêmica e Certificações** (página Sobre,
  geridas em `/admin/curriculo`) — pensadas especificamente para quem
  está buscando a **primeira vaga sem experiência profissional**: essas
  três seções compensam a ausência de "Experiência" (que propositalmente
  *não* existe aqui — uma seção vazia ou forçada pesa contra o candidato,
  não a favor). Habilidades usam barra de proficiência (`.skill-bar`),
  Formação usa timeline (`.timeline-dot`), Certificações usam grade de
  cards com link de credencial.
  > **Idiomas**: não existe uma entidade separada para isso — cadastre
  > como uma Habilidade com categoria "Idiomas" (ex: "Inglês", 80%). A
  > página Sobre já agrupa por categoria automaticamente, então aparece
  > como sua própria seção sem precisar de nenhum código novo.
- **Redes sociais completas**: além de GitHub e LinkedIn, o Perfil aceita
  Instagram e X/Twitter (`instagramUrl`, `twitterUrl`) — exibidos no
  Footer e no hero da Home sempre que preenchidos.
- **Preview de link (Open Graph/Twitter Card)** — `index.html` tem meta
  tags estáticas (`og:title`, `og:description`, `og:image`...), porque a
  maioria dos crawlers que geram preview (LinkedIn, WhatsApp, Slack) **não
  executa JavaScript**. Um placeholder já vem pronto em
  `public/og-image.png` (1200×630, no estilo do site) — troque pelo seu
  antes de publicar, junto com `seudominio.com` nas tags e em
  `public/robots.txt` / `public/sitemap.xml`.
- **Título de aba dinâmico por página** — via `react-helmet-async`
  (componente `components/ui/Seo.tsx`), cobre navegação com JS habilitado
  e ajuda o Google a indexar cada rota com título/descrição próprios.
- **Badge "Disponível para oportunidades"** — controlado pelo Admin
  (`availableForWork` em Perfil & Dados), aparece na Home e no rodapé.
  Sinal direto e imediato para quem está avaliando candidatos.
- **Botão "Baixar currículo (PDF)"** — controlado pelo Admin
  (`resumeUrl`), aparece na Home e em Sobre.
- **`robots.txt` + `sitemap.xml`** — SEO básico para aparecer em buscas
  pelo seu nome; painel admin (`/admin`) fica bloqueado a indexadores.
- **Scroll-to-top ao trocar de rota** — sem isso, o React Router mantém a
  posição de scroll entre páginas, o que confunde quem clica de um card
  de projeto para o link de detalhe.

- **CTA "Vamos trabalhar juntos?"** ao final da Home — card com gradiente
  sutil, botões para Contato e LinkedIn. Fecha a página com uma chamada
  clara para ação, em vez de deixar o visitante "esbarrar" no rodapé.
- **Cabeçalho de perfil na página Sobre** — foto (ou iniciais em gradiente,
  se não houver foto), nome, cargo, localização e disponibilidade lado a
  lado com a bio, seguindo a mesma hierarquia visual do resto do site.
- **Máquina de escrever contínua no hero** — o Admin cadastra uma lista de
  "cargos alternados" em Perfil (`profile.roles`, ex: "Desenvolvedor Full
  Stack", "Engenheiro de Software"); eles alternam em loop infinito
  (`repeat: Infinity`) no hero da Home. Sem nenhum cargo cadastrado, cai
  para a Headline única — que também repete em loop, só sem alternar
  texto, em vez de rodar uma única vez e parar.

## Animações

Adicionadas com `framer-motion`, `react-type-animation` e
`react-intersection-observer`, mantendo a identidade visual restrita do
design system (sem gradientes/glows) — só a *técnica* de animação foi
incorporada, não o estilo visual de outra referência:

- **`components/ui/FadeIn.tsx`** — scroll-reveal (fade + leve subida) via
  `react-intersection-observer`, `triggerOnce`. Usado para revelar seções
  e itens de lista (projetos, tech stack) conforme o usuário rola a página.
- **`lib/motionVariants.ts`** — variantes reutilizáveis do `framer-motion`
  (`fadeUp`, `fadeLeft`, `fadeRight`, `staggerContainer`, `floatAnimation`).
- **Hero da Home**: entrada em cascata (`staggerContainer`) nos blocos de
  texto; a headline é "digitada" uma única vez com `TypeAnimation` — sem
  repetir em loop, para não virar decoração. A foto de perfil flutua
  suavemente com um glow radial atrás, e os botões/ícones sociais reagem
  com leve elevação no hover (`whileHover`/`whileTap`). Badges com entrada
  em mola (`type: "spring"`) mostram contagem de projetos e disponibilidade.
- **Listagens de projeto** (Home e `/projetos`): cada card entra com um
  atraso incremental (`delay={index * 70}`), criando uma cascata em vez
  de tudo aparecer de uma vez.
- **Nav**: sublinhado que cresce da esquerda ao passar o mouse
  (`.nav-underline`, CSS puro).
- **Acessibilidade**: `<MotionConfig reducedMotion="user">` em `App.tsx`
  faz todas as animações do framer-motion respeitarem
  `prefers-reduced-motion` automaticamente; as transições CSS puras (como
  o `FadeIn`) já são neutralizadas pela media query em `index.css`.



## Pré-requisitos

- Node.js 20 LTS ou superior
- npm 10+ (ou pnpm/yarn, ajustando os comandos)
- O backend (`portfolio-backend`) rodando localmente — veja o README dele.
  Sem o backend no ar, a interface carrega mas todos os dados ficam em
  estado de skeleton/erro, já que tudo é dinâmico via API.

## Passo a passo — rodando localmente

### 1. Instalar dependências

```bash
cd portfolio-frontend
npm install
```

### 2. Configurar a URL da API

```bash
cp .env.example .env
```

Confirme que aponta para o backend local (ajuste a porta se necessário):

```
VITE_API_URL=http://localhost:8080/api
```

### 3. Subir o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação sobe em **http://localhost:5173**.

- Área pública: `http://localhost:5173/`
- Painel admin: `http://localhost:5173/admin/login` — use o mesmo valor
  configurado em `admin.security.token` no `application.yml` do backend.

### 4. Build de produção

```bash
npm run build   # gera a pasta dist/
npm run preview # serve o build localmente para conferência
```

### 5. Lint (opcional)

```bash
npm run lint
```

## Notas de implementação

- **Sem `localStorage`/cookies para o token**: usa `sessionStorage`
  propositalmente, para reduzir a janela de exposição do token admin no
  navegador. (A preferência de tema claro/escuro *é* salva em
  `localStorage` — não é dado sensível, e precisa sobreviver ao fechar
  a aba, diferente do token.)
- **Upload de arquivo real (imagens e currículo)**: foto de perfil, capa
  de projeto e currículo em PDF são enviados via `multipart/form-data`
  para o backend (`POST /api/uploads/images` e `POST /api/uploads/documents`),
  com preview, barra de progresso e drag & drop
  (`components/ui/ImageUploadField.tsx` e `DocumentUploadField.tsx`,
  serviço em `services/uploadService.ts`). O upload acontece assim que o
  arquivo é selecionado; a URL retornada só é persistida quando o
  formulário (Perfil ou Projeto) é salvo — upload e gravação de dados são
  operações independentes.
