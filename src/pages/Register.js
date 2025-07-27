import { Eye, EyeOff, Key, Lock, User, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { showToast } from '../components/ui/Toast';
import { useAuth } from '../hooks/useAuth';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirm_password: '',
    security_code: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      showToast('error', 'Username is required');
      return false;
    }

    if (formData.username.length < 3) {
      showToast('error', 'Username must be at least 3 characters');
      return false;
    }

    if (!formData.password) {
      showToast('error', 'Password is required');
      return false;
    }

    if (formData.password.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return false;
    }

    if (formData.password !== formData.confirm_password) {
      showToast('error', 'Passwords do not match');
      return false;
    }

    if (!formData.security_code.trim()) {
      showToast('error', 'Security code is required');
      return false;
    }

    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const result = await register(formData);

      if (result.success) {
        showToast('success', 'Account created successfully! Welcome!');
      } else {
        showToast('error', result.error || 'Registration failed');
      }
    } catch (error) {
      showToast('error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-primary-50 px-4 py-8">
      {/* Background Animation */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-purple-100 rounded-full opacity-20 animate-bounce-gentle"></div>
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-primary-100 rounded-full opacity-20 animate-bounce-gentle delay-75"></div>
      </div>

      <div className="relative w-full max-w-md">
        <Card className="shadow-2xl border-0 backdrop-blur-sm bg-white/95">
          <Card.Body className="p-8">
            {/* Logo/Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-600 to-primary-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h1>
              <p className="text-gray-600">Join the FiveM Dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onChange={handleChange}
                    className="form-input pl-10 pr-4 py-3 rounded-lg"
                    placeholder="Choose a username"
                    disabled={loading}
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    className="form-input pl-10 pr-12 py-3 rounded-lg"
                    placeholder="Create a password"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label htmlFor="confirm_password" className="form-label">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm_password"
                    name="confirm_password"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirm_password}
                    onChange={handleChange}
                    className="form-input pl-10 pr-12 py-3 rounded-lg"
                    placeholder="Confirm your password"
                    disabled={loading}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Security Code Field */}
              <div>
                <label htmlFor="security_code" className="form-label">
                  Security Code
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Key className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="security_code"
                    name="security_code"
                    type="text"
                    value={formData.security_code}
                    onChange={handleChange}
                    className="form-input pl-10 pr-4 py-3 rounded-lg"
                    placeholder="Enter security code"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                loading={loading}
                className="w-full py-3 text-base font-semibold"
                size="lg"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>

            {/* Login Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link
                  to="/login"
                  className="font-medium text-primary-600 hover:text-primary-500 transition-colors"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500">
          Made with ❤️ by{' '}
          <a
            href="https://github.com/reverseHaze"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 transition-colors"
          >
            push.42
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;
