// QueueContext.jsx`
import React, { createContext, useState, useContext, useEffect } from "react";
import Queue from "../Model/Queue"; // Import your Queue.js class
import SongFront from "../Model/SongFront"; // Import your Queue.js class

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState(new Queue()); // Initialize the Queue.js class
  const [processingIndex, setProcessingIndex] = useState(null); // Track which song is being processed
  const [isProcessing, setIsProcessing] = useState(false); // Flag to track if a song is being processed

  const addSongToQueue = (song) => {
    // Clone the current songs to avoid mutating the original
    const newQueue = new Queue()
  // Create a SongFront instance
    const songFront = new SongFront({
      title: song.title,
      artist: song.artist,
      spotifyUrl: song.spotify_url,
      spotifyId: song.spotify_id,
      albumImageUrl: song.album_image_URL,
      duration: song.duration,
      lyrics: song.lyrics,
      instrumentalUrl: song.instrumental_URL,
      instrumental_path: song.instrumental_path,
      original_path: song.original_path,
    });
    newQueue.songs = [...queue.getSongs(), songFront]; // Create a new Queue with the updated song list
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

  // Update a song in the queue
  const updateSongInQueue = (index, newAttributes) => {
    const newQueue = new Queue();
    newQueue.songs = queue.getSongs().map((song, i) =>
      i === index ? { ...song, ...newAttributes } : song
    );
    setQueue(newQueue);
  };

  // Start song process
  // Function to process the next song in the queue
  const processNextSong = async () => {
    console.log("processing song")
    const songs = queue.getSongs();
    
    if (processingIndex === null || processingIndex >= songs.length) {
      console.log("No valid song to process.");
      return; // Exit if no valid song is being processed
    }
    const currentSong = songs[processingIndex];

    try {
      await currentSong.StartAudioProcess();
      // poll status until complete
      await currentSong.pollTaskStatus((updatedSong) => {
        setQueue((prevQueue) => {
          const updatedQueue = new Queue();
          updatedQueue.songs = prevQueue.getSongs().map((s, i) =>
            i === processingIndex ? updatedSong : s
          );
          return updatedQueue;
        });
      });
      const new_queue = queue.getSongs()
      console.log(`Finished processing song: ${currentSong.title}`);
      console.log(queue.getNextSong())
    }
    catch (error) {
      console.error(`Error processing song: ${currentSong.title}`, error);
      setProcessingIndex(null); // Reset processing index on error
    } finally {
      setProcessingIndex(null); // Always reset processingIndex
      setIsProcessing(false); // Reset processing flag
    }
  };

  // useEffect(() => {
  //   if (processingIndex !== null) {
  //     processNextSong();
  //   }
  // }, [processingIndex]); // Only call when processingIndex changes

  // useEffect(() => {
  //   if (processingIndex === null) {
  //     const songs = queue.getSongs();
  //     const nextIndex = songs.findIndex((song) => !song.hasInstrumental());
  
  //     if (nextIndex !== -1) {
  //       console.log(`Found next song to process at index: ${nextIndex}`);
  //       setProcessingIndex(nextIndex);
  //     } else {
  //       console.log("No songs left to process.");
  //     }
  //   }
  // }, [processingIndex]);

 
  useEffect(() => {
    const songs = queue.getSongs();

    if (!isProcessing) {
      if (processingIndex === null) {
        const nextIndex = songs.findIndex((song) => !song.hasInstrumental());

        if (nextIndex !== -1) {
          console.log(`Found next song to process at index: ${nextIndex}`);
          setProcessingIndex(nextIndex);
        } else {
          console.log("No songs left to process.");
        }
      } else {
        setIsProcessing(true);
        processNextSong();
      }
    }
  }, [processingIndex, queue, isProcessing]);

  return (
    <QueueContext.Provider
      value={{
        queue,
        addSongToQueue,
        removeSongFromQueue,
        updateSongInQueue,
        getCurrentSong,
      }}
    >
      {children}
    </QueueContext.Provider>
  );
};


export const useQueue = () => useContext(QueueContext);