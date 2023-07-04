import React, { useState, useEffect } from "react";
import Todo from "./Todo";
import { getTodos } from '../API/api';

const Container = () => {

  const [todos, setTodos] = useState([]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todosData = await getTodos();
        setTodos(todosData);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTodos();
  }, []);

  const handleTodoDelete = (deletedTodoId) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== deletedTodoId));
  };

  return (
    <div className="container mx-auto mt-8 px-4 md:px-8 lg:px-20 pb-8">
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {todos.map((todo) => (
          <Todo key={todo.id} todo={todo} onDelete={handleTodoDelete} />
        ))}

      </div>
    </div>
  );
};

export default Container;

