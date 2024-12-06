import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import PlayButton from "../components/PlayButton";

describe("PlayButton Component", () => {
  const mockLyrics = [
    { time: 0, text: "First lyric" },
    { time: 5, text: "Second lyric" }
  ];

  beforeEach(() => {
    // Mock the HTML audio element
    const mockAudio = {
      play: jest.fn(),
      pause: jest.fn(),
      currentTime: 0,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn()
    };
    window.HTMLMediaElement.prototype.play = mockAudio.play;
    window.HTMLMediaElement.prototype.pause = mockAudio.pause;
    jest.clearAllMocks();
  });

  it("renders play button initially", () => {
    render(<PlayButton mp3Path="test.mp3" lyrics={mockLyrics} onTimeUpdate={() => {}} />);
    expect(screen.getByText("Play")).toBeInTheDocument();
  });

  it("toggles between play and pause", () => {
    render(<PlayButton mp3Path="test.mp3" lyrics={mockLyrics} onTimeUpdate={() => {}} />);
    
    const button = screen.getByText("Play");
    fireEvent.click(button);
    expect(screen.getByText("Pause")).toBeInTheDocument();
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalled();
    
    fireEvent.click(screen.getByText("Pause"));
    expect(screen.getByText("Play")).toBeInTheDocument();
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalled();
  });

  it("updates time correctly", () => {
    const mockOnTimeUpdate = jest.fn();
    const { container } = render(
      <PlayButton mp3Path="test.mp3" lyrics={mockLyrics} onTimeUpdate={mockOnTimeUpdate} />
    );
    
    const audio = container.querySelector('audio');
    expect(audio).toBeInTheDocument();
    
    act(() => {
      fireEvent.timeUpdate(audio, { target: { currentTime: 2 } });
    });
    
    expect(mockOnTimeUpdate).toHaveBeenCalledWith(2);
  });

  it("displays current lyrics", () => {
    const { container } = render(
      <PlayButton mp3Path="test.mp3" lyrics={mockLyrics} onTimeUpdate={() => {}} />
    );
    
    const audio = container.querySelector('audio');
    act(() => {
      fireEvent.timeUpdate(audio, { target: { currentTime: 0 } });
    });
    
    expect(screen.getByText("First lyric")).toBeInTheDocument();
  });
});