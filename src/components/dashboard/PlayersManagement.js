import { useQuery } from '@tanstack/react-query';
import { Briefcase, Clock, DollarSign, Eye, Filter, Search, Shield, Users } from 'lucide-react';
import { useState } from 'react';
import { fivemAPI } from '../../services/fivemAPI';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const PlayerCard = ({ player }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getJobBadgeColor = job => {
    const jobColors = {
      police: 'bg-blue-100 text-blue-800',
      ambulance: 'bg-red-100 text-red-800',
      mechanic: 'bg-yellow-100 text-yellow-800',
      taxi: 'bg-purple-100 text-purple-800',
      unemployed: 'bg-gray-100 text-gray-800',
    };
    return jobColors[job] || 'bg-green-100 text-green-800';
  };

  const getGroupBadgeColor = group => {
    const groupColors = {
      admin: 'bg-red-100 text-red-800',
      moderator: 'bg-orange-100 text-orange-800',
      vip: 'bg-purple-100 text-purple-800',
      user: 'bg-gray-100 text-gray-800',
    };
    return groupColors[group] || 'bg-gray-100 text-gray-800';
  };

  const totalMoney = (player.money || 0) + (player.bank || 0);
  const lastSeen = player.last_seen_formatted
    ? new Date(player.last_seen_formatted).toLocaleDateString()
    : 'Never';

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Card.Body className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {player.firstname?.[0]}
                {player.lastname?.[0]}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">
                  {player.firstname} {player.lastname}
                </h3>
                <p className="text-sm text-gray-600">{player.identifier}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getJobBadgeColor(player.job)}`}
              >
                <Briefcase className="w-3 h-3 inline mr-1" />
                {player.job} (Grade {player.job_grade})
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getGroupBadgeColor(player.group)}`}
              >
                <Shield className="w-3 h-3 inline mr-1" />
                {player.group}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Total Money</p>
                <p className="font-semibold text-green-600 flex items-center">
                  <DollarSign className="w-4 h-4 mr-1" />${totalMoney.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Last Seen</p>
                <p className="font-semibold flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {lastSeen}
                </p>
              </div>
            </div>

            {showDetails && (
              <div className="mt-4 pt-4 border-t space-y-2">
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Cash</p>
                    <p className="font-semibold">${(player.money || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Bank</p>
                    <p className="font-semibold">${(player.bank || 0).toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Black Money</p>
                    <p className="font-semibold text-red-600">
                      ${(player.black_money || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
                {player.position && (
                  <div>
                    <p className="text-gray-600 text-sm">Last Position</p>
                    <p className="text-xs text-gray-500 font-mono">{player.position}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="small"
            onClick={() => setShowDetails(!showDetails)}
            className="ml-4"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

const PlayersManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJob, setFilterJob] = useState('');
  const [filterGroup, setFilterGroup] = useState('');

  const {
    data: playersData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fivemPlayers'],
    queryFn: async () => {
      const response = await fivemAPI.getPlayers();
      return response.data;
    },
    refetchInterval: 60000, // 1 minute
  });

  const players = playersData?.players || [];

  // Get unique jobs and groups for filters
  const uniqueJobs = [...new Set(players.map(p => p.job).filter(Boolean))];
  const uniqueGroups = [...new Set(players.map(p => p.group).filter(Boolean))];

  // Filter players
  const filteredPlayers = players.filter(player => {
    const matchesSearch =
      !searchTerm ||
      `${player.firstname} ${player.lastname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.identifier.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesJob = !filterJob || player.job === filterJob;
    const matchesGroup = !filterGroup || player.group === filterGroup;

    return matchesSearch && matchesJob && matchesGroup;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">Failed to load players data</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2" />
            Players Management
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredPlayers.length} of {players.length} players
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search players..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Job Filter */}
            <div className="relative">
              <select
                value={filterJob}
                onChange={e => setFilterJob(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Jobs</option>
                {uniqueJobs.map(job => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>

            {/* Group Filter */}
            <div className="relative">
              <select
                value={filterGroup}
                onChange={e => setFilterGroup(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Groups</option>
                {uniqueGroups.map(group => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Players Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredPlayers.map(player => (
          <PlayerCard key={player.identifier} player={player} />
        ))}
      </div>

      {filteredPlayers.length === 0 && searchTerm && (
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No players match your search criteria</p>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setFilterJob('');
              setFilterGroup('');
            }}
            className="mt-2"
          >
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default PlayersManagement;
