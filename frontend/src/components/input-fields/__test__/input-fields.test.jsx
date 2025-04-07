import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Input from "../input-fields";
import "@testing-library/jest-dom";

jest.mock("../handleSubmit", () => ({
  handleSubmit: jest.fn(),
}));

describe("Input Component", () => {
  test("renders the input component with text input", () => {
    render(<Input />);

    const textButton = screen.getByRole("button", { name: /Iš teksto/i });
    fireEvent.click(textButton);

    const textarea = screen.getByPlaceholderText(/Tekstą įklijuokite čia/i);
    expect(textarea).toBeInTheDocument();
  });

  test("renders the input component with link input", () => {
    render(<Input />);

    const linkButton = screen.getByRole("button", { name: /Iš nuorodos/i });
    fireEvent.click(linkButton);

    const input = screen.getByPlaceholderText(
      /Įkelkite nuorodą į privatumo politiką/i
    );
    expect(input).toBeInTheDocument();
  });

  test("renders the input component with file input", () => {
    render(<Input />);

    const fileButton = screen.getByRole("button", { name: /Iš failo/i });
    fireEvent.click(fileButton);

    const fileInput = screen.getByLabelText(/Pasirinkite iš savo įrenginio/i);
    expect(fileInput).toBeInTheDocument();
  });

  test("handles file selection", async () => {
    render(<Input />);

    const fileButton = screen.getByRole("button", { name: /Iš failo/i });
    fireEvent.click(fileButton);

    const fileInput = screen.getByLabelText(/Pasirinkite iš savo įrenginio/i);
    const file = new File(["dummy content"], "test.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(screen.getByText(file.name)).toBeInTheDocument();
    });
  });

  test("handles link input change", () => {
    render(<Input />);

    const linkButton = screen.getByRole("button", { name: /Iš nuorodos/i });
    fireEvent.click(linkButton);

    const input = screen.getByPlaceholderText(
      /Įkelkite nuorodą į privatumo politiką/i
    );
    fireEvent.change(input, { target: { value: "https://example.com" } });

    expect(input.value).toBe("https://example.com");
  });

  test("does not render submit button when there is no input", () => {
    render(<Input />);

    const submitButton = screen.queryByRole("button", { name: /Pateikti/i });

    expect(submitButton).not.toBeInTheDocument();
  });
});
