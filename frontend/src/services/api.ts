import axios from 'axios';
import type { Todo } from '../types/todo';

const API_URL = 'http://localhost:5000/api/todos';

export const getTodos = async (): Promise<Todo[]> => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await axios.post(API_URL, todo);
  return response.data;
};

export const updateTodo = async (id: string, todo: Omit<Todo, 'id'>): Promise<Todo> => {
  const response = await axios.put(`${API_URL}/${id}`, todo);
  return response.data;
};

export const deleteTodo = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
