import React, { useState } from "react";
import { RiDeleteBin2Line } from "react-icons/ri";

const Todo = ({ title, content }) => {
  const [completed, setCompleted] = useState(false);

  const handleCheck = () => {
    setCompleted(!completed);
  };

  return (
    <div className={`bg-yellow-200 rounded-lg p-4 shadow-md flex flex-col ${completed ? "opacity-50" : ""}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className={`text-2xl font-bold ${completed ? "line-through text-gray-500" : "text-purple-700"}`}>{title}</h2>
        <RiDeleteBin2Line className="text-red-600 cursor-pointer" />
      </div>
      <div className={`bg-gray-100 rounded-lg p-4 mb-4 ${completed ? "opacity-50" : ""}`}>
        <p className={`text-lg font-semibold ${completed ? "text-gray-500" : "text-gray-800"}`}>{content}</p>
      </div>
      <button
        className={`bg-green-400 text-white font-semibold py-2 px-4 rounded-full focus:outline-none ${completed ? "hidden" : ""}`}
        onClick={handleCheck}
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
