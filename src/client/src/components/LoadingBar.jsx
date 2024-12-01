import React, { useEffect, useState } from "react";

const SongLoadingBar = ({ song }) => {
    const [displayedProgress, setDisplayedProgress] = useState(0);

    useEffect(() => {
        let intervalDuration = 0;

        // Determine the speed based on the current progress range
        if (displayedProgress < 10) {
            intervalDuration = 100; // Fast for Initializing
        } else if (displayedProgress < 50) {
            intervalDuration = 500; // Slower for Downloading
        } else if (displayedProgress < 95) {
            intervalDuration = 900; // Slowest for Separating
        } else {
            intervalDuration = 100; // Instant for Complete
        }

        const interval = setInterval(() => {
            setDisplayedProgress((prev) => {
                if (song.progress === 100) {
                    clearInterval(interval); // Stop interval if the song is completed
                    return 100; // Jump to 100 instantly
                }
    
                if (prev < song.progress) {
                    return Math.min(prev + 1, song.progress); // Increment towards actual progress
                }
    
                clearInterval(interval); // Clear interval when displayed progress matches actual progress
                return prev;
            });
        }, intervalDuration);

        return () => clearInterval(interval);
    }, [song.progress, displayedProgress]);

    const getProgressMessage = () => {
        // Use displayedProgress instead of song.progress
        if (displayedProgress < 10) return "Initializing...";
        if (displayedProgress < 50) return "Downloading...";
        if (displayedProgress < 99) return "Separating...";
        if (displayedProgress >= 100) return "Complete!";
        return ""; // Default message
    };

    return (
        <div className="song-loading-container">
            
            <div className="relative bg-gray-300 h-4 overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-green-500"
                    style={{
                        width: `${displayedProgress}%`,
                        transition: `width ${displayedProgress >= 100 ? 0 : 1}s ease-in-out`, // No transition for Complete
                    }}
                ></div>
            </div> 
            <div className="text-sm font-medium mb-2"
                style={{ marginTop: "10px" }} // Add margin for spacing
            >
                {getProgressMessage()}</div>
        </div>
    );
};

export default SongLoadingBar;