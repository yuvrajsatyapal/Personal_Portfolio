# Yuvraj Satyapal — Personal Portfolio

A responsive developer portfolio showcasing my projects, experience, education, technical skills, and coding activity. Built with React and TypeScript, with live activity data and website analytics served through Vercel Functions.

## **Live - [View Portfolio](https://yuvraj-satyapal.vercel.app/)**

## Portfolio Preview
https://github.com/yuvrajsatyapal/Personal_Portfolio/blob/main/public/videos/Screen%20Recording%202026-10-02%20at%201.02.19%E2%80%AFAM.mov


## Features

- Responsive layouts with dark and light themes.
- Project cards with live demos, source links, and expandable details.
- A muted FlowBoard video preview that plays on hover, with manual playback controls.
- Live GitHub contribution and LeetCode submission calendars.
- A Google Drive resume preview and download link.
- Visitor and page-view analytics with interactive charts and period filters.
- Cached analytics data and a remembered period selection across page navigation.
- Search for pages, sections, and projects, with keyboard shortcuts.
- Contact links, hover tooltips, and subtle interface animations.

## Tech Stack

| Area             | Technology                    |
| ---------------- | ----------------------------- |
| Frontend         | React 19, TypeScript          |
| Build tooling    | Vite 7                        |
| Routing          | React Router                  |
| Data caching     | TanStack Query                |
| Styling          | CSS, Figtree, JetBrains Mono  |
| Icons            | React Icons                   |
| APIs and hosting | Vercel Functions, Vercel      |
| Website tracking | Vercel Web Analytics          |
| Testing          | Vitest, React Testing Library |

## Getting Started

Use Node.js 22.12 or later and npm.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://127.0.0.1:3000). If that port is occupied, Vite selects the next available port and prints its address.

The site can run without analytics credentials. To enable the traffic dashboard locally, copy the environment template and fill in your values:

```bash
cp .env.example .env.local
```

Restart the development server after changing environment variables.

## Commands

| Command                 | Purpose                                                        |
| ----------------------- | -------------------------------------------------------------- |
| `npm run dev`           | Start the development server and local API middleware          |
| `npm run build`         | Check frontend and API types, then create the production build |
| `npm run preview`       | Preview the static production build                            |
| `npm run typecheck`     | Check frontend and API types                                   |
| `npm run typecheck:api` | Check Vercel Functions with Node-compatible module resolution  |
| `npm test`              | Run the test suite                                             |

`npm run preview` serves the static frontend; it does not run the Vercel Functions. Use the development server or a Vercel deployment to access the APIs.

## Project Structure

```text
api/                  Vercel Functions for analytics, GitHub, and LeetCode
public/               Images, videos, and audio assets
src/
  components/         Navigation, project cards, charts, and shared UI
  data/portfolio.ts   Profile, projects, skills, experience, and site configuration
  lib/                Data fetching, normalization, and interface utilities
  pages/              Resume, analytics, and other pages
  App.tsx             Routes and the shared query provider
  main.tsx            Application entry point and analytics tracking
  *.css               Interface and responsive styles
tests/                Component and behavior tests
.env.example          Server-side analytics configuration template
vercel.json           SPA routing configuration
```

## Updating Portfolio Content

Edit `src/data/portfolio.ts` to change:

- Profile information, biography, photo, and contact details.
- Social links, education, and work experience.
- Project descriptions, screenshots, technology lists, and URLs.
- GitHub and LeetCode usernames.
- Site endpoints and optional support information.

Place screenshots and profile images in `public/images/`. The FlowBoard preview is stored at `public/videos/flowboard-preview.mp4`; its path is configured in the project's `video` field. Projects without a video use their screenshot.

## Updating the Resume

The resume uses a single Google Drive file ID configured as `resumeDriveFileId` in `src/data/portfolio.ts`. The preview and download URLs are generated from this ID.

To update the resume without changing code:

1. Open the existing PDF in Google Drive.
2. Use **Manage versions → Upload new version** to replace its contents.
3. Keep the file shared so visitors can view it.

Uploading a new version preserves the file ID. If you create a separate Drive file instead, update `resumeDriveFileId` and redeploy.

The PDF viewer remains mounted after its first visit during in-app navigation, preserving the loaded preview when returning to the resume page.

## Live Activity APIs

| Endpoint                   | Data                                                                                   |
| -------------------------- | -------------------------------------------------------------------------------------- |
| `/api/github`              | Public contribution calendar for the configured GitHub username                        |
| `/api/leetcode`            | Solved-problem statistics and submission activity for the configured LeetCode username |
| `/api/analytics?period=7d` | Production page views, visitors, chart data, and available previous-period totals      |

GitHub and LeetCode responses are cached at the deployment edge for 30 minutes. If a service is unavailable, the interface offers a retry rather than displaying fabricated activity.

## Analytics Configuration

Enable **Web Analytics** for the project in Vercel. The application already mounts the tracking component.

The public analytics dashboard reads the collected metrics through a server-side API. Add these variables in **Vercel → Project Settings → Environment Variables**:

| Variable                      | Value                                                                    |
| ----------------------------- | ------------------------------------------------------------------------ |
| `VERCEL_ANALYTICS_TOKEN`      | A Vercel access token with access to the project                         |
| `VERCEL_ANALYTICS_PROJECT_ID` | Project ID from Project Settings → General                               |
| `VERCEL_ANALYTICS_TEAM_ID`    | Team ID from Team Settings → General; omit for personal-account projects |

Keep these values server-side. Do not prefix them with `VITE_` or commit environment files containing credentials.

The dashboard supports **24H**, **7D**, and **30D**. Successful responses are cached at the deployment edge for five minutes. TanStack Query retains inactive client results for 30 minutes, so returning to a previously loaded period does not reload the chart. The selected period is stored for the browser session; **Refresh** explicitly requests updated data.

Growth percentages appear only when a nonzero previous-period total is available. Missing comparison data and zero baselines do not display a growth label. Available reporting history depends on the project's analytics plan and collection start date.

## Keyboard Shortcuts

Open search with **Ctrl + K** on Windows/Linux or **⌘ + K** on macOS. Use **↑ / ↓** to move through results, **Enter** to open one, and **Escape** to close search.

| Shortcut              | Destination                             |
| --------------------- | --------------------------------------- |
| Shift + H             | Home                                    |
| Shift + P             | Projects                                |
| Shift + R             | Resume                                  |
| Shift + A             | Analytics                               |
| Shift + T             | Skills                                  |
| Shift + W             | Experience                              |
| Shift + E             | Education                               |
| Shift + C             | Contact                                 |
| Shift + 1 / 2 / 3 / 4 | FlowBoard / MindMora / Trimly / AvoChat |

Destination shortcuts work in the empty search menu and outside editable fields. They do not interrupt an existing search query.

## Deploying to Vercel

Import the repository and use these settings:

| Setting            | Value           |
| ------------------ | --------------- |
| Root Directory     | `./`            |
| Application Preset | Vite            |
| Install Command    | `npm ci`        |
| Build Command      | `npm run build` |
| Output Directory   | `dist`          |

Add the analytics environment variables before deploying. If you add or change them afterward, redeploy for the Functions to use the updated values.

`vercel.json` sends frontend routes to `index.html` while leaving `/api/` routes to the serverless Functions. A static-only host requires separately hosted API endpoints and an SPA fallback.

## Contact

[LinkedIn](https://www.linkedin.com/in/yuvraj-satyapal) • [GitHub](https://github.com/yuvrajsatyapal) • [LeetCode](https://leetcode.com/u/yuvraj_satyapal/) • [Email](mailto:yuvrajsatyapal21@gmail.com)
