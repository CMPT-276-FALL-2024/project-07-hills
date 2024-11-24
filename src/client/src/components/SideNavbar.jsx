import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useQueue } from './QueueContext'; // Use the hook, no need to re-import the context

const SideNavbar = () => {
  const [activePage, setActivePage] = useState('search');
  const [searchQuery, setSearchQuery] = useState('');// State to hold the search query
  const [showResults, setShowResults] = useState(false); // State to control the result visibility

  const [results, setResults] = useState([]); 
  const { addSongToQueue } = useQueue(); // Access functions from QueueContext

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  // Function to handle search button click
  const handleSearchClick = async () => {
    if (searchQuery) {
      setShowResults(true); // Show results only after clicking the search button
      console.log('Searching for:', searchQuery);
      try {
        const response = await fetch('http://localhost:8000/search-songs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: searchQuery }), // Send the search query as JSON
        });
        if (!response.ok) {
          throw new Error('Failed to fetch songs');
        }

        const data = await response.json() // Parse JSON response
        // Assuming the response is a list of song objects
        console.log('Received data:', data);
        setResults(data); // Update the results state with the received song objects

      }
      catch (error) {
        console.error('Error fetching songs: ', error)
      }
    }
  };
  const handleAddToQueue = async (song) => {
    // Fetch lyriced song form server
    try {
      const response = await fetch('http://localhost:8000/fetch-song', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(song),
      });
    
      if (response.ok) {
        const updatedSong = await response.json();
        console.log(`Song with lyrics added to queue: ${updatedSong.title}`);
        addSongToQueue(updatedSong); // Add the song with lyrics to the queue
      } else if (response.status === 404) {
        console.error(`Lyrics not found for the song: ${song.title}`);
        alert(`Lyrics not found for the song: ${song.title}`);
      } else {
        throw new Error('Failed to fetch song with lyrics');
      }
    }
    catch (error) {
      console.error('Error adding song to queue:', error);
      alert('An error occurred while adding the song to the queue. Please try again.');
    }
  };


  return (
    <div className="w-80 bg-gray-800 text-white flex flex-col justify-between p-0 h-screen">
      {activePage === 'search' && (
        <div className="search-subpage flex flex-col justify-center items-center mt-8">
          <h2 className="text-2xl font-bold mb-4 text-center">Separate a Song!</h2>
          <div className="flex items-center space-x-2 relative">
            <input
              type="text"
              placeholder="Song/Artist name here..."
              className="w-[200px] p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {/* Search Button */}
            <button
              className="w-10 h-10 bg-blue-500 rounded text-white flex justify-center items-center hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={handleSearchClick} // Trigger the searchON LY ont the on click
            >
              <FaSearch />
            </button>

            {/* Dropdown Results */}
            {showResults && (
              <div className="absolute mt-[610px] left-[-8px] w-[200px] bg-gray-700 rounded-lg shadow-lg max-h-250 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 hover:bg-gray-600 cursor-pointer"
                    onClick={() => handleAddToQueue(result)} // Add song to queue on click
                  >
                    {/* Album Cover */}
                    <img
                      src={result.album_image_URL}
                      alt="Album Cover"
                      className="w-12 h-12 rounded mr-3"
                    />
                    {/* Song Title and Artist Name */}
                    <div className="text-white">
                      <p className="font-semibold">{result.title}</p>
                      <p className="text-sm text-gray-400">{result.artist}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideNavbar;