# Yuvraj Satyapal — Portfolio

React + TypeScript portfolio recreating the layout, typography, colors and component treatment of https://manixh.vercel.app/, personalized with Yuvraj's supplied content.

## Run

```sh
npm install
npm run dev
npm test
npm run typecheck
npm run build
```

The development server runs at http://127.0.0.1:3000.

## Personalize

Edit `src/data/portfolio.ts`. Components render the typed data rather than embedding personal information.

- `profile`: bio, bio bullets (use `**bold**` for emphasis), location, photo, public email, resume URL and portfolio URL.
- `socials`: LinkedIn, GitHub and LeetCode.
- `education`, `experience`, `projects`, `skills`, `tools`, `achievements`, `uses`: the supplied portfolio content.
- `support`: your own payment links, UPI ID and wallets. Empty fields produce disabled controls; there are no reference payment destinations.
- `site`: repository link, optional analytics endpoint, optional blog content, LeetCode endpoint.

### Pending assets and links

Profile photo: replace the clean initials placeholder by setting `profile.photo` to a file in `public/images/` or a URL. Resume: add `public/resume/resume.pdf` and set `profile.resume = '/resume/resume.pdf'`. Until then the resume page displays a summary of supplied content and a disabled PDF CTA.

All four project GitHub/demo links are `null`. Add them when available. The SVG project previews are clearly labeled **interface concepts**, not screenshots of your applications. Replace each project's `image` with a real screenshot when ready.

Set `profile.siteUrl` after deployment. The profile QR currently points to your supplied LinkedIn profile until the portfolio URL is configured.

## GitHub and LeetCode activity

The `/api/github` endpoint reads the public GitHub calendar for `achievements.githubUsername`. Both activity sections use seven-row, Sunday-aligned calendars with month labels, green intensity levels, and exact counts inside active days. Zero days remain blank. Calendars scroll horizontally and initially show the most recent months; keyboard users can focus the calendar and use the arrow keys. GitHub totals count contributions; LeetCode totals count submissions, while the separate solved-problems statistic comes from LeetCode.

### Live LeetCode activity

The `/api/leetcode` endpoint requests public statistics and submission history from LeetCode GraphQL for `achievements.leetcodeUsername`. The widget displays live solved counts and a year of activity; it does not substitute a hardcoded count on failure. Development and Vercel use the same normalization and fetching code. The response is cached by Vercel for 30 minutes. An unavailable upstream produces a retry state.

## Analytics

No third-party tracking scripts from the reference are included. The Analytics page displays a clear unconnected state until `site.analyticsEndpoint` is set. The endpoint should accept `period=24h|7d|30d` and return:

```json
{"pageviews":120,"visitors":80,"series":[{"label":"2026-10-01","pageviews":20,"visitors":12}]}
```

These values illustrate the API shape only; no sample traffic is rendered. Connect your analytics provider server-side; never put API tokens in client config.

## Deploy

Import the folder into Vercel, use `npm run build` and `dist` as the output directory. `vercel.json` handles client routes and Vercel serves `api/leetcode.ts` as a serverless endpoint. A plain static host can serve the site, but needs a separately hosted LeetCode endpoint and an SPA fallback. `npm run preview` previews the static build; the live API runs via `npm run dev` or Vercel.

## Credits

Visual reference: [Manish Kumar's portfolio](https://manixh.vercel.app/). Published design documentation: [ig-imanish/manixh](https://github.com/ig-imanish/manixh), MIT; retained in `LICENSE` and `docs/reference-design.md`. Reference CSS was used to match the requested visual design. The portfolio content, editable React implementation and illustrative project SVGs were created for this project.
