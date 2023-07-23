const rpc = require('../../bloc/index');
const { TodoItem } = require('../../bloc/models/todo_item');
const { connectToSolanaCluster, readKeypair, readProgramId } = require('../../bloc/index');

const connection = connectToSolanaCluster('http://localhost:8899');

let payerKeypair;
const programIdPath = '../program_id';
const programId = readProgramId(programIdPath);

let id = 1;

const checkConnection = async (req, res) => {
  try {
    const keypairFilePath = "/home/bittu/.config/solana/id.json";
    payerKeypair = await readKeypair(keypairFilePath);

    const isConnected = true;

    res.json({ isConnected, walletAddr: payerKeypair.publicKey.toBase58() });
  } catch (error) {
    console.error('Error checking server connection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBalance = async (req, res) => {
  try {
    const balance = await rpc.getBalance(connection, payerKeypair);
    res.json({ balance });
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

const completeTodo = async (req, res) => {
  try {
    let todo = new TodoItem({
      id: req.body.todo.id,
      title: req.body.todo.title,
      description: req.body.todo.description,
      completed: false,
    });

    await rpc.markCompleted(connection, payerKeypair, programId, todo);
    res.status(200).send('Todo marked as completed');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while marking todo as completed');
  }
};

const updateTodo = async (req, res) => {
  try {
    let todo = new TodoItem({
      id: req.params.id,
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

const getTodoById = async (req, res) => {
  // Implement the logic to fetch a todo item
};

const getAllTodos = async (req, res) => {
  // Implement the logic to fetch all todos
};

module.exports = {
  checkConnection,
  getBalance,
  createTodo,
  getTodoById,
  updateTodo,
  completeTodo,
  deleteTodo,
  getAllTodos,
  getTodoById,
  getAllTodos,
};
