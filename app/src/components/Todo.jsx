import React, { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";

const Todo = ({ title, content }) => {
  const [completed, setCompleted] = useState(false);

  const handleCheck = () => {
    setCompleted(!completed);
  };

  return (
    <div className={`bg-gray-100 rounded-lg p-4 shadow-md flex flex-col ${completed ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${completed ? "line-through text-gray-600" : "text-blue-800"}`}>{title}</h2>
        <div className="bg-red-500 rounded-full p-2 cursor-pointer">
          <RiDeleteBin2Line className="text-white cursor-pointer" size={20} />
        </div>
      </div>
      <div className={`bg-white rounded-lg p-4 mb-4 ${completed ? "opacity-50" : ""}`}>
        <p className={`text-lg font-semibold ${completed ? "text-gray-600" : "text-gray-800"}`}>{content}</p>
      </div>
      <button
        className={`bg-green-500 text-lg text-white font-semibold py-2 px-4 rounded-full focus:outline-none ${
          completed ? "hidden" : ""
        }`}
        onClick={handleCheck}
        style={{ fontFamily: "revert" }}
      >
        Mark Completed
      </button>
      {completed && (
        <div className="text-lg text-green-700 mt-4">
          <span className="text-green-500">&#10003;</span> Completed
        </div>
      )}
    </div>
  );
};

export default Todo;
