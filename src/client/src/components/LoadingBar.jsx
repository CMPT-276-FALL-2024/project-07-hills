import React, { useEffect, useState } from "react";

const SongLoadingBar = ({ song }) => {
    const [displayedProgress, setDisplayedProgress] = useState(0);

    useEffect(() => {
        let intervalDuration = 0;

        if (displayedProgress < 10) {
            intervalDuration = 100;
        } else if (displayedProgress < 50) {
            intervalDuration = 400;
        } else if (displayedProgress < 95) {
            intervalDuration = 800;
        } else {
            intervalDuration = 100;
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
    }, [song.progress, displayedProgress, song.spotifyId]);

    const getProgressMessage = () => {
        if (displayedProgress < 10) return "Initializing...";
        if (displayedProgress < 50) return "Downloading...";
        if (displayedProgress < 99) return "Separating...";
        return "";
    };

    return (
        <div
            className="relative h-24 bg-cover bg-center rounded-lg shadow"
            style={{
                backgroundImage: `url(${song.albumImageUrl || "https://via.placeholder.com/150"})`,
                filter: displayedProgress < 100 ? "brightness(100%)" : "brightness(170%)",
                transition: "filter 0.7s ease-in-out",
            }}
        >
            {/* Overlay for the Progress Bar */}
            <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
                {/* Conditionally render the progress bar */}
                {displayedProgress < 100 && (
                    <div className="relative bg-gray-300 h-4 w-3/4 overflow-hidden rounded">
                        <div
                            className="absolute top-0 left-0 h-full bg-green-500"
                            style={{
                                width: `${displayedProgress}%`,
                                transition: `width ${displayedProgress >= 100 ? 0 : 1}s ease-in-out`,
                            }}
                        ></div>
                    </div>
                )}
                {/* Progress Message */}
                <div
                    className="text-sm font-medium mt-2 text-white"
                    style={{ marginTop: displayedProgress < 100 ? "10px" : "0" }}
                >
                    {getProgressMessage()}
                </div>
            </div>
        </div>
    );
};

export default SongLoadingBar;