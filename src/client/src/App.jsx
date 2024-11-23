import React from "react";
import Navbar from "./components/SideNavbar.jsx";
import Home from "./Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Karaoke from "./KaraokePage.jsx";
import ProgressBar from "./components/ProgressBar.jsx";
import LyricsDisplay from "./components/LyricsDisplay.jsx";
import { QueueProvider } from "./context/QueueContext"; // Import QueueProvider

const App = () => {
  return (
    <QueueProvider> {/* Wrap the application with the QueueProvider */}
      <Router>
        <div className="w-full p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/karaoke" element={<Karaoke />} />
            <Route path="/progressbar" element={<ProgressBar />} />
            <Route path="/lyricsdisplay" element={<LyricsDisplay />} />
          </Routes>
        </div>
      </Router>
    </QueueProvider>
  );
};

export default App
