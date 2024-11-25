// QueueContext.jsx`
import React, { createContext, useState, useContext, useEffect } from "react";
import Queue from "../Model/Queue"; // Import your Queue.js class
import SongFront from "../Model/SongFront"; // Import your Queue.js class
const QueueContext = createContext();

export const QueueProvider = ({ children }) => {
  const [queue, setQueue] = useState(new Queue()); // Initialize the Queue.js class
  const [processingIndex, setProcessingIndex] = useState(null); // Track which song is being processed

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

  // Function to process the next song in the queue
  const processNextSong = async () => {
    const songs = queue.getSongs();
    const nextIndex = songs.findIndex(song => song.isProcessing);

    if (nextIndex === -1) {
      console.log("No more songs to process.");
      return;
    }

    setProcessingIndex(nextIndex);

    const song = songs[nextIndex];

    try {
      const response = await fetch("http://localhost:8000/get-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(song),
      });

      if (response.ok) {
        const instrumentalUrl = await response.text(); // Assuming server returns URL as plain text
        updateSongInQueue(nextIndex, { instrumental_url: instrumentalUrl });
        console.log(`Instrumental URL added for song: ${song.title}`);
      } else {
        console.error(`Failed to fetch audio for song: ${song.title}`);
      }
    } catch (error) {
      console.error(`Error processing song: ${song.title}`, error);
    } finally {
      setProcessingIndex(null); // Reset processing index
    }
  };

  // Automatically process the next song when the queue updates
  useEffect(() => {
    // if (processingIndex === null) {
    //   processNextSong();
    // }
  }, [queue]);

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