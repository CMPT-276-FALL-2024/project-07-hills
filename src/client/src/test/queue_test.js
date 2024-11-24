const testAddSongs = async () => {
    const queries = ["The Hills", "Love Story", "Tequila Dave"];
    const baseURL = "http://localhost:8000";
  
    for (const query of queries) {
      try {
        const response = await fetch(`${baseURL}/search-songs`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(`Fetched songs for "${query}":`, data);
          // Add the songs to the queue (frontend state)
          setSongs((prevSongs) => [...prevSongs, ...data]);
        } else {
          console.error(`Failed to fetch "${query}":`, await response.text());
        }
      } catch (error) {
        console.error(`Error fetching "${query}":`, error);
      }
    }
  };
  