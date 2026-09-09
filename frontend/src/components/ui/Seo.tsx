import { Helmet } from "react-helmet-async";

interface SeoProps {
  title: string;
  description?: string;
  image?: string;
}

const SITE_NAME = "Portfólio";

/**
 * Ajusta <title> e meta description por rota. As tags Open Graph/Twitter
 * "de verdade" (as que os crawlers do LinkedIn/WhatsApp realmente leem)
 * ficam fixas em index.html, porque a maioria desses bots não executa
 * JavaScript — este componente cobre a aba do navegador e os buscadores
 * que executam JS (Google já faz isso na indexação).
 */
export function Seo({ title, description, image }: SeoProps) {
  const fullTitle = `${title} | ${SITE_NAME}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      {image && <meta property="og:image" content={image} />}
    </Helmet>
  );
}
