import axios from 'axios';

const baseURL = 'http://localhost:3000';

// Function to check connection with the backend server
const checkConnection = async () => {
  try {
    const response = await axios.get(`${baseURL}/check-connection`);
    return response.data.isConnected;
  } catch (error) {
    console.error(error);
    return false;
  }
};

// Function to get account balance
const getBalance = async () => {
  try {
    const response = await axios.get(`${baseURL}/balance`);
    return response.data.balance;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to create a new todo
const createTodo = async (todo) => {
  try {
    const response = await axios.post(`${baseURL}/todos`, todo);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to mark a todo as completed
const markCompleted = async (todoId) => {
  try {
    const response = await axios.put(`${baseURL}/todos/${todoId}/complete`);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to update a todo
const updateTodo = async (todoId, updatedTodo) => {
  try {
    const response = await axios.put(`${baseURL}/todos/${todoId}`, updatedTodo);
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to delete a todo
const deleteTodo = async (todoId) => {
  try {
    const response = await axios.delete(`${baseURL}/todos/${todoId}`);
    return response.data; // Assuming the response contains a success message
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to get a todo item by ID
const getTodoById = async (todoId) => {
  try {
    const response = await axios.get(`${baseURL}/todos/${todoId}`);
    return response.data.todo;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Function to get all todos
const getTodos = async () => {
  try {
    const response = await axios.get(`${baseURL}/todos`);
    return response.data.todos;
  } catch (error) {
    console.error(error);
    return [];
  }
};

module.exports = {
  checkConnection,
  getBalance,
  createTodo,
  markCompleted,
  updateTodo,
  deleteTodo,
  getTodoById,
  getTodos,
};