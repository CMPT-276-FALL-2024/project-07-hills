import React, { useState, useEffect, useRef } from 'react';

// Import JSON file (alternatively, use fetch if needed)
import sample from "../sample.json";

const ProgressBar = () => {
    // State variables
    const [progress, setProgress] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // Elapsed time in milliseconds

    // Ref to store the interval ID
    const intervalRef = useRef(null);

    // Extract minutes and seconds from the JSON duration
    const durationParts = sample.duration.match(/(\d+)m\s*(\d+)s/);
    const minutes = durationParts ? parseInt(durationParts[1], 10) : 0;
    const seconds = durationParts ? parseInt(durationParts[2], 10) : 0;

    // Calculate total song duration in milliseconds
    const songDuration = (minutes * 60 + seconds) * 1000;

    // Start or stop the timer based on the play/pause state
    useEffect(() => {
        if (isPlaying) {
            // Start the timer (update every 100 milliseconds)
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

    // Update the progress bar based on elapsed time (in milliseconds)
    useEffect(() => {
        const progressPercentage = (elapsedTime / songDuration) * 100;
        setProgress(progressPercentage);
    }, [elapsedTime, songDuration]);

    // Handle play/pause button click
    const handlePlayPauseClick = () => {
        setIsPlaying(!isPlaying); // Toggle play/pause
    };

    // Handle reset button click (reset progress, elapsed time, and stop playing)
    const handleResetClick = () => {
        setProgress(0); // Reset progress
        setElapsedTime(0); // Reset elapsed time
        setIsPlaying(false); // Stop playing
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