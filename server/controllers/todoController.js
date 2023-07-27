const rpc = require('../../dist/index');

const keypairFilePath = "/home/bittu/.config/solana/id.json";
let payerKeypair = rpc.readKeypair(keypairFilePath);

const programId = rpc.getProgramId();

let id = 1;

const checkConnection = async (req, res) => {
  try {
    let isConnected = false;
    let walletAddr = '';

    if (payerKeypair) {
      isConnected = true;
      walletAddr = payerKeypair.publicKey.toString();
    }

    res.json({ isConnected, walletAddr });
  } catch (error) {
    console.error('Error checking server connection:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getBalance = async (req, res) => {
  try {
    if (!payerKeypair) {
      throw new Error('Payer keypair is not initialized.');
    }

    const balance = await rpc.getBalance(payerKeypair);
    res.json({ balance });
  } catch (error) {
    console.error('Error fetching balance:', error);
    res.status(500).send('Error occurred while fetching balance');
  }
};

const createTodo = async (req, res) => {
  try {
    let todo = {
      id: id,
      title: req.body.todo.title,
      description: req.body.todo.description,
      completed: false,
    };

    await rpc.addTodoItem(payerKeypair, programId, todo);
    id++;
    res.status(201).send('Todo created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while creating todo');
  }
};

const completeTodo = async (req, res) => {
  try {
    await rpc.markCompleted(payerKeypair, programId, req.body.todo.id);
    res.status(200).send('Todo marked as completed');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while marking todo as completed');
  }
};

const updateTodo = async (req, res) => {
  try {
    let todo = {
      id: req.params.id,
      title: req.body.todo.title,
      description: req.body.todo.description,
      completed: req.body.todo.completed,
    };

    await rpc.updateTodoItem(payerKeypair, programId, todo);
    res.status(200).send('Todo updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error occurred while updating todo');
  }
};

const deleteTodo = async (req, res) => {
  try {
    await rpc.deleteTodoItem(payerKeypair, programId, req.body.todo.id);
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
