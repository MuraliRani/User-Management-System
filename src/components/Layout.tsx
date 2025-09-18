import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { User, LogOut, Home, CheckSquare, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

export const Layout: React.FC = () => {
  const { user, logoutUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
    setMobileMenuOpen(false);
  };

  const navigationItems = [
    { path: '/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/todos', icon: CheckSquare, label: 'Todos' },
    { path: '/profile', icon: Settings, label: 'Profile' },
  ];

  return (
   <div className="min-h-screen bg-gradient-to-r from-purple-100 via-pink-100 to-red-100">
      <nav className="bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 shadow-sm border-b">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex items-center">
                <User className="h-8 w-8 text-blue-600" />
                <span className="ml-2 text-lg sm:text-xl font-semibold text-gray-900">User Management System</span>
              </div>
              
              <div className="hidden md:flex ml-8 space-x-4">
                {navigationItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      location.pathname === path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
            
       
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600 max-w-[10rem] whitespace-nowrap overflow-hidden text-ellipsis">
                Welcome, {user?.username}
              </span>
  
            <button onClick={handleLogout}
            className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-700 rounded-md transition-colors">
            <LogOut className="h-5 w-5 mr-2 text-white" />
            Logout
            </button>
</div>

            
            
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
      
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navigationItems.map(({ path, icon: Icon, label }) => (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center px-3 py-3 rounded-md text-base font-medium transition-colors ${
                      location.pathname === path
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {label}
                  </Link>
                ))}
              </div>
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="px-3 mb-3">
                  <p className="text-sm text-gray-600 truncate">Welcome, {user?.username}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center w-full px-3 py-3 text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};