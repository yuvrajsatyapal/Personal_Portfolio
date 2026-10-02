import { profile, education, skills, tools, socials } from "../data/portfolio";

export const publicRoutes = ["/", "/projects", "/resume", "/analytics", "/support"] as const;
export const siteOrigin = new URL(profile.siteUrl).origin;
const origin = siteOrigin;
const personId = `${origin}/#person`;
const websiteId = `${origin}/#website`;
const pages: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Yuvraj Satyapal | Software Engineer & Full Stack Developer",
    description: "Official portfolio of Yuvraj Satyapal, Software Engineer and Full Stack Developer in Delhi, India. Explore React, Next.js, Node.js projects and experience.",
  },
  "/projects": {
    title: "Projects | Yuvraj Satyapal — Full Stack Developer",
    description: "Explore Yuvraj Satyapal’s projects: FlowBoard, Trimly and AvoChat. Real-time collaboration, URL analytics and chat built with React, Next.js and Node.js.",
  },
  "/resume": {
    title: "Resume & Experience | Yuvraj Satyapal — Software Engineer",
    description: "Yuvraj Satyapal’s resume: Full Stack Developer Intern at Arabazaar, B.Tech IT at GGSIPU, graduating in 2026 with CGPA 8.5. Skills, projects and achievements.",
  },
  "/analytics": {
    title: "Portfolio Analytics | Yuvraj Satyapal",
    description: "Public visitor and page-view analytics for the official portfolio of Yuvraj Satyapal, Software Engineer and Full Stack Developer in Delhi, India.",
  },
  "/support": {
    title: "Support | Yuvraj Satyapal",
    description: "Support the work of Yuvraj Satyapal, Software Engineer and Full Stack Developer. Explore his projects and connect through his official public profiles.",
  },
};
export function getSeo(pathname: string) {
  const path = pathname === "/home" ? "/" : pathname.replace(/\/+$/, "") || "/";
  const page = pages[path];
  return {
    ...(page ?? { title: "Page not found | Yuvraj Satyapal", description: "This page could not be found. Visit Yuvraj Satyapal’s official portfolio to explore his projects, experience and resume." }),
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
      "@type": "Person", "@id": personId,
      name: profile.name, url: profile.siteUrl, image: page.image,
      jobTitle: "Software Engineer / Full Stack Developer",
      description: profile.bio,
      address: { "@type": "PostalAddress", addressLocality: "Delhi", addressCountry: "IN" },
      alumniOf: { "@type": "CollegeOrUniversity", name: education.institute },
      hasCredential: {
        "@type": "EducationalOccupationalCredential", name: education.degree,
        credentialCategory: "Bachelor’s degree",
        description: `B.Tech in Information Technology, graduation 2026, ${education.grade}.`,
        recognizedBy: { "@type": "CollegeOrUniversity", name: education.institute },
      },
      knowsAbout: [...new Set([...skills, ...tools].map(skill => skill.name))],
      sameAs: [...socials.flatMap(social => social.url ? [social.url] : []), profile.handleUrl],
    },
    {
      "@type": "WebSite", "@id": websiteId,
      url: profile.siteUrl, name: "Yuvraj Satyapal — Official Portfolio",
      description: pages["/"].description, inLanguage: "en-IN", publisher: { "@id": personId },
    },
  ];
  if (page.canonical) graph.push({
    "@type": page.path === "/" || page.path === "/resume" ? "ProfilePage" : page.path === "/projects" ? "CollectionPage" : "WebPage",
    "@id": `${page.canonical}#webpage`, url: page.canonical,
    name: page.title, description: page.description, inLanguage: "en-IN",
    isPartOf: { "@id": websiteId }, mainEntity: { "@id": personId },
  });
  return { "@context": "https://schema.org", "@graph": graph };
}
const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]!);
export function renderSeoHead(pathname: string) {
  const page = getSeo(pathname);
  const meta = (key: string, value: string, property = false) => `<meta ${property ? "property" : "name"}="${key}" content="${escapeHtml(value)}" data-seo />`;
  return [
    `<title>${escapeHtml(page.title)}</title>`,
    meta("description", page.description), meta("author", profile.name), meta("robots", page.robots),
    ...(page.canonical ? [`<link rel="canonical" href="${escapeHtml(page.canonical)}" data-seo />`] : []),
    meta("og:type", "website", true), meta("og:site_name", "Yuvraj Satyapal — Official Portfolio", true),
    meta("og:title", page.title, true), meta("og:description", page.description, true),
    ...(page.canonical ? [meta("og:url", page.canonical, true)] : []),
    meta("og:image", page.image, true), meta("og:image:alt", "Portrait of Yuvraj Satyapal", true),
    meta("og:image:width", "1122", true), meta("og:image:height", "1402", true), meta("og:locale", "en_IN", true),
    meta("twitter:card", "summary"), meta("twitter:creator", `@${profile.handle}`), meta("twitter:title", page.title), meta("twitter:description", page.description),
    meta("twitter:image", page.image), meta("twitter:image:alt", "Portrait of Yuvraj Satyapal"),
    `<script type="application/ld+json" data-seo>${JSON.stringify(getStructuredData(pathname)).replace(/</g, "\\u003c")}</script>`,
  ].join("\n");
}
