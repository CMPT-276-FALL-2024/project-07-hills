import React, { useState, useRef, useEffect } from "react";

const Playbutton = ({ mp3Path, lyrics, onTimeUpdate }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);

  // Play/Pause toggle
  const togglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  // Update the current time from the audio element
  const handleTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    setCurrentTime(current);
    onTimeUpdate(current); // Update parent with current time
  };

  // Play/Pause logic based on `isPlaying` state
  useEffect(() => {
    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Sync lyrics with current time
  const currentLyric = lyrics.find((lyric) => currentTime >= lyric.time);

  return (
    <div className="audio-player">
      {/* Play/Pause Button */}
      <button onClick={togglePlay} className="play-button">
        {isPlaying ? "Pause" : "Play"}
      </button>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src={mp3Path}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => handleTimeUpdate()} // Reset current time when metadata is loaded
      />

      {/* Lyrics Display */}
      {currentLyric && (
        <div className="lyrics-display">
          <p>{currentLyric.text}</p>
        </div>
      )}
    </div>
  );
};

export default Playbutton;
