const express = require('express');
const router = express.Router();

// Import the controller or handler functions
const todoController = require('./controllers/todoController');

// Define the routes
router.get('/todos', todoController.getAllTodos);
router.post('/todos', todoController.createTodo);
router.get('/todos/:id', todoController.getTodoById);
router.put('/todos/:id', todoController.updateTodo);
router.delete('/todos/:id', todoController.deleteTodo);
router.get('/todos/completed', todoController.getCompletedTodos);
router.get('/todos/uncompleted', todoController.getUncompletedTodos);
router.put('/todos/:id/complete', todoController.completeTodo);
router.put('/todos/:id/uncomplete', todoController.uncompleteTodo);
router.delete('/todos', todoController.deleteAllTodos);

module.exports = router;
