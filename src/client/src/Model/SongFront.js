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
    }
  
    // Check if the song has an instrumental URL
    hasInstrumental() {
      return Boolean(this.instrumentalUrl);
    }
  
    // Fetch audio from the server
    async fetchInstrumental() {
      try {
        const response = await fetch("http://localhost:8000/get-audio", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(this),
        });
  
        if (!response.ok) {
          throw new Error("Failed to fetch instrumental audio");
        }
  
        const data = await response.json();
        this.instrumentalUrl = data.instrumental_URL;
        return this.instrumentalUrl;
      } catch (error) {
        console.error("Error fetching instrumental audio:", error);
        return null;
      }
    }
  }
  
  export default SongFront;