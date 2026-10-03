import {
  profile,
  experience,
  projects,
  skills,
  tools,
  socials,
} from "../data/portfolio";

export const publicRoutes = [
  "/",
  "/projects",
  "/resume",
  "/analytics",
  "/support",
] as const;
export const siteOrigin = new URL(profile.siteUrl).origin;
const origin = siteOrigin;
const personId = `${origin}/#person`;
const websiteId = `${origin}/#website`;
// Use the same introduction rendered on the home page, without Markdown emphasis.
const visibleBio = profile.bioLines
  .map((line) => line.replace(/\*\*/g, ""))
  .join(" ");
const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: `${profile.name} | ${profile.role}`,
    description: `${profile.name}, ${profile.role} based in ${profile.location}. ${visibleBio.replace(/^Hi, I’m a [^.]+\.\s*/, "")}`,
  },
  "/projects": {
    title: `Projects | ${profile.name} — ${profile.role}`,
    description: `Explore ${profile.name}’s projects: ${projects.map((project) => project.name).join(", ")}. Real-time Kanban collaboration, URL shortening and real-time chat.`,
  },
  "/resume": {
    title: `Resume | ${profile.name} — ${profile.role}`,
    description: `${profile.name}’s resume. ${experience.map((item) => `${item.role} at ${item.company}`).join("; ")}. Explore professional experience, skills and projects.`,
  },
  "/analytics": {
    title: `Analytics | ${profile.name}`,
    description: `Visitors and page views for ${profile.name}’s portfolio, with activity over the past 24 hours, 7 days and 30 days.`,
  },
  "/support": {
    title: `Support | ${profile.name}`,
    description: `If ${profile.name}’s work has helped you, explore the support options on this page, including quick support, UPI and crypto.`,
  },
};
export function getSeo(pathname: string) {
  const path = pathname === "/home" ? "/" : pathname.replace(/\/+$/, "") || "/";
  const page = pages[path];
  return {
    ...(page ?? {
      title: "Page not found | Yuvraj Satyapal",
      description:
        "This page could not be found. Visit Yuvraj Satyapal’s official portfolio to explore his projects, experience and resume.",
    }),
    canonical: page ? new URL(path, origin).href : undefined,
    robots: page ? "index, follow, max-image-preview:large" : "noindex, follow",
    image: new URL("/images/yuvraj-profile.png", origin).href,
    path,
  };
}
export function getStructuredData(pathname: string) {
  const page = getSeo(pathname);
  const graph: Record<string, unknown>[] = [
    {
      "@type": "Person",
      "@id": personId,
      name: profile.name,
      url: profile.siteUrl,
      image: page.image,
      jobTitle: profile.role,
      description: visibleBio,
      address: {
        "@type": "PostalAddress",
        addressLocality: profile.location.split(",")[0].trim(),
        addressCountry: "IN",
      },
      knowsAbout: [
        ...new Set(
          [...skills, ...tools].map((skill) => skill.name).concat("REST APIs"),
        ),
      ],
      sameAs: [
        ...socials.flatMap((social) => (social.url ? [social.url] : [])),
        profile.handleUrl,
      ],
    },
    {
      "@type": "WebSite",
      "@id": websiteId,
      url: profile.siteUrl,
      name: profile.name,
      description: pages["/"].description,
      inLanguage: "en-IN",
      publisher: { "@id": personId },
    },
  ];
  if (page.canonical)
    graph.push({
      "@type":
        page.path === "/" || page.path === "/resume"
          ? "ProfilePage"
          : page.path === "/projects"
            ? "CollectionPage"
            : "WebPage",
      "@id": `${page.canonical}#webpage`,
      url: page.canonical,
      name: page.title,
      description: page.description,
      inLanguage: "en-IN",
      isPartOf: { "@id": websiteId },
      mainEntity: { "@id": personId },
    });
  return { "@context": "https://schema.org", "@graph": graph };
}
const escapeHtml = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ]!,
  );
export function renderSeoHead(pathname: string) {
  const page = getSeo(pathname);
  const meta = (key: string, value: string, property = false) =>
    `<meta ${property ? "property" : "name"}="${key}" content="${escapeHtml(value)}" data-seo />`;
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    meta("description", page.description),
    meta("author", profile.name),
    meta("robots", page.robots),
    ...(page.canonical
      ? [
          `<link rel="canonical" href="${escapeHtml(page.canonical)}" data-seo />`,
        ]
      : []),
    meta("og:type", "website", true),
    meta("og:site_name", profile.name, true),
    meta("og:title", page.title, true),
    meta("og:description", page.description, true),
    ...(page.canonical ? [meta("og:url", page.canonical, true)] : []),
    meta("og:image", page.image, true),
    meta("og:image:alt", "Portrait of Yuvraj Satyapal", true),
    meta("og:image:width", "1122", true),
    meta("og:image:height", "1402", true),
    meta("og:locale", "en_IN", true),
    meta("twitter:card", "summary"),
    meta("twitter:creator", `@${profile.handle}`),
    meta("twitter:title", page.title),
    meta("twitter:description", page.description),
    meta("twitter:image", page.image),
    meta("twitter:image:alt", "Portrait of Yuvraj Satyapal"),
    `<script type="application/ld+json" data-seo>${JSON.stringify(getStructuredData(pathname)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
}
