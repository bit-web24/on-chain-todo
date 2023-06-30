const express = require('express');
const router = express.Router();

// Import the controller or handler functions
const todoController = require('./controllers/todoController');

// Define the routes
router.get('/check-connection', todoController.checkConnection);
router.get('/balance', todoController.getBalance);
router.post('/todos', todoController.createTodo);
router.put('/todos/:id', todoController.updateTodo);
router.put('/todos/:id/complete', todoController.completeTodo);
router.delete('/todos/:id', todoController.deleteTodo);
router.get('/todos/:id', todoController.getTodoById);
router.get('/todos', todoController.getAllTodos);

module.exports = router;
