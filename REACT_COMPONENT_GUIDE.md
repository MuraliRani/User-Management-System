# 📚 React Component Guide - Line by Line Explanation

This guide explains key components in the UMS project with detailed code analysis for React learning.

## 🏗️ Core Components

### App.tsx - Application Root
```typescript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';

function App() {
  return (
    // Redux Provider makes store available to all components
    <Provider store={store}>
      {/* Router enables navigation between pages */}
      <Router>
        <Routes>
          {/* Public route - no authentication required */}
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes wrapped in PrivateRoute */}
          <Route path="/*" element={
            <PrivateRoute>
              <Layout /> {/* Layout contains <Outlet /> for child routes */}
            </PrivateRoute>
          }>
            {/* Nested routes render inside Layout */}
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="todos" element={<TodosPage />} />
            {/* Default redirect */}
            <Route path="" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}
```

**🎯 Key Concepts:**
- **Provider Pattern**: Makes Redux store accessible everywhere
- **Nested Routing**: Child routes render in parent's `<Outlet />`
- **Route Protection**: PrivateRoute wrapper guards authenticated pages

---

### PrivateRoute.tsx - Authentication Guard
```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface PrivateRouteProps {
  children: React.ReactNode; // Any React content
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth(); // Get auth status
  
  // Conditional rendering: show content OR redirect
  return isAuthenticated ? 
    <>{children}</> : 
    <Navigate to="/login" replace />;
};
```

**🎯 Key Concepts:**
- **TypeScript Interface**: Defines component props structure
- **Conditional Rendering**: Ternary operator for simple if/else
- **Custom Hooks**: useAuth provides authentication state
- **React Fragments**: `<>...</>` renders without extra DOM nodes

---

### LoginPage.tsx - Authentication Form
```typescript
import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  // Multiple state variables for form management
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { isAuthenticated, loginUser } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Form validation function
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Email is required';
    } else if (!formData.username.includes('@')) {
      newErrors.username = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if valid
  };

  // Async form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent browser default
    setLoginError(''); // Clear previous errors
    
    if (!validateForm()) return; // Stop if validation fails
    
    setLoading(true); // Show loading state
    try {
      const success = await loginUser(formData.username, formData.password);
      
      if (success) {
        navigate('/dashboard'); // Navigate on success
      } else {
        setLoginError('Invalid credentials');
      }
    } catch (error) {
      setLoginError('An error occurred');
    } finally {
      setLoading(false); // Always clear loading
    }
  };

  // Input change handler
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Functional state update - safe for concurrent updates
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear errors when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit}>
        {/* Error display */}
        {loginError && (
          <div className="text-red-600">{loginError}</div>
        )}
        
        {/* Email input */}
        <input
          name="username"
          type="email"
          value={formData.username}
          onChange={handleChange}
          className={errors.username ? 'border-red-300' : 'border-gray-300'}
        />
        {errors.username && <p className="text-red-600">{errors.username}</p>}
        
        {/* Password input */}
        <input
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          className={errors.password ? 'border-red-300' : 'border-gray-300'}
        />
        {errors.password && <p className="text-red-600">{errors.password}</p>}
        
        {/* Submit button with loading state */}
        <button type="submit" disabled={loading}>
          {loading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </div>
  );
};
```

**🎯 Key Concepts:**
- **Multiple useState**: Managing different pieces of state
- **Form Validation**: Client-side validation with error display
- **Async Operations**: Handling login with loading states
- **Event Handling**: Form submission and input changes
- **Controlled Components**: React controls input values
- **Error Handling**: Try-catch for async operations

---

### useAuth.ts - Custom Authentication Hook
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { login, logout, updateProfile } from '../store/authSlice';

// Demo credentials for testing
const DEMO_CREDENTIALS = {
  username: 'demo@example.com',
  password: 'password123',
};

export const useAuth = () => {
  const dispatch = useDispatch(); // Redux action dispatcher
  const auth = useSelector((state: RootState) => state.auth); // Auth state

  // Login function - returns Promise<boolean>
  const loginUser = async (username: string, password: string): Promise<boolean> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check credentials
    if (username === DEMO_CREDENTIALS.username && password === DEMO_CREDENTIALS.password) {
      const user = {
        username: 'Demo User',
        email: username,
      };
      const token = 'mock-jwt-token-' + Date.now();
      
      // Dispatch login action to Redux
      dispatch(login({ user, token }));
      return true;
    }
    return false;
  };

  // Logout function
  const logoutUser = () => {
    dispatch(logout()); // Clear auth state
  };

  // Profile update function
  const updateUserProfile = (userData: User) => {
    dispatch(updateProfile(userData));
  };

  // Return auth state and functions
  return {
    ...auth, // Spread auth state (isAuthenticated, user, token)
    loginUser,
    logoutUser,
    updateUserProfile,
  };
};
```

**🎯 Key Concepts:**
- **Custom Hooks**: Encapsulate reusable logic
- **Redux Integration**: useSelector and useDispatch hooks
- **Async Functions**: Promise-based login with artificial delay
- **State Management**: Dispatching actions to update global state
- **Return Object**: Exposing state and functions to components

---

### useTodos.ts - Todo Management Hook
```typescript
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { addTodo, toggleTodo, deleteTodo, setFilter } from '../store/todosSlice';

export const useTodos = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos);
  const user = useSelector((state: RootState) => state.auth.user);

  // Filter todos by current user and filter type
  const filteredTodos = todos.items
    .filter(todo => todo.userId === user?.email) // User-specific todos
    .filter(todo => {
      switch (todos.filter) {
        case 'completed': return todo.completed;
        case 'pending': return !todo.completed;
        default: return true; // 'all'
      }
    });

  // Todo operations
  const addNewTodo = (text: string) => {
    if (user?.email) {
      dispatch(addTodo({ text, userId: user.email }));
    }
  };

  const toggleTodoStatus = (id: string) => {
    dispatch(toggleTodo(id));
  };

  // Calculate statistics
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
    // ... other functions
  };
};
```

**🎯 Key Concepts:**
- **Data Filtering**: Multiple filter operations for user-specific data
- **Computed Values**: Calculating statistics from state
- **Function Encapsulation**: Wrapping Redux actions in meaningful functions
- **Multi-selector**: Using multiple useSelector calls for different state pieces

---

## 🎨 React Patterns Used

### 1. **Functional Components with Hooks**
```typescript
export const ComponentName: React.FC = () => {
  const [state, setState] = useState(initialValue);
  const customData = useCustomHook();
  
  return <div>Component content</div>;
};
```

### 2. **Conditional Rendering**
```typescript
// Ternary operator
{isLoading ? <Spinner /> : <Content />}

// Logical AND
{error && <ErrorMessage />}

// Early return
if (isAuthenticated) return <Navigate to="/dashboard" />;
```

### 3. **Event Handling**
```typescript
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle form submission
};

const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const { name, value } = e.target;
  setFormData(prev => ({ ...prev, [name]: value }));
};
```

### 4. **State Management Patterns**
```typescript
// Object state update
setFormData(prev => ({ ...prev, [name]: value }));

// Array state update
setItems(prev => [...prev, newItem]);

// Conditional state update
if (errors[name]) {
  setErrors(prev => ({ ...prev, [name]: '' }));
}
```

This architecture demonstrates modern React development with TypeScript, providing type safety, reusable logic, and maintainable code structure!