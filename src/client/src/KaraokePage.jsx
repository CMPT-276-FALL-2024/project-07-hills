import React, { useState } from 'react';
import SideNavbar from './components/SideNavbar';
import LyricsDisplay from './components/LyricsDisplay.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import data from './sample.json';

const Karaoke = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const { instrumental_url, lyrics } = data;

  // Handle time update from the audio player
  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
  };
  return (
    <div className="flex h-screen">
      {/** Lyrics and music player area */}
      <div className="flex-1 bg-gray-100 p-8">
        {/** Progress bar and the timer */}
        <ProgressBar />
        
        <h1 className="text-2xl font-bold">Lyrics</h1>
        {/** Lyrics Display, synced in with time stamps */}
        <LyricsDisplay />
      </div>

      {/** Navigation bar */}
      <SideNavbar />
    </div>
  );
};

export default Karaoke;