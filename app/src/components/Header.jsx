import React, { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { createTodo, getBalance } from "../API/api";
import SearchBar from "./SearchBar";

const Header = ({ walletPublicKey }) => {
  const [showForm, setShowForm] = useState(false);
  const [todoTitle, setTodoTitle] = useState("");
  const [todoDescription, setTodoDescription] = useState("");
  const [solTokenBalance, setSolTokenBalance] = useState(0); // SOL token balance

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await getBalance(walletPublicKey);
        setSolTokenBalance(balance);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBalance();
  }, [walletPublicKey]);

  const handleAddTodo = () => {
    try {
      createTodo(todoTitle, todoDescription);
      setTodoTitle("");
      setTodoDescription("");
      setShowForm(false);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    handleAddTodo();
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
        <div className="flex justify-between items-center bg-amber-200 rounded-full px-4 py-2 mt-8 mx-4">
          <div>
            <p className="text-gray-800 text-sm">
              <code className="font-extrabold">PUBLIC-KEY:</code>{" "}
              <code className="font-light">{walletPublicKey}</code>
            </p>
          </div>
          <div className="border-l border-gray-300 mx-4"></div>
          <div>
            <p className="text-gray-800 text-sm">
              <code className="font-extrabold">BALANCE:</code>{" "}
              <code className="font-light">{solTokenBalance} SOL</code>
            </p>
          </div>
        </div>

      </div>
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center mt-12">
        <div className="flex justify-center mt-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-4 rounded-full">
            <IoMdAdd className="text-5xl" onClick={() => setShowForm(true)} />
          </button>
        </div>
        <SearchBar />
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
                  onClick={handleAddTodo}
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
