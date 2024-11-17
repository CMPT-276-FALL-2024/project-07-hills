import React from 'react';
import SideNavbar from './components/SideNavbar';
import LyricsDisplay from './components/LyricsDisplay.jsx';
import Playbutton from './components/Playbutton.jsx';
import ProgressBar from './components/ProgressBar.jsx';
const Karaoke = () => {
  return (
    <div className="flex h-screen">
      {/** Lyrics and music player area */}
      <div className="flex-1 bg-gray-100 p-8">
        <h1 className="text-2xl font-bold">Lyrics Display</h1>

      </div>

      {/** Navigation bar */}
      <SideNavbar />
      {/** Lyrics Display, synced in with time stamps */}
      <LyricsDisplay />
      {/**Play button, plays the mp3 and plays and pauses */}
      <Playbutton />
      {/** Progress bar and the timer */}
      <ProgressBar />
    </div>
  );
};

export default Karaoke;