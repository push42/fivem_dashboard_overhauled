import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Building,
  Car,
  CheckSquare,
  Clock,
  Crown,
  DollarSign,
  MessageSquare,
  Server,
  Shield,
  TrendingUp,
  Users,
} from 'lucide-react';
import { chatAPI, todoAPI } from '../../services/api';
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
    orange: 'text-orange-600 bg-orange-50',
  };

  return (
    <Card className="overflow-hidden">
      <Card.Body className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
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
      trend: '+12%',
    },
    {
      title: 'Total Registered',
      value: fivemStats?.totalUsers || 0,
      icon: Shield,
      color: 'blue',
    },
    {
      title: 'Active Today',
      value: fivemStats?.activeUsers || 0,
      icon: Activity,
      color: 'purple',
    },
    {
      title: 'Total Vehicles',
      value: fivemStats?.totalVehicles || 0,
      icon: Car,
      color: 'orange',
    },
    {
      title: 'Chat Messages',
      value: messageStats?.total || 0,
      icon: MessageSquare,
      color: 'primary',
      trend: '+8%',
    },
    {
      title: 'Task Progress',
      value: `${completionRate}%`,
      subtitle: `${completedTasks}/${totalTasks} completed`,
      icon: CheckSquare,
      color: 'green',
    },
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
            <p className="font-semibold">
              {serverStatus?.players || 0}/{serverStatus?.maxPlayers || 64}
            </p>
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
