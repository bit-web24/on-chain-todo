import React from "react";
import { AiFillHeart } from "react-icons/ai";

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-black py-4 text-center border-t-4 border-gray-700">
      <div className="flex flex-col-reverse items-center">
        <p className="text-2xl font-bold" style={{ fontFamily: "arial" }}>
          Crafted with <AiFillHeart className="text-red-500 inline-block mx-1" size={40} /> by <span style={{ color: "red", fontWeight: "bold" }}>Bittu</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
