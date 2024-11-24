import { useQueue } from "../components/QueueContext"; // Ensure this path is correct

const addSongToQueueFromTask = async (taskId) => {
  const { addSongToQueue } = useQueue(); // Access the Queue context
  try {
    // Fetch song from the FastAPI backend
    const response = await fetch(`http://localhost:8000/task/output/${taskId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch song for Task ID ${taskId}: ${response.statusText}`);
    }

    const data = await response.json();
    if (data && data.result) {
      // Add the fetched song to the queue
      addSongToQueue(data.result);
      console.log(`Song added to queue:`, data.result);
    } else {
      console.error("No song found in the response:", data);
    }
  } catch (error) {
    console.error("Error adding song to queue from task:", error);
  }
};

export default addSongToQueueFromTask;