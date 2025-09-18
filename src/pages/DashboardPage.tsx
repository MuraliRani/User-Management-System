import { useAuth } from '../hooks/useAuth';
import { useTodos } from '../hooks/useTodos';
import { CheckSquare, User, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { stats } = useTodos();

  const quickStats = [
    {
      label: 'Total Tasks',
      value: stats.total,
      icon: CheckSquare,
      color: 'bg-blue-100 text-blue-600',
      link: '/todos',
    },
    {
      label: 'Completed',
      value: stats.completed,
      icon: BarChart3,
      color: 'bg-green-100 text-green-600',
      link: '/todos',
    },
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-100 text-yellow-600',
      link: '/todos',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-black rounded-xl sm:rounded-2xl p-6 sm:p-8 text-[springgreen]">
  <div className="flex items-center">
    <div className="bg-white bg-opacity-20 rounded-full p-3">
      <User className="h-6 w-6 sm:h-8 sm:w-8 text-[springgreen]" />
    </div>
    <div className="ml-4">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold break-words text-[springgreen]">
        Welcome back, {user?.username}!
      </h1>
      <p className="mt-1 text-sm sm:text-base text-[springgreen]">
        Here's what's happening with your tasks today
      </p>
    </div>
  </div>
</div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickStats.map((stat) => (
          <Link
            key={stat.label}
            to={stat.link}
            className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow active:scale-95 sm:active:scale-100"
          >
            <div className="flex items-center">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              </div>
              <div className="ml-4">
                <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/todos"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <CheckSquare className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">Manage Tasks</h3>
              <p className="text-xs sm:text-sm text-gray-600">View and organize your todo items</p>
            </div>
          </Link>
          
          <Link
            to="/profile"
            className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors active:bg-gray-100"
          >
            <User className="h-5 w-5 text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900 text-sm sm:text-base">Edit Profile</h3>
              <p className="text-xs sm:text-sm text-gray-600">Update your personal information</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};