import { Shield, UserCheck, Users, UserX } from 'lucide-react';
import Card from '../ui/Card';

const UserManagement = () => {
  // Mock data for demonstration
  const users = [
    { id: 1, username: 'admin', rank: 'owner', status: 'online', lastSeen: '2 minutes ago' },
    { id: 2, username: 'moderator1', rank: 'admin', status: 'online', lastSeen: '5 minutes ago' },
    {
      id: 3,
      username: 'staff_member',
      rank: 'moderator',
      status: 'offline',
      lastSeen: '1 hour ago',
    },
    { id: 4, username: 'helper', rank: 'staff', status: 'offline', lastSeen: '3 hours ago' },
  ];

  const getRankColor = rank => {
    switch (rank) {
      case 'owner':
        return 'text-red-600 bg-red-50';
      case 'admin':
        return 'text-orange-600 bg-orange-50';
      case 'moderator':
        return 'text-blue-600 bg-blue-50';
      case 'staff':
        return 'text-green-600 bg-green-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = status => {
    return status === 'online' ? (
      <UserCheck className="w-4 h-4 text-green-500" />
    ) : (
      <UserX className="w-4 h-4 text-gray-400" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
        <p className="text-gray-600 mt-1">Manage staff members and their permissions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{users.length}</p>
              </div>
              <div className="p-3 rounded-lg text-blue-600 bg-blue-50">
                <Users className="w-6 h-6" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {users.filter(u => u.status === 'online').length}
                </p>
              </div>
              <div className="p-3 rounded-lg text-green-600 bg-green-50">
                <UserCheck className="w-6 h-6" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Offline</p>
                <p className="text-2xl font-bold text-gray-600 mt-1">
                  {users.filter(u => u.status === 'offline').length}
                </p>
              </div>
              <div className="p-3 rounded-lg text-gray-600 bg-gray-50">
                <UserX className="w-6 h-6" />
              </div>
            </div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Admins</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {users.filter(u => ['owner', 'admin'].includes(u.rank)).length}
                </p>
              </div>
              <div className="p-3 rounded-lg text-orange-600 bg-orange-50">
                <Shield className="w-6 h-6" />
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold text-gray-900">Staff Members</h3>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Seen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-700">
                              {user.username.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div className="ml-3">
                          <div className="text-sm font-medium text-gray-900">{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRankColor(user.rank)}`}
                      >
                        {user.rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(user.status)}
                        <span
                          className={`ml-2 text-sm ${user.status === 'online' ? 'text-green-600' : 'text-gray-500'}`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.lastSeen}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default UserManagement;
