import React, { useState, useEffect } from "react";
import { IoMdSearch, IoMdAdd } from "react-icons/io";

const Header = () => {
  const [showForm, setShowForm] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [searchBarWidth, setSearchBarWidth] = useState(500); // Initial width
  const [solTokenAmount, setSolTokenAmount] = useState(0); // Total SOL token amount

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

  const handleNewTodoClick = () => {
    setShowForm(true);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    // You can access the form values using the todoTitle and todoDescription state variables
    // Reset the form and hide it when done
    setTodoTitle("");
    setTodoDescription("");
    setShowForm(false);
  };

  const closeModal = () => {
    setShowForm(false);
  };

  return (
    <div className="bg-gray-800 py-8">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-between" style={{ height: "90px" }}>
        <h1 className="text-white text-5xl font-bold">
          <span style={{ fontFamily: "OldEnglishFive" }}>On Chain Todo</span>
        </h1>
        <div className="bg-white rounded-full px-4 py-2 mt-8 mx-4">
          <p className="text-gray-800 text-sm">Wallet Public Key: <span className="font-bold">ABCD1234EFGH56784EFGH56</span></p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center mt-10">
        <div className="flex justify-center mt-4">
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-full"
            onClick={handleNewTodoClick}
          >
            <IoMdAdd className="text-5xl" />
          </button>
        </div>
        <div className="bg-white rounded-full flex items-center p-2 mt-4">
          <IoMdSearch className="w-10 h-10 sm:w-12 sm:h-12 ml-2" />
          <input
            className="w-full py-2 px-4 rounded-full focus:outline-none"
            type="text"
            placeholder="Search..."
            style={{ width: searchBarWidth }}
          />
        </div>
      </div>
      {showForm && (
        <div className="fixed z-10 inset-0 flex items-center justify-center backdrop-filter backdrop-blur-lg bg-opacity-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Create New Todo</h2>
            <form onSubmit={handleFormSubmit}>
              <input
                type="text"
                placeholder="Todo Title"
                value={todoTitle}
                onChange={(e) => setTodoTitle(e.target.value)}
                className="w-full bg-gray-100 rounded-lg p-2 mb-4 focus:outline-none"
              />
              <textarea
                placeholder="Todo Description"
                value={todoDescription}
                onChange={(e) => setTodoDescription(e.target.value)}
                className="w-full bg-gray-100 rounded-lg p-2 mb-4 focus:outline-none resize-none overflow-auto"
                style={{ height: "200px" }}
              ></textarea>
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full mr-2"
                >
                  Add Todo
                </button>
                <button
                  type="button"
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full"
                  onClick={closeModal}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
