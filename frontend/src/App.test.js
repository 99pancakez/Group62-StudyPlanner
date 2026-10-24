import App from "./App";

describe("App", () => {
  it("exists and exports a component", () => {
    expect(App).toBeDefined();
    expect(typeof App).toBe("function");
  });
});
