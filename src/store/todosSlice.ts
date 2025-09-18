import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TodosState, Todo, FilterType } from '../types';

const initialState: TodosState = {
  items: [],
  filter: 'all',
};

const loadTodosFromStorage = (): TodosState => {
  try {
    const saved = localStorage.getItem('todos');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (error) {
    console.error('Failed to load todos from storage:', error);
  }
  return initialState;
};

const todosSlice = createSlice({
  name: 'todos',
  initialState: loadTodosFromStorage(),
  reducers: {
    addTodo: (state, action: PayloadAction<{ text: string; userId: string }>) => {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: action.payload.text,
        completed: false,
        createdAt: new Date().toISOString(),
        userId: action.payload.userId,
      };
      state.items.push(newTodo);
      localStorage.setItem('todos', JSON.stringify(state));
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.items.find(item => item.id === action.payload);
      if (todo) {
        todo.completed = !todo.completed;
        localStorage.setItem('todos', JSON.stringify(state));
      }
    },
    deleteTodo: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('todos', JSON.stringify(state));
    },
    editTodo: (state, action: PayloadAction<{ id: string; text: string }>) => {
      const todo = state.items.find(item => item.id === action.payload.id);
      if (todo) {
        todo.text = action.payload.text;
        localStorage.setItem('todos', JSON.stringify(state));
      }
    },
    setFilter: (state, action: PayloadAction<FilterType>) => {
      state.filter = action.payload;
    },
    clearCompleted: (state) => {
      state.items = state.items.filter(item => !item.completed);
      localStorage.setItem('todos', JSON.stringify(state));
    },
  },
});

export const { 
  addTodo, 
  toggleTodo, 
  deleteTodo, 
  editTodo, 
  setFilter, 
  clearCompleted 
} = todosSlice.actions;
export default todosSlice.reducer;