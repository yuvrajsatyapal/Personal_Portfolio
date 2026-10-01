import { describe, expect, it } from "vitest";
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
  it("navigates to the complete project collection", async () => {
    open();
    await userEvent.click(
      within(screen.getByRole("navigation")).getByRole("link", {
        name: "Projects",
      }),
    );
    expect(screen.getByText("AvoChat")).toBeVisible();
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
  it("shows an honest unconfigured analytics state", () => {
    open("/analytics");
    expect(screen.getByText("Analytics not connected")).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Refresh analytics" }),
    ).toBeVisible();
  });
  it("handles unknown routes", () => {
    open("/missing");
    expect(screen.getByRole("heading", { name: "404" })).toBeVisible();
  });
});
