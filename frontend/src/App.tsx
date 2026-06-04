import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { useTodos } from './hooks/useTodos';

function App() {
  const { todos, loading, error, addTodo, editTodo, removeTodo } = useTodos();

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4">
        <header className="py-8 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
            TaskMaster
          </h1>
          <p className="text-slate-400 mt-2 font-medium">Elevate your productivity</p>
        </header>

        {error && (
          <div className="max-w-2xl mx-auto mb-4 p-4 bg-danger/20 border border-danger/50 text-danger-100 rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        <TodoForm onAdd={addTodo} />
        
        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center text-textMain max-w-7xl mx-auto px-4">Your Tasks</h2>
          <TodoList 
            todos={todos} 
            loading={loading} 
            onEdit={editTodo} 
            onDelete={removeTodo} 
          />
        </div>
      </div>
    </div>
  );
}

export default App;
