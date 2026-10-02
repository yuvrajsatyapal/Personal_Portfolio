import { readFile, writeFile } from "node:fs/promises";
import { createServer } from "vite";

// Render the same components users see; no bot-only content or separate SEO page.
const server = await createServer({ server: { middlewareMode: true, hmr: false, ws: false }, optimizeDeps: { noDiscovery: true }, appType: "custom" });
try {
  const { renderPage, renderSeoHead, publicRoutes, siteOrigin } = await server.ssrLoadModule("/src/entry-server.tsx");
  const template = await readFile("dist/index.html", "utf8");
  for (const path of [...publicRoutes, "/404"]) {
    const html = template.replace("<!--seo-head-->", renderSeoHead(path))
      .replace('<div id="root"></div>', `<div id="root">${renderPage(path)}</div>`);
    await writeFile(path === "/" ? "dist/index.html" : `dist/${path.slice(1)}.html`, html);
  }
  const origin = siteOrigin;
  await writeFile("dist/robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${origin}/sitemap.xml\n`);
  await writeFile("dist/sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicRoutes.map(path => `  <url><loc>${new URL(path, origin).href}</loc></url>`).join("\n")}\n</urlset>\n`);
  console.log(`Generated ${publicRoutes.length} public pages, 404.html, robots.txt and sitemap.xml.`);
} finally {
  await server.close();
}
