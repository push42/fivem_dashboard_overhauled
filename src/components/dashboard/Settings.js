import { Bell, Camera, Globe, Key, Palette, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { showToast } from '../ui/Toast';

const Settings = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    username: user?.username || '',
    avatar_url: user?.avatar_url || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'security', name: 'Security', icon: Key },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'appearance', name: 'Appearance', icon: Palette },
    { id: 'general', name: 'General', icon: Globe },
  ];

  const handleInputChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleProfileUpdate = async e => {
    e.preventDefault();
    try {
      // Here you would make an API call to update the profile
      updateUser({
        username: formData.username,
        avatar_url: formData.avatar_url,
      });
      showToast('success', 'Profile updated successfully');
    } catch (error) {
      showToast('error', 'Failed to update profile');
    }
  };

  const handlePasswordChange = async e => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      showToast('error', 'Passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      showToast('error', 'Password must be at least 6 characters');
      return;
    }

    try {
      // Here you would make an API call to change the password
      showToast('success', 'Password changed successfully');
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }));
    } catch (error) {
      showToast('error', 'Failed to change password');
    }
  };

  const renderProfileTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Profile Information</h3>
        <p className="text-sm text-gray-600 mt-1">Update your profile information and avatar.</p>
      </div>

      <form onSubmit={handleProfileUpdate} className="space-y-6">
        {/* Avatar */}
        <div>
          <label className="form-label">Avatar</label>
          <div className="flex items-center space-x-4">
            <img
              src={formData.avatar_url || '/img/default_avatar.png'}
              alt="Avatar"
              className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
            />
            <div className="flex-1">
              <input
                type="url"
                name="avatar_url"
                value={formData.avatar_url}
                onChange={handleInputChange}
                placeholder="https://example.com/avatar.jpg"
                className="form-input"
              />
              <p className="text-xs text-gray-500 mt-1">Enter a URL to your avatar image</p>
            </div>
          </div>
        </div>

        {/* Username */}
        <div>
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <Button type="submit">
          <Camera className="w-4 h-4 mr-2" />
          Update Profile
        </Button>
      </form>
    </div>
  );

  const renderSecurityTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Security Settings</h3>
        <p className="text-sm text-gray-600 mt-1">
          Change your password and manage security settings.
        </p>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-6">
        <div>
          <label htmlFor="currentPassword" className="form-label">
            Current Password
          </label>
          <input
            type="password"
            id="currentPassword"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div>
          <label htmlFor="newPassword" className="form-label">
            New Password
          </label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className="form-input"
            required
            minLength={6}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="form-label">
            Confirm New Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="form-input"
            required
            minLength={6}
          />
        </div>

        <Button type="submit">
          <Key className="w-4 h-4 mr-2" />
          Change Password
        </Button>
      </form>
    </div>
  );

  const renderNotificationsTab = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900">Notification Preferences</h3>
        <p className="text-sm text-gray-600 mt-1">
          Configure how you want to receive notifications.
        </p>
      </div>

      <div className="space-y-4">
        {[
          {
            id: 'chat',
            label: 'Chat Messages',
            description: 'Get notified about new chat messages',
          },
          {
            id: 'server',
            label: 'Server Status',
            description: 'Alerts about server status changes',
          },
          {
            id: 'tasks',
            label: 'Task Updates',
            description: 'Notifications about task completions',
          },
          {
            id: 'users',
            label: 'User Activity',
            description: 'Alerts about user logins and activity',
          },
        ].map(notification => (
          <div
            key={notification.id}
            className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
          >
            <div>
              <h4 className="text-sm font-medium text-gray-900">{notification.label}</h4>
              <p className="text-sm text-gray-500">{notification.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileTab();
      case 'security':
        return renderSecurityTab();
      case 'notifications':
        return renderNotificationsTab();
      case 'appearance':
        return (
          <div className="text-center py-12">
            <Palette className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Appearance Settings</h3>
            <p className="text-gray-600">Theme and appearance customization coming soon.</p>
          </div>
        );
      case 'general':
        return (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">General Settings</h3>
            <p className="text-gray-600">General application settings coming soon.</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Body className="p-0">
              <nav className="space-y-1">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-none border-r-2 transition-colors ${
                      activeTab === tab.id
                        ? 'bg-primary-50 text-primary-700 border-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 border-transparent'
                    }`}
                  >
                    <tab.icon
                      className={`mr-3 h-5 w-5 ${
                        activeTab === tab.id ? 'text-primary-600' : 'text-gray-400'
                      }`}
                    />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </Card.Body>
          </Card>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <Card>
            <Card.Body className="p-6">{renderContent()}</Card.Body>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Settings;
