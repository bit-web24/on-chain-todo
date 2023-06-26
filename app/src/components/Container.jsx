import React from "react";
import Todo from "./Todo";

const todos = [
  { id: 1, title: "Todo 1", content: "This is my Todo content" },
  { id: 2, title: "Todo 2", content: "This is my Todo content" },
  { id: 3, title: "Todo 3", content: "This is my Todo content" },
  { id: 4, title: "Todo 4", content: "This is my Todo content" },
  { id: 5, title: "Todo 5", content: "This is my Todo content" },
  { id: 6, title: "Todo 6", content: "This is my Todo content" },
  { id: 3, title: "Todo 3", content: "This is my Todo content" },
  { id: 4, title: "Todo 4", content: "This is my Todo content" },
  { id: 5, title: "Todo 5", content: "This is my Todo content" },
  { id: 6, title: "Todo 6", content: "This is my Todo content" }
];

const Container = () => {
  return (
    <div className="container mx-auto mt-8 px-20 pb-8">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
        {todos.map(todo => (
          <Todo key={todo.id} title={todo.title} content={todo.content} />
        ))}
      </div>
    </div>
  );
};

export default Container;
