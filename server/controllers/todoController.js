const rpc = require('../../bloc/index');
const { TodoItem } = require('../../bloc/models/todoItem');
const { connectToSolanaCluster, readKeypair, readProgramId } = require('../../bloc/index');

const connection = await connectToSolanaCluster('http://localhost:8899');

const keypairFilePath = "/home/bittu/.config/solana/id.json";
const payerKeypair = await readKeypair(keypairFilePath);
const programIdPath = '../program_id';
const programId = await readProgramId(programIdPath);

let id = 1;

const getBalance = async (req, res) => {
  try {
    const balance = await rpc.getBalance(connection, payerKeypair);
    res.status(200).send(`Account Balance: ${balance}`);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while fetching balance');
  }
};

const createTodo = async (req, res) => {
  try {
    let todo = new TodoItem({
      id: id,
      title: req.body.todo.title,
      description: req.body.todo.description,
      completed: false,
    });

    await rpc.addTodoItem(connection, payerKeypair, programId, todo);
    id++;
    res.status(201).send('Todo created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while creating todo');
  }
};

const getTodoById = async (req, res) => {
  try {
    const todoId = req.body.id;
    const todo = await rpc.getTodoById(todoId);
    res.status(200).send(todo);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while fetching todo');
  }
};

const completeTodo = async (req, res) => {
  try {
    const todoId = req.body.id;
    await rpc.markCompleted(todoId);
    res.status(200).send('Todo marked as completed');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while marking todo as completed');
  }
};

const updateTodo = async (req, res) => {
  try {
    let todo = new TodoItem({
      id: req.body.todo.id,
      title: req.body.todo.title,
      description: req.body.todo.description,
      completed: false,
    });

    await rpc.updateTodoItem(connection, payerKeypair, programId, todo);
    res.status(200).send('Todo updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while updating todo');
  }
};

const deleteTodo = async (req, res) => {
  try {
    let todo = new TodoItem({
      id: req.body.todo.id,
      title: req.body.todo.title,
      description: req.body.todo.description,
      completed: false,
    });
    await rpc.deleteTodoItem(connection, payerKeypair, programId, todo);
    res.status(200).send('Todo deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while deleting todo');
  }
};

const getAllTodos = async (req, res) => {
  // Implement the logic to fetch all todos
};

const getCompletedTodos = async (req, res) => {
  // Implement the logic to fetch completed todos
};

const getUncompletedTodos = async (req, res) => {
  // Implement the logic to fetch uncompleted todos
};

module.exports = {
  getBalance,
  createTodo,
  getTodoById,
  updateTodo,
  completeTodo,
  deleteTodo,
  getAllTodos,
  getCompletedTodos,
  getUncompletedTodos,
};
