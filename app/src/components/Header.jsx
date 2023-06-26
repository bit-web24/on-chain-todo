import React from "react";
import { IoMdSearch } from "react-icons/io";

const Header = () => {
  return (
    <div className="bg-gray-800 py-8">
      <div
        className="max-w-4xl mx-auto flex flex-col items-center justify-center"
        style={{ height: "150px" }}
      >
        <h1 className="text-white text-5xl font-bold mb-4"><span style={{fontFamily: "OldEnglishFive"}}>On Chain Todo</span></h1>
        <div className="bg-white rounded-full flex items-center p-2 mt-4">
          <IoMdSearch className="w-10 h-10 ml-2" />
          <input
            className="w-full py-2 px-4 rounded-full focus:outline-none max-w-xl"
            type="text"
            placeholder="Search..."
            style={{ width: "500px", height: "40px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default Header;
