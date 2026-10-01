import { useId, useState } from "react";

export interface AnalyticsData {
  pageviews: number;
  visitors: number;
  previous?: { pageviews: number; visitors: number };
  series: { label: string; pageviews: number; visitors: number }[];
}
const width = 800, height = 330, left = 58, right = 12, top = 22, bottom = 292;
function tickLabel(value: number) {
  return value >= 1000 ? (value / 1000).toFixed(1) + "k" : String(value);
}
export function AnalyticsChart({ data }: { data: AnalyticsData }) {
  const id = useId().replace(/:/g, "");
  const [active, setActive] = useState<number | null>(null);
  const maximum = Math.max(3, ...data.series.flatMap((row) => [row.visitors, row.pageviews]));
  const magnitude = 10 ** Math.floor(Math.log10(maximum));
  const ceiling = Math.ceil(maximum / magnitude) * magnitude;
  const x = (index: number) => data.series.length === 1 ? (left + width - right) / 2
    : left + index * (width - left - right) / Math.max(1, data.series.length - 1);
  const y = (value: number) => bottom - value / ceiling * (bottom - top);
  const path = (metric: "visitors" | "pageviews") => data.series.map((row, index) =>
    `${index === 0 ? "M" : "L"}${x(index)},${y(row[metric])}`).join(" ");
  const hovered = active === null ? null : data.series[active];
  const labelStep = Math.max(1, Math.ceil(data.series.length / 7));
  const mobileLabelStep = Math.max(1, Math.ceil(data.series.length / 4));
  return (
    <div className="analytics-plot" onMouseLeave={() => setActive(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Visitors and page views over time">
        <desc>{data.series.length ? data.series.map((row) => `${row.label}: ${row.visitors} visitors, ${row.pageviews} page views`).join("; ") : "No traffic recorded in this period."}</desc>
        <defs>
          {(["visitors", "pageviews"] as const).map((metric) => <linearGradient key={metric} id={`${id}-${metric}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={metric === "visitors" ? "#14b8a6" : "#f43f68"} stopOpacity=".2" />
            <stop offset="100%" stopColor={metric === "visitors" ? "#14b8a6" : "#f43f68"} stopOpacity="0" />
          </linearGradient>)}
        </defs>
        {[0, 1, 2, 3].map((step) => {
          const value = ceiling * step / 3;
          return <g key={step} className="analytics-axis">
            <line x1={left} x2={width - right} y1={y(value)} y2={y(value)} />
            <text x={left - 12} y={y(value) + 4} textAnchor="end">{tickLabel(Math.round(value))}</text>
          </g>;
        })}
        {(["pageviews", "visitors"] as const).map((metric) => data.series.length > 0 && <g key={metric}>
          <path d={`${path(metric)} L${x(data.series.length - 1)},${bottom} L${x(0)},${bottom} Z`} fill={`url(#${id}-${metric})`} />
          <path className={`analytics-line ${metric}`} d={path(metric)} />
          {data.series.length === 1 && <circle cx={x(0)} cy={y(data.series[0][metric])} r="3" fill={metric === "visitors" ? "#14b8a6" : "#f43f68"} />}
        </g>)}
        {data.series.map((row, index) => (index % labelStep === 0 || index % mobileLabelStep === 0 || index === data.series.length - 1) &&
          <text className={`analytics-date${index % labelStep === 0 || index === data.series.length - 1 ? " desktop-label" : ""}${index % mobileLabelStep === 0 || index === data.series.length - 1 ? " mobile-label" : ""}`} key={index} x={x(index)} y={bottom + 23} textAnchor={index === data.series.length - 1 ? "end" : index === 0 ? "start" : "middle"}>{row.label}</text>)}
        {active !== null && hovered && <g className="analytics-highlight">
          <line x1={x(active)} x2={x(active)} y1={top} y2={bottom} />
          <circle cx={x(active)} cy={y(hovered.visitors)} r="4" fill="#14b8a6" />
          <circle cx={x(active)} cy={y(hovered.pageviews)} r="4" fill="#f43f68" />
        </g>}
      </svg>
      {data.series.map((row, index) => <button
        key={index} className="analytics-point" style={{ left: `${x(index) / width * 100}%`, width: `${Math.min(12, 88 / Math.max(1, data.series.length))}%` }}
        aria-label={`${row.label}: ${row.visitors.toLocaleString()} visitors, ${row.pageviews.toLocaleString()} page views`}
        onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onBlur={() => setActive(null)} onClick={() => setActive(index)}
      />)}
      {hovered && <div className="analytics-tooltip" role="tooltip" style={{ left: `${Math.max(18, Math.min(82, x(active!) / width * 100))}%` }}>
        <strong>{hovered.label}</strong>
        <span><i className="visitors" />Visitors <b>{hovered.visitors.toLocaleString()}</b></span>
        <span><i className="pageviews" />Page Views <b>{hovered.pageviews.toLocaleString()}</b></span>
      </div>}
    </div>
  );
}
export function AnalyticsGrowth({ current, previous }: { current: number; previous?: number }) {
  if (previous === undefined || !Number.isFinite(previous) || previous <= 0) return null;
  if (current === previous)
    return <small className="analytics-growth unchanged" title="No change from the previous period">→ 0.0%</small>;
  const change = (current - previous) / previous * 100;
  return <small className={`analytics-growth${change < 0 ? " negative" : ""}`} title="Compared with the previous period">
    {change < 0 ? "↓" : "↑"} {Math.abs(change).toFixed(1)}%
  </small>;
}
