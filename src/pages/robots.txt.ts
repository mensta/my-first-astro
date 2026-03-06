import type { APIRoute } from "astro";
import config from "@/config/config.json";

export const GET: APIRoute = () => {
  const baseUrl = config.site.base_url;
  const content = `User-agent: *
Allow: /
Disallow: /search/

Sitemap: ${baseUrl}/sitemap-index.xml
`;
  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
