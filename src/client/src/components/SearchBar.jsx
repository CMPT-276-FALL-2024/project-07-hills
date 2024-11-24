import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [taskId, setTaskId] = useState(null);
  const [loading, setLoading] = useState(false);

  const createTask = async () => {
    if (!query.trim()) {
      console.error("Query cannot be empty");
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
