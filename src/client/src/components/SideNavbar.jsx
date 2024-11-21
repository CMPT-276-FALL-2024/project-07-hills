import React, { useState } from 'react';
import { FaSearch } from 'react-icons/fa';

const SideNavbar = () => {
  // State to keep track of the active subpage
  const [activePage, setActivePage] = useState('search');
  const [searchQuery, setSearchQuery] = useState(''); // State to hold the search query

  // note: how are we gonna make this ocntect to natacontext? 
  const [results, setResults] = useState([ // examples for the data with placehoolder images 
    { title: 'Song Title 1', artist: 'Artist 1', imageUrl: 'https://via.placeholder.com/50' },
    { title: 'Song Title 2', artist: 'Artist 2', imageUrl: 'https://via.placeholder.com/50' },
    { title: 'Song Title 3', artist: 'Artist 3', imageUrl: 'https://via.placeholder.com/50' },
    { title: 'Song Title 1', artist: 'Artist 1', imageUrl: 'https://via.placeholder.com/50' },
    { title: 'Song Title 2', artist: 'Artist 2', imageUrl: 'https://via.placeholder.com/50' },
    { title: 'Song Title 3', artist: 'Artist 3', imageUrl: 'https://via.placeholder.com/50' },
    { title: 'Song Title 1', artist: 'Artist 1', imageUrl: 'https://via.placeholder.com/50' },
  ]); 

  // Function to handle changes in the search input
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    // For now we're just using mock results, need to get them from spotiofy api 
  };

  // Function to switch pages ( we don't need this anymore)
  const handlePageChange = (page) => {
    setActivePage(page);
  };

  return (
    <div className="w-80 bg-gray-800 text-white flex flex-col justify-between p-0 h-screen">
      {/* Search page */}
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
            {/* <button
              className="w-10 h-10 bg-blue-500 rounded text-white flex justify-center items-center hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => console.log('Separating song...')}
            >
              <FaSearch />
            </button> */}

            {/* Dropdown Results */}
            {searchQuery && (
              <div className="absolute mt-[525px] left-[-8px] w-[200px] bg-gray-700 rounded-lg shadow-lg max-h-250 overflow-y-auto">
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center p-2 hover:bg-gray-600 cursor-pointer"
                  >
                    {/* Album Cover */}
                    <img
                      src={result.imageUrl}
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