import { useEffect, useRef, useState, useId, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { buildCalendar, type CalendarData } from "../lib/calendar";

export default function Heatmap({ calendar, label, end = new Date() }: {
  calendar: CalendarData; label: string; end?: Date;
}) {
  const grid = buildCalendar(calendar, end);
  const scroll = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const [tooltip, setTooltip] = useState<{ date: string; count: number; left: number; top: number } | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const keepTooltip = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const closeTooltip = () => { keepTooltip(); closeTimer.current = setTimeout(() => setTooltip(null), 120); };
  useEffect(() => {
    const hide = () => setTooltip(null);
    const key = (event: KeyboardEvent) => { if (event.key === "Escape") hide(); };
    window.addEventListener("keydown", key);
    window.addEventListener("resize", hide);
    window.addEventListener("scroll", hide, true);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", hide);
      window.removeEventListener("scroll", hide, true);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);
  const unit = label === "GitHub" ? "contributions" : "submissions";
  useEffect(() => {
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, [calendar]);
  return <>
    <div ref={scroll} className="contribution-scroll" role="region" aria-label={label + " activity calendar"} tabIndex={0}>
      <div className="contribution-calendar" style={{ "--weeks": grid.days.length / 7 } as CSSProperties}>
        <div className="contribution-months">{grid.months.map((month, i) => <span key={i} style={{ gridColumn: month.column + 1 }}>{month.label}</span>)}</div>
        <div className="contribution-grid" role="group" aria-label={label + " daily " + unit}>
          {grid.days.map((day, i) => day ? <span key={day.date} className={"contribution-day contribution-level-" + day.level + (day.count > 99 ? " large-count" : "")} onMouseEnter={event => {
            keepTooltip();
            const rect = event.currentTarget.getBoundingClientRect();
            setTooltip({ date: day.date, count: day.count, left: Math.max(108, Math.min(window.innerWidth - 108, rect.left + rect.width / 2)), top: Math.max(8, rect.top - 64) });
          }} onMouseLeave={closeTooltip} aria-describedby={tooltip?.date === day.date ? tooltipId : undefined} aria-label={day.date + ": " + day.count + " " + unit}>{day.count > 0 ? day.count : null}</span> : <span key={"padding-" + i} className="contribution-padding" aria-hidden="true" />)}
        </div>
      </div>
    </div>
    {tooltip && createPortal(
      <div id={tooltipId} className="activity-block-tooltip" role="tooltip" style={{ left: tooltip.left, top: tooltip.top }} onMouseEnter={keepTooltip} onMouseLeave={closeTooltip}>
        <strong>{tooltip.count.toLocaleString()} {tooltip.count === 1 ? unit.slice(0, -1) : unit}</strong>
        <span>{new Date(tooltip.date + "T00:00:00Z").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}</span>
      </div>, document.body
    )}
    <div className="contribution-caption"><p>{grid.total.toLocaleString()} {unit} in the past year</p><div className="contribution-legend"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <span key={level} className={"contribution-day contribution-level-" + level} aria-hidden="true" />)}<span>More</span></div></div>
  </>;
}
