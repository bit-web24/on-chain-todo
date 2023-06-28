const rpc = require('../../bloc/index');
const { TodoItem } = require('../../bloc/models/todoItem');
let id = 1;

const createTodo = (req, res) => {
    let todo = new TodoItem({
        id: id,
        title: req.body.todo.title,
        description: req.body.todo.description,
        completed: false,
    });

    rpc.addTodoItem(todo);
    id++;
}

const getTodoById = (req, res) => {
    rpc.getTodoById(req.body.id);
}

const completeTodo = (req, res) => {
    rpc.markCompleted(req.body.id);
}

const updateTodo = (req, res) => {
    let todo = new TodoItem({
        id: req.body.todo.id,
        title: req.body.todo.title,
        description: req.body.todo.description,
        completed: false,
    });

    rpc.updateTodoItem(todo);
}

const deleteTodo = (req, res) => {
    rpc.deleteTodoItem(req.body.id);
}

const getAllTodos = (req, res) => {

}

const getCompletedTodos = (req, res) => {

}

const getUncompletedTodos = (req, res) => {

}

module.exports = {
    createTodo,
    getTodoById,
    updateTodo,
    completeTodo,
    deleteTodo,
    getAllTodos,
    getCompletedTodos,
    getUncompletedTodos,
}