import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  Award,
  Building,
  Car,
  Crown,
  DollarSign,
  Medal,
  Trophy,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import { fivemAPI } from '../../services/fivemAPI';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const LeaderboardCard = ({
  title,
  data,
  icon: Icon,
  color,
  valueKey,
  valueFormatter,
  emptyMessage,
}) => {
  const colorClasses = {
    gold: 'from-yellow-400 to-yellow-600',
    green: 'from-green-400 to-green-600',
    blue: 'from-blue-400 to-blue-600',
    purple: 'from-purple-400 to-purple-600',
    red: 'from-red-400 to-red-600',
  };

  const getRankIcon = index => {
    switch (index) {
      case 0:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 1:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 2:
        return <Award className="w-5 h-5 text-orange-500" />;
      default:
        return <span className="text-gray-600 font-bold">#{index + 1}</span>;
    }
  };

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center space-x-2">
          <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color]} text-white`}>
            <Icon className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-semibold">{title}</h3>
        </div>
      </Card.Header>
      <Card.Body>
        {data && data.length > 0 ? (
          <div className="space-y-3">
            {data.slice(0, 10).map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getRankIcon(index)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.firstname && item.lastname
                        ? `${item.firstname} ${item.lastname}`
                        : item.company_name || item.gang_name || 'Unknown'}
                    </p>
                    {item.identifier && <p className="text-xs text-gray-500">{item.identifier}</p>}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">
                    {valueFormatter ? valueFormatter(item[valueKey]) : item[valueKey]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Icon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>{emptyMessage}</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const HallOfFame = () => {
  const [activeTab, setActiveTab] = useState('players');

  const {
    data: hallOfFameData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['hallOfFame'],
    queryFn: async () => {
      const response = await fivemAPI.getHallOfFame();
      return response.data.hall_of_fame;
    },
    refetchInterval: 300000, // 5 minutes
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
        <p className="text-red-600">Failed to load hall of fame data</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'players', label: 'Players', icon: Users },
    { id: 'organizations', label: 'Organizations', icon: Building },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Trophy className="w-6 h-6 mr-2 text-yellow-500" />
            Hall of Fame
          </h2>
          <p className="text-gray-600 mt-1">Top performers across different categories</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'players' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardCard
            title="Richest Players"
            data={hallOfFameData?.richest}
            icon={DollarSign}
            color="gold"
            valueKey="total_money"
            valueFormatter={value => `$${parseInt(value || 0).toLocaleString()}`}
            emptyMessage="No player wealth data available"
          />

          <LeaderboardCard
            title="Most Vehicles Owned"
            data={hallOfFameData?.most_vehicles}
            icon={Car}
            color="blue"
            valueKey="vehicle_count"
            valueFormatter={value => `${value} vehicle${value !== 1 ? 's' : ''}`}
            emptyMessage="No vehicle ownership data available"
          />

          <LeaderboardCard
            title="Most Active Players"
            data={hallOfFameData?.most_active}
            icon={Activity}
            color="green"
            valueKey="last_seen_formatted"
            valueFormatter={value => (value ? new Date(value).toLocaleDateString() : 'Never')}
            emptyMessage="No activity data available"
          />
        </div>
      )}

      {activeTab === 'organizations' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LeaderboardCard
            title="Richest Companies"
            data={hallOfFameData?.richest_companies}
            icon={Building}
            color="purple"
            valueKey="money"
            valueFormatter={value => `$${parseInt(value || 0).toLocaleString()}`}
            emptyMessage="No company data available"
          />

          {hallOfFameData?.richest_gangs && hallOfFameData.richest_gangs.length > 0 && (
            <LeaderboardCard
              title="Richest Gangs"
              data={hallOfFameData.richest_gangs}
              icon={Users}
              color="red"
              valueKey="money"
              valueFormatter={value => `$${parseInt(value || 0).toLocaleString()}`}
              emptyMessage="No gang data available"
            />
          )}
        </div>
      )}

      {/* Summary Stats */}
      <Card>
        <Card.Header>
          <h3 className="text-lg font-semibold flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Quick Stats
          </h3>
        </Card.Header>
        <Card.Body>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {hallOfFameData?.richest?.[0]
                  ? `$${parseInt(hallOfFameData.richest[0].total_money || 0).toLocaleString()}`
                  : '$0'}
              </div>
              <div className="text-sm text-gray-600">Highest Wealth</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {hallOfFameData?.most_vehicles?.[0]?.vehicle_count || 0}
              </div>
              <div className="text-sm text-gray-600">Most Vehicles</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {hallOfFameData?.richest_companies?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Companies</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {hallOfFameData?.richest_gangs?.length || 0}
              </div>
              <div className="text-sm text-gray-600">Active Gangs</div>
            </div>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HallOfFame;
