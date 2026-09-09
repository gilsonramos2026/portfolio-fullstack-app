/**
 * Ícones de tecnologia 100% dinâmicos via o CDN público do simple-icons
 * (`cdn.simpleicons.org/{slug}`) — cada logo (com a cor oficial da marca)
 * é carregado sob demanda como uma imagem, em vez de empacotar milhares
 * de ícones no bundle do JS.
 */
import { useState } from "react";
import { clsx } from "clsx";

const ALIASES: Record<string, string> = {
  javascript: "javascript", js: "javascript",
  typescript: "typescript", ts: "typescript",
  python: "python", java: "openjdk", "java 21": "openjdk",
  go: "go", golang: "go", rust: "rust",
  kotlin: "kotlin", swift: "swift", php: "php",
  ruby: "ruby", "c#": "csharp", "c++": "cplusplus",

  react: "react", "react native": "react", "react.js": "react",
  "next.js": "nextdotjs", nextjs: "nextdotjs", next: "nextdotjs",
  vue: "vuedotjs", "vue.js": "vuedotjs", nuxt: "nuxtdotjs",
  angular: "angular", svelte: "svelte", astro: "astro",
  vite: "vite", webpack: "webpack",

  tailwind: "tailwindcss", "tailwind css": "tailwindcss", tailwindcss: "tailwindcss",
  sass: "sass", css: "css3", css3: "css3", html: "html5", html5: "html5",
  bootstrap: "bootstrap",

  "node.js": "nodedotjs", nodejs: "nodedotjs", node: "nodedotjs",
  spring: "spring", "spring boot": "springboot", springboot: "springboot",
  "spring cloud": "spring", springcloud: "spring",
  "spring data jpa": "spring", springdatajpa: "spring",
  django: "django", flask: "flask", fastapi: "fastapi",
  laravel: "laravel", express: "express", "express.js": "express", nestjs: "nestjs",
  graphql: "graphql",

  postgresql: "postgresql", postgres: "postgresql", "postgresql / mysql": "postgresql",
  mysql: "mysql", mongodb: "mongodb", mongo: "mongodb",
  redis: "redis", sqlite: "sqlite",

  docker: "docker", kubernetes: "kubernetes", k8s: "kubernetes",
  "docker & kubernetes": "docker", dockerkubernetes: "docker",
  aws: "amazonwebservices", azure: "microsoftazure",
  gcp: "googlecloud", "google cloud": "googlecloud",
  terraform: "terraform", nginx: "nginx",
  "github actions": "githubactions",

  git: "git", github: "github", "git & github": "git", gitgithub: "git", gitlab: "gitlab",
  figma: "figma", postman: "postman", jira: "jira",
  notion: "notion", linux: "linux",
  intellij: "intellijidea", maven: "apachemaven", gradle: "gradle",

  stripe: "stripe", firebase: "firebase",
  vercel: "vercel", netlify: "netlify",
  railway: "railway", cloudflare: "cloudflare",

  // Mapeamentos ajustados (OpenAI usa o slug direto ou cai no fallback se indisponível)
  "openai api": "openai", 
  openai: "openai",
  "commander.js": "nodedotjs",
  
  // Termos conceituais (mapeados vazio para forçar o fallback de iniciais e evitar 404)
  "arquitetura de microsservios": "",
  "arquitetura": "",
  microservices: "",
};

function resolveSlug(name: string): string {
  const normalizedKey = name.toLowerCase().trim();
  
  // 1. Tenta buscar a string exata primeiro (ex: "openai api", "arquitetura de microsservios")
  if (ALIASES[normalizedKey] !== undefined) {
    return ALIASES[normalizedKey];
  }

  // 2. Fallback para o primeiro termo caso exista no dicionário
  const cleanName = normalizedKey.split(/[\s/&+-]+/)[0] || normalizedKey;
  if (ALIASES[cleanName] !== undefined) {
    return ALIASES[cleanName];
  }

  // 3. Limpeza padrão para slugs simples
  return cleanName.replace(/[^a-z0-9]/g, "");
}

function Fallback({ name, size }: { name: string; size: number }) {
  const initials = name
    .split(/[\s.+_-]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
  return (
    <span
      className="flex h-full w-full items-center justify-center rounded-md bg-(--chb) font-bold text-(--t3)"
      style={{ fontSize: Math.max(Math.floor(size * 0.38), 9) }}
    >
      {initials || name.slice(0, 2).toUpperCase()}
    </span>
  );
}

function IconBox({ name, size }: { name: string; size: number }) {
  const slug = resolveSlug(name);
  const [failed, setFailed] = useState(!slug); // Se o slug vier vazio (ex: arquitetura), já ativa o fallback direto

  return (
    <span
      className="inline-flex shrink-0 items-center justify-center overflow-hidden rounded-md"
      style={{ width: size, height: size }}
      title={name}
    >
      {failed || !slug ? (
        <Fallback name={name} size={size} />
      ) : (
        <img
          src={`https://cdn.simpleicons.org/${slug}`}
          alt={name}
          width={size}
          height={size}
          loading="lazy"
          onError={() => setFailed(true)}
          className="h-full w-full object-contain"
        />
      )}
    </span>
  );
}

interface TechIconProps {
  tech: string;
  size?: number;
  showLabel?: boolean;
  className?: string;
}

export function TechIcon({ tech, size = 32, showLabel = false, className }: TechIconProps) {
  return (
    <span className={clsx("inline-flex flex-col items-center gap-1", className)} title={tech}>
      <IconBox name={tech} size={size} />
      {showLabel && (
        <span className="text-center text-xs font-medium leading-none text-(--t4)">{tech}</span>
      )}
    </span>
  );
}

export function TechBadge({ tech, size = 14 }: { tech: string; size?: number }) {
  return (
    <span className="chip">
      <IconBox name={tech} size={size} />
      {tech}
    </span>
  );
}

export function TechGrid({ names, iconSize = 34 }: { names: string[]; iconSize?: number }) {
  return (
    <div className="flex flex-wrap justify-center gap-5 sm:gap-6">
      {names.map((name) => (
        <TechIcon key={name} tech={name} size={iconSize} showLabel />
      ))}
    </div>
  );
}