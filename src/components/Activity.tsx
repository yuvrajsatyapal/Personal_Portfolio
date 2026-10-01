import { useEffect, useState } from "react";
import { achievements, site, socials } from "../data/portfolio";
import type { LeetcodeStats } from "../lib/leetcode";
import type { GithubStats } from "../lib/github";
import type { CalendarData } from "../lib/calendar";
import { External, Title } from "./Shared";
import Icon from "./Icon";
import Heatmap from "./Heatmap";
function ringPath(start: number, end: number) {
  const point = (angle: number) => [60 + 52 * Math.cos(angle * Math.PI / 180), 60 + 52 * Math.sin(angle * Math.PI / 180)];
  const a = point(start), b = point(end);
  return `M ${a[0]} ${a[1]} A 52 52 0 ${end - start > 180 ? 1 : 0} 1 ${b[0]} ${b[1]}`;
}
export default function Activity({
  platform = "leetcode",
}: {
  platform?: "leetcode" | "github";
}) {
  const github = platform === "github";
  const label = github ? "GitHub" : "LeetCode";
  const username = github
    ? achievements.githubUsername
    : achievements.leetcodeUsername;
  const endpoint = github ? site.githubEndpoint : site.leetcodeEndpoint;
  const url = socials.find((s) => s.name === label)?.url;
  const [data, setData] = useState<{
    calendar: CalendarData;
    stats?: LeetcodeStats;
  } | null>(null);
  const [state, setState] = useState<"loading" | "error" | "ready">("loading");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setState("loading");
    setData(null);
    fetch(endpoint, { signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error();
        if (controller.signal.aborted) return;
        if (github) {
          const value = (await response.json()) as GithubStats;
          if (!value.calendar || !Object.keys(value.calendar).length)
            throw new Error();
          setData({ calendar: value.calendar });
        } else {
          const value = (await response.json()) as LeetcodeStats;
          if (typeof value.total !== "number" || !value.calendar)
            throw new Error();
          const counts: Record<string, number> = {};
          for (const [t, count] of Object.entries(value.calendar)) {
            const date = new Date(Number(t) * 1000).toISOString().slice(0, 10);
            counts[date] = (counts[date] || 0) + count;
          }
          const max = Math.max(1, ...Object.values(counts));
          const calendar: CalendarData = {};
          for (const [date, count] of Object.entries(counts))
            calendar[date] = {
              count,
              level: count
                ? Math.min(4, Math.max(1, Math.ceil((count / max) * 4)))
                : 0,
            };
          setData({ calendar, stats: value });
        }
        setState("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("error");
      });
    return () => controller.abort();
  }, [endpoint, github, retry]);
  return (
    <section className="standard-container activity-section">
      <Title>{github ? "GitHub Contributions" : "LeetCode Activity"}</Title>
      <div className="activity-card">
        <div className="activity-header">
          <span>
            <Icon name={platform} colored={!github} />
            {username}
          </span>
          {url && (
            <External href={url}>
              View profile
              <Icon name="external" />
            </External>
          )}
        </div>
        {state === "ready" && data ? (
          <>
            {data.stats && (
              <div className="activity-stats ring-stats">
                {(["total", "easy", "medium", "hard"] as const).map(difficulty => {
                  const stats = data.stats!;
                  const solved = stats[difficulty];
                  const available = stats.available?.[difficulty];
                  const label = difficulty === "total" ? "Problems solved" : difficulty[0].toUpperCase() + difficulty.slice(1);
                  return <div className={`activity-stat difficulty-${difficulty}`} key={difficulty}>
                    <svg className="stat-arc" viewBox="0 0 120 120" role="img" aria-label={available === undefined ? `${label}: ${solved} problems solved; total unavailable` : `${label}: ${solved} of ${available} problems solved`}>
                      {(difficulty === "total" ? (["easy", "medium", "hard"] as const) : [difficulty]).map((part, i) => {
                        const partTotal = stats.available?.[part];
                        const partProgress = partTotal ? Math.min(100, Math.max(0, stats[part] / partTotal * 100)) : 0;
                        const path = difficulty === "total" ? ringPath(135 + i * 90 + (i ? 3 : 0), 225 + i * 90 - (i < 2 ? 3 : 0)) : ringPath(135, 405);
                        return <g className={`ring-segment difficulty-${part}`} key={part}>
                          <path className="stat-arc-track" d={path} pathLength="100" />
                          <path className="stat-arc-progress" d={path} pathLength="100" strokeDasharray={`${partProgress} 100`} />
                        </g>;
                      })}
                    </svg>
                    <div className="stat-ring-content">
                      <div className="stat-fraction"><strong>{solved}</strong><span>/{available ?? "—"}</span></div>
                      <small>{difficulty === "total" && <span className="solved-check" aria-hidden="true">✓ </span>}{difficulty === "total" ? "Solved" : label}</small>
                    </div>
                    {difficulty === "total" && stats.attempting !== undefined && <span className="stat-attempting">{stats.attempting} Attempting</span>}
                  </div>;
                })}
              </div>
            )}
            {!github && (
              <div className="activity-highlights">
                <span>Total active days: <strong>{achievements.leetcodeActivity.totalActiveDays}</strong></span>
                <span>Max streak: <strong>{achievements.leetcodeActivity.maxStreak}</strong></span>
              </div>
            )}
            <Heatmap calendar={data.calendar} label={label} />
          </>
        ) : (
          <div className="activity-empty">
            <Icon name={platform} />
            <p>
              {state === "loading"
                ? "Loading live activity…"
                : "Live activity is temporarily unavailable."}
            </p>
            <span>
              {github
                ? "Public contributions, updated from GitHub."
                : "Graph and tree algorithms, and consistent problem solving."}
            </span>
            {state === "error" && (
              <button
                className="plain-btn"
                onClick={() => setRetry((n) => n + 1)}
              >
                <Icon name="refresh" />
                Retry
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
