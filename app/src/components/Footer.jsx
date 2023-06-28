import React from "react";
import { AiFillHeart } from "react-icons/ai";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <div className="container mx-auto">
        <p className="text-2xl font-bold">
          Crafted with <AiFillHeart className="text-red-500 inline-block mx-1" size={24} /> by <span className="text-red-500">Bittu</span>
        </p>
        <p className="text-sm text-gray-300">&copy; {currentYear} All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
