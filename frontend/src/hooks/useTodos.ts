import { useState, useEffect } from 'react';
import type { Todo } from '../types/todo';
import * as api from '../services/api';

export const useTodos = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const data = await api.getTodos();
      setTodos(data);
      setError(null);
    } catch (err: unknown) {
      setError('Failed to fetch todos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchTodos();
  }, []);

  const addTodo = async (title: string, message: string) => {
    try {
      const newTodo = await api.createTodo({ title, message });
      setTodos(prev => [...prev, newTodo]);
    } catch (err: unknown) {
      setError('Failed to add todo');
      throw err;
    }
  };

  const addTodoLocal = (newTodo: Todo) => {
    setTodos(prev => [...prev, newTodo]);
  };

  const editTodo = async (id: string, title: string, message: string) => {
    try {
      const updated = await api.updateTodo(id, { title, message });
      setTodos(prev => prev.map(t => (t.id === id ? updated : t)));
    } catch (err: unknown) {
      setError('Failed to update todo');
      throw err;
    }
  };

  const removeTodo = async (id: string) => {
    try {
      // Optimistic update
      setTodos(prev => prev.filter(t => t.id !== id));
      await api.deleteTodo(id);
    } catch (err: unknown) {
      // Revert if failed
      fetchTodos();
      setError('Failed to delete todo');
      throw err;
    }
  };

  return { todos, loading, error, addTodo, addTodoLocal, editTodo, removeTodo };
};
