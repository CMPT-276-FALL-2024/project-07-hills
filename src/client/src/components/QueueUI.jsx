import React, { useState, useEffect } from "react";
import Queue from "../Model/Queue";

const QueueUI = () => {
  const [queue, setQueue] = useState(new Queue()); // Initialize the Queue instance
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  // Add initial songs to the queue using useEffect
  useEffect(() => {
    const newQueue = new Queue();
    newQueue.addSong({ title: "Song 1", artist: "Artist 1" });
    newQueue.addSong({ title: "Song 2", artist: "Artist 2" });
    newQueue.addSong({ title: "Song 3", artist: "Artist 3" });
    newQueue.addSong({ title: "Song 4", artist: "Artist 4" });
    // newQueue.addSong({ title: "Song 5", artist: "Artist 5" });
    newQueue.addSong({ title: "Song 6", artist: "Artist 6" });
    newQueue.addSong({ title: "Song 7", artist: "Artist 7" });

    setQueue(newQueue); // Update state with the populated queue
  }, []);

  // Fetch queue items for the current page
  const currentItems = queue
    .getSongs()
    .slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  const hasNextPage =
    (currentPage + 1) * itemsPerPage < queue.getSongs().length;
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
            key={index}
            className="relative flex items-center justify-between bg-gray-100 border border-gray-300 rounded-lg shadow p-4"
          >
            <div>
              <h3 className="text-lg font-bold">{song.title}</h3>
              <p className="text-sm text-gray-600">{song.artist}</p>
            </div>

            {/* Vertical line outside the first box */}
            {index === 0 && isFirstPage && (
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
