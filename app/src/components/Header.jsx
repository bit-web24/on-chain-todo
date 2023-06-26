import React from "react";
import { IoMdSearch } from "react-icons/io";

const Header = () => {
    return (
        <div className="bg-gray-800 py-4">
            <div className="max-w-4xl mx-auto flex items-center justify-center"
                style={{ height: "150px" }}
            >
                <div className="bg-white rounded-full flex items-center p-2">
                    <IoMdSearch className="w-10 h-10 ml-2" />
                    <input
                        className="w-full py-2 px-4 rounded-full focus:outline-none max-w-xs"
                        type="text"
                        placeholder="Search..."
                        style={{ width: "350px", height: "40px" }}
                    />
                </div>
            </div>
        </div>
    );
}

export default Header;