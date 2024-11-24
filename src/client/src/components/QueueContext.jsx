// QueueContext.jsx
import React, { createContext, useState, useContext } from "react";
import Queue from "../Model/Queue"; // Import your Queue.js class

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState(new Queue()); // Initialize the Queue.js class

  const addSongToQueue = (song) => {
    queue.addSong(song); // Use Queue.js methods
    setQueue(new Queue(queue.getSongs())); // Update state with the modified queue
  };

  const removeSongFromQueue = (index) => {
    queue.removeSong(index);
    setQueue(new Queue(queue.getSongs()));
  };

  const getCurrentSong = () => {
    return queue.getNextSong();
  };

  return (
    <QueueContext.Provider value={{ queue, addSongToQueue, removeSongFromQueue, getCurrentSong }}>
      {children}
    </QueueContext.Provider>
  );
};

export const useQueue = () => useContext(QueueContext);