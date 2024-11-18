import React from "react";
import Navbar from "./components/SideNavbar.jsx";
import Home from "./Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Karaoke from "./KaraokePage.jsx";
import ProgressBar from "./components/ProgressBar.jsx";

const App = () => {
  return (
    <Router>
      <div className="w-full p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/karaoke" element={<Karaoke />} />
          <Route path="/progressbar" element={<ProgressBar />} />
        </Routes>
        
      </div>
    </Router>
  );
};
export default App
