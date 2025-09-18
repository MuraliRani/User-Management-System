export interface User {
  username: string;
  email: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
}

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  userId: string;
}

export interface TodosState {
  items: Todo[];
  filter: 'all' | 'completed' | 'pending';
}

export type FilterType = 'all' | 'completed' | 'pending';