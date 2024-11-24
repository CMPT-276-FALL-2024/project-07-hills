import React, { useState } from "react";

import { IoSearchOutline } from "react-icons/io5";
import { useQueue } from "./QueueContext";
// import addSongToQueueFromTask from "../test/addSongToQ";
//todo figure out how to change it so once it gets that task id it will add it to the queue

const SearchBar = () => {
  // const { addSongToQueue } = useQueue(); // Access the context hook here
  const { queue, removeSongFromQueue } = useQueue();

  const [query, setQuery] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(false);

  const addSongToQFinished = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/task/output/${taskId}`);
      if (!response.ok) {
        throw new Error("Failed to get task output");
      }

      const data = await response.json();
      const song = data.result;

      if (!song) {
        console.error("No song found in task output");
        return;
      }

      console.log("Task Output:", data);
      console.log("Song:", song);

      // addSongToQueue(song); // Add song to queue directly
      queue.addSong(song);
      let title = song.title;
      console.log("Song Title:", title);
      let artist = song.artist;
      console.log("Song Artist:", artist);

      // queue.addSong({ title: title, artist: artist });
    } catch (error) {
      console.error("Error getting task output:", error);
    }
  };

  
  const tempTest = async (taskId) => {
    try {
      const response = await fetch(`http://localhost:8000/task/output/$c9e57d65-e77a-430a-8ece-bd23134db36c`);
      //get song
      if (!response.ok) {
        throw new Error("Failed to get task output");
      }
      const data = await response.json();
      console.log("Task Output:", data);
      console.log("Song:", data.song);
      //add song to queue
    } catch (error) {
      console.error("Error getting task output:", error);
    }
  };


  

      

  const checkLoading = async (taskId) => {
    
    try {
      let isTaskLoading = true; // Use a local variable to manage the loop condition
  
      console.log("Checking task status for ID:", taskId);
  
      while (isTaskLoading) {
        const response = await fetch(`http://localhost:8000/task/status/${taskId}`);
        if (!response.ok) {
          throw new Error("Failed to check task status");
        }
  
        const data = await response.json();
        console.log("Task Status:", data);
  
        if (data.status === "Completed" || data.status === "Failed") {
          console.log(`Task ${taskId} finished with status: ${data.status}`);
          isTaskLoading = false; // Break the loop when task is done or failed
  
          if (data.status === "Completed") {
            isTaskLoading = false;
            addSongToQFinished(taskId); // Process the completed task result
            return;
          } else {
            console.error(`Task ${taskId} failed:`, data.result);
          }
        } else {
          console.log(`Task ${taskId} is still in progress...`);
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2 seconds
        }
      }
    } catch (error) {
      console.error("Error checking task status:", error);
    }
  };

  const createTask = async () => {
    if (!query.trim()) {
      console.error("Query cannot be empty");
      return;
    }
    let tempstate = false;
    if(tempstate === true){ // for testing
      let taskId = "8f614bc6-0c68-4223-8a2f-28715bb06cf7"
      addSongToQFinished(taskId);
      return;
    }

    console.log("User query:", query); // Log the query for debugging

    try {
      setLoading(true); // Show "Adding..." feedback
      const response = await fetch("http://localhost:8000/task/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }), // Correctly format the body as { "query": "your-input" }
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const data = await response.json();
      setTaskId(data.task_id); // Store the returned task ID
      console.log("Task created with ID:", data.task_id);
      // addSongToQueueFromTask(data.task_id);

      checkLoading(data.task_id)
    } catch (error) {
      console.error("Error creating task:", error);
    } finally {
      setLoading(false); // Reset button state
    }
  };
  return (
    <form
      className="w-[500px] relative"
      onSubmit={(e) => e.preventDefault()} // Prevent form submission
    >
      <div className="relative">
        <input
          type="search"
          placeholder="Type Here"
          className="w-full p-4 rounded-full border-2 border-gray focus:outline-none focus:border-gray-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button
          type="submit"
          className="absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full"
          onClick={createTask} // Handle button click
        >
          <IoSearchOutline />
        </button>
      </div>

      {/* Additional action button */}
      <div className="mt-4">
    
        <button
          type="button"
          onClick={createTask}
          className="w-full p-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none"
        >
          {loading ? "Adding..." : "Add to Queue"}
        </button>
      </div>

      {/* Display Task ID */}
      {taskId && (
        <div className="mt-4 text-center text-green-600">
          <p>Task Created: {taskId}</p>
        </div>
      )}
    </form>
  );
};

export default SearchBar;
