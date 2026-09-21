import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import App from "./App";

describe("App routing", () => {
  it("renders the QnA screen at the default route", () => {
    render(<App />);
    expect(
      screen.getByRole("heading", {
        name: "Which program code applies to your degree?",
      }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Next" })).toBeInTheDocument();
  });
});
