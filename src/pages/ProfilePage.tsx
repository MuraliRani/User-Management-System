import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { User, Mail, Save, AlertCircle, CheckCircle } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
      });
    }
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!formData.email.includes('@')) {
      newErrors.email = 'Please enter a valid email';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    
    if (!validateForm()) return;
    
    updateUserProfile(formData);
    setSuccess(true);
    
    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-sm rounded-lg sm:rounded-xl p-6 sm:p-8">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 rounded-full p-3">
            <User className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
          </div>
          <div className="ml-4">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage your personal information</p>
          </div>
        </div>

        {success && (
          <div className="mb-6 flex items-start p-3 sm:p-4 text-green-700 bg-green-50 rounded-lg">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 mr-2 flex-shrink-0 mt-0.5" />
            <span className="text-sm sm:text-base">Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                className={`w-full pl-10 pr-3 py-3 border ${
                  errors.username ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base`}
                placeholder="Enter your username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            {errors.username && (
              <div className="mt-1 flex items-start text-red-600">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{errors.username}</span>
              </div>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                required
                className={`w-full pl-10 pr-3 py-3 border ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base`}
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && (
              <div className="mt-1 flex items-start text-red-600">
                <AlertCircle className="h-4 w-4 mr-1 flex-shrink-0 mt-0.5" />
                <span className="text-sm">{errors.email}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 sm:pt-6">
            <button
              type="submit"
              className="flex items-center px-4 sm:px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-sm sm:text-base min-h-[48px]"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};