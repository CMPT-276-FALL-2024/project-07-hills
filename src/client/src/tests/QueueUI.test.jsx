import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import QueueUI from "../components/QueueUI";
import { useQueue } from "../components/QueueContext";

// Mock the useQueue hook
jest.mock("../components/QueueContext", () => ({
  useQueue: jest.fn()
}));

describe("QueueUI Component", () => {
  const mockSongs = [
    { id: 1, title: "Song 1", artist: "Artist 1" },
    { id: 2, title: "Song 2", artist: "Artist 2" },
    { id: 3, title: "Song 3", artist: "Artist 3" },
    { id: 4, title: "Song 4", artist: "Artist 4" },
    { id: 5, title: "Song 5", artist: "Artist 5" },
    { id: 6, title: "Song 6", artist: "Artist 6" }
  ];

  const mockRemoveSongFromQueue = jest.fn();

  beforeEach(() => {
    useQueue.mockImplementation(() => ({
      queue: {
        getSongs: () => mockSongs
      },
      removeSongFromQueue: mockRemoveSongFromQueue
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders initial page of songs correctly", () => {
    render(<QueueUI />);
    
    expect(screen.getByText("Song 1")).toBeInTheDocument();
    expect(screen.getByText("Artist 1")).toBeInTheDocument();
    expect(screen.queryByText("Song 6")).not.toBeInTheDocument();
  });

  it("handles pagination correctly", () => {
    render(<QueueUI />);
    
    const nextButton = screen.getByText("→");
    fireEvent.click(nextButton);
    
    expect(screen.getByText("Song 6")).toBeInTheDocument();
    expect(screen.queryByText("Song 1")).not.toBeInTheDocument();
    
    const prevButton = screen.getByText("←");
    fireEvent.click(prevButton);
    
    expect(screen.getByText("Song 1")).toBeInTheDocument();
  });

  it("removes songs correctly", () => {
    render(<QueueUI />);
    
    const removeButtons = screen.getAllByText("X");
    fireEvent.click(removeButtons[0]);
    
    expect(mockRemoveSongFromQueue).toHaveBeenCalledWith(0);
  });
});