import React from 'react';
import logo from './assets/VocaFree.svg';
import SearchBar from './components/SearchBar.jsx';

const Home = () => {
    return (
        // Make the logo slightly above appear and add a search bar below.
        //Add the logo right here.
        <section className="flex flex-col items-center justify-center">
            {/* Logo section */}
            <div className="pt-[2vh]">
                <img className="" src={logo} alt="logo" />
            </div>

            <SearchBar />
            {/* Content section */}
          
        </section>

    );
}

export default Home;
