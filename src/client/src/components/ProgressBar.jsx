import React, { useState, useEffect, useRef } from 'react';

const ProgressBar = () => {
  // Set initial progress and total song time (3 minutes and 25 seconds)
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const songDuration = 3 * 60 + 25; // 3 minutes 25 seconds in total (205 seconds)
  const [elapsedTime, setElapsedTime] = useState(0);

  // Ref to store the interval ID
  const intervalRef = useRef(null);

  // Start or stop the timer based on the play/pause state
  useEffect(() => {
    if (isPlaying) {
      // Start the timer
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev < songDuration) {
            return prev + 1;
          }
          clearInterval(intervalRef.current); // Stop interval when the song finishes
          return prev;
        });
      }, 1000); // Update every second
    } else {
      // Pause the timer
      clearInterval(intervalRef.current);
    }

    // Cleanup interval when the component unmounts
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Update the progress bar based on elapsed time
  useEffect(() => {
    const progressPercentage = (elapsedTime / songDuration) * 100;
    setProgress(progressPercentage);
  }, [elapsedTime]);

  const handlePlayPauseClick = () => {
    setIsPlaying(!isPlaying); // Toggle play/pause
  };

  const handleResetClick = () => {
    setProgress(0); // Reset progress
    setElapsedTime(0); // Reset elapsed time
    setIsPlaying(false); // Stop playing
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
      <div className="mt-[0px] text-[12px] font-bold text-[#444444] mb-[12px]">
        {Math.floor(elapsedTime / 60)}:{(elapsedTime % 60).toString().padStart(2, '0')} / 3:25
      </div>

      {/* Play/Pause Button */}
      <button
        onClick={handlePlayPauseClick}
        className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>

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