import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTodo, toggleTodo, deleteTodo, editTodo, setFilter, clearCompleted } from '../store/todosSlice';
import { FilterType, Todo } from '../types';

export const useTodos = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const user = useSelector((state: RootState) => state.auth.user);

  const filteredTodos = todos.items
    .filter(todo => todo.userId === user?.email)
    .filter(todo => {
      switch (todos.filter) {
        case 'completed':
          return todo.completed;
        case 'pending':
          return !todo.completed;
        default:
          return true;
      }
    });

  const addNewTodo = (text: string) => {
    if (user?.email) {
      dispatch(addTodo({ text, userId: user.email }));
    }
  };

  const toggleTodoStatus = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const deleteTodoItem = (id: string) => {
    dispatch(deleteTodo(id));
  };

  const editTodoText = (id: string, text: string) => {
    dispatch(editTodo({ id, text }));
  };

  const setTodoFilter = (filter: FilterType) => {
    dispatch(setFilter(filter));
  };

  const clearCompletedTodos = () => {
    dispatch(clearCompleted());
  };

  const stats = {
    total: todos.items.filter(todo => todo.userId === user?.email).length,
    completed: todos.items.filter(todo => todo.userId === user?.email && todo.completed).length,
    pending: todos.items.filter(todo => todo.userId === user?.email && !todo.completed).length,
  };

  return {
    todos: filteredTodos,
    filter: todos.filter,
    stats,
    addNewTodo,
    toggleTodoStatus,
    deleteTodoItem,
    editTodoText,
    setTodoFilter,
    clearCompletedTodos,
  };
};