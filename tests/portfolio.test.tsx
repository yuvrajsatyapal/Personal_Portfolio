import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";
const open = (path = "/") =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );
describe("portfolio flows", () => {
  it("shows the reference development indicator for the building projects", () => {
    open();
    const card = document.querySelector("#project-hypothron-ai")! as HTMLElement;
    const indicator = within(card).getByLabelText("Under development");
    expect(indicator).toHaveAttribute("aria-describedby", "development-hypothron-ai");
    expect(within(card).getByRole("tooltip", { hidden: true })).toHaveTextContent("Functionality might not work properly");
    expect(within(card).getByRole("tooltip", { hidden: true })).toHaveTextContent("Currently Building This Project, So its Under Development");
    expect(screen.getAllByLabelText("Under development")).toHaveLength(2);
  });
  it("links the experience company to Arabazaar", () => {
    open();
    expect(screen.getByRole("link", { name: "Visit Arabazaar website" })).toHaveAttribute(
      "href", "https://arabazaar.com/",
    );
  });
  it.each(["/", "/home"])("shows exactly four ordered projects on %s", (path) => {
    open(path);
    const cards = document.querySelectorAll(".home-container .project-card");
    expect(Array.from(cards).map(card => card.querySelector("h3")?.textContent)).toEqual([
      "FlowBoard", "Hypothron AI", "QueryCure", "PitchBorn",
    ]);
  });
  it.each(["/", "/home"])("orders home sections without Education on %s", (path) => {
    open(path);
    const sections = Array.from(document.querySelectorAll(".home-container > section"));
    const names = sections.slice(1).map(section => section.querySelector("h2")?.textContent);
    expect(names).toEqual([
      "Experience", "Projects", "Skills", "GitHub Contributions",
      "LeetCode Activity", "Analytics", "Let's Connect",
    ]);
    expect(screen.queryByRole("heading", { name: "Education" })).not.toBeInTheDocument();
  });
  it.each(["/", "/home"])("omits Education from %s", (path) => {
    open(path);
    expect(screen.queryByRole("heading", { name: "Education" })).not.toBeInTheDocument();
  });
  it("links the current building status to projects", () => {
    open();
    expect(screen.getByRole("link", { name: "Building Hypothron AI" })).toHaveAttribute("href", "/projects");
    expect(screen.queryByText(/MindMora/)).not.toBeInTheDocument();
  });
  it("shows GitHub and LeetCode profile cards without the hero social row", () => {
    open();
    const hero = document.querySelector("#about")!;
    const links = within(hero as HTMLElement);
    expect(links.getByRole("link", { name: /GitHub.*Profile/ })).toHaveAttribute(
      "href", "https://github.com/yuvrajsatyapal",
    );
    expect(links.getByRole("link", { name: /LeetCode.*Profile/ })).toBeVisible();
    expect(hero.querySelector(".contact-me")).toBeNull();
    expect(within(document.querySelector("#contact")! as HTMLElement).getByRole("link", { name: "LinkedIn" })).toBeVisible();
  });
  it.each(["/", "/home"])("shows Analytics below LeetCode on %s", (path) => {
    open(path);
    const leetcode = screen.getByRole("heading", { name: "LeetCode Activity" });
    const analytics = screen.getByRole("heading", { name: "Analytics" });
    expect(leetcode.compareDocumentPosition(analytics) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    expect(screen.getByRole("group", { name: "Analytics period" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Refresh analytics" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Back to Home/ })).not.toBeInTheDocument();
  });
  it("navigates to the complete project collection", async () => {
    open();
    await userEvent.click(
      within(screen.getByRole("navigation")).getByRole("link", {
        name: "Projects",
      }),
    );
    expect(screen.getByText("AvoChat")).toBeVisible();
    expect(screen.queryByRole("heading", { name: "LifeTale" })).not.toBeInTheDocument();
    expect(screen.queryByText("InsightSpend")).not.toBeInTheDocument();
  });
  it("expands experience with keyboard-accessible controls", async () => {
    open();
    const b = screen.getAllByRole("button", { name: /Toggle details/ })[0];
    expect(b).toHaveAttribute("aria-expanded", "false");
    await userEvent.click(b);
    expect(b).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/7 core modules/)).toBeVisible();
  });
  it("shows the uploaded profile photo without a QR toggle", () => {
    open();
    expect(screen.getByAltText("Profile photo")).toHaveAttribute("src", "/images/yuvraj-profile.png");
    expect(screen.queryByRole("button", { name: "Show profile QR code" })).not.toBeInTheDocument();
  });
  it("does not send support to sample payment destinations", () => {
    open("/support");
    expect(screen.getByRole("button", { name: "Copy UPI ID" })).toBeDisabled();
    expect(
      screen.queryByRole("link", { name: /PayPal/ }),
    ).not.toBeInTheDocument();
  });
  it("resets crypto networks when selecting another coin", async () => {
    open("/support");
    await userEvent.selectOptions(screen.getByLabelText("Coin"), "BTC");
    expect(screen.getByLabelText("Network")).toHaveValue("Bitcoin");
    expect(
      screen.getByRole("button", { name: "Copy wallet address" }),
    ).toBeDisabled();
  });
  it("shows an honest unavailable state when the analytics API fails", async () => {
    const request = vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response("unavailable", { status: 503 }));
    open("/analytics");
    expect(await screen.findByText("Analytics temporarily unavailable")).toBeVisible();
    expect(request).toHaveBeenCalledWith("/api/analytics?period=7d", expect.anything());
    expect(
      screen.getByRole("button", { name: "Refresh analytics" }),
    ).toBeVisible();
    request.mockRestore();
  });
  it("handles unknown routes", () => {
    open("/missing");
    expect(screen.getByRole("heading", { name: "404" })).toBeVisible();
  });
});

 it("shows PitchBorn links and README-backed project details", async () => {
  open("/projects");
  const card = within(document.querySelector("#project-pitchborn")! as HTMLElement);
  expect(card.queryByLabelText("Under development")).not.toBeInTheDocument();
  expect(card.queryByRole("tooltip", { hidden: true })).not.toBeInTheDocument();
  expect(card.getByRole("link", { name: /Live/ })).toHaveAttribute("href", "https://pitch-born.vercel.app/");
  expect(card.getByRole("link", { name: /GitHub/ })).toHaveAttribute("href", "https://github.com/yuvrajsatyapal/PitchBorn");
  for (const tech of ["Zod", "Vitest", "Playwright"]) expect(card.getByText(tech)).toBeVisible();
  await userEvent.click(card.getByRole("button", { name: "Details" }));
  expect(card.getByText(/298 real clubs across 15 leagues/)).toBeVisible();
  expect(card.getByText(/Client-side static export/)).toBeVisible();
});
