class Queue {
    constructor() {
      this.songs = [];
    }
  
    // Add a song to the queue
    addSong(song) {
      this.songs.push(song);
    }
    
    // Remove a song from the queue
    removeSong(index) {
      if (index >= 0 && index < this.songs.length) {
        this.songs.splice(index, 1);
      } else {
        console.error("Invalid index for song removal");
      }
    }
//todo - this is not setup, no time :(
    // removeSong(index) {
    //   if (index >= 0 && index < this.songs.length) {
    //     // Use the filter method to remove the song from the display
    //     const updatedSongs = this.songs.filter((_, i) => i !== index); // Filter out the song at the specified index
        
    //     // Update the internal list of songs
    //     this.songs = updatedSongs; // Now this.songs holds the updated list without the removed song
    
    //     // Optional: If you need to notify the state or UI update, you can do that here as well
    //     // For example, if you're using React, you would call setQueue(updatedSongs) to trigger a re-render.
        
    //   } else {
    //     console.error("Invalid index for song removal");
    //   }
    // }
    
  
    // Get the next song in the queue
    getNextSong() {
      return this.songs.length > 0 ? this.songs[0] : null;
    }
  
    // Clear the queue
    clearQueue() {
      this.songs = [];
    }
  
    // Get all songs in the queue
    getSongs() {
      return this.songs;
    }
  
    // Check if the queue is empty
    isEmpty() {
      return this.songs.length === 0;
    }
  }
  
  export default Queue;