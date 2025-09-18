import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, Lock, AlertCircle, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const { isAuthenticated, loginUser } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const success = await loginUser(formData.username, formData.password);
      
      if (success) {
        navigate('/dashboard');
      } else {
        setLoginError('Invalid email or password. Try: demo@example.com / password123');
      }
    } catch (error) {
      setLoginError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
  
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setLoginError('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-4 space-y-6 sm:space-y-8 p-6 sm:p-8 bg-[#000] text-[springgreen] rounded-xl shadow-lg">

  <div className="text-center">
    <User className="mx-auto h-12 w-12 text-[springgreen]" />
    <h2 className="mt-4 text-2xl sm:text-3xl font-bold text-[springgreen]">Welcome Back</h2>
    <p className="mt-2 text-sm sm:text-base text-[springgreen]">
      Sign in to your account to continue
    </p>
  </div>
  
  <div className="bg-[#000] border border-[springgreen] p-3 sm:p-4 rounded-lg">
    <p className="text-xs sm:text-sm text-[springgreen]">
      <strong>Demo Credentials:</strong><br />
      Email: demo@example.com<br />
      Password: password123
    </p>
  </div>

  <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
    {loginError && (
      <div className="flex items-start p-3 text-[springgreen] bg-[#111] border border-[springgreen] rounded-lg">
        <AlertCircle className="h-4 w-4 mr-2 text-[springgreen]" />
        <span className="text-xs sm:text-sm">{loginError}</span>
      </div>
    )}
    
    <div className="space-y-4 sm:space-y-6">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-[springgreen] mb-1">
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-[springgreen]" />
          </div>
          <input
            id="username"
            name="username"
            type="email"
            autoComplete="email"
            required
            className={`appearance-none relative block w-full px-10 py-3 border border-[springgreen] placeholder-[springgreen] text-[springgreen] bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[springgreen] focus:border-transparent text-sm sm:text-base`}
            placeholder="Enter your email"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        {errors.username && (
          <p className="mt-1 text-sm text-[springgreen]">{errors.username}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-[springgreen] mb-1">
          Password
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-[springgreen]" />
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className={`appearance-none relative block w-full px-10 py-3 border border-[springgreen] placeholder-[springgreen] text-[springgreen] bg-black rounded-lg focus:outline-none focus:ring-2 focus:ring-[springgreen] focus:border-transparent text-sm sm:text-base`}
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        {errors.password && (
          <p className="mt-1 text-sm text-[springgreen]">{errors.password}</p>
        )}
      </div>
    </div>

    <button
      type="submit"
      disabled={loading}
      className="group relative w-full flex justify-center py-3 px-4 border border-[springgreen] text-sm sm:text-base font-medium rounded-lg text-black bg-[springgreen] hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[springgreen] disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-h-[48px]"
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-2 animate-spin text-black" />
          Signing in...
        </>
      ) : (
        'Sign in'
      )}
    </button>
  </form>
</div>

    </div>
  );
};