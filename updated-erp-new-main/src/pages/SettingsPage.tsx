import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout/Layout';
import {
  User,
  Bell,
  Shield,
  Palette,
  Lock,
  Smartphone,
  Mail,
  Eye,
  EyeOff,
} from 'lucide-react';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [settings, setSettings] = useState({
    profile: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      language: 'en',
      timezone: 'UTC+05:30',
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: true,
      whatsappNotifications: true,
      attendanceAlerts: true,
      feeReminders: true,
      marksUpdates: true,
      generalAnnouncements: true,
    },
    security: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      twoFactorAuth: false,
      loginAlerts: true,
    },
    appearance: {
      theme: 'light',
      fontSize: 'medium',
      colorScheme: 'blue',
    },
    privacy: {
      profileVisibility: 'institution',
      contactInfoVisible: true,
      academicInfoVisible: true,
    },
  });

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Lock },
  ];

  // --- RENDER FUNCTIONS (unchanged) ---
  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              value={settings.profile.name}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, name: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              value={settings.profile.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, email: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="tel"
              value={settings.profile.phone}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, phone: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
            <select
              value={settings.profile.language}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, language: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="te">Telugu</option>
              <option value="ta">Tamil</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
            <select
              value={settings.profile.timezone}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  profile: { ...settings.profile, timezone: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="UTC+05:30">India Standard Time (UTC+05:30)</option>
              <option value="UTC+00:00">Greenwich Mean Time (UTC+00:00)</option>
              <option value="UTC-05:00">Eastern Time (UTC-05:00)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Communication Channels</h4>
            <div className="space-y-3">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', icon: Mail },
                { key: 'smsNotifications', label: 'SMS Notifications', icon: Smartphone },
                { key: 'whatsappNotifications', label: 'WhatsApp Notifications', icon: Smartphone },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-700">{item.label}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [item.key]: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Notification Types</h4>
            <div className="space-y-3">
              {[
                { key: 'attendanceAlerts', label: 'Attendance Alerts' },
                { key: 'feeReminders', label: 'Fee Reminders' },
                { key: 'marksUpdates', label: 'Marks Updates' },
                { key: 'generalAnnouncements', label: 'General Announcements' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <span className="text-gray-700">{item.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          notifications: { ...settings.notifications, [item.key]: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Change Password</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={settings.security.currentPassword}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        security: { ...settings.security, currentPassword: e.target.value },
                      })
                    }
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-gray-400" />
                    ) : (
                      <Eye className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={settings.security.newPassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, newPassword: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={settings.security.confirmPassword}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      security: { ...settings.security, confirmPassword: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-3">Security Options</h4>
            <div className="space-y-3">
              {[
                {
                  key: 'twoFactorAuth',
                  label: 'Two-Factor Authentication',
                  description: 'Add an extra layer of security to your account',
                },
                {
                  key: 'loginAlerts',
                  label: 'Login Alerts',
                  description: 'Get notified when someone logs into your account',
                },
              ].map((item) => (
                <div key={item.key} className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{item.label}</div>
                    <div className="text-sm text-gray-600">{item.description}</div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={settings.security[item.key]}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          security: { ...settings.security, [item.key]: e.target.checked },
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Appearance Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Light', preview: 'bg-white border-2' },
                { value: 'dark', label: 'Dark', preview: 'bg-gray-900 border-2' },
                { value: 'auto', label: 'Auto', preview: 'bg-gradient-to-r from-white to-gray-900 border-2' },
              ].map((theme) => (
                <label key={theme.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="theme"
                    value={theme.value}
                    checked={settings.appearance.theme === theme.value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, theme: e.target.value },
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`p-4 rounded-lg border-2 transition-colors ${
                      settings.appearance.theme === theme.value
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-full h-16 rounded ${theme.preview} mb-2`}></div>
                    <div className="text-center text-sm font-medium">{theme.label}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
            <select
              value={settings.appearance.fontSize}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  appearance: { ...settings.appearance, fontSize: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Color Scheme</label>
            <div className="grid grid-cols-4 gap-3">
              {[
                { value: 'blue', color: 'bg-blue-500' },
                { value: 'green', color: 'bg-green-500' },
                { value: 'purple', color: 'bg-purple-500' },
                { value: 'red', color: 'bg-red-500' },
              ].map((scheme) => (
                <label key={scheme.value} className="cursor-pointer">
                  <input
                    type="radio"
                    name="colorScheme"
                    value={scheme.value}
                    checked={settings.appearance.colorScheme === scheme.value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appearance: { ...settings.appearance, colorScheme: e.target.value },
                      })
                    }
                    className="sr-only"
                  />
                  <div
                    className={`w-12 h-12 rounded-lg ${scheme.color} border-4 transition-all ${
                      settings.appearance.colorScheme === scheme.value
                        ? 'border-gray-900 scale-110'
                        : 'border-gray-200'
                    }`}
                  ></div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h3>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  privacy: { ...settings.privacy, profileVisibility: e.target.value },
                })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="public">Public</option>
              <option value="institution">Institution Only</option>
              <option value="private">Private</option>
            </select>
          </div>
          <div className="space-y-3">
            {[
              { key: 'contactInfoVisible', label: 'Contact Information Visible' },
              { key: 'academicInfoVisible', label: 'Academic Information Visible' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <span className="text-gray-700">{item.label}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.privacy[item.key]}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        privacy: { ...settings.privacy, [item.key]: e.target.checked },
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'profile':
        return renderProfileSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'appearance':
        return renderAppearanceSettings();
      case 'privacy':
        return renderPrivacySettings();
      default:
        return renderProfileSettings();
    }
  };

  // Handler for Save Changes (for faculty only)
  const handleSaveChanges = () => {
    // Add your save logic here
    alert('Settings saved successfully!');
  };

  return (
    <Layout>
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        style={{ pointerEvents: 'none' }}
      >
        <source src="https://media.istockphoto.com/id/1224356307/video/circuit-board-background-copy-space-blue-loopable-animation-computer-data-technology.mp4?s=mp4-640x640-is&k=20&c=G0mWgOSm7QrXr2bceDPdVBwbFUKcI7rFJKm-FIlJI2I=" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="relative z-10 min-h-screen flex flex-col items-center px-2 md:px-0 py-6">
        {/* Header Bar */}
        <div className="w-full max-w-5xl mx-auto mb-8">
          <div className="bg-white/90 rounded-xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-2 md:gap-0">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account settings and preferences</p>
            </div>
          </div>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-5xl mx-auto flex flex-col lg:flex-row gap-8"
        >
          {/* Sidebar */}
          <div className="lg:w-1/4 w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8 lg:mb-0">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-50 text-primary-700 border border-primary-200'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
          {/* Main Content */}
          <div className="lg:w-3/4 w-full">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              {renderTabContent()}
              {/* Save Changes button only for faculty */}
              {user?.role === 'faculty' && (
                <div className="pt-8 flex justify-end">
                  <button
                    onClick={handleSaveChanges}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg font-semibold shadow hover:bg-primary-700 transition"
                  >
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
