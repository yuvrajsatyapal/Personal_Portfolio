import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HiDownload } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import { HiCog } from "react-icons/hi";
import { AnalyticsChart, AnalyticsGrowth, type AnalyticsData } from "../components/AnalyticsChart";
import {
  profile,
  education,
  experience,
  projects,
  site,
} from "../data/portfolio";
import { External, PageLinks, Title } from "../components/Shared";
import Icon from "../components/Icon";
export function Resume() {
  return (
    <div className="standard-container secondary-page">
      <Title level={1}>Resume</Title>
      <div className="resume-actions">
        {profile.resume ? (
          <External className="resume-download-btn" href={profile.resumeDownload}>
            <HiDownload className="resume-download-icon" aria-hidden="true" />
            Download
          </External>
        ) : (
          <button disabled className="resume-download-btn">
            <HiDownload className="resume-download-icon" aria-hidden="true" />
            Resume PDF coming soon
          </button>
        )}
      </div>
      {profile.resume ? (
        <>
          <div className="resume-viewer">
            <iframe
              className="resume-iframe"
              title={profile.name + " resume"}
              src={profile.resumePreview}
            />
          </div>
          <div className="mobile-resume-link">
            <External className="resume-mobile-btn" href={profile.resume}>
              View / Download PDF <Icon name="external" />
            </External>
          </div>
        </>
      ) : (
        <div className="resume-summary">
          <h1>{profile.name}</h1>
          <p className="resume-role">
            {profile.role} · {profile.location}
          </p>
          <p>{profile.bio}</p>
          <h2>Experience</h2>
          {experience.map((e) => (
            <div key={e.company}>
              <h3>
                {e.role} · {e.company}
              </h3>
              <p>{e.dates}</p>
              <ul>
                {e.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            </div>
          ))}
          <h2>Selected Projects</h2>
          {projects.map((p) => (
            <div key={p.id}>
              <h3>{p.name}</h3>
              <p>{p.description}</p>
            </div>
          ))}
          <h2>Education</h2>
          <h3>{education.degree}</h3>
          <p>
            {education.institute} · {education.dates} · {education.grade}
          </p>
        </div>
      )}
      <PageLinks />
    </div>
  );
}
export function Analytics({ embedded = false }: { embedded?: boolean }) {
  const EmptyHeading = embedded ? "h3" : "h2";
  const [period, setPeriod] = useState(() => {
    try {
      const saved = sessionStorage.getItem("analytics-period");
      if (saved === "24h" || saved === "7d" || saved === "30d") return saved;
    } catch { /* Storage can be unavailable in private browsing. */ }
    return "7d";
  });
  useEffect(() => {
    try { sessionStorage.setItem("analytics-period", period); } catch { /* Keep in-memory selection. */ }
  }, [period]);
  const { data, isPending, refetch, isFetching } = useQuery({
    queryKey: ["analytics", site.analyticsEndpoint, period],
    enabled: Boolean(site.analyticsEndpoint),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: false,
    queryFn: async ({ signal }) => {
      const endpoint = site.analyticsEndpoint!;
      const response = await fetch(`${endpoint}${endpoint.includes("?") ? "&" : "?"}period=${period}`, { signal });
      if (!response.ok) throw new Error("Analytics unavailable");
      const stats = await response.json() as AnalyticsData;
      if (!Number.isFinite(stats.pageviews) || !Number.isFinite(stats.visitors) || !Array.isArray(stats.series))
        throw new Error("Invalid analytics response");
      return stats;
    },
  });
  return (
    <section
      id="analytics"
      className={`standard-container${embedded ? "" : " secondary-page"}`}
    >
      <Title level={embedded ? 2 : 1}>Analytics</Title>
      <div className="analytics-metrics">
        <div>
          <span>Visitors</span>
          <strong>{data?.visitors.toLocaleString() ?? "—"}</strong>
          {data && <AnalyticsGrowth current={data.visitors} previous={data.previous?.visitors} />}
        </div>
        <div>
          <span>Page Views</span>
          <strong>{data?.pageviews.toLocaleString() ?? "—"}</strong>
          {data && <AnalyticsGrowth current={data.pageviews} previous={data.previous?.pageviews} />}
        </div>
      </div>
      <div className="analytics-chart">
      <div className="analytics-controls">
        <span>
          <HiCog aria-hidden="true" />
          <span>~/analytics.tsx</span>
        </span>
        <div role="group" aria-label="Analytics period">
          {[
            ["24h", "24H"],
            ["7d", "7D"],
            ["30d", "30D"],
          ].map(([v, l]) => (
            <button
              key={v}
              className={v === period ? "selected" : ""}
              aria-pressed={v === period}
              onClick={() => setPeriod(v)}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
      <div className="analytics-legend" aria-label="Chart legend">
        <span><i className="visitors" />Visitors</span>
        <span><i className="pageviews" />Page Views</span>
      </div>
        {data ? (
          <AnalyticsChart key={period} data={data} />
        ) : (
          <div className="analytics-empty">
            <Icon name="chart" />
            <EmptyHeading>
              {!site.analyticsEndpoint
                ? "Analytics not connected"
                : isPending
                  ? "Loading analytics…"
                  : "Analytics temporarily unavailable"}
            </EmptyHeading>
            <p>
              {!site.analyticsEndpoint
                ? "Traffic will appear here once analytics is connected."
                : "Please try refreshing in a moment."}
            </p>
          </div>
        )}
      </div>
      {!embedded && (
      <div className="page-links">
        <Link className="view-all-btn" to="/">
          <Icon name="left" />
          Back to Home
        </Link>
        <button
          aria-label="Refresh analytics"
          className="view-all-btn"
          disabled={isFetching}
          onClick={() => void refetch()}
        >
          <Icon name="refresh" />
          Refresh
        </button>
      </div>
      )}
    </section>
  );
}
export function NotFound() {
  return (
    <div className="standard-container not-found">
      <h1>404</h1>
      <h2>This page wandered off.</h2>
      <p>Let's get you back to something useful.</p>
      <Link className="view-all-btn" to="/">
        <Icon name="left" />
        Back to Home
      </Link>
    </div>
  );
}
