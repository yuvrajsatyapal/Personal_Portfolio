import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { buildCalendar } from "../src/lib/calendar";
import { parseGithubCalendar } from "../src/lib/github";
import Heatmap from "../src/components/Heatmap";
describe("contribution calendars", () => {
  it("aligns real dates to Sunday-start weeks without shifting counts", () => {
    const grid = buildCalendar(
      { "2026-10-01": { count: 19, level: 4 } },
      new Date("2026-10-01T12:00:00Z"),
    );
    const index = grid.days.findIndex((d) => d?.date === "2026-10-01");
    expect(index % 7).toBe(4);
    expect(grid.days[index]?.count).toBe(19);
    expect(grid.days[index]?.level).toBe(4);
    expect(grid.days.length % 7).toBe(0);
    expect(grid.total).toBe(19);
    expect(grid.months.some((m) => m.label === "Oct")).toBe(true);
  });
  it("extracts exact counts, dates and intensity from GitHub public calendar", () => {
    const html =
      '<td data-date="2026-09-30" id="day-a" data-level="3"></td><tool-tip for="day-a">19 contributions on September 30th.</tool-tip><td data-date="2026-10-01" id="day-b" data-level="0"></td><tool-tip for="day-b">No contributions on October 1st.</tool-tip>';
    expect(parseGithubCalendar(html)).toEqual({
      calendar: {
        "2026-09-30": { count: 19, level: 3 },
        "2026-10-01": { count: 0, level: 0 },
      },
    });
  });
  it("does not interpret an upstream error page as zero activity", () => {
    expect(() => parseGithubCalendar("<h1>Service unavailable</h1>")).toThrow();
  });
  it("renders contribution numbers inside active blocks and leaves zero blocks empty", () => {
    render(
      <Heatmap
        calendar={{ "2026-10-01": { count: 19, level: 4 } }}
        label="GitHub"
        end={new Date("2026-10-01T12:00:00Z")}
      />,
    );
    expect(
      screen.getByLabelText("2026-10-01: 19 contributions"),
    ).toHaveTextContent("19");
    expect(
      screen.getByLabelText("2026-09-30: 0 contributions"),
    ).toBeEmptyDOMElement();
    expect(screen.getByText("Less")).toBeVisible();
    expect(screen.getByText("More")).toBeVisible();
  });
});
