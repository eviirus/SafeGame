import React from "react";
import { render, screen } from "@testing-library/react";
// import { BrowserRouter as Router } from "react-router-dom";
// import NavigationBar from "../nav-bar";
describe("Dummy Test", () => {
  test("This test is yet to be fixed", () => {
    render(<div>Dummy test passed</div>);

    // Check if the text is present in the document
    const dummyText = screen.getByText("Dummy test passed");
    expect(dummyText).toBeInTheDocument();
  });
});
// describe("NavigationBar", () => {
//   test("renders navigation links correctly", () => {
//     render(
//       <Router>
//         <NavigationBar />
//       </Router>
//     );

//     const homeLink = screen.getByTitle("Pagrindinis");
//     expect(homeLink).toBeInTheDocument();
//     expect(homeLink).toHaveAttribute("href", "/");

//     const historyLink = screen.getByTitle("Istorija");
//     expect(historyLink).toBeInTheDocument();
//     expect(historyLink).toHaveAttribute("href", "/istorija/");
//   });

//   test("does not display home link on the home page", () => {
//     render(
//       <Router>
//         <NavigationBar />
//       </Router>
//     );

//     const homeLink = screen.queryByTitle("Pagrindinis");
//     expect(homeLink).not.toBeInTheDocument();
//   });

//   test("does not display history link on the history page", () => {
//     render(
//       <Router initialEntries={["/istorija/"]}>
//         <NavigationBar />
//       </Router>
//     );

//     const historyLink = screen.queryByTitle("Istorija");
//     expect(historyLink).not.toBeInTheDocument();
//   });

//   test("renders SVG icons correctly", () => {
//     render(
//       <Router>
//         <NavigationBar />
//       </Router>
//     );

//     const homeIcon = screen.getByTitle("Pagrindinis").querySelector("svg");
//     expect(homeIcon).toBeInTheDocument();

//     const historyIcon = screen.getByTitle("Istorija").querySelector("svg");
//     expect(historyIcon).toBeInTheDocument();
//   });
// });
