import React, { useState } from "react";
import {
  RiDeleteBin2Line,
  RiEdit2Line,
  RiCheckLine,
  RiCloseLine,
} from "react-icons/ri";

const Todo = ({ title, content, completed }) => {
  const [isCompleted, setIsCompleted] = useState(completed);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(title);
  const [updatedContent, setUpdatedContent] = useState(content);

  const handleCheck = () => {
    setIsCompleted(!isCompleted);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    // Perform save/update logic here
    setIsEditing(false);
  };

  const handleCancel = () => {
    // Reset the updated title and content
    setUpdatedTitle(title);
    setUpdatedContent(content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    // Perform delete logic here
  };

  const handleTitleChange = (e) => {
    setUpdatedTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setUpdatedContent(e.target.value);
  };

  return (
    <div
      className={`bg-gray-100 rounded-lg p-4 shadow-md flex flex-col ${isCompleted ? "opacity-50" : ""
        } border-2 border-gray-300`}
    >
      <div className="flex items-center justify-between mb-4">
        {isEditing ? (
          <input
            type="text"
            value={updatedTitle}
            onChange={handleTitleChange}
            className={`text-2xl font-bold ${isCompleted ? "line-through text-gray-600" : "text-blue-800"
              }`}
          />
        ) : (
          <h2
            className={`text-2xl font-bold ${isCompleted ? "line-through text-gray-600" : "text-blue-800"
              }`}
          >
            {updatedTitle}
          </h2>
        )}
        <div className="flex items-center">
          {isEditing ? (
            <>
              <button
                className="bg-green-500 rounded-full p-2 cursor-pointer mr-2"
                onClick={handleSave}
                title="Save"
              >
                <RiCheckLine className="text-white cursor-pointer" size={20} />
              </button>
              <button
                className="bg-red-500 rounded-full p-2 cursor-pointer"
                onClick={handleCancel}
                title="Cancel"
              >
                <RiCloseLine className="text-white cursor-pointer" size={20} />
              </button>
            </>
          ) : (
            <>
              <button
                className="bg-blue-500 rounded-full p-2 cursor-pointer mr-2"
                onClick={handleEdit}
                title="Edit"
                disabled={isCompleted}
              >
                <RiEdit2Line className="text-white cursor-pointer" size={20} />
              </button>
              <button
                className="bg-red-500 rounded-full p-2 cursor-pointer"
                onClick={handleDelete}
                title="Delete"
                disabled={!isCompleted}
              >
                <RiDeleteBin2Line
                  className="text-white cursor-pointer"
                  size={20}
                />
              </button>
            </>
          )}
        </div>
      </div>
      <div
        className={`bg-white rounded-lg p-4 mb-4 ${isCompleted ? "opacity-50" : ""
          }`}
        style={{ minHeight: "200px" }} // Adjust the height as desired
      >
        {isEditing ? (
          <textarea
            value={updatedContent}
            onChange={handleContentChange}
            className={`text-lg font-semibold ${isCompleted ? "text-gray-600" : "text-gray-800"
              } resize-none`}
            style={{ width: "100%", height: "100%" }}
          />
        ) : (
          <div className="max-h-40 overflow-auto">
            <p
              className={`text-lg font-semibold ${isCompleted ? "text-gray-600" : "text-gray-800"
                }`}
            >
              {updatedContent}
            </p>
          </div>
        )}
      </div>
      <button
        className={`bg-green-500 text-lg text-white font-semibold py-2 px-4 rounded-full focus:outline-none ${isCompleted ? "hidden" : ""
          }`}
        onClick={handleCheck}
        style={{ fontFamily: "revert" }}
        disabled={isEditing}
      >
        Mark Completed
      </button>
      {isCompleted && (
        <div className="text-lg text-green-700 mt-4">
          <span className="text-green-500">&#10003;</span> Completed
        </div>
      )}
    </div>
  );
};

export default Todo;
