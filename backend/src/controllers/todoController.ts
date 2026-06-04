import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../models/todo';

// In-memory data store
let todos: Todo[] = [];

export const getTodos = (req: Request, res: Response) => {
  res.status(200).json(todos);
};

export const createTodo = (req: Request, res: Response) => {
  const { title, message } = req.body;
  const newTodo: Todo = {
    id: uuidv4(),
    title: title.trim(),
    message: message.trim(),
  };
  todos.push(newTodo);
  res.status(201).json(newTodo);
};

export const updateTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, message } = req.body;
  
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos[todoIndex] = {
    ...todos[todoIndex],
    title: title.trim(),
    message: message.trim(),
  };
  
  res.status(200).json(todos[todoIndex]);
};

export const deleteTodo = (req: Request, res: Response) => {
  const { id } = req.params;
  const todoIndex = todos.findIndex(t => t.id === id);
  
  if (todoIndex === -1) {
    return res.status(404).json({ error: 'Todo not found' });
  }
  
  todos = todos.filter(t => t.id !== id);
  res.status(200).json({ message: 'Todo deleted successfully' });
};
