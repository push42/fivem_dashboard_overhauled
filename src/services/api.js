import axios from 'axios';

// Create axios instance with default config
export const api = axios.create({
  baseURL: '/api', // Adjust based on your PHP API structure
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  withCredentials: true, // Important for session-based auth
});

// Request interceptor for adding auth tokens if needed
api.interceptors.request.use(
  config => {
    // Add any auth headers here if using tokens
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors globally
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.warn('Access denied');
    } else if (error.response?.status >= 500) {
      // Server errors
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

// API endpoint functions
export const authAPI = {
  login: credentials => api.post('/login_handler.php', credentials),
  register: userData => api.post('/register.php', userData),
  logout: () => api.post('/logout.php'),
  checkAuth: () => api.get('/check-auth.php'),
  updateProfile: userData => api.put('/update_profile.php', userData),
};

export const chatAPI = {
  getMessages: () => api.get('/get_messages.php'),
  sendMessage: messageData => api.post('/save_message.php', messageData),
  getOnlineUsers: () => api.get('/get_online_users.php'),
  getMostActiveUser: () => api.get('/get_most_present_username.php'),
  getMessageStats: () => api.get('/fetch_messages.php'),
  joinChat: userData => api.post('/join_or_leave_chat.php', userData),
};

export const todoAPI = {
  getTasks: () => api.get('/get_tasks.php'),
  addTask: taskData => api.post('/save_task.php', taskData),
  updateTask: (taskId, taskData) => api.put(`/update_task.php?id=${taskId}`, taskData),
  deleteTask: taskId => api.delete('/delete_task.php', { data: { taskId } }),
  toggleTask: taskId => api.post('/toggle_task_completion.php', { taskId }),
};

export const serverAPI = {
  getStatus: () => api.get('/server_status.php'),
  getPlayers: () => api.get('/get_players.php'),
  restartServer: () => api.post('/restart_server.php'),
  getServerInfo: () => api.get('/server_info.php'),
};

export const userAPI = {
  updateAvatar: avatarData => api.post('/update_avatar.php', avatarData),
  updateUsername: usernameData => api.post('/update_username.php', usernameData),
  heartbeat: () => api.post('/heartbeat.php'),
};
