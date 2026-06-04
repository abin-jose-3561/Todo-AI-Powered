import React, { useState } from 'react';
import { Edit2, Trash2, Check, X } from 'lucide-react';
import type { Todo } from '../types/todo';

interface TodoCardProps {
  todo: Todo;
  onEdit: (id: string, title: string, message: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export const TodoCard: React.FC<TodoCardProps> = ({ todo, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editMessage, setEditMessage] = useState(todo.message);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    if (!editTitle.trim() || !editMessage.trim()) {
      setError('Title and message cannot be empty');
      return;
    }
    
    try {
      await onEdit(todo.id, editTitle, editMessage);
      setIsEditing(false);
      setError('');
    } catch {
      setError('Failed to save');
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditTitle(todo.title);
    setEditMessage(todo.message);
    setError('');
  };

  const handleDelete = () => {
    setIsDeleting(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(todo.id);
    } catch {
      setIsDeleting(false);
    }
  };

  if (isEditing) {
    return (
      <div className="glass-panel p-5 animate-in fade-in zoom-in duration-200">
        <div className="space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="input-field text-lg font-semibold"
          />
          <textarea
            value={editMessage}
            onChange={(e) => setEditMessage(e.target.value)}
            className="input-field min-h-[80px]"
          />
          {error && <p className="text-danger text-sm">{error}</p>}
          <div className="flex justify-end gap-2 mt-4">
            <button onClick={handleCancelEdit} className="p-2 text-textMuted hover:text-white hover:bg-slate-700 rounded-full transition-colors" title="Cancel">
              <X size={20} />
            </button>
            <button onClick={handleSave} className="p-2 text-primary hover:bg-primary/20 rounded-full transition-colors" title="Save">
              <Check size={20} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-panel p-5 group hover:shadow-2xl hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
      {isDeleting ? (
        <div className="absolute inset-0 bg-surface/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center p-4 animate-in fade-in duration-200">
          <p className="text-lg font-medium text-center mb-4">Delete this task?</p>
          <div className="flex gap-4">
            <button onClick={() => setIsDeleting(false)} className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm font-medium transition-colors">
              Cancel
            </button>
            <button onClick={confirmDelete} className="px-4 py-2 bg-danger hover:bg-dangerHover rounded-lg text-sm font-medium text-white transition-colors">
              Confirm
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-textMain line-clamp-2">{todo.title}</h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => setIsEditing(true)} className="p-1.5 text-textMuted hover:text-primary hover:bg-primary/10 rounded-md transition-colors">
            <Edit2 size={18} />
          </button>
          <button onClick={handleDelete} className="p-1.5 text-textMuted hover:text-danger hover:bg-danger/10 rounded-md transition-colors">
            <Trash2 size={18} />
          </button>
        </div>
      </div>
      <p className="text-textMuted whitespace-pre-wrap line-clamp-4">{todo.message}</p>
    </div>
  );
};
