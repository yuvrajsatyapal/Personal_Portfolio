import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Activity from "../src/components/Activity";
afterEach(() => vi.unstubAllGlobals());
function mockStats(total: number, easy: number, medium: number, hard: number, available?: Record<string, number>) {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => ({ total, easy, medium, hard, available, attempting: 2, calendar: {} }) })));
}
describe("LeetCode difficulty summary", () => {
  it("shows live solved and available counts in the four progress rings", async () => {
    mockStats(471, 275, 179, 17, { total: 4069, easy: 968, medium: 2122, hard: 979 });
    render(<Activity />);
    expect(await screen.findByText("Solved")).toBeVisible();
    expect(screen.getByText("2 Attempting")).toBeVisible();
    for (const [label, solved, available] of [["Problems solved",471,4069],["Easy",275,968],["Medium",179,2122],["Hard",17,979]] as const) {
      const ring = screen.getByRole("img", { name: `${label}: ${solved} of ${available} problems solved` });
      if (label === "Problems solved") { expect(ring.querySelectorAll(".stat-arc-progress")).toHaveLength(3); continue; }
      expect(ring.querySelector('.stat-arc-progress')).toHaveAttribute('stroke-dasharray', `${solved / available * 100} 100`);
    }
    expect(screen.getByText('/4069')).toBeVisible();
    expect(screen.getByText('/968')).toBeVisible();
  });
  it("keeps zero-count progress finite", async () => {
    mockStats(0,0,0,0,{total:0,easy:0,medium:0,hard:0});
    render(<Activity />);
    const ring = await screen.findByRole("img", { name: "Easy: 0 of 0 problems solved" });
    expect(ring.querySelector('.stat-arc-progress')).toHaveAttribute('stroke-dasharray','0 100');
  });
  it("does not invent totals when catalog data is missing", async () => {
    mockStats(471,275,179,17);
    render(<Activity />);
    expect(await screen.findByRole("img",{name:"Easy: 275 problems solved; total unavailable"})).toBeVisible();
    expect(screen.getAllByText('/—')).toHaveLength(4);
  });
});
