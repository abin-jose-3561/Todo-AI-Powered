import React, { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { sendChatMessage } from '../services/api';
import type { Todo } from '../types/todo';

interface ChatAssistantProps {
  onAddTodo: (title: string, message: string) => Promise<void>;
  onEditTodo: (id: string, title: string, message: string) => Promise<void>;
  onGetTodos: () => Promise<void>;
}

export const ChatAssistant: React.FC<ChatAssistantProps> = ({ onAddTodo, onEditTodo, onGetTodos }) => {
  const [messages, setMessages] = useState<Array<{ role: string; text: string }>>([
    { role: 'model', text: "Hello! I'm your AI task assistant. What would you like to add to your TODO list?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const response = await sendChatMessage(userMessage, history);
      console.log("reply,reply", response)
      setMessages(prev => [...prev, { role: 'model', text: response.reply }]);
      setHistory(response.history);

      if (response.action) {
        const { type, payload } = response.action;
        if (type === 'CREATE_TODO') {
          await onAddTodo(payload.title, payload.message);
        } else if (type === 'UPDATE_TODO') {
          await onEditTodo(payload.id, payload.title, payload.message);
        } else if (type === 'GET_TODOS') {
          await onGetTodos();
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', text: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-panel mb-8 mt-10 max-w-2xl mx-auto transform transition-all hover:shadow-2xl flex flex-col h-[400px]">
      <div className="p-4 border-b border-primary/20 flex items-center gap-2">
        <Bot className="text-primary w-6 h-6" />
        <h2 className="text-xl font-bold text-textMain">AI Task Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`p-2 rounded-full flex-shrink-0 ${msg.role === 'user' ? 'bg-primary/20 text-primary' : 'bg-secondary/20 text-secondary'}`}>
                {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-primary text-white rounded-tr-none' : 'bg-background border border-primary/20 text-textMain rounded-tl-none'}`}>
                {msg.text}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 bg-background border border-primary/20 p-3 rounded-2xl rounded-tl-none text-textMain text-sm">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-primary/20">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            className="input-field flex-1 text-sm py-2"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="btn-primary px-4 py-2 flex items-center justify-center disabled:opacity-50"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
