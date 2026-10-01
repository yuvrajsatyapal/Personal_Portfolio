# Portfolio reference recreation

Build an editable React + TypeScript portfolio matching https://manixh.vercel.app/.
The supplied live site is the approved visual direction: no generated redesign.
Use the author's published design reference for exact tokens and the observed site for current structure.

Home: profile photo with decoration and QR toggle; name/handle/status; live India clock; three bio bullets; Twitter and Discord cards; email/social buttons; two animated skills rows; collapsible experience timeline; four project cards with FlowBoard featured; uses teaser; contact card; quote and footer clock. Profile uses an initials placeholder until the user supplies a photo.
Routes: /projects (FlowBoard, Trimly, AvoChat, InsightSpend), /resume (PDF preview/download), /analytics (period selector, refresh, honest unconfigured state), /support (support links, UPI copying, cryptocurrency/network selection, QR), /uses (software/hardware), /blogs and article, fallback 404.
Preserve dark background #0b0d0e, Figtree and JetBrains Mono, 700px container, dashed outlines, grayscale project images with color hover, layered button shadows and responsive breakpoints.
Use Yuvraj Satyapal’s supplied profile, education, Arabazaar experience, projects and skills. GitHub, LinkedIn, email and corrected LeetCode handle are supplied. Add education and live LeetCode activity. Store personal content in src/data/portfolio.ts. Do not silently route support payments to reference accounts: support destinations stay unconfigured until user supplies them. Analytics must not fabricate traffic or inherit the reference site's trackers. Missing personal resume must be stated clearly.
Keyboard accessible controls, reduced-motion support, no horizontal overflow at 354px. Local assets, npm dev/build/test/typecheck, SPA hosting rewrites and README.
