import { getAnalytics, isAnalyticsPeriod } from "../src/lib/analytics.js";
interface Response {
  status: (code: number) => Response;
  json: (body: unknown) => void;
  setHeader: (name: string, value: string) => void;
}
export default async function handler(request: { url?: string }, response: Response) {
  const period = new URL(request.url || "/", "https://portfolio.local").searchParams.get("period") || "7d";
  if (!isAnalyticsPeriod(period)) {
    response.status(400).json({ error: "Invalid analytics period" });
    return;
  }
  try {
    const stats = await getAnalytics(period, {
      token: process.env.VERCEL_ANALYTICS_TOKEN,
      projectId: process.env.VERCEL_ANALYTICS_PROJECT_ID,
      teamId: process.env.VERCEL_ANALYTICS_TEAM_ID,
    });
    response.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=600");
    response.status(200).json(stats);
  } catch {
    response.setHeader("Cache-Control", "no-store");
    response.status(503).json({ error: "Live analytics temporarily unavailable" });
  }
}
