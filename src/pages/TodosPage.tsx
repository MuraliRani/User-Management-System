import { useState } from 'react';
import { useTodos } from '../hooks/useTodos';
import { Plus, Filter, Trash2, Edit3, Check, X } from 'lucide-react';
import { FilterType } from '../types';

export const TodosPage: React.FC = () => {
  const {
    todos,
    filter,
    stats,
    addNewTodo,
    toggleTodoStatus,
    deleteTodoItem,
    editTodoText,
    setTodoFilter,
    clearCompletedTodos,
  } = useTodos();

  const [newTodoText, setNewTodoText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTodoText.trim()) {
      addNewTodo(newTodoText.trim());
      setNewTodoText('');
    }
  };

  const handleEditStart = (id: string, currentText: string) => {
    setEditingId(id);
    setEditingText(currentText);
  };

  const handleEditSave = () => {
    if (editingId && editingText.trim()) {
      editTodoText(editingId, editingText.trim());
    }
    setEditingId(null);
    setEditingText('');
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText('');
  };

  const filterOptions: { value: FilterType; label: string; count?: number }[] = [
    { value: 'all', label: 'All', count: stats.total },
    { value: 'pending', label: 'Pending', count: stats.pending },
    { value: 'completed', label: 'Completed', count: stats.completed },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-sm sm:text-base text-gray-600">Organize and track your todo items</p>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-sm text-gray-500">Progress</p>
              <div className="flex items-center">
                <div className="w-32 bg-gray-200 rounded-full h-2 mr-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{
                      width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : '0%'
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">
                  {stats.completed}/{stats.total}
                </span>
              </div>
            </div>
          </div>

          
          <div className="sm:hidden mb-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-gray-500">Progress</p>
              <span className="text-sm font-medium text-gray-900">
                {stats.completed}/{stats.total}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{
                  width: stats.total > 0 ? `${(stats.completed / stats.total) * 100}%` : '0%'
                }}
              />
            </div>
          </div>

          <form onSubmit={handleAddTodo} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newTodoText}
              onChange={(e) => setNewTodoText(e.target.value)}
              placeholder="Add a new task..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            />
            <button
              type="submit"
              className="flex items-center justify-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base min-h-[48px]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </button>
          </form>
        </div>

        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center flex-wrap gap-1">
              <Filter className="h-4 w-4 text-gray-500 mr-2" />
              {filterOptions.map(({ value, label, count }) => (
                <button
                  key={value}
                  onClick={() => setTodoFilter(value)}
                  className={`px-3 py-2 text-xs sm:text-sm rounded-md transition-colors min-h-[40px] ${
                    filter === value
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>
            {stats.completed > 0 && (
              <button
                onClick={clearCompletedTodos}
                className="flex items-center justify-center px-3 py-2 text-xs sm:text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors min-h-[40px]"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Clear Completed
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {todos.length === 0 ? (
            <div className="p-8 sm:p-12 text-center">
              <div className="text-gray-400 mb-4">
                <Plus className="h-10 w-10 sm:h-12 sm:w-12 mx-auto" />
              </div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No tasks yet</h3>
              <p className="text-sm sm:text-base text-gray-600">
                {filter === 'all'
                  ? 'Add your first task above to get started'
                  : `No ${filter} tasks found`}
              </p>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo.id} className="p-4 sm:p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1 min-w-0">
                    <button
                      onClick={() => toggleTodoStatus(todo.id)}
                      className={`flex-shrink-0 h-5 w-5 rounded border-2 mr-3 transition-colors flex items-center justify-center ${
                        todo.completed
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-gray-300 hover:border-blue-500'
                      }`}
                    >
                      {todo.completed && <Check className="h-3 w-3" />}
                    </button>
                    
                    {editingId === todo.id ? (
                      <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        <input
                          type="text"
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm sm:text-base"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditSave();
                            if (e.key === 'Escape') handleEditCancel();
                          }}
                          autoFocus
                        />
                        <div className="flex gap-2 sm:gap-1">
                          <button
                            onClick={handleEditSave}
                            className="flex-1 sm:flex-none p-2 text-green-600 hover:bg-green-50 rounded min-h-[40px] flex items-center justify-center"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleEditCancel}
                            className="flex-1 sm:flex-none p-2 text-gray-500 hover:bg-gray-100 rounded min-h-[40px] flex items-center justify-center"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1 min-w-0">
                        <p className={`truncate ${
                          todo.completed 
                            ? 'text-gray-500 line-through' 
                            : 'text-gray-900'
                        } text-sm sm:text-base`}>
                          {todo.text}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(todo.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                  
                  {editingId !== todo.id && (
                    <div className="flex items-center gap-1 ml-2 flex-shrink-0">
                      <button
                        onClick={() => handleEditStart(todo.id, todo.text)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteTodoItem(todo.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};