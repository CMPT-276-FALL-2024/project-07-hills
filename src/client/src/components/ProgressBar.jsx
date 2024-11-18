import React, { useState, useEffect, useRef } from 'react';
import sample from "../sample.json";
import instrumental from "../Creep - Radiohead (Lyrics).mp3";

const ProgressBar = () => {
  // Audio Ref for both versions
  const audioRef = useRef(new Audio(instrumental));

  // State variables for progress and elapsed time
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [volume, setVolume] = useState(1); // Volume state (1 = 100%)

  // Ref to store the interval ID
  const intervalRef = useRef(null);

  // Duration from the sample.json (extracted from the JSON string)
  const durationParts = sample.duration.match(/(\d+)m\s*(\d+)s/);
  const minutes = durationParts ? parseInt(durationParts[1], 10) : 0;
  const seconds = durationParts ? parseInt(durationParts[2], 10) : 0;
  const songDuration = (minutes * 60 + seconds) * 1000; // Convert to milliseconds

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume); // Update volume state
    audioRef.current.volume = newVolume; // Update audio element volume
  };

  // Start or stop the timer based on the play/pause state
  useEffect(() => {
    if (isPlaying) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev < songDuration) {
            return prev + 100; // Increase by 100 milliseconds
          }
          clearInterval(intervalRef.current); // Stop interval when the song finishes
          return prev;
        });
      }, 100); // Update every 100 milliseconds
    } else {
      // Pause the timer
      clearInterval(intervalRef.current);
    }

    // Cleanup interval when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, songDuration]);

  // Update the progress bar based on elapsed time
  useEffect(() => {
    const progressPercentage = (elapsedTime / songDuration) * 100;
    setProgress(progressPercentage);
  }, [elapsedTime, songDuration]);

  // Handle play/pause button click
  const handlePlayPauseClick = () => {
    if (isPlaying) {
      audioRef.current.pause(); // Pause the audio
    } else {
      audioRef.current.play(); // Play the audio
    }
    setIsPlaying(!isPlaying);
  };

  // Handle reset button click (reset progress, elapsed time, and stop playing)
  const handleResetClick = () => {
    setProgress(0); // Reset progress
    setElapsedTime(0); // Reset elapsed time
    setIsPlaying(false); // Stop playing
    audioRef.current.currentTime = 0; // Reset audio to start
  };

  // Function to format time as minutes:seconds
  const formatTime = (timeInMs) => {
    const timeInSeconds = Math.floor(timeInMs / 1000); // Convert to seconds
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; // Format as mm:ss
  };

  return (
    <div className="w-[200px] mt-[30px]">
      {/* Progress Bar */}
      <div className="w-[100%] h-[7px] rounded-[10px] bg-gray-400 mb-[10px]">
        <div
          className="h-[7px] rounded-[10px] bg-green-500 transition-[width_0.5s_ease-out]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Progress Text */}
      <div className="mt-[10px] text-[24px] font-bold text-[#444444]">
        {formatTime(elapsedTime)} / {minutes}:{seconds.toString().padStart(2, '0')}
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPauseClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

      {/* Volume Slider */}
      <div className="Volume-Slider">
        <label htmlFor="volume">Volume:</label>
        <input
          id="volume"
          type="range"
          min="0"
          max="1.0"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>

      {/* Reset Button */}
      <button
        onClick={handleResetClick}
        className="px-4 py-2 bg-gray-500 text-white rounded-md"
      >
        Reset
      </button>
    </div>
  );
};

export default ProgressBar;