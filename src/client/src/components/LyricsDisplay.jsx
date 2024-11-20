// // Version 2
// // Show all lyrics
// // Made it scrollable so that it doesn't go over past the bottom boundary
// // Made it interactive so you can go to the specific point in the song by clicking on lyrics
import React, { useState, useEffect } from "react";
import sample from "../sample.json";

// Added the onLyricClick function to optimize code, this is much more organized hoenstly lol
const LyricsDisplay = ({ currentTime, onLyricClick }) => {
  const [currentLyrics, setCurrentLyrics] = useState([]);

  useEffect(() => {
    if (!sample?.lyrics?.lines) return;

    const updatedLyrics = sample.lyrics.lines.map((line) => {
      const startTime = parseInt(line.startTimeMs, 10);
      const endTime = parseInt(line.endTimeMs, 10) || startTime + 2500; // Extra 2.5 seconds just in case (this is in milliseconds)

      // organize by current and upcoming and passed parts
      if (currentTime >= startTime && currentTime <= endTime) {
        return { ...line, status: "current" };
      } else if (currentTime < startTime) {
        return { ...line, status: "upcoming" };
      } else {
        return { ...line, status: "passed" };
      }
    });

    setCurrentLyrics(updatedLyrics);
  }, [currentTime]);

  return (
    <div className="text-center mt-[4px] text-[24px]">
      <h1 className="text-[32px] mb-[18px] font-bold">Lyrics</h1>
      <div className="max-h-[calc(100vh-200px)] overflow-y-scroll scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
        {currentLyrics.map((line, index) => (
          <div
            key={index}
            onClick={() => onLyricClick(parseInt(line.startTimeMs, 10))}
            className={`cursor-pointer ${
              line.status === "current"
                ? "text-gray-800 font-bold"
                : line.status === "upcoming"
                ? "text-gray-400"
                : "text-gray-200"
            }`}
          >
            {line.words}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LyricsDisplay;









// // Version 1
// // Show lyrics line by line only, so current and next lyrics only
// import React, { useState, useEffect } from "react";
// import sample from "../sample.json";

// const LyricsDisplay = ({ currentTime }) => {
//   const [currentLine, setCurrentLine] = useState(null); // Current lyrics line
//   const [nextLine, setNextLine] = useState(null); // Next lyrics line

//   useEffect(() => {
//     if (!sample?.lyrics?.lines) return;

//     // Find the current and next lines based on the currentTime
//     const currentIndex = sample.lyrics.lines.findIndex((line, index) => {
//       const startTime = parseInt(line.startTimeMs, 10);
//       const endTime = parseInt(
//         sample.lyrics.lines[index + 1]?.startTimeMs || line.startTimeMs + 2500,
//         10
//       ); // make it 2.5 seconds

//       return currentTime >= startTime && currentTime < endTime;
//     });

//     // Set the current line, null if theres nothing
//     const current = sample.lyrics.lines[currentIndex] || null;

//     // Set the next line, null if theres nothing
//     const next = sample.lyrics.lines[currentIndex + 1] || null;

//     setCurrentLine(current);
//     setNextLine(next);
//   }, [currentTime]);

//   return (
//     <div className="text-center mt-[48px] text-[24px]">
//       <h1 className="text-[32px] mb-[148px] font-bold">Lyrics</h1>

//       {/** Display the current line */}
//       <div className="text-gray-800 font-bold text-[36px]">
//         {currentLine?.words || ""}
//       </div>

//       {/** Display the next line */}
//       <div className="text-gray-400 text-[24px] mt-[24px]">
//         {nextLine?.words || ""}
//       </div>
//     </div>
//   );
// };

// export default LyricsDisplay;