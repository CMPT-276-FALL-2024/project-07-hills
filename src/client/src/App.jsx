import React from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./Home.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Karaoke from "./KaraokePage.jsx";

const App = () => {
  return (
    <Router>
      <div className="w-full p-6">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/karaoke" element={<Karaoke />} />
        </Routes>
        
      </div>
    </Router>
  );
};
export default App
