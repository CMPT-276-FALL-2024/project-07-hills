import React, { useState, useEffect } from "react";
import { useQueue } from "./QueueContext";

const LyricsDisplay = ({ currentTime, onLyricClick }) => {
  const { queue } = useQueue(); // Move this inside the component
  const [currentLyrics, setCurrentLyrics] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    if (!queue) return; // Ensure `queue` exists

    const song = queue.getNextSong(); // Assuming the next song is being played
    setCurrentSong(song);

    if (song && song.lyrics) {
      const updatedLyrics = song.lyrics.lines.map((line) => {
        const startTime = parseInt(line.startTimeMs, 10);
        const endTime = parseInt(line.endTimeMs, 10) || startTime + 2500; // Default 2.5 seconds

        if (currentTime >= startTime && currentTime <= endTime) {
          return { ...line, status: "current" };
        } else if (currentTime < startTime) {
          return { ...line, status: "upcoming" };
        } else {
          return { ...line, status: "passed" };
        }
      });

      setCurrentLyrics(updatedLyrics);
    } else {
      setCurrentLyrics([]); // Clear lyrics if no current song or lyrics
    }
  }, [currentTime, queue]);

  return (
    <div className="text-center mt-[4px] text-[24px]">
      <h1 className="text-[32px] mb-[18px] font-bold">Lyrics</h1>
      <div className="max-h-[calc(100vh-400px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
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
    </div>
  );
};

export default LyricsDisplay;
