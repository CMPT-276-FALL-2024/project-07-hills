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