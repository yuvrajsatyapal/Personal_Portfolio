import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
      <Title>/resume</Title>
      <p className="resume-description">
        My resume — view it below or download a copy.
      </p>
      <div className="resume-actions">
        {profile.resume ? (
          <External className="resume-download-btn" href={profile.resume}>
            <Icon name="resume" />
            Download resume PDF
          </External>
        ) : (
          <button disabled className="resume-download-btn">
            <Icon name="resume" />
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
              src={profile.resume}
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
interface AnalyticsData {
  pageviews: number;
  visitors: number;
  series: { label: string; pageviews: number; visitors: number }[];
}
export function Analytics() {
  const [period, setPeriod] = useState("7d");
  const [refresh, setRefresh] = useState(0);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [state, setState] = useState("idle");
  useEffect(() => {
    if (!site.analyticsEndpoint) return;
    const controller = new AbortController();
    setData(null);
    setState("loading");
    fetch(
      site.analyticsEndpoint +
        (site.analyticsEndpoint.includes("?") ? "&" : "?") +
        "period=" +
        period,
      { signal: controller.signal },
    )
      .then(async (r) => {
        if (!r.ok) throw new Error();
        const d = (await r.json()) as AnalyticsData;
        if (
          typeof d.pageviews !== "number" ||
          typeof d.visitors !== "number" ||
          !Array.isArray(d.series)
        )
          throw new Error();
        setData(d);
        setState("ready");
      })
      .catch(() => {
        if (!controller.signal.aborted) setState("error");
      });
    return () => controller.abort();
  }, [period, refresh]);
  return (
    <div className="standard-container secondary-page">
      <Title>/analytics</Title>
      <p className="resume-description">
        A transparent look at this portfolio's traffic.
      </p>
      <div className="analytics-controls">
        <span>
          <Icon name="chart" />
          Traffic overview
        </span>
        <div role="group" aria-label="Analytics period">
          {[
            ["24h", "24h"],
            ["7d", "7 days"],
            ["30d", "30 days"],
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
      <div className="analytics-metrics">
        <div>
          <span>Page views</span>
          <strong>{data?.pageviews.toLocaleString() ?? "—"}</strong>
        </div>
        <div>
          <span>Visitors</span>
          <strong>{data?.visitors.toLocaleString() ?? "—"}</strong>
        </div>
      </div>
      <div className="analytics-chart">
        {data ? (
          <>
            <div
              className="bar-chart"
              role="img"
              aria-label="Page views by time period"
            >
              {data.series.map((s, i) => (
                <div
                  key={i}
                  title={s.label + ": " + s.pageviews + " page views"}
                  style={{
                    height:
                      Math.max(
                        2,
                        (s.pageviews /
                          Math.max(1, ...data.series.map((p) => p.pageviews))) *
                          100,
                      ) + "%",
                  }}
                />
              ))}
            </div>
            <p className="activity-caption">Page views · {period}</p>
          </>
        ) : (
          <div className="analytics-empty">
            <Icon name="chart" />
            <h3>
              {!site.analyticsEndpoint
                ? "Analytics not connected"
                : state === "loading"
                  ? "Loading analytics…"
                  : "Analytics temporarily unavailable"}
            </h3>
            <p>
              {!site.analyticsEndpoint
                ? "Traffic will appear here once analytics is connected."
                : "Please try refreshing in a moment."}
            </p>
          </div>
        )}
      </div>
      <div className="page-links">
        <Link className="view-all-btn" to="/">
          <Icon name="left" />
          Back to Home
        </Link>
        <button
          aria-label="Refresh analytics"
          className="view-all-btn"
          onClick={() => setRefresh((n) => n + 1)}
        >
          <Icon name="refresh" />
          Refresh
        </button>
      </div>
    </div>
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
