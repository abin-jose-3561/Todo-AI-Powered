"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateTodo = void 0;
const validateTodo = (req, res, next) => {
    const { title, message } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string.' });
    }
    if (!message || typeof message !== 'string' || message.trim() === '') {
        return res.status(400).json({ error: 'Message is required and must be a non-empty string.' });
    }
    next();
};
exports.validateTodo = validateTodo;
