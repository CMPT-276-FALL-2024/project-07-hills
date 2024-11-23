import React, { useState } from "react";
import SideNavbar from "./components/SideNavbar";
import LyricsDisplay from "./components/LyricsDisplay.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import QueueUI from "./components/QueueUI.jsx";
import data from "./sample.json";

const Karaoke = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const { instrumental_url, lyrics } = data;

  // Handle time update from the audio player
  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };

  return (
    <div className="flex h-screen">
      {/** Side Navbar */}
      <SideNavbar />

      {/** Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/** Top Section: Lyrics and ProgressBar */}
        <div className="flex-1 bg-gray-100 p-4 overflow-y-auto">
          <ProgressBar />
          <LyricsDisplay currentTime={currentTime} onLyricClick={handleTimeUpdate} />
        </div>

        {/** Bottom Section: Queue */}
        <div className="flex-1 bg-white p-4 border-t border-gray-300 overflow-y-auto">
          <QueueUI />
        </div>
      </div>
    </div>
  );
};

export default Karaoke;
