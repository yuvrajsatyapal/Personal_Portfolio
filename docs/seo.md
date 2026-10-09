# Portfolio SEO and deployment guide

## What changed

The production origin is https://yuvraj-satyapal.vercel.app/, already listed in README.md. `src/data/portfolio.ts` now records it explicitly. `src/lib/seo.ts` is the shared source for route titles, descriptions, canonical URLs, author/robots metadata, Open Graph, Twitter/X cards and connected JSON-LD.

`npm run build` typechecks the browser/API code, builds Vite, renders the existing React components into route-specific HTML, and validates the output. The public pages are `/`, `/projects`, `/resume`, `/analytics` and `/support`. Each receives its own metadata and one H1. Initial content is available without JavaScript; the existing React client then mounts the interactive app. No separate bot-only content is served. Live activity/analytics remain client-updated and are not fabricated at build time.

`Person`, `WebSite` and `ProfilePage` entities share stable IDs, with `CollectionPage` for projects and `WebPage` for utility pages. The Person includes real public profiles, Delhi locality, skills, education and an EducationalOccupationalCredential for the supplied degree, graduation year and CGPA. The past internship is presented as past experience, not as a current employer.

Resume text is included in native expandable HTML alongside the PDF viewer. Experience and project details remain in the HTML when collapsed. Visible copy naturally connects the name, software engineering/full stack role, Delhi, React/Next.js/Node.js/PostgreSQL skills, Arabazaar work, GGSIPU education and 450+ LeetCode problems. InsightSpend is mentioned by name only because there are no verified project details or URLs in the current data; Hypothron AI, PitchBorn and LifeTale are marked as currently building.

Responsive WebP sources supplement the original PNG files. Noncritical images have lazy loading, project images have async decoding, the profile image has high fetch priority, and image dimensions reserve space. Existing layout and interactive previews remain in place. The original public PNG portrait is retained as a social-card image.

Vercel uses `cleanUrls` to serve the generated HTML at extensionless paths, redirects `/home` and `/index.html` to `/`, and removes trailing slashes. The former blanket SPA rewrite was removed so unknown server requests can return an actual 404 using the generated `404.html`. Missing routes use noindex metadata and are excluded from the sitemap. The APIs and static assets are no longer rewritten to the homepage.

## Files changed

- `index.html`, `package.json`, `vite.config.ts`, `vercel.json`, `.gitignore`
- `src/lib/seo.ts`, `src/components/Seo.tsx`, `src/entry-server.tsx`, `src/App.tsx`
- `src/data/portfolio.ts`
- `src/components/HomeSections.tsx`, `Projects.tsx`, `Activity.tsx`, `Header.tsx`, `Shared.tsx`
- `src/pages/Secondary.tsx`, `Support.tsx`, `src/styles.css`
- `public/robots.txt`, `public/sitemap.xml`, seven new WebP files in `public/images/`
- `scripts/prerender.mjs`, `scripts/validate-seo.mjs`
- `tests/seo.test.ts`, updated profile-image assertion in `tests/portfolio.test.tsx`
- `docs/seo-plan.md`, `docs/seo.md`

## Verification setup

No tokens were invented or installed. For this Vercel subdomain, create a Google Search Console **URL-prefix property** for `https://yuvraj-satyapal.vercel.app/`.

Choose HTML tag verification. Paste the complete issued `<meta name="google-site-verification" ...>` into the `<head>` of the source `index.html`, at the verification comment immediately before `<!--seo-head-->`. For Bing, place the issued `<meta name="msvalidate.01" ...>` in that same location. The build preserves these tags on the generated pages; the client metadata updater leaves them alone. Redeploy before clicking Verify.

Alternatively, place the exact issued HTML verification file into `public/`, preserving its supplied filename and contents, then rebuild and redeploy. Do not put verification tags only into generated `dist/` files because the next build replaces them. DNS verification is appropriate if you later attach a custom domain whose DNS you control.

## After deployment

1. Confirm Vercel runs `npm run build` and publishes `dist/`, with production domain `yuvraj-satyapal.vercel.app`. Do not replace the build command with plain `vite build`, which omits HTML generation and validation.
2. Open every public page directly and inspect **View Source**, not only the rendered DOM. Confirm each has its own canonical and that profile/resume content appears before JavaScript runs.
3. Check `/robots.txt` and `/sitemap.xml` return 200 with the correct text/XML content. Confirm `/home` and `.html` aliases redirect to their canonical URLs. Request an unknown path and confirm its HTTP status is 404. These hosting behaviors require verification on the deployment.
4. Verify Google Search Console and Bing Webmaster Tools, then submit `https://yuvraj-satyapal.vercel.app/sitemap.xml` in both.
5. Use Google URL Inspection on `/`, `/projects` and `/resume`: run Test Live URL, inspect the rendered page and selected canonical, then request indexing. Monitor Pages and Performance for name/profile queries.
6. Check structured data with Schema.org Validator and Google Rich Results Test. Valid Schema.org data does not guarantee a Google rich-result appearance.
7. Run PageSpeed Insights for mobile and desktop after deployment. Monitor LCP, INP and CLS in field data when traffic is sufficient. No measured Core Web Vitals or ranking gains are claimed by this implementation.
8. Add this exact portfolio URL to your real GitHub, LinkedIn and LeetCode profiles yourself, where their profile settings allow it.

When you add a custom domain, update `profile.siteUrl` and the checked-in public crawler files, and review the validator’s expected origin. Redirect the old domain to the new one on Vercel rather than publishing two independent canonical sites.

## Validation results and limits

Production build, browser/API typechecks, generated metadata uniqueness, canonical URLs, JSON-LD parsing/references, H1/heading order, image alt/dimensions/assets, sitemap/robots and internal routes/anchors passed. All 85 tests passed. The existing jsdom canvas warning from SidePattern is a test-environment limitation; the test suite passes. No lint script is configured.

Browser checks at 375px confirmed no horizontal overflow on home, projects and resume, verified responsive WebP sources, route metadata updates and project expansion. Deployment redirects/status codes, public verification, external account/demo link availability, Google schema eligibility and field Core Web Vitals remain live-site checks. No accounts or project URLs were invented; existing external links were preserved.

## References

- Google’s [JavaScript SEO guidance](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics) explains crawlable content and canonical/metadata consistency.
- [Schema.org ProfilePage](https://schema.org/ProfilePage) documents the connection between a profile page and its Person entity.
- [Vercel static configuration](https://vercel.com/docs/project-configuration/vercel-json) documents clean URLs and redirects; [custom 404 documentation](https://vercel.com/kb/guide/custom-404-page) covers `404.html`.
- [Google Search Console guidance](https://developers.google.com/search/docs/monitor-debug/search-console-start) covers sitemap submission and URL inspection.
