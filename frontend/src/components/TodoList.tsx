import React from 'react';
import type { Todo } from '../types/todo';
import { TodoCard } from './TodoCard';
import { CheckCircle } from 'lucide-react';

interface TodoListProps {
  todos: Todo[];
  loading: boolean;
  onEdit: (id: string, title: string, message: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({ todos, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <div className="glass-panel p-12 text-center max-w-2xl mx-auto flex flex-col items-center mt-10">
        <CheckCircle size={64} className="text-primary/50 mb-4" />
        <h3 className="text-2xl font-medium text-textMain mb-2">All caught up!</h3>
        <p className="text-textMuted">You have no pending tasks. Add one above to get started.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto px-4 pb-20">
      {todos.map(todo => (
        <TodoCard 
          key={todo.id} 
          todo={todo} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};
