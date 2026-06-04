"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTodo = exports.updateTodo = exports.createTodo = exports.getTodos = void 0;
const uuid_1 = require("uuid");
// In-memory data store
let todos = [];
const getTodos = (req, res) => {
    res.status(200).json(todos);
};
exports.getTodos = getTodos;
const createTodo = (req, res) => {
    const { title, message } = req.body;
    const newTodo = {
        id: (0, uuid_1.v4)(),
        title: title.trim(),
        message: message.trim(),
    };
    todos.push(newTodo);
    res.status(201).json(newTodo);
};
exports.createTodo = createTodo;
const updateTodo = (req, res) => {
    const { id } = req.params;
    const { title, message } = req.body;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todos[todoIndex] = Object.assign(Object.assign({}, todos[todoIndex]), { title: title.trim(), message: message.trim() });
    res.status(200).json(todos[todoIndex]);
};
exports.updateTodo = updateTodo;
const deleteTodo = (req, res) => {
    const { id } = req.params;
    const todoIndex = todos.findIndex(t => t.id === id);
    if (todoIndex === -1) {
        return res.status(404).json({ error: 'Todo not found' });
    }
    todos = todos.filter(t => t.id !== id);
    res.status(200).json({ message: 'Todo deleted successfully' });
};
exports.deleteTodo = deleteTodo;
