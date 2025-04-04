import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Page from "../src/app/update/[todoId]/Page";
import { useRouter } from "next/navigation";
import { act } from "react";
import "@testing-library/jest-dom";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    pathname: "/",
    query: {},
    asPath: "/",
  }),
}));
const user = userEvent.setup();
global.fetch = jest.fn();

describe("Todo Page", () => {
  const mockRouter = { replace: jest.fn() };

  beforeEach(() => {
    useRouter.mockReturnValue(mockRouter);
    fetch.mockClear();
  });

  it("renders form fields correctly", async () => {
    await act(async () => {
      render(<Page params={Promise.resolve({ todoId: 1 })} />);
    });
    expect(await screen.findByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/completed/i)).toBeInTheDocument();
    expect(screen.getByText(/submit/i)).toBeInTheDocument();
  });

  it("fetches and displays todo data", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: "Test Todo",
        description: "Test Desc",
        completed: false,
      }),
    });

    await act(async () => {
      render(<Page params={Promise.resolve({ todoId: 1 })} />);
    });

    await waitFor(() =>
      expect(screen.getByDisplayValue("Test Todo")).toBeInTheDocument(),
    );
    expect(screen.getByDisplayValue("Test Desc")).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: "Updated Todo",
        description: "Updated Desc",
        completed: true,
      }),
    });

    await act(async () => {
      render(<Page params={Promise.resolve({ todoId: 1 })} />);
    });

    await waitFor(() =>
      expect(screen.getByDisplayValue("Updated Todo")).toBeInTheDocument(),
    );
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        title: "Updated Todo",
        description: "Updated Desc",
        completed: true,
      }),
    });
    fireEvent.change(screen.getByLabelText(/title/i), {
      target: { value: "Updated Todo" },
    });
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: "Updated Desc" },
    });
    fireEvent.click(screen.getByLabelText(/completed/i));
    user.click(screen.getByRole("button", { name: /submit/i }));

    await waitFor(() =>
      expect(mockRouter.replace).toHaveBeenCalledWith("/?action=update"),
    );
    console.log("Router calls:", mockRouter.replace.mock.calls);
  });

  it("handles API errors gracefully", async () => {
    fetch.mockRejectedValueOnce(new Error("Failed to fetch"));

    render(<Page params={Promise.resolve({ todoId: 1 })} />);

    await waitFor(() =>
      expect(screen.getByText(/failed to fetch/i)).toBeInTheDocument(),
    );
  });
});
