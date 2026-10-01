export type AnalyticsPeriod = "24h" | "7d" | "30d";
interface Config {
  token: string | undefined;
  projectId: string | undefined;
  teamId?: string;
}
function metrics(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("Invalid analytics response");
  const row = value as Record<string, unknown>;
  const { pageviews, visitors } = row;
  if (typeof pageviews !== "number" || !Number.isInteger(pageviews) || pageviews < 0 ||
      typeof visitors !== "number" || !Number.isInteger(visitors) || visitors < 0)
    throw new Error("Invalid analytics metrics");
  return { pageviews, visitors };
}
export function isAnalyticsPeriod(value: unknown): value is AnalyticsPeriod {
  return value === "24h" || value === "7d" || value === "30d";
}
export async function getAnalytics(period: AnalyticsPeriod, config: Config, now = new Date()) {
  if (!config.token || !config.projectId) throw new Error("Analytics not configured");
  const hourly = period === "24h";
  const since = new Date(now);
  if (hourly) {
    since.setUTCMinutes(0, 0, 0);
    since.setUTCHours(since.getUTCHours() - 23);
  } else {
    since.setUTCHours(0, 0, 0, 0);
    since.setUTCDate(since.getUTCDate() - (period === "7d" ? 6 : 29));
  }
  const query = async (by: string, start = since, end = now) => {
    const url = new URL("https://api.vercel.com/v1/query/web-analytics/visits/aggregate");
    url.searchParams.set("projectId", config.projectId!);
    if (config.teamId) url.searchParams.set("teamId", config.teamId);
    url.searchParams.set("since", start.toISOString());
    url.searchParams.set("until", end.toISOString());
    url.searchParams.set("by", by);
    url.searchParams.set("limit", "100");
    url.searchParams.set("filter", "environment eq 'production'");
    const response = await fetch(url.href, {
      headers: { Authorization: `Bearer ${config.token}` },
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) throw new Error("Analytics service unavailable");
    const body = await response.json() as { data?: unknown };
    if (!Array.isArray(body.data)) throw new Error("Invalid analytics response");
    return body.data as unknown[];
  };
  // One production-environment row gives distinct visitors across the whole period.
  const previousStart = new Date(since);
  if (hourly) previousStart.setUTCHours(previousStart.getUTCHours() - 24);
  else previousStart.setUTCDate(previousStart.getUTCDate() - (period === "7d" ? 7 : 30));
  const previousEnd = new Date(since.getTime() - 1);
  // Comparison can fall outside the plan's retention window; current metrics still render.
  const [totals, rows, previousRows] = await Promise.all([
    query("environment"), query(hourly ? "hour" : "day"),
    query("environment", previousStart, previousEnd).catch(() => null),
  ]);
  if (totals.length > 1) throw new Error("Invalid analytics totals");
  const total = totals.length ? metrics(totals[0]) : { pageviews: 0, visitors: 0 };
  const buckets = new Map<string, { pageviews: number; visitors: number }>();
  for (const row of rows) {
    const values = metrics(row);
    const timestamp = (row as Record<string, unknown>).timestamp;
    if (typeof timestamp !== "string" || !Number.isFinite(Date.parse(timestamp)))
      throw new Error("Invalid analytics timestamp");
    const date = new Date(timestamp);
    if (hourly) date.setUTCMinutes(0, 0, 0);
    else date.setUTCHours(0, 0, 0, 0);
    buckets.set(date.toISOString(), values);
  }
  const series: { label: string; pageviews: number; visitors: number }[] = [];
  for (const date = new Date(since); date <= now; hourly ? date.setUTCHours(date.getUTCHours() + 1) : date.setUTCDate(date.getUTCDate() + 1)) {
    const label = date.toLocaleString("en-US", hourly
      ? { hour: "numeric", timeZone: "UTC" }
      : { month: "short", day: "numeric", timeZone: "UTC" });
    series.push({ label, ...(buckets.get(date.toISOString()) || { pageviews: 0, visitors: 0 }) });
  }
  let previous: { pageviews: number; visitors: number } | undefined;
  if (previousRows && previousRows.length <= 1) {
    try { previous = previousRows.length ? metrics(previousRows[0]) : { pageviews: 0, visitors: 0 }; }
    catch { /* Ignore unavailable comparison metrics. */ }
  }
  return { ...total, series, ...(previous ? { previous } : {}) };
}
