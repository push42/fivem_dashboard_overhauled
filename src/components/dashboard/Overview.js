import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Users,
  MessageSquare,
  CheckSquare,
  Server,
  Activity,
  TrendingUp,
  Clock,
  Shield,
  Car,
  DollarSign,
  Crown,
  Building
} from 'lucide-react';
import { chatAPI, todoAPI, serverAPI } from '../../services/api';
import { fivemAPI } from '../../services/fivemAPI';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const StatCard = ({ title, value, icon: Icon, color = 'primary', trend, subtitle }) => {
  const colorClasses = {
    primary: 'text-primary-600 bg-primary-50',
    green: 'text-green-600 bg-green-50',
    blue: 'text-blue-600 bg-blue-50',
    purple: 'text-purple-600 bg-purple-50',
    yellow: 'text-yellow-600 bg-yellow-50',
    red: 'text-red-600 bg-red-50',
    orange: 'text-orange-600 bg-orange-50'
  };

  return (
    <Card className="overflow-hidden">
      <Card.Body className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && (
              <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
            )}
            {trend && (
              <div className="flex items-center mt-2 text-sm">
                <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">{trend}</span>
                <span className="text-gray-500 ml-1">from last week</span>
              </div>
            )}
          </div>
          <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const QuickStatsGrid = ({ onlineUsers, messageStats, tasks, fivemStats }) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      title: 'Players Online',
      value: fivemStats?.players || 0,
      subtitle: `/ ${fivemStats?.maxPlayers || 64}`,
      icon: Users,
      color: fivemStats?.online ? 'green' : 'red',
      trend: '+12%'
    },
    {
      title: 'Total Registered',
      value: fivemStats?.totalUsers || 0,
      icon: Shield,
      color: 'blue'
    },
    {
      title: 'Active Today',
      value: fivemStats?.activeUsers || 0,
      icon: Activity,
      color: 'purple'
    },
    {
      title: 'Total Vehicles',
      value: fivemStats?.totalVehicles || 0,
      icon: Car,
      color: 'orange'
    },
    {
      title: 'Chat Messages',
      value: messageStats?.total || 0,
      icon: MessageSquare,
      color: 'primary',
      trend: '+8%'
    },
    {
      title: 'Task Progress',
      value: `${completionRate}%`,
      subtitle: `${completedTasks}/${totalTasks} completed`,
      icon: CheckSquare,
      color: 'green'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
};

const ServerStatusCard = ({ serverStatus }) => {
  const isOnline = serverStatus?.online;

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center space-x-2">
          <Server className="w-5 h-5" />
          <h3 className="text-lg font-semibold">FiveM Server Status</h3>
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className={`font-semibold ${isOnline ? 'text-green-600' : 'text-red-600'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Players</p>
            <p className="font-semibold">{serverStatus?.players || 0}/{serverStatus?.maxPlayers || 64}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Version</p>
            <p className="font-semibold">{serverStatus?.version || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Uptime</p>
            <p className="font-semibold">{serverStatus?.uptime || 'N/A'}</p>
          </div>
        </div>
        {serverStatus?.lastUpdate && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              Last updated: {new Date(serverStatus.lastUpdate).toLocaleString()}
            </p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const Overview = () => {
  // Fetch various statistics
  const { data: onlineUsers = 0 } = useQuery({
    queryKey: ['onlineUsers'],
    queryFn: async () => {
      const response = await chatAPI.getOnlineUsers();
      return parseInt(response.data) || 0;
    },
    refetchInterval: 30000,
  });

  const { data: messageStats } = useQuery({
    queryKey: ['messageStats'],
    queryFn: async () => {
      const response = await chatAPI.getMessageStats();
      return response.data;
    },
  });

  const { data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const response = await todoAPI.getTasks();
      return response.data.tasks || [];
    },
  });

  const { data: fivemServerStatus, isLoading: fivemLoading } = useQuery({
    queryKey: ['fivemServerStatus'],
    queryFn: async () => {
      const response = await fivemAPI.getServerStatus();
      return response.data.server;
    },
    refetchInterval: 30000,
  });

  const { data: hallOfFame } = useQuery({
    queryKey: ['hallOfFame'],
    queryFn: async () => {
      const response = await fivemAPI.getHallOfFame();
      return response.data.hall_of_fame;
    },
    refetchInterval: 300000, // 5 minutes
  });

  if (fivemLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">FiveM Server Dashboard</h2>
        <div className="text-sm text-gray-500">
          <Clock className="w-4 h-4 inline mr-1" />
          Last updated: {new Date().toLocaleString()}
        </div>
      </div>

      <QuickStatsGrid
        onlineUsers={onlineUsers}
        messageStats={messageStats}
        tasks={tasks}
        fivemStats={fivemServerStatus}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServerStatusCard serverStatus={fivemServerStatus} />

        {hallOfFame && (
          <Card>
            <Card.Header>
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5 text-yellow-500" />
                <h3 className="text-lg font-semibold">Hall of Fame Preview</h3>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="space-y-4">
                {hallOfFame.richest && hallOfFame.richest.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <DollarSign className="w-4 h-4 mr-1 text-green-500" />
                      Richest Player
                    </h4>
                    <p className="text-sm text-gray-600">
                      {hallOfFame.richest[0].firstname} {hallOfFame.richest[0].lastname}
                      <span className="ml-2 font-medium text-green-600">
                        ${parseInt(hallOfFame.richest[0].total_money || 0).toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}

                {hallOfFame.most_vehicles && hallOfFame.most_vehicles.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Car className="w-4 h-4 mr-1 text-blue-500" />
                      Most Vehicles
                    </h4>
                    <p className="text-sm text-gray-600">
                      {hallOfFame.most_vehicles[0].firstname} {hallOfFame.most_vehicles[0].lastname}
                      <span className="ml-2 font-medium text-blue-600">
                        {hallOfFame.most_vehicles[0].vehicle_count} vehicles
                      </span>
                    </p>
                  </div>
                )}

                {hallOfFame.richest_companies && hallOfFame.richest_companies.length > 0 && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Building className="w-4 h-4 mr-1 text-purple-500" />
                      Top Company
                    </h4>
                    <p className="text-sm text-gray-600">
                      {hallOfFame.richest_companies[0].company_name}
                      <span className="ml-2 font-medium text-purple-600">
                        ${parseInt(hallOfFame.richest_companies[0].money || 0).toLocaleString()}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Overview;
      value: messageStats?.totalMessages || 0,
      icon: MessageSquare,
      color: 'blue',
      trend: '+8%'
    },
    {
      title: 'Task Completion',
      value: `${completionRate}%`,
      icon: CheckSquare,
      color: 'purple',
      trend: '+15%'
    },
    {
      title: 'Server Status',
      value: serverLoading ? 'Checking...' : (serverStatus?.online ? 'Online' : 'Offline'),
      icon: Server,
      color: serverStatus?.online ? 'green' : 'red'
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'user_join',
      message: 'New user joined the server',
      time: '2 minutes ago',
      icon: Users,
      color: 'green'
    },
    {
      id: 2,
      type: 'task_complete',
      message: 'Task "Update server config" completed',
      time: '15 minutes ago',
      icon: CheckSquare,
      color: 'blue'
    },
    {
      id: 3,
      type: 'message',
      message: '5 new chat messages received',
      time: '30 minutes ago',
      icon: MessageSquare,
      color: 'purple'
    },
    {
      id: 4,
      type: 'server',
      message: 'Server restart completed successfully',
      time: '1 hour ago',
      icon: Server,
      color: 'green'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-600 mt-1">
          Welcome back! Here's what's happening with your FiveM server.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Server Status */}
        <Card className="lg:col-span-2">
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Server Status</h3>
            </div>
          </Card.Header>
          <Card.Body>
            {serverLoading ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${serverStatus?.online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {serverStatus?.online ? 'Server Online' : 'Server Offline'}
                      </p>
                      <p className="text-sm text-gray-600">
                        {serverStatus?.online ? 'All systems operational' : 'Server is currently down'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {serverStatus?.playerCount || 0}
                    </p>
                    <p className="text-sm text-gray-600">Players</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-900">Uptime</span>
                    </div>
                    <p className="text-lg font-semibold text-blue-900 mt-1">
                      {serverStatus?.uptime || '0h 0m'}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Shield className="w-4 h-4 text-green-600" />
                      <span className="text-sm font-medium text-green-900">Security</span>
                    </div>
                    <p className="text-lg font-semibold text-green-900 mt-1">Active</p>
                  </div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Recent Activity */}
        <Card>
          <Card.Header>
            <div className="flex items-center space-x-2">
              <Activity className="w-5 h-5 text-primary-600" />
              <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div className="divide-y divide-gray-200">
              {recentActivity.map((activity) => {
                const colorClasses = {
                  green: 'text-green-600 bg-green-50',
                  blue: 'text-blue-600 bg-blue-50',
                  purple: 'text-purple-600 bg-purple-50',
                  red: 'text-red-600 bg-red-50'
                };

                return (
                  <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start space-x-3">
                      <div className={`p-1.5 rounded-full ${colorClasses[activity.color]}`}>
                        <activity.icon className="w-3 h-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default Overview;
