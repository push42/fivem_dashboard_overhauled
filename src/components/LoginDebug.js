import { useEffect } from 'react';
import { api } from '../services/api';

const LoginDebug = () => {
  useEffect(() => {
    const testLogin = async () => {
      console.log('Testing login...');
      console.log('API base URL:', api.defaults.baseURL);

      try {
        // Test basic connectivity
        const response = await api.get('/check-auth.php');
        console.log('Auth check response:', response.data);
      } catch (error) {
        console.error('Auth check error:', error);
      }

      try {
        // Test login
        const loginResponse = await api.post('/login_handler.php', {
          username: 'admin',
          password: 'admin123',
        });
        console.log('Login response:', loginResponse.data);
      } catch (error) {
        console.error('Login error:', error);
        console.error('Error details:', {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
          statusText: error.response?.statusText,
        });
      }
    };

    testLogin();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Login Debug Component</h2>
      <p>Check the browser console for debug information.</p>
    </div>
  );
};

export default LoginDebug;
