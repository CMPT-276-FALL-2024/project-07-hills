import React, { useState } from "react";
import { useQueue } from "./QueueContext";

//Create a song
// import { addSongToQueueFromTask } from "./addSongToQ";

// const handleAddSong = async () => {
//   // const taskId = "your-task-id"; // Replace with actual Task ID
//   await addSongToQueueFromTask(taskId);
// };


const QueueUI = () => {
  const { queue, removeSongFromQueue } = useQueue();
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

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
            <button
              onClick={() => handleRemove(index)}
              className="absolute right-2 top-2 p-2 bg-red-500 text-white rounded"
            >
              Remove
            </button>
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
