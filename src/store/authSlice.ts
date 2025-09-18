import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User } from '../types';

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
};


const loadAuthFromStorage = (): AuthState => {
  try {
    const saved = localStorage.getItem('auth');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        isAuthenticated: parsed.isAuthenticated || false,
        user: parsed.user || null,
        token: parsed.token || null,
      };
    }
  } catch (error) {
    console.error('Failed to load auth from storage:', error);
  }
  return initialState;
};

const authSlice = createSlice({
  name: 'auth',
  initialState: loadAuthFromStorage(),
  reducers: {
    login: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      
      localStorage.setItem('auth', JSON.stringify(state));
    },
    updateProfile: (state, action: PayloadAction<User>) => {
      if (state.user) {
        state.user = action.payload;
        localStorage.setItem('auth', JSON.stringify(state));
      }
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      
      localStorage.removeItem('auth');
      localStorage.removeItem('todos');
    },
  },
});

export const { login, updateProfile, logout } = authSlice.actions;
export default authSlice.reducer;