# Portfolio SEO implementation plan

Target: establish Yuvraj Satyapal as the owner of the official portfolio at https://yuvraj-satyapal.vercel.app/.

Preserve the current visual design and interactions. Use Vite build-time rendering of the existing React routes, with a shared metadata module for initial HTML and client navigation. Generate unique titles, descriptions, canonical URLs, social cards, and connected Person/WebSite/ProfilePage JSON-LD. Render resume information as HTML alongside its PDF, preserve project details in the document, and add supplied experience, education and achievement text without inventing project facts.

Generate sitemap and robots files from the canonical routes. Redirect /home to /, serve known routes with their own HTML and unknown URLs with an actual 404. Keep APIs/assets outside HTML rewrites. Improve image dimensions/loading and produce smaller WebP variants when a local encoder is available.

Validation: tests first for metadata, canonicalization and schema identity; production build; inspect generated HTML with a structural validator for metadata uniqueness, JSON-LD references, headings, image alt/dimensions, sitemap, robots and internal links. Run existing tests. Browser-check desktop/mobile and client navigation. Record verification-token placement and deployment steps in docs/seo.md. Field Core Web Vitals and search indexing remain deployment checks.
