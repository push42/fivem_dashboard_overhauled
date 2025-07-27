import {
  Car,
  CheckSquare,
  Crown,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Server,
  Settings,
  Shield,
  Trophy,
  User,
  Users,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import { showToast } from '../ui/Toast';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    {
      name: 'Overview',
      href: '/dashboard',
      icon: Home,
      current: location.pathname === '/dashboard',
    },
    {
      name: 'Players',
      href: '/dashboard/players',
      icon: Users,
      current: location.pathname === '/dashboard/players',
    },
    {
      name: 'Vehicles',
      href: '/dashboard/vehicles',
      icon: Car,
      current: location.pathname === '/dashboard/vehicles',
    },
    {
      name: 'Hall of Fame',
      href: '/dashboard/hall-of-fame',
      icon: Trophy,
      current: location.pathname === '/dashboard/hall-of-fame',
    },
    {
      name: 'Chat',
      href: '/dashboard/chat',
      icon: MessageSquare,
      current: location.pathname === '/dashboard/chat',
    },
    {
      name: 'Todo',
      href: '/dashboard/todo',
      icon: CheckSquare,
      current: location.pathname === '/dashboard/todo',
    },
    {
      name: 'Server Status',
      href: '/dashboard/server',
      icon: Server,
      current: location.pathname === '/dashboard/server',
    },
    {
      name: 'User Management',
      href: '/dashboard/users',
      icon: Shield,
      current: location.pathname === '/dashboard/users',
    },
    {
      name: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
      current: location.pathname === '/dashboard/settings',
    },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      showToast('success', 'Logged out successfully');
    } catch (error) {
      showToast('error', 'Error logging out');
    }
  };

  const getRankIcon = rank => {
    if (rank === 'admin' || rank === 'owner') {
      return <Crown className="w-4 h-4 text-yellow-500" />;
    }
    return <User className="w-4 h-4 text-gray-500" />;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="flex items-center justify-between flex-shrink-0 h-16 px-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-r from-primary-600 to-purple-600">
              <Server className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FiveM Dashboard</span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 lg:hidden hover:text-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* User info */}
        <div className="flex-shrink-0 p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <img
              src={user?.avatar_url || '/img/default_avatar.png'}
              alt="Avatar"
              className="object-cover w-10 h-10 border-2 border-gray-200 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium text-gray-900 truncate">{user?.username}</p>
                {getRankIcon(user?.rank)}
              </div>
              <p className="text-xs text-gray-500 capitalize">{user?.rank || 'User'}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {navigation.map(item => (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`
                group flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200
                ${
                  item.current
                    ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon
                className={`
                  mr-3 h-5 w-5 transition-colors duration-200
                  ${item.current ? 'text-primary-600' : 'text-gray-400 group-hover:text-gray-600'}
                `}
              />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Logout button */}
        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <Button
            onClick={handleLogout}
            variant="ghost"
            className="justify-start w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center h-16 px-4 bg-white border-b border-gray-200 shadow-sm gap-x-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex justify-between flex-1">
            <div className="flex items-center space-x-4">
              <h1 className="text-lg font-semibold text-gray-900">
                {navigation.find(item => item.current)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Online Users: <span className="font-medium text-green-600">12</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 overflow-y-auto sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
