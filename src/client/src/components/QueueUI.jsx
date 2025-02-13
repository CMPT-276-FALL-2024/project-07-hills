import React, { useState } from "react";
import { useQueue } from "./QueueContext";
import SongLoadingBar from "./LoadingBar";

const QueueUI = () => {
  const { queue, removeSongFromQueue } = useQueue();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;
  console.log("Songs in queue:", queue.getSongs());
  // Fetch current page items
  const currentItems = queue
    .getSongs()
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const hasNextPage = (currentPage + 1) * itemsPerPage < queue.getSongs().length;
  const hasPreviousPage = currentPage > 0;

  const handleNext = () => {
    if (hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (hasPreviousPage) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleRemove = (index) => {
    const globalIndex = currentPage * itemsPerPage + index;
    removeSongFromQueue(globalIndex);
  };

  const isFirstPage = currentPage === 0;

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
            key={song.id}
            className="relative flex flex-col justify-between bg-gray-100 border border-gray-300 rounded-lg shadow p-4"
          >
            <div>
              <h3 className="text-lg font-bold">{song.title}</h3>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>
            <button
              onClick={() => handleRemove(index)}
              className="absolute right-2 top-2 p-2 text-stone-600 rounded-full hover:bg-slate-200"
            >
              X
            </button>

            {index === 0 && isFirstPage && (
              <div className="absolute right-[-8px] -bottom-0 top-2 h-4/5 w-[1px] bg-gray-300"></div>
            )}

            {/* Add SongLoadingBar at the bottom */}
            <div className="mt-4">
              <SongLoadingBar song={song} />
            </div>
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