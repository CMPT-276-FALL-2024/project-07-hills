import React from 'react';
import { Link } from 'react-router-dom';
import logo from './assets/VocaFree.svg';
import Slideshow from './components/Slideshow';  // Ensure correct path

const Home = () => {
//   const images = [
//     {
//       url: '/public/InitialKaraokePage.png',
//       alt: 'Initial Karaoke Page'
//     },
//     {
//         url: '/pub dddlic/SearchResults.png',
//         alt: 'Search Results'
//     },
//     {
//         url: '/public/QueueSongs.png',
//         alt: 'Queue Songs'
//     },
//     {
//       url: '/public/PlaySongs.png',
//       alt: 'Play Songs'
//     }
//   ];

const images = [
    {
      url: '/public/InitialKaraokePage.png',
      alt: 'Initial Karaoke Page',
      description: 'When you first access the Karaoke page, this is what you will see. The main section displays the lyrics of the song, along with a progress bar, play/pause controls, replay and skip buttons, and a volume control. On the right, you will find a sidebar where you can search for songs to add to your karaoke session.'
    },
    {
      url: '/public/SearchResults.png',
      alt: 'Search Results',
      description: 'Once you enter a song name in the search bar, the top 6 results will be displayed based on how closely they match the song or artist name. This allows you to easily find the karaoke song you want to perform.'
    },
    {
      url: '/public/QueueSongs.png',
      alt: 'Queue Songs',
      description: 'You can add songs to the queue by selecting them from the search results. Inside the queue, you have the ability to delete songs or skip to the next song using the skip button located at the top left of the screen.'
    },
    {
      url: '/public/PlaySongs.png',
      alt: 'Play Songs',
      description: 'As you play a song, the lyrics will flow and sync with the music. The lyrics for the currently playing part of the song will be highlighted, allowing you to follow along. You can also manually scroll through the lyrics to navigate to specific parts of the song. Clicking on a specific lyric will jump to that part, and scrubbing the progress bar will also sync the lyrics with the selected part of the song. After 3 seconds of inactivity, the lyrics will automatically resume scrolling to match the song.'
    }
  ];
  
  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-200 p-6 md:p-12">
      {/* Flex container to align logo, slideshow, and button side by side */}
      <div className="flex flex-row items-start justify-center w-full max-w-screen-lg">
        {/* Logo section */}
        <div className="mr-12"> {/* Add some margin to the right of the logo */}
          <img 
            className="w-96 md:w-[350px] shadow-xl rounded-full hover:scale-105 transition-transform duration-300"
            src={logo} 
            alt="logo" 
          />
        </div>

        {/* Content section (Slideshow and Button) */}
        <div className="flex flex-col items-center justify-start">
          {/* Slideshow section */}
          <div className="w-full max-w-2xl mx-auto rounded-lg overflow-hidden shadow-xl mb-8">
            <Slideshow images={images} /> {/* Pass the images prop */}
          </div>

          {/* Link to Karaoke Page */}
          <Link
            to="/karaoke"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg text-lg shadow-lg hover:bg-blue-600 hover:shadow-2xl transition duration-300 ease-in-out mt-6"
          >
            Go to Karaoke
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Home;