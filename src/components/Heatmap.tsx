import { useEffect, useRef, type CSSProperties } from "react";
import { buildCalendar, type CalendarData } from "../lib/calendar";

export default function Heatmap({ calendar, label, end = new Date() }: {
  calendar: CalendarData; label: string; end?: Date;
}) {
  const grid = buildCalendar(calendar, end);
  const scroll = useRef<HTMLDivElement>(null);
  const unit = label === "GitHub" ? "contributions" : "submissions";
  useEffect(() => {
    if (scroll.current) scroll.current.scrollLeft = scroll.current.scrollWidth;
  }, [calendar]);
  return <>
    <div ref={scroll} className="contribution-scroll" role="region" aria-label={label + " activity calendar"} tabIndex={0}>
      <div className="contribution-calendar" style={{ "--weeks": grid.days.length / 7 } as CSSProperties}>
        <div className="contribution-months">{grid.months.map((month, i) => <span key={i} style={{ gridColumn: month.column + 1 }}>{month.label}</span>)}</div>
        <div className="contribution-grid" role="group" aria-label={label + " daily " + unit}>
          {grid.days.map((day, i) => day ? <span key={day.date} className={"contribution-day contribution-level-" + day.level + (day.count > 99 ? " large-count" : "")} title={day.date + ": " + day.count + " " + unit} aria-label={day.date + ": " + day.count + " " + unit}>{day.count > 0 ? day.count : null}</span> : <span key={"padding-" + i} className="contribution-padding" aria-hidden="true" />)}
        </div>
      </div>
    </div>
    <div className="contribution-caption"><p>{grid.total.toLocaleString()} {unit} in the past year</p><div className="contribution-legend"><span>Less</span>{[0, 1, 2, 3, 4].map(level => <span key={level} className={"contribution-day contribution-level-" + level} aria-hidden="true" />)}<span>More</span></div></div>
  </>;
}
