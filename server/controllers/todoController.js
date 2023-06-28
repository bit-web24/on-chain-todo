const rpc = require('../../bloc/index');
const { TodoItem } = require('../../bloc/models/todoItem');

const createTodo = (req, res) => {
    let todo = new TodoItem({
        title: req.body.todo.title,
        description: req.body.todo.description,
        completed: false,
    });

    rpc.addTodoItem(todo);

}

const getTodoById = (req, res) => {
    rpc.getTodoById(req.body.id);
}

const completeTodo = (req, res) => {
    rpc.markCompleted(req.body.id);
}

const updateTodo = (req, res) => {

}

const deleteTodo = (req, res) => {

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