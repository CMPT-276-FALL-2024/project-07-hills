class SongFront {
    constructor({ title, artist, spotifyUrl, spotifyId, albumImageUrl, duration, lyrics, instrumentalUrl, instrumental_path, original_path}) {
      this.title = title || "Unknown Title";
      this.artist = artist || "Unknown Artist";
      this.spotifyUrl = spotifyUrl || "";
      this.spotifyId = spotifyId || "";
      this.albumImageUrl = albumImageUrl || "";
      this.duration = duration || "";
      this.lyrics = lyrics || null;
      this.instrumentalUrl = instrumentalUrl || null;
      this.instrumental_path = instrumental_path
      this.original_path = original_path
      this.taskID = ""
      this.isProcessing = false 
    }
  
    // Check if the song has an instrumental URL
    hasInstrumental() {
      return Boolean(this.instrumentalUrl);
    }
  
    // Start audio processing process and fetch task id
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
        console.log(`Started processing for ${this.title}. Task ID: ${this.taskID}`);
      } catch (error) {
        console.error(`Error starting audio process for ${this.title}:`, error);
        return null;
      }
    }
  
  // Poll the server for task status
  async pollTaskStatus(updateCallback) {
    if (!this.taskID) {
      console.error(`No task ID for ${this.title}`);
      return;
    }

    try {
      let isCompleted = false;

      while (!isCompleted) {
        const response = await fetch(`http://localhost:8000/task/status/${this.taskID}`);
        if (!response.ok) throw new Error(`Failed to fetch task status for ${this.taskID}`);

        const statusData = await response.json();
        console.log(`Task status for ${this.title}:`, statusData);

        if (statusData.status === "Completed") {
          isCompleted = true;
          this.isProcessing = false;
          this.instrumentalUrl = statusData.result; // Assuming the task result includes the URL
          console.log(`gigity ${statusData.result}`)
          console.log(`Instrumental ready for ${this.title}: ${this.instrumentalUrl}`);

          if (updateCallback) updateCallback(this); // Notify parent or UI
        }
        else {
          await new Promise(resolve => setTimeout(resolve, 3000)); // Wait for 3 seconds before next poll
        }
      }
    }
    catch (error) {
      console.error(`Error polling task status for ${this.title}:`, error);
      this.isProcessing = false;
    }
  }
  
  // async fetchInstrumental() {
  //     if (!this.taskID) {
  //       console.error(`No task ID for ${this.title}`);
  //       return;
  //     }
  //     try {
  //       const response = await fetch("http://localhost:8000/task/output/${this.taskID}"), {
  //         if(!response.ok) throw new Error(`Failed to fetch instrumental URL for ${this.taskID}`);
          
  //       const data = await response.json();
  //       this.taskID = data.task_id;
  //       this.isProcessing = true;
  //     } catch (error) {
  //       console.error("Error starting audio process:", error);
  //       return null;
  //     }
  //     }
    
  }
  
  export default SongFront;