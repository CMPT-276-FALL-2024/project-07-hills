// Version 3
import React, { useState, useEffect } from "react";
import sample from "../sample.json";

const LyricsDisplay = ({ currentTime, onLyricClick }) => {
  const [currentLyrics, setCurrentLyrics] = useState([]);

  useEffect(() => {
    if (!sample?.lyrics?.lines) return;

    const updatedLyrics = sample.lyrics.lines.map((line) => {
      const startTime = parseInt(line.startTimeMs, 10);
      const endTime = parseInt(line.endTimeMs, 10) || startTime + 2500;

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
  );
};

export default LyricsDisplay;






// Show lyrics altogether (Version 2)
// import React, { useState, useEffect } from "react";
// import sample from "../sample.json";

// const LyricsDisplay = ({ currentTime }) => {
//   const [currentLyrics, setCurrentLyrics] = useState([]);

//   useEffect(() => {
//     if (!sample?.lyrics?.lines) return;

//     const updatedLyrics = sample.lyrics.lines.map((line) => {
//       const startTime = parseInt(line.startTimeMs, 10);
//       const endTime = parseInt(line.endTimeMs, 10) || startTime + 2500; // Default to 1s duration if endTime is 0

//       if (currentTime >= startTime && currentTime <= endTime) {
//         return { ...line, status: "current" };
//       } else if (currentTime < startTime) {
//         return { ...line, status: "upcoming" };
//       } else {
//         return { ...line, status: "passed" };
//       }
//     });

//     setCurrentLyrics(updatedLyrics);
//   }, [currentTime]);

//   return (
//     <div className="text-center mt-[4px] text-[24px]">
//       <h1 className="text-[32px] mb-[18px] font-bold">Lyrics</h1>
//       {currentLyrics.map((line, index) => (
//         <div
//           key={index}
//           className={`${
//             line.status === "current"
//               ? "text-gray-800 font-bold"
//               : line.status === "upcoming"
//               ? "text-gray-400"
//               : "text-gray-200"
//           }`}
//         >
//           {line.words}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default LyricsDisplay;





// Show lyrics piece by piece (version 1)
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
//         sample.lyrics.lines[index + 1]?.startTimeMs || line.startTimeMs + 1000,
//         10
//       );

//       return currentTime >= startTime && currentTime < endTime;
//     });

//     // Set the current line
//     const current = sample.lyrics.lines[currentIndex] || null;

//     // Set the next line
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