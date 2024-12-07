import React, { useState, useEffect, useRef } from "react";
import LyricsDisplay from "./LyricsDisplay";
import { FaPlay, FaPause, FaVolumeUp, FaRedoAlt, FaStepForward } from "react-icons/fa";
import { useQueue } from "./QueueContext";

const ProgressBar = () => {
  const { queue } = useQueue(); // Access the queue from context
  const { removeSongFromQueue } = useQueue();

  const [topSong, setTopSong] = useState(null);
  const audioRef = useRef(null); // Initialize without an Audio instance
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [instrumental, setInstrumental] = useState(null); // Instrumental URL
  const [elapsedTime, setElapsedTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const intervalRef = useRef(null);
  const durationParts = topSong?.duration.match(/(\d+)m\s*(\d+)s/);
  const minutes = durationParts ? parseInt(durationParts[1], 10) : 0;
  const seconds = durationParts ? parseInt(durationParts[2], 10) : 0;
  const songDuration = (minutes * 60 + seconds) * 1000;

  // Check if the top song has changed
  useEffect(() => {
    const newTopSong = queue.getNextSong();
    if (newTopSong !== topSong) {
      setTopSong(newTopSong);
      setInstrumental(); // Reset instrumental URL when the song changes
    }
  }, [queue]);

  // Poll for instrumental URL
  useEffect(() => {
    console.log("handling new top song change")
      console.log("handling new top song change2")
      const interval = setInterval(() => {
        console.log("Polling for instrumentalUrl:", topSong?.instrumentalUrl);
        if (topSong?.instrumentalUrl) {
          setInstrumental(topSong.instrumentalUrl);
          clearInterval(interval); // Stop polling when the value is available
        }
      }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
    console.log(topSong)
  }, [topSong]);

  // Set up audio player and load instrumental
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    if (instrumental && audioRef.current.src !== instrumental) { // Only update the source if it has changed
      console.log("hoho")
      audioRef.current.src = instrumental;
      console.log("Audio source set to: ", instrumental);

      audioRef.current.addEventListener("canplaythrough", () => {
        console.log("Audio is ready to play:", instrumental);
        console.log("Curwtf:", audioRef.current.src);
      });

      audioRef.current.addEventListener("error", (e) => {
        console.error("Error loading audio:", instrumental, e);
      });
    }
  }, [instrumental]); // Runs only when instrumental URL changes

  // Add an event listener for when the song ends
  useEffect(() => {
    const audio = audioRef.current;

    const handleSongEnd = () => {
      handleNextSong(); // Automatically play the next song
    };

    audio.addEventListener("ended", handleSongEnd);

    return () => {
      audio.removeEventListener("ended", handleSongEnd);
    };
  }, [audioRef.current, queue]); // Add/remove listener when the queue changes

  // Handle time updates
  useEffect(() => {
    const audio = audioRef.current;

    const updateElapsedTime = () => {
      setElapsedTime(audio.currentTime * 1000);
    };

    audio.addEventListener("timeupdate", updateElapsedTime);

    return () => {
      audio.removeEventListener("timeupdate", updateElapsedTime);
    };
  }, []);

  // Update progress percentage based on elapsed time
  useEffect(() => {
    const progressPercentage = (elapsedTime / songDuration) * 100;
    setProgress(progressPercentage);
  }, [elapsedTime, songDuration]);

  // Handle play/pause click
  const handlePlayPauseClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle replay click
  const handleReplayClick = () => {
    setProgress(0);
    setElapsedTime(0);
    setIsPlaying(false);
    audioRef.current.currentTime = 0;
    audioRef.current.play();
    setIsPlaying(true);
  };

  const handleNextSong = () => {
    removeSongFromQueue(0); // Remove the current song from the queue
  
    const nextSong = queue.getNextSong(); // Get the next song
    if (nextSong) {
      setTopSong(nextSong);
      setInstrumental(nextSong.instrumentalUrl || null);
      setElapsedTime(0);
      setProgress(0);
  
      // Update the audio player and play the song
      audioRef.current.pause();
      audioRef.current.src = nextSong.instrumentalUrl || "";
      audioRef.current.play();
      setIsPlaying(true);
  
      // Trigger the replay functionality twice
      for (let i = 0; i < 2; i++) {
        handlePlayPauseClick();
      }
    } else {
      setIsPlaying(false);
  
      // Trigger the replay functionality twice
      for (let i = 0; i < 2; i++) {
        handlePlayPauseClick();
      }
    }
  };  

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  // Format time for display
  const formatTime = (timeInMs) => {
    const timeInSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Scrub progress bar
  const handleScrub = (e) => {
    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const barWidth = rect.width;
    const newProgress = (clickX / barWidth) * 100;
    const newElapsedTime = (newProgress / 100) * songDuration;

    setProgress(newProgress);
    setElapsedTime(newElapsedTime);
    console.log("New Elapsed time: " + newElapsedTime)

    if (audioRef.current.readyState >= 4) {
      console.log("New Elapsed time: " + newElapsedTime / 1000)
      audioRef.current.currentTime = newElapsedTime / 1000;
      console.log("audioRef.current.currentTime: " + audioRef.current.currentTime)
      console.log("Scrubbed to time:", audioRef.current.currentTime);
    } else {
      console.warn("Audio is not ready for seeking.");
    }
  };

  // Click on lyric to jump to that part of the song
  const handleLyricClick = (timestamp) => {
    setElapsedTime(timestamp); // Update the elapsed time
    audioRef.current.currentTime = timestamp / 1000; // Move to the specific time in seconds
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col space-y-4">
      <div className="flex flex-wrap items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Next song button */}
        <button
          onClick={handleNextSong}
          className="px-2 py-2 bg-gray-500 text-white rounded-md"
        >
          <FaStepForward />
        </button>
  
        {/* Play/Pause Button */}
        <button
          onClick={handlePlayPauseClick}
          className="px-2 py-2 bg-gray-500 text-white rounded-md"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>
  
        {/* Replay Button */}
        <button
          onClick={handleReplayClick}
          className="px-2 py-2 bg-gray-500 text-white rounded-md"
        >
          <FaRedoAlt />
        </button>
  
        {/* Progress Bar */}
        <div className="flex-1 mx-4">
          <div
            className="w-full h-2 bg-gray-400 rounded-full cursor-pointer"
            onClick={handleScrub}
          >
            <div
              className="h-2 bg-green-500 rounded-full transition-[width_0.5s_ease-out]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
  
        {/* Timer */}
        <div className="text-sm sm:text-base font-bold text-gray-700">
          {formatTime(elapsedTime)} / {minutes}:{seconds
            .toString()
            .padStart(2, "0")}
        </div>
  
        {/* Volume Control */}
        <div className="flex items-center space-x-2">
          <FaVolumeUp size={24} className="text-gray-700" />
          <input
            id="volume"
            type="range"
            min="0"
            max="1.0"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
  
      {/* Lyrics Display */}
      <div className="w-full">
        <LyricsDisplay
          currentTime={elapsedTime}
          onLyricClick={handleLyricClick}
        />
      </div>
    </div>
  );  
};

export default ProgressBar;