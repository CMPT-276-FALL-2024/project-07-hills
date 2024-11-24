export const createTask = async (query) => {
    const baseURL = "http://localhost:8000";
    try {
      const createResponse = await fetch(`${baseURL}/task/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query }),
      });
  
      if (!createResponse.ok) {
        throw new Error("Failed to create task");
      }
  
      const { task_id } = await createResponse.json();
      return task_id;
    } catch (error) {
      console.error("Error creating task:", error);
      throw error;
    }
  };
  
  export const pollTaskStatus = async (taskId, updateProgress) => {
    const baseURL = "http://localhost:8000";
    try {
      while (true) {
        const statusResponse = await fetch(`${baseURL}/task/status/${taskId}`);
        if (!statusResponse.ok) {
          throw new Error("Failed to fetch task status");
        }
  
        const taskStatus = await statusResponse.json();
        updateProgress(taskStatus.progress);
  
        if (taskStatus.progress >= 100) {
          break; // Task completed
        }
  
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Poll every second
      }
    } catch (error) {
      console.error("Error polling task status:", error);
      throw error;
    }
  };
  
  export const fetchTaskResult = async (taskId) => {
    const baseURL = "http://localhost:8000";
    try {
      const resultResponse = await fetch(`${baseURL}/task/output/${taskId}`);
      if (!resultResponse.ok) {
        throw new Error("Failed to fetch task result");
      }
  
      const { result } = await resultResponse.json();
      return result;
    } catch (error) {
      console.error("Error fetching task result:", error);
      throw error;
    }
  };
  