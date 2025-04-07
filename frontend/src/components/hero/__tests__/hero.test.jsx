import { render, screen } from "@testing-library/react";
import Hero from "../hero";
import "@testing-library/jest-dom";

test("renders Hero component with the provided title", () => {
  render(<Hero title="Test title" />);
  expect(screen.getByText("Test title")).toBeInTheDocument();
});

test("renders correctly when no title is given", () => {
  render(<Hero />);
  expect(screen.queryByText(/./)).not.toBeInTheDocument();
});
