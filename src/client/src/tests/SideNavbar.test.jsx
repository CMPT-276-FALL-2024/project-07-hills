import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import SideNavbar from "../components/SideNavbar";
import { QueueProvider } from "../components/QueueContext";

// Mock fetch globally
global.fetch = jest.fn();

// Mock search results
const mockSearchResults = [
  {
    title: "Test Song",
    artist: "Test Artist",
    album_image_URL: "test-image.jpg"
  }
];

// Mock Queue Context
jest.mock("../components/QueueContext", () => ({
  useQueue: () => ({
    addSongToQueue: jest.fn()
  }),
  QueueProvider: ({ children }) => <div>{children}</div>
}));

describe("SideNavbar Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockReset();
  });

  it("renders search interface correctly", () => {
    render(
      <QueueProvider>
        <SideNavbar />
      </QueueProvider>
    );
    
    expect(screen.getByText("Separate a Song!")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/song\/artist name here/i)).toBeInTheDocument();
  });

  it("performs search and displays results", async () => {
    fetch.mockImplementationOnce(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockSearchResults)
      })
    );

    render(
      <QueueProvider>
        <SideNavbar />
      </QueueProvider>
    );
    
    const input = screen.getByPlaceholderText(/song\/artist name here/i);
    fireEvent.change(input, { target: { value: "test query" } });
    
    const searchButton = screen.getByRole("button");
    fireEvent.click(searchButton);
    
    await waitFor(() => {
      expect(screen.getByText("Test Song")).toBeInTheDocument();
      expect(screen.getByText("Test Artist")).toBeInTheDocument();
    });
  });

  it("handles song addition to queue", async () => {
    fetch
      .mockImplementationOnce(() => 
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSearchResults)
        })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ ...mockSearchResults[0], lyrics: "test lyrics" })
        })
      );

    render(
      <QueueProvider>
        <SideNavbar />
      </QueueProvider>
    );
    
    // Perform search
    const input = screen.getByPlaceholderText(/song\/artist name here/i);
    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.click(screen.getByRole("button"));
    
    // Wait for results and click on a song
    await waitFor(() => {
      const songResult = screen.getByText("Test Song");
      fireEvent.click(songResult);
    });
    
    // Verify fetch-song was called
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "https://teaching-gorilla-rich.ngrok-free.app:8000/fetch-song",
        expect.any(Object)
      );
    });
  });

  it("handles search errors gracefully", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    
    fetch.mockImplementationOnce(() => 
      Promise.reject(new Error("Search failed"))
    );

    render(
      <QueueProvider>
        <SideNavbar />
      </QueueProvider>
    );
    
    const input = screen.getByPlaceholderText(/song\/artist name here/i);
    fireEvent.change(input, { target: { value: "test query" } });
    fireEvent.click(screen.getByRole("button"));
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith("Error fetching songs: ", expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });
});