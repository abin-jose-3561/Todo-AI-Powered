import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

interface TodoFormProps {
  onAdd: (title: string, message: string) => Promise<void>;
}

export const TodoForm: React.FC<TodoFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setIsSubmitting(true);
    try {
      await onAdd(title, message);
      setTitle('');
      setMessage('');
    } catch {
      setError('Failed to add todo. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-panel p-6 mb-8 mt-10 max-w-2xl mx-auto transform transition-all hover:shadow-2xl">
      <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <PlusCircle className="text-primary" /> Create New Task
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className={`input-field ${error && !title.trim() ? 'border-danger' : ''}`}
            maxLength={60}
          />
        </div>
        
        <div>
          <textarea
            placeholder="Task Description..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className={`input-field min-h-[100px] resize-y ${error && !message.trim() ? 'border-danger' : ''}`}
          />
        </div>

        {error && <p className="text-danger text-sm font-medium">{error}</p>}
        
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="btn-primary w-full flex justify-center items-center gap-2 text-lg"
        >
          {isSubmitting ? 'Adding...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
};
