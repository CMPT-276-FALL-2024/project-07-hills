import React, { useState, useEffect, useRef } from 'react';
import sample from "../sample.json";
import instrumental from "../Creep - Radiohead (Lyrics).mp3";
import { FaPlay, FaPause, FaVolumeUp, FaRedoAlt } from 'react-icons/fa'; // Import necessary icons

const ProgressBar = () => {
  const audioRef = useRef(new Audio(instrumental));

  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [volume, setVolume] = useState(1);

  const intervalRef = useRef(null);

  const durationParts = sample.duration.match(/(\d+)m\s*(\d+)s/);
  const minutes = durationParts ? parseInt(durationParts[1], 10) : 0;
  const seconds = durationParts ? parseInt(durationParts[2], 10) : 0;
  const songDuration = (minutes * 60 + seconds) * 1000;

  const handleVolumeChange = (e) => {
    const newVolume = e.target.value;
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setElapsedTime((prev) => {
          if (prev < songDuration) {
            return prev + 100;
          }
          clearInterval(intervalRef.current);
          return prev;
        });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isPlaying, songDuration]);

  useEffect(() => {
    const progressPercentage = (elapsedTime / songDuration) * 100;
    setProgress(progressPercentage);
  }, [elapsedTime, songDuration]);

  const handlePlayPauseClick = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleReplayClick = () => {
    setProgress(0);
    setElapsedTime(0);
    setIsPlaying(false);
    audioRef.current.currentTime = 0;
    audioRef.current.play(); // Start playing again when replaying
    setIsPlaying(true);
  };

  const formatTime = (timeInMs) => {
    const timeInSeconds = Math.floor(timeInMs / 1000);
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-[1200px] ml-[30px] mt-[30px] mb-[30px] flex items-center">
        {/* Play/Pause Button with Icons */}
        <button
            onClick={handlePlayPauseClick}
            className="px-2 py-2 bg-gray-500 text-white rounded-md mr-2"
        >
            {isPlaying ? <FaPause /> : <FaPlay />} {/* Use Icons here */}
        </button>

        {/* Replay Button with Circular Arrow Icon */}
        <button
            onClick={handleReplayClick}
            className="px-2 py-2 bg-gray-500 text-white rounded-md"
        >
            <FaRedoAlt /> {/* Replay (Circular Arrow) Icon */}
        </button>
    
        {/* Progress Bar */}
        <div className="w-[1000px] h-[7px] rounded-[10px] bg-gray-400 mb-[10px] mt-[10px]  ml-[20px] mr-[20px]">
        <div
            className="h-[7px] rounded-[10px] bg-green-500 transition-[width_0.5s_ease-out]"
            style={{ width: `${progress}%` }}
        ></div>
        </div>

        {/* Progress Text */}
        <div className="text-[18px] w-[200px] font-bold text-[#444444] mr-[0px]">
            {formatTime(elapsedTime)} / {minutes}:{seconds.toString().padStart(2, '0')}
        </div>

        {/* Volume Slider with Volume Icon */}
        <div className="flex items-center">
            <FaVolumeUp size={30} className="mr-2" /> {/* Volume Icon */}
            <input
            id="volume"
            type="range"
            min="0"
            max="1.0"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="w-[120px]"
            />
        </div>
    </div>
  );
};

export default ProgressBar;