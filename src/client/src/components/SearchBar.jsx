import React from 'react'
import { IoSearchOutline } from "react-icons/io5";


const SearchBar = () => {
    return (
        <form className='w-[500px] relative'>
            <div className='relative'>
                <input type='search' placeholder='Type Here' className='w-full p-4 rounded-full border-2 border-gray focus:outline-none focus:border-gray-500' />
                <button className='absolute right-1 top-1/2 -translate-y-1/2 p-4 rounded-full'>
                    <IoSearchOutline />
                </button>
            </div>
            {/* <div className='absolute top-20 p-4 text-white bg-slate-600 w-full rounded-xl left-1/2 -translate-x-1/2 flex flex-col gap-2'>

            </div> */}
            {/* TODO ABOVE HANDLES THE SEARCH RESPONSE */}
        </form>
    );
};

export default SearchBar;