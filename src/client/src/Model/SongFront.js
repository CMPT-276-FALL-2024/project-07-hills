class SongFront {
    constructor({ title, artist, spotifyUrl, spotifyId, albumImageUrl, duration, lyrics, instrumentalUrl }) {
      this.title = title || "Unknown Title";
      this.artist = artist || "Unknown Artist";
      this.spotifyUrl = spotifyUrl || "";
      this.spotifyId = spotifyId || "";
      this.albumImageUrl = albumImageUrl || "";
      this.duration = duration || "0:00";
      this.lyrics = lyrics || null;
      this.instrumentalUrl = instrumentalUrl || null;
      this.taskID = ""
      this.isProcessing = false 
    }
  
    // Check if the song has an instrumental URL
    hasInstrumental() {
      return Boolean(this.instrumentalUrl);
    }
  
    // Fetch audio from the server
    async StartAudioProcess() {
      try {
        const response = await fetch("http://localhost:8000/task/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: this.spotifyId }), // Send the search query as JSON
        });
        if (!response.ok) {
          throw new Error("Failed to fetch instrumental audio");
        }
  
        const data = await response.json();
        this.taskID = data.task_id;
        this.isProcessing = true;
      } catch (error) {
        console.error("Error starting audio process:", error);
        return null;
      }
    }
  
    async getInstrumental() {
      try {
        const response = await fetch("http://localhost:8000/task/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query: this.spotifyId }), // Send the search query as JSON
        });
        if (!response.ok) {
          throw new Error("Failed to fetch instrumental audio");
        }
  
        const data = await response.json();
        this.taskID = data.task_id;
        this.isProcessing = true;
      } catch (error) {
        console.error("Error starting audio process:", error);
        return null;
      }
    }
    
  }
  
  export default SongFront;