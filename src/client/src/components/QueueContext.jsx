// QueueContext.jsx
import React, { createContext, useState, useContext } from "react";
import Queue from "../Model/Queue"; // Import your Queue.js class

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState(new Queue()); // Initialize the Queue.js class

  const addSongToQueue = (song) => {
    // Clone the current songs to avoid mutating the original
    const newQueue = new Queue()
    newQueue.songs = [...queue.getSongs(), song]; // Create a new Queue with the updated song list
    setQueue(newQueue); // Update state with the modified queue
  };

  const removeSongFromQueue = (index) => {
    // Clone the current songs to avoid mutating the original
    const newQueue = new Queue();
    const updatedSongs = queue.getSongs().filter((_, i) => i !== index);
    newQueue.songs = updatedSongs; // Create a new Queue with the updated song list
    setQueue(newQueue); // Update state with the new Queue instance
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