import { api } from './api';

export const fivemAPI = {
  // Get all players with their data
  getPlayers: () => api.get('/fivem/players'),

  // Get all vehicles
  getVehicles: () => api.get('/fivem/vehicles'),

  // Get hall of fame data
  getHallOfFame: () => api.get('/fivem/hall-of-fame'),

  // Get enhanced server status
  getServerStatus: () => api.get('/fivem/server-status'),
};
