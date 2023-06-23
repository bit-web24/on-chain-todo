const Todo = require('../models/todoModel');
const rpc = require('../../bloc/index');
const { TodoItem } = require('../../bloc/models/todoItem');

exports.getAllTodos = (req, res) => {

}

exports.createTodo = (req, res) => {
    let todo = new TodoItem({
        title: req.body.title,
        description: req.body.description,
        completed: false,
    });

}

exports.getTodoById = (req, res) => {

}

exports.updateTodo = (req, res) => {

}

exports.deleteTodo = (req, res) => {

}

exports.getCompletedTodos = (req, res) => {

}

exports.getUncompletedTodos = (req, res) => {

}

exports.completeTodo = (req, res) => {

}

exports.uncompleteTodo = (req, res) => {

}

exports.deleteAllTodos = (req, res) => {

}