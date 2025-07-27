import { useQuery } from '@tanstack/react-query';
import { Car, Filter, Hash, Package, Palette, Search, User } from 'lucide-react';
import { useState } from 'react';
import { fivemAPI } from '../../services/fivemAPI';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../ui/LoadingSpinner';

const VehicleCard = ({ vehicle }) => {
  const getStorageStatus = stored => {
    return stored === 1 ? 'Garage' : 'Out';
  };

  const getStorageColor = stored => {
    return stored === 1 ? 'text-green-600 bg-green-100' : 'text-orange-600 bg-orange-100';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <Card.Body className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white">
                <Car className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-lg">
                  {vehicle.model || 'Unknown Vehicle'}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Hash className="w-3 h-3" />
                  <span className="font-mono">{vehicle.plate}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Owner Info */}
              {vehicle.owner_name && vehicle.owner_name.trim() && (
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-600">Owner:</span>
                  <span className="font-medium text-gray-900">{vehicle.owner_name}</span>
                </div>
              )}

              {/* Vehicle Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStorageColor(vehicle.stored)}`}
                  >
                    <Package className="w-3 h-3 inline mr-1" />
                    {getStorageStatus(vehicle.stored)}
                  </span>
                </div>

                {vehicle.color && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Color</p>
                    <div className="flex items-center space-x-2">
                      <Palette className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">#{vehicle.color}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Owner ID for debugging/admin */}
              <div className="pt-2 border-t">
                <p className="text-xs text-gray-500">
                  Owner ID: <span className="font-mono text-gray-700">{vehicle.owner}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

const VehicleManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const {
    data: vehiclesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['fivemVehicles'],
    queryFn: async () => {
      const response = await fivemAPI.getVehicles();
      return response.data;
    },
    refetchInterval: 60000, // 1 minute
  });

  const vehicles = vehiclesData?.vehicles || [];

  // Filter vehicles
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch =
      !searchTerm ||
      (vehicle.model && vehicle.model.toLowerCase().includes(searchTerm.toLowerCase())) ||
      vehicle.plate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (vehicle.owner_name && vehicle.owner_name.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus =
      filterStatus === '' ||
      (filterStatus === 'garage' && vehicle.stored === 1) ||
      (filterStatus === 'out' && vehicle.stored !== 1);

    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalVehicles = vehicles.length;
  const vehiclesInGarage = vehicles.filter(v => v.stored === 1).length;
  const vehiclesOut = totalVehicles - vehiclesInGarage;

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
        <p className="text-red-600">Failed to load vehicles data</p>
        <p className="text-sm text-gray-500 mt-2">{error.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Car className="w-6 h-6 mr-2" />
            Vehicle Management
          </h2>
          <p className="text-gray-600 mt-1">
            {filteredVehicles.length} of {totalVehicles} vehicles
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <Card.Body className="p-6 text-center">
            <div className="text-3xl font-bold text-gray-900 mb-2">{totalVehicles}</div>
            <div className="text-sm text-gray-600">Total Vehicles</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{vehiclesInGarage}</div>
            <div className="text-sm text-gray-600">In Garage</div>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body className="p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">{vehiclesOut}</div>
            <div className="text-sm text-gray-600">Currently Out</div>
          </Card.Body>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <Card.Body className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by model, plate, or owner..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <select
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Status</option>
                <option value="garage">In Garage</option>
                <option value="out">Currently Out</option>
              </select>
              <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredVehicles.map((vehicle, index) => (
          <VehicleCard key={`${vehicle.plate}-${index}`} vehicle={vehicle} />
        ))}
      </div>

      {filteredVehicles.length === 0 && (searchTerm || filterStatus) && (
        <div className="text-center py-12">
          <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">No vehicles match your search criteria</p>
          <Button
            variant="ghost"
            onClick={() => {
              setSearchTerm('');
              setFilterStatus('');
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

export default VehicleManagement;
