# Portfolio recreation implementation plan

Goal: Recreate the supplied portfolio as editable, tested source code.
Architecture: React 19 + Vite + TypeScript, React Router; page components share navigation, headings, cards and footer. Personal and sample content is centralized in a typed data module. Styling follows the author's design reference.
Spec: docs/spec.md

1. Scaffold package, TypeScript and Vite configuration. Install React, router, icons, QR generator, Vitest and Testing Library.
2. Write behavioral tests for route navigation, experience expansion, profile QR toggle, support missing configuration, coin/network reset and unknown route. Run failing tests before implementation.
3. Build typed portfolio data, shared shell and home sections, project cards and marquee rows. Use the reference's observed imagery and MIT design documentation; retain attribution.
4. Build all secondary routes and live LeetCode activity. Analytics shows setup instructions unless an endpoint is configured; resume shows upload instructions unless a user PDF is configured; payment controls copy only user-configured destinations.
5. Run tests and typecheck/build. Open local preview, compare screenshots against reference at desktop and 354px, check images, console, navigation and interactions. Correct verified discrepancies.
6. Document personalization and deployment, leave preview open.

Review focus: keyboard controls; payment destinations without user data; route reloads; failed external images; narrow-screen overflow; reduced motion.
