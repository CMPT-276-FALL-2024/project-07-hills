import React from 'react';
import SideNavbar from './components/SideNavbar';

const Karaoke = () => {
  return (
      <div className="flex h-screen">
          {/** Lyrics and music player area */}
          <div className="flex-1 bg-gray-100 p-8">
              <h1 className="text-2xl font-bold">Lyrics Display</h1>
            
        </div>
          
          {/** Navigation bar */}
          <SideNavbar/>
      </div>
  );
};

export default Karaoke;