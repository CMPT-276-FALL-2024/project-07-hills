import React, { useState } from "react";

const QueueUI = () => {
  const queue = [
    { title: "Song 1", artist: "Artist 1" },
    { title: "Song 2", artist: "Artist 2" },
    { title: "Song 3", artist: "Artist 3" },
    { title: "Song 4", artist: "Artist 4" },
    { title: "Song 5", artist: "Artist 5" },
    { title: "Song 6", artist: "Artist 6" },
    { title: "Song 7", artist: "Artist 7" },
    { title: "Song 8", artist: "Artist 8" },
    { title: "Song 9", artist: "Artist 9" },
    { title: "Song 10", artist: "Artist 10" },
    { title: "Song 11", artist: "Artist 11" },
    { title: "Song 12", artist: "Artist 12" },
  ];

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const currentItems = queue.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const hasNextPage = (currentPage + 1) * itemsPerPage < queue.length;
  const hasPreviousPage = currentPage > 0;

  const handleNext = () => {
    if (hasNextPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevious = () => {
    if (hasPreviousPage) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  return (
    <div className="flex items-center">
      {hasPreviousPage && (
        <button
          onClick={handlePrevious}
          className="mr-4 p-2 text-black rounded-full shadow hover:bg-slate-200 focus:outline-none"
        >
          ←
        </button>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 p-4 w-full relative">
        {currentItems.map((song, index) => (
          <div
            key={index}
            className="relative flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg shadow p-4"
          >
            <div>
              <h3 className="text-lg font-bold">{song.title}</h3>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>

            {/* Vertical line outside the first box */}
            {index === 0 && (
              <div className="absolute right-[-8px] -bottom-0 top-2 h-4/5 w-[1px] bg-gray-300"></div>
            )}
          </div>
        ))}
      </div>
      {hasNextPage && (
        <button
          onClick={handleNext}
          className="ml-4 p-2 text-black rounded-full shadow hover:bg-slate-200 focus:outline-none"
        >
          →
        </button>
      )}
    </div>
  );
};

export default QueueUI;
