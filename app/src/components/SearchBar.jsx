import React, { useState, useEffect } from "react";
import { IoMdSearch } from "react-icons/io";

const SearchBar = () => {
    const [searchBarWidth, setSearchBarWidth] = useState(500); // Initial width

    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const maxDesktopWidth = 500; // Maximum width of the search bar on desktop
            const maxMobileWidth = 350; // Maximum width of the search bar on mobile

            // Calculate the maximum width based on screen size
            const maxScreenWidth = screenWidth >= 768 ? maxDesktopWidth : maxMobileWidth;

            // Subtracting 32 for padding and margins
            const updatedWidth = Math.min(screenWidth - 32, maxScreenWidth);

            setSearchBarWidth(updatedWidth);
        };

        // Add event listener for window resize
        window.addEventListener("resize", handleResize);

        // Call handleResize once initially to set the initial width
        handleResize();

        // Cleanup the event listener on component unmount
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className="bg-white rounded-full flex items-center p-2 mt-4">
            <IoMdSearch className="w-10 h-10 sm:w-12 sm:h-12 ml-2" />
            <input
                className="w-full py-2 px-4 rounded-full focus:outline-none"
                type="text"
                placeholder="Search..."
                style={{ width: searchBarWidth }}
            />
        </div>
    );
}

export default SearchBar;