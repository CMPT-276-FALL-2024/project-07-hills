import React, { useState, useEffect, useRef } from "react";
import { useQueue } from "./QueueContext";

const LyricsDisplay = ({ currentTime, onLyricClick }) => {
  const { queue } = useQueue();
  const [currentLyrics, setCurrentLyrics] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false); // Track manual scrolling
  const lyricsContainerRef = useRef(null); // Ref for the lyrics container
  const scrollTimeoutRef = useRef(null); // Ref for timeout to resume auto-scrolling

  useEffect(() => {
    if (!queue) return;

    const song = queue.getNextSong();
    setCurrentSong(song);

    if (song && song.lyrics) {
      const updatedLyrics = song.lyrics.lines.map((line) => {
        const startTime = parseInt(line.startTimeMs, 10);
        const endTime = parseInt(line.endTimeMs, 10) || startTime + 2500;

        if (currentTime >= startTime && currentTime <= endTime) {
          return { ...line, status: "current" };
        } else if (currentTime < startTime) {
          return { ...line, status: "upcoming" };
        } else {
          return { ...line, status: "passed" };
        }
      });

      setCurrentLyrics(updatedLyrics);

      // Auto-scroll to the current lyric if not user-scrolling
      if (!isUserScrolling) {
        const currentIndex = updatedLyrics.findIndex(
          (line) => line.status === "current"
        );
        scrollToLyric(currentIndex);
      }
    } else {
      setCurrentLyrics([]);
    }
  }, [currentTime, queue]);

  // Function to scroll to a specific lyric
  const scrollToLyric = (index) => {
    if (index < 0 || !lyricsContainerRef.current) return;

    const lyricElements = lyricsContainerRef.current.children;
    if (lyricElements[index]) {
      lyricElements[index].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // Detect manual scrolling
  const handleScroll = () => {
    setIsUserScrolling(true);
    clearTimeout(scrollTimeoutRef.current);

    // Reset to auto-scrolling after 3 seconds of no interaction
    scrollTimeoutRef.current = setTimeout(() => {
      setIsUserScrolling(false);
    }, 3000);
  };

  return (
    <div
      className="text-center mt-[4px] text-[24px] max-h-[calc(100vh-400px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200"
      ref={lyricsContainerRef}
      onScroll={handleScroll} // Detect manual scrolling
    >
      <h1 className="text-[32px] mb-[18px] font-bold">Lyrics</h1>
      {currentLyrics.map((line, index) => (
        <div
          key={index}
          onClick={() => onLyricClick(parseInt(line.startTimeMs, 10))}
          className={`cursor-pointer ${
            line.status === "current"
              ? "text-gray-800 font-bold"
              : line.status === "upcoming"
              ? "text-gray-400"
              : "text-gray-200"
          }`}
        >
          {line.words}
        </div>
      ))}
    </div>
  );
};

export default LyricsDisplay;