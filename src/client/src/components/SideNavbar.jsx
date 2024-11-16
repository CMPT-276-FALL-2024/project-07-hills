import React, { useState } from 'react'

const SideNavbar = () => {
    // State to keep track of the active subpage
    const [activePage, setActivePage] = useState('search');

    // Function to switch pages
    const handlePageChange = (page) => {
      setActivePage(page);
    };
  
  return (
    <div className='w-80 bg-gray-800 text-white flex flex-col justify-between p-1=4 h-screen'>
      {/* Search subpage */}
      {activePage === 'search' && (
        <div className='search-subpage'>
          <h2>Search</h2>
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
      <div className="flex flex-col space-y-4">
        <button
          onClick={() => handlePageChange('search')}
          className={`p-2 rounded ${activePage === 'search' ? 'bg-blue-500' : 'bg-gray-700 hover:bg-gray-600'
            }`}>Search</button>
        <button onClick={() => handlePageChange('GPT4')}>GPT4</button>
        <button onClick={() => handlePageChange('Analysis')}>Analysis</button>
      </div>
    </div>
  )
}

export default SideNavbar