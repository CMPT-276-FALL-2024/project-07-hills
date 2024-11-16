import React, { useState } from 'react'

const SideNavbar = () => {
    // State to keep track of the active subpage
    const [activePage, setActivePage] = useState('search');

    // Function to switch pages
    const handlePageChange = (page) => {
      setActivePage(page);
    };
  
  return (
    <div className='w-80 bg-gray-800 text-white flex flex-col justify-between p-0 h-screen'>
      {/* Search subpage */}
      {activePage === 'search' && (
        <div className='search-subpage flex flex-col justify-center items-center mt-8'>
          <h2 className="text-2xl font-bold mb-4 text-center">Separate a Song!</h2>
          <input
            type="text"
            placeholder="Youtube URL here..."
            className="w-3/4 p-2 rounded bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-500"
          />
          <button
            className="w-10 h-10 bg-blue-500 rounded text-white flex justify-center items-center hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
            onClick={() => console.log('Separating song...')}
          >
          </button>
        </div>
      )}
      {/* OpenAI subpage */}
      {activePage === 'GPT4' && (
        <div className='GPT4-subpage'>
          <h2>GPT4</h2>
        </div>
      )}
      {/* Analysis subpage */}
      {activePage === 'Analysis' && (
        <div className='Analysis-subpage'>
          <h2>Analysis</h2>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex flex-x-4 mt-4 justify-left">
        {/** Search */}
        <button
          onClick={() => handlePageChange('search')}
          className={`p-2 w-full rounded ${
            activePage === 'search' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}>
          Search
        </button>

        {/** GPT4 */}
        <button
          onClick={() => handlePageChange('GPT4')}
          className={`p-2 w-full rounded ${
            activePage === 'GPT4' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}>
          GPT4
        </button>

        {/** Analysis */}
        <button
          onClick={() => handlePageChange('Analysis')}
          className={`p-2 w-full rounded ${
            activePage === 'Analysis' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}>
          Analysis
        </button>
      </div>
    </div>
  )
}

export default SideNavbar