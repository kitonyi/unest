import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders main application component", () => {
  render(<App />);
  const linkElement = screen.getByText(/welcome to the app/i);
  expect(linkElement).toBeInTheDocument();
});
