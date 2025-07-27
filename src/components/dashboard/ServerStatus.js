import { useQuery } from '@tanstack/react-query';
import { AlertCircle, Server, Users, Wifi } from 'lucide-react';
import { serverAPI } from '../../services/api';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const ServerStatus = () => {
  const {
    data: serverStatus,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['serverStatus'],
    queryFn: async () => {
      const response = await serverAPI.getStatus();
      return response.data;
    },
    refetchInterval: 10000, // Refetch every 10 seconds
  });

  const getStatusColor = isOnline => {
    return isOnline ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50';
  };

  const getStatusIcon = isOnline => {
    return isOnline ? (
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
    ) : (
      <div className="w-3 h-3 bg-red-500 rounded-full" />
    );
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading server status</h3>
          <p className="text-gray-600">Please check your server configuration</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Server Status</h2>
        <p className="text-gray-600 mt-1">Monitor your FiveM server performance and status</p>
      </div>

      {/* Server Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Status */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Server Status</p>
                <div className="flex items-center space-x-2 mt-2">
                  {isLoading ? <LoadingSpinner size="sm" /> : getStatusIcon(serverStatus?.online)}
                  <span className="text-lg font-semibold text-gray-900">
                    {isLoading ? 'Checking...' : serverStatus?.online ? 'Online' : 'Offline'}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${getStatusColor(serverStatus?.online)}`}>
                <Server className="w-6 h-6" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Player Count */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Players Online</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {isLoading ? '...' : serverStatus?.playerCount || 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">/ {serverStatus?.maxPlayers || 64} max</p>
              </div>
              <div className="p-3 rounded-lg text-blue-600 bg-blue-50">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Connection */}
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Connection</p>
                <p className="text-lg font-semibold text-gray-900 mt-1">
                  {isLoading
                    ? 'Checking...'
                    : serverStatus?.ping
                      ? `${serverStatus.ping}ms`
                      : 'N/A'}
                </p>
                <p className="text-sm text-gray-500 mt-1">Latency</p>
              </div>
              <div className="p-3 rounded-lg text-purple-600 bg-purple-50">
                <Wifi className="w-6 h-6" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Detailed Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Server Information */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Server Information</h3>
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Server Name:</span>
                  <span className="font-medium text-gray-900">
                    {serverStatus?.serverName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Version:</span>
                  <span className="font-medium text-gray-900">
                    {serverStatus?.version || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Uptime:</span>
                  <span className="font-medium text-gray-900">{serverStatus?.uptime || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Game Mode:</span>
                  <span className="font-medium text-gray-900">
                    {serverStatus?.gameMode || 'N/A'}
                  </span>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Resource Usage */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Resource Usage</h3>
          </Card.Header>
          <Card.Body>
            {isLoading ? (
              <div className="flex items-center justify-center h-32">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">CPU Usage</span>
                    <span className="font-medium">{serverStatus?.cpu || '0'}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${serverStatus?.cpu || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Memory Usage</span>
                    <span className="font-medium">{serverStatus?.memory || '0'}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${serverStatus?.memory || 0}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Network I/O</span>
                    <span className="font-medium">{serverStatus?.network || '0'} MB/s</span>
                  </div>
                  <div className="w-ull bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((serverStatus?.network || 0) * 10, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ServerStatus;
