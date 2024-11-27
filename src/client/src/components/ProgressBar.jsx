import React, { useState, useEffect, useRef } from "react";
import LyricsDisplay from "./LyricsDisplay";
import { FaPlay, FaPause, FaVolumeUp, FaRedoAlt } from "react-icons/fa";
import { useQueue } from "./QueueContext";

const ProgressBar = () => {
  const { queue } = useQueue(); // Access the queue from context
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
      setInstrumental(null); // Reset instrumental URL when the song changes
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
      // audioRef.current.load(); // Load the new instrumental
      console.log("Audio source set to:", instrumental);

      audioRef.current.addEventListener("canplaythrough", () => {
        console.log("Audio is ready to play:", instrumental);
        console.log("Curwtf:", audioRef.current.src);
      });

      audioRef.current.addEventListener("error", (e) => {
        console.error("Error loading audio:", instrumental, e);
      });
    }
  }, [instrumental]); // Runs only when instrumental URL changes

  // Set up time update listener
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
    setElapsedTime(newElapsedTime); // Update time
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
    <div className="w-[1200px] ml-[30px] mt-[30px] mb-[30px] flex flex-col">
      <div className="flex items-center mb-4">
        <button
          onClick={handlePlayPauseClick}
          className="px-2 py-2 bg-gray-500 text-white rounded-md mr-2"
        >
          {isPlaying ? <FaPause /> : <FaPlay />}
        </button>

        <button
          onClick={handleReplayClick}
          className="px-2 py-2 bg-gray-500 text-white rounded-md"
        >
          <FaRedoAlt />
        </button>

        <div
          className="w-[1000px] h-[7px] rounded-[10px] bg-gray-400 mb-[10px] mt-[10px] ml-[20px] mr-[20px] relative cursor-pointer"
          onClick={handleScrub}
        >
          <div
            className="h-[7px] rounded-[10px] bg-green-500 transition-[width_0.5s_ease-out]"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        <div className="text-[18px] w-[200px] font-bold text-[#444444] mr-[0px]">
          {formatTime(elapsedTime)} / {minutes}:{seconds
            .toString()
            .padStart(2, "0")}
        </div>

        <div className="flex items-center">
          <FaVolumeUp size={30} className="mr-2" />
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

      <div className="mt-[]">
        <LyricsDisplay
          currentTime={elapsedTime}
          onLyricClick={handleLyricClick}
        />
      </div>
    </div>
  );
};

export default ProgressBar;









// // Progress bar Version 1 (To be used with LyricsDisplay Version 1)
// import React, { useState, useEffect, useRef } from "react";
// import sample from "../sample.json";
// import instrumental from "../Creep - Radiohead (Lyrics).mp3";
// import LyricsDisplay from "./LyricsDisplay";
// import { FaPlay, FaPause, FaVolumeUp, FaRedoAlt } from "react-icons/fa";

// const ProgressBar = () => {
//   const audioRef = useRef(new Audio(instrumental));

//   const [progress, setProgress] = useState(0);
//   const [isPlaying, setIsPlaying] = useState(false);
//   const [elapsedTime, setElapsedTime] = useState(0);
//   const [volume, setVolume] = useState(1);

//   const intervalRef = useRef(null);

//   const durationParts = sample.duration.match(/(\d+)m\s*(\d+)s/);
//   const minutes = durationParts ? parseInt(durationParts[1], 10) : 0;
//   const seconds = durationParts ? parseInt(durationParts[2], 10) : 0;
//   const songDuration = (minutes * 60 + seconds) * 1000;

//   // For volume change
//   const handleVolumeChange = (e) => {
//     const newVolume = e.target.value;
//     setVolume(newVolume);
//     audioRef.current.volume = newVolume;
//   };

//   // Update elapsed time if the audio plays normally
//   useEffect(() => {
//     const audio = audioRef.current;

//     const updateElapsedTime = () => {
//       setElapsedTime(audio.currentTime * 1000);
//     };

//     audio.addEventListener("timeupdate", updateElapsedTime);

//     return () => {
//       audio.removeEventListener("timeupdate", updateElapsedTime);
//     };
//   }, []);

//   useEffect(() => {
//     const progressPercentage = (elapsedTime / songDuration) * 100;
//     setProgress(progressPercentage);
//   }, [elapsedTime, songDuration]);

//   // Handles play and pause
//   const handlePlayPauseClick = () => {
//     if (isPlaying) {
//       audioRef.current.pause();
//     } else {
//       audioRef.current.play();
//     }
//     setIsPlaying(!isPlaying);
//   };

//   // Replay function; Just calls the play function again after setting the time to 0
//   const handleReplayClick = () => {
//     setProgress(0);
//     setElapsedTime(0);
//     setIsPlaying(false);
//     audioRef.current.currentTime = 0;
//     audioRef.current.play();
//     setIsPlaying(true);
//   };

//   // Format time to be in minutes and seconds from milliseconds
//   const formatTime = (timeInMs) => {
//     const timeInSeconds = Math.floor(timeInMs / 1000);
//     const minutes = Math.floor(timeInSeconds / 60);
//     const seconds = timeInSeconds % 60;
//     return `${minutes}:${seconds.toString().padStart(2, "0")}`;
//   };

//   // Scrubbing function
//   const handleScrub = (e) => {
//     const bar = e.currentTarget;
//     const rect = bar.getBoundingClientRect();
//     const clickX = e.clientX - rect.left; // Click position relative to the bar
//     const barWidth = rect.width;
//     const newProgress = (clickX / barWidth) * 100; // Calculate new progress in percentage
//     const newElapsedTime = (newProgress / 100) * songDuration; // Calculate new time in ms

//     setProgress(newProgress);
//     setElapsedTime(newElapsedTime);
//     audioRef.current.currentTime = newElapsedTime / 1000; // Set audio's positdion
//   };

//   return (
//     <div className="w-[1200px] ml-[30px] mt-[30px] mb-[30px] flex flex-col">
//     {/* Row 1: Play/Pause button, Replay button, Progress Bar, and the volume control */}
//     <div className="flex items-center mb-4">
//         {/* Play/Pause button with icons */}
//         <button
//         onClick={handlePlayPauseClick}
//         className="px-2 py-2 bg-gray-500 text-white rounded-md mr-2"
//         >
//         {isPlaying ? <FaPause /> : <FaPlay />}
//         </button>

//         {/* Replay button with circular arrow icon */}
//         <button
//         onClick={handleReplayClick}
//         className="px-2 py-2 bg-gray-500 text-white rounded-md"
//         >
//         <FaRedoAlt />
//         </button>

//         {/* Progress bar */}
//         <div
//         className="w-[1000px] h-[7px] rounded-[10px] bg-gray-400 mb-[10px] mt-[10px] ml-[20px] mr-[20px] relative cursor-pointer"
//         onClick={handleScrub}
//         >
//         <div
//             className="h-[7px] rounded-[10px] bg-green-500 transition-[width_0.5s_ease-out]"
//             style={{ width: `${progress}%` }}
//         ></div>
//         </div>

//         {/* Progress text */}
//         <div className="text-[18px] w-[200px] font-bold text-[#444444] mr-[0px]">
//         {formatTime(elapsedTime)} / {minutes}:{seconds.toString().padStart(2, "0")}
//         </div>

//         <div className="flex items-center">
//         <FaVolumeUp size={30} className="mr-2" />
//         <input
//             id="volume"
//             type="range"
//             min="0"
//             max="1.0"
//             step="0.1"
//             value={volume}
//             onChange={handleVolumeChange}
//             className="w-[120px]"
//         />
//         </div>
//     </div>

//     {/* Row 2: Lyrics Display */}
//     <div className="mt-[]">
//         <LyricsDisplay currentTime={elapsedTime} />
//     </div>
//     </div>
//   );
// };

// export default ProgressBar;