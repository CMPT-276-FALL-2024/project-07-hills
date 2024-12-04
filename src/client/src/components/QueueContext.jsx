// QueueContext.jsx`
import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import Queue from "../Model/Queue"; // Import your Queue.js class
import SongFront from "../Model/SongFront"; // Import your Queue.js class
import LoadingBar from "./LoadingBar"

const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState(new Queue()); // Initialize the Queue.js class
  const [processingIndex, setProcessingIndex] = useState(null); // Track which song is being processed
  const [isProcessing, setIsProcessing] = useState(false); // Flag to track if a song is being processed
  const [progress, setProgress] = useState(0); // Track task progress
  const [prevProcessingIndex, setPrevProcessingIndex] = useState(null); // Previous processing index
  const processingIndexRef = useRef(processingIndex);

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

  // const removeSongFromQueue = (index) => {
  //     // Check if the song being removed is the one being processed
  //   if (queue.getSongs()[index].isProcessing) {
  //     alert("Cannot remove the song currently being processed.");
  //     return; // Prevent removal
  //   }
  //       // Adjust processingIndex if necessary
  //   if (index < processingIndex) {
  //     setProcessingIndex(processingIndex - 1);
  //   } else if (index === queue.getSongs().length - 1) {
  //     // Reset if last item is removed and no songs remain to process
  //     setProcessingIndex(null);
  //   }

  //   // Clone the current songs to avoid mutating the original
  //   const newQueue = new Queue();
  //   const updatedSongs = queue.getSongs().filter((_, i) => i !== index);
  //   newQueue.songs = updatedSongs; // Create a new Queue with the updated song list
  //   setQueue(newQueue); // Update state with the new Queue instance
  // };

  const removeSongFromQueue = (index) => {
    const songs = queue.getSongs();

    if (index < 0 || index >= songs.length) {
      console.error("Invalid index for song removal.");
      return;
    }
  
    if (songs[index].isProcessing) {
      alert("Cannot remove the song currently being processed.");
      return;
    }
  
    if (index < processingIndex) {
      setProcessingIndex(processingIndex - 1);
    } else if (index === processingIndex) {
      setProcessingIndex(null);
    }
  
    const newQueue = new Queue();
    newQueue.songs = songs.filter((_, i) => i !== index);
    setQueue(newQueue);
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
    console.log("processing song");
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
            i === processingIndexRef.current ? updatedSong : s
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
    processingIndexRef.current = processingIndex;
  }, [processingIndex]);
 
  useEffect(() => {
    const songs = queue.getSongs();

    if (!isProcessing) {
      if (processingIndex === null) {
        const nextIndex = songs.findIndex((song) => !song.hasInstrumental());

        if (nextIndex !== -1) {
          console.log(`Found next song to process at index: ${nextIndex}`);
          setProcessingIndex(nextIndex);
        }
        else {
          console.log("No songs left to process.");
        }
      }
      else {
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