import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';

const SideNavbar = () => {
    // State to keep track of the active subpage
    const [activePage, setActivePage] = useState('search');

    // Function to switch pages
    const handlePageChange = (page) => {
      setActivePage(page);
    };
  
  return (
    <div className='w-80 bg-gray-800 text-white flex flex-col justify-between p-0 h-screen'>
      {/* Search page */}
      {activePage === 'search' && (
        <div className='search-subpage flex flex-col justify-center items-center mt-8'>
          <h2 className="text-2xl font-bold mb-4 text-center">Separate a Song!</h2>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Youtube URL here..."
              className="w-[200px] p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
            />
            <button
              className="w-10 h-10 bg-blue-500 rounded text-white flex justify-center items-center hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
              onClick={() => console.log('Separating song...')}
            >
              <FaSearch />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default SideNavbar