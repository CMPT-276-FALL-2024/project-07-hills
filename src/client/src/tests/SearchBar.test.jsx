import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../components/SearchBar";
import { QueueProvider } from "../components/QueueContext";

// Mock fetch globally
global.fetch = jest.fn();

// Mock Queue Context
jest.mock("../components/QueueContext", () => ({
  useQueue: () => ({
    queue: {
      addSong: jest.fn()
    },
    removeSongFromQueue: jest.fn()
  }),
  QueueProvider: ({ children }) => <div>{children}</div>
}));

describe("SearchBar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockReset();
  });

  it("renders search input and button", () => {
    render(
      <QueueProvider>
        <SearchBar />
      </QueueProvider>
    );
    
    expect(screen.getByPlaceholderText(/type here/i)).toBeInTheDocument();
    expect(screen.getByText(/add to queue/i)).toBeInTheDocument();
  });

  it("handles empty query", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    render(
      <QueueProvider>
        <SearchBar />
      </QueueProvider>
    );
    
    const addButton = screen.getByText(/add to queue/i);
    fireEvent.click(addButton);
    
    expect(consoleSpy).toHaveBeenCalledWith("Query cannot be empty");
    expect(fetch).not.toHaveBeenCalled();
    
    consoleSpy.mockRestore();
  });

  it("creates task and checks status", async () => {
    // Mock successful responses
    fetch
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ task_id: "test-task-id" })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: "Completed" })
      }))
      .mockImplementationOnce(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          result: { title: "Test Song", artist: "Test Artist" }
        })
      }));

    render(
      <QueueProvider>
        <SearchBar />
      </QueueProvider>
    );
    
    // Enter search query
    const input = screen.getByPlaceholderText(/type here/i);
    fireEvent.change(input, { target: { value: "test query" } });
    
    // Click add to queue
    const addButton = screen.getByText(/add to queue/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://teaching-gorilla-rich.ngrok-free.app:8000/task/create",
        expect.any(Object)
      );
    });
    
    // Verify task ID display
    await waitFor(() => {
      expect(screen.getByText(/test-task-id/i)).toBeInTheDocument();
    });
  });

  it("handles API errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    fetch.mockImplementationOnce(() => Promise.reject(new Error("API Error")));

    render(
      <QueueProvider>
        <SearchBar />
      </QueueProvider>
    );
    
    const input = screen.getByPlaceholderText(/type here/i);
    fireEvent.change(input, { target: { value: "test query" } });
    
    const addButton = screen.getByText(/add to queue/i);
    fireEvent.click(addButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error creating task:", expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});