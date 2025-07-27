import { api } from './api';

export const fivemAPI = {
  // Get all players with their data
  getPlayers: () => api.get('/fivem/get_players.php'),

  // Get all vehicles
  getVehicles: () => api.get('/fivem/get_vehicles.php'),

  // Get hall of fame data
  getHallOfFame: () => api.get('/fivem/get_hall_of_fame.php'),

  // Get enhanced server status
  getServerStatus: () => api.get('/fivem/get_server_status.php'),
};
