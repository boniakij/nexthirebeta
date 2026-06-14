'use client';

import { useEffect, useState, Suspense } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { RoleGuard } from '@/components/auth/RoleGuard';
import { Card, CardBody, CardHeader, Badge, Spinner, Button, Input } from '@/components/ui';
import { useAuthStore } from '@/stores/authStore';
import { studentApi } from '@/lib/api/student';
import {
  Bell, Lock, Eye, EyeOff, Trash2, LogOut, Save, X,
  Check, AlertCircle, Shield, Smartphone, Mail, Clock
} from 'lucide-react';

function SettingsContent() {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('account');
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Account Settings
  const [accountSettings, setAccountSettings] = useState({
    email: '',
    phone: '',
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    email_notifications: true,
    session_reminders: true,
    interview_updates: true,
    badges_unlocked: true,
    marketing_emails: false,
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profile_visibility: 'public', // public, private, trainers_only
    show_xp: true,
    show_badges: true,
    show_activity: true,
  });

  // Other Settings
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const profileData = await studentApi.getProfile();
      const settingsData = await studentApi.getSettings();

      setAccountSettings(prev => ({
        ...prev,
        email: profileData.data.data.email || '',
        phone: profileData.data.data.phone || '',
      }));

      if (settingsData.data.data) {
        if (settingsData.data.data.notification_settings) {
          setNotificationSettings(settingsData.data.data.notification_settings);
        }
        if (settingsData.data.data.privacy_settings) {
          setPrivacySettings(settingsData.data.data.privacy_settings);
        }
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setLoading(false);
    }
  };

  const handleAccountSettingsSave = async () => {
    if (accountSettings.new_password && accountSettings.new_password !== accountSettings.confirm_password) {
      setMessage({ type: 'error', text: 'Passwords do not match' });
      return;
    }

    setIsSaving(true);
    try {
      const updateData: any = {
        phone: accountSettings.phone,
      };

      if (accountSettings.new_password) {
        updateData.current_password = accountSettings.current_password;
        updateData.new_password = accountSettings.new_password;
        updateData.new_password_confirmation = accountSettings.confirm_password;
      }

      await studentApi.updateSettings(updateData);
      setMessage({ type: 'success', text: 'Account settings updated successfully!' });
      setShowPasswordFields(false);
      setAccountSettings(prev => ({
        ...prev,
        current_password: '',
        new_password: '',
        confirm_password: '',
      }));
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || 'Failed to update settings';
      setMessage({ type: 'error', text: errorMsg });
    } finally {
      setIsSaving(false);
    }
  };

  const handleNotificationSettingsSave = async () => {
    setIsSaving(true);
    try {
      await studentApi.updateSettings({
        notification_settings: notificationSettings,
      });
      setMessage({ type: 'success', text: 'Notification settings updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrivacySettingsSave = async () => {
    setIsSaving(true);
    try {
      await studentApi.updateSettings({
        privacy_settings: privacySettings,
      });
      setMessage({ type: 'success', text: 'Privacy settings updated!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update settings' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteConfirm) return;

    setIsSaving(true);
    try {
      // Call delete account API
      await studentApi.updateProfile({ delete_account: true });
      setMessage({ type: 'success', text: 'Account deleted. Logging out...' });
      setTimeout(() => logout(), 2000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to delete account' });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* Message Alert */}
      {message && (
        <div className={`p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.type === 'success' ? (
            <Check className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <p>{message.text}</p>
        </div>
      )}

      {/* Settings Tabs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="space-y-2">
            {[
              { id: 'account', label: 'Account', icon: Mail },
              { id: 'notifications', label: 'Notifications', icon: Bell },
              { id: 'privacy', label: 'Privacy', icon: Eye },
              { id: 'security', label: 'Security', icon: Shield },
              { id: 'danger', label: 'Danger Zone', icon: Trash2 },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full px-4 py-3 rounded-lg font-semibold text-left flex items-center gap-3 transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 border-l-4 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Account Settings */}
          {activeTab === 'account' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Mail className="w-6 h-6 text-primary-600" />
                  <h2 className="font-bold text-gray-900">Account Settings</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Email */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Email Address
                  </label>
                  <Input
                    value={accountSettings.email}
                    disabled
                    className="opacity-50 cursor-not-allowed"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Email cannot be changed. Contact support to update.
                  </p>
                </div>

                {/* Phone */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2 flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    Phone Number
                  </label>
                  <Input
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={accountSettings.phone}
                    onChange={(e) => setAccountSettings(prev => ({
                      ...prev,
                      phone: e.target.value
                    }))}
                  />
                </div>

                {/* Password Section */}
                <div className="border-t pt-6">
                  {!showPasswordFields ? (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2"
                      onClick={() => setShowPasswordFields(true)}
                    >
                      <Lock className="w-5 h-5" />
                      Change Password
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Lock className="w-5 h-5" />
                        Change Password
                      </h3>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Current Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter current password"
                          value={accountSettings.current_password}
                          onChange={(e) => setAccountSettings(prev => ({
                            ...prev,
                            current_password: e.target.value
                          }))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          New Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Enter new password"
                          value={accountSettings.new_password}
                          onChange={(e) => setAccountSettings(prev => ({
                            ...prev,
                            new_password: e.target.value
                          }))}
                        />
                      </div>

                      <div>
                        <label className="text-sm font-semibold text-gray-700 block mb-2">
                          Confirm Password
                        </label>
                        <Input
                          type="password"
                          placeholder="Confirm new password"
                          value={accountSettings.confirm_password}
                          onChange={(e) => setAccountSettings(prev => ({
                            ...prev,
                            confirm_password: e.target.value
                          }))}
                        />
                      </div>

                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          className="flex items-center gap-2"
                          onClick={() => handleAccountSettingsSave()}
                          disabled={isSaving}
                        >
                          <Save className="w-5 h-5" />
                          Update Password
                        </Button>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                          onClick={() => setShowPasswordFields(false)}
                        >
                          <X className="w-5 h-5" />
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Save Button */}
                {!showPasswordFields && (
                  <div className="border-t pt-6">
                    <Button
                      variant="primary"
                      className="flex items-center gap-2"
                      onClick={handleAccountSettingsSave}
                      disabled={isSaving}
                    >
                      <Save className="w-5 h-5" />
                      {isSaving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-6 h-6 text-primary-600" />
                  <h2 className="font-bold text-gray-900">Notification Settings</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {[
                  { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive email updates' },
                  { key: 'session_reminders', label: 'Session Reminders', desc: 'Get reminders before sessions' },
                  { key: 'interview_updates', label: 'Interview Updates', desc: 'Updates about interviews' },
                  { key: 'badges_unlocked', label: 'Badges Unlocked', desc: 'Notifications when you earn badges' },
                  { key: 'marketing_emails', label: 'Marketing Emails', desc: 'News and promotional content' },
                ].map(setting => (
                  <div key={setting.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-900">{setting.label}</p>
                      <p className="text-sm text-gray-600">{setting.desc}</p>
                    </div>
                    <label className="relative inline-block w-12 h-7">
                      <input
                        type="checkbox"
                        checked={notificationSettings[setting.key as keyof typeof notificationSettings]}
                        onChange={(e) => setNotificationSettings(prev => ({
                          ...prev,
                          [setting.key]: e.target.checked
                        }))}
                        className="opacity-0 w-0 h-0"
                      />
                      <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition ${
                        notificationSettings[setting.key as keyof typeof notificationSettings]
                          ? 'bg-primary-600'
                          : 'bg-gray-300'
                      }`}>
                        <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition ${
                          notificationSettings[setting.key as keyof typeof notificationSettings]
                            ? 'translate-x-5'
                            : ''
                        }`} />
                      </span>
                    </label>
                  </div>
                ))}

                <div className="border-t pt-6">
                  <Button
                    variant="primary"
                    className="flex items-center gap-2"
                    onClick={handleNotificationSettingsSave}
                    disabled={isSaving}
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Preferences'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Eye className="w-6 h-6 text-primary-600" />
                  <h2 className="font-bold text-gray-900">Privacy Settings</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                {/* Profile Visibility */}
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-3">
                    Who can see your profile?
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'public', label: 'Public', desc: 'Everyone can see your profile' },
                      { value: 'trainers_only', label: 'Trainers Only', desc: 'Only trainers can see your profile' },
                      { value: 'private', label: 'Private', desc: 'Only you can see your profile' },
                    ].map(option => (
                      <label key={option.value} className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                        <input
                          type="radio"
                          name="profile_visibility"
                          value={option.value}
                          checked={privacySettings.profile_visibility === option.value}
                          onChange={(e) => setPrivacySettings(prev => ({
                            ...prev,
                            profile_visibility: e.target.value
                          }))}
                          className="w-4 h-4 text-primary-600"
                        />
                        <div className="ml-3">
                          <p className="font-semibold text-gray-900">{option.label}</p>
                          <p className="text-sm text-gray-600">{option.desc}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Show XP, Badges, Activity */}
                <div className="border-t pt-6 space-y-4">
                  <h3 className="font-semibold text-gray-900">Show on Your Profile</h3>

                  {[
                    { key: 'show_xp', label: 'XP Points', desc: 'Display your XP points' },
                    { key: 'show_badges', label: 'Badges', desc: 'Display earned badges' },
                    { key: 'show_activity', label: 'Activity History', desc: 'Show your activity' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-600">{item.desc}</p>
                      </div>
                      <label className="relative inline-block w-12 h-7">
                        <input
                          type="checkbox"
                          checked={privacySettings[item.key as keyof typeof privacySettings] as boolean}
                          onChange={(e) => setPrivacySettings(prev => ({
                            ...prev,
                            [item.key]: e.target.checked
                          }))}
                          className="opacity-0 w-0 h-0"
                        />
                        <span className={`absolute cursor-pointer top-0 left-0 right-0 bottom-0 rounded-full transition ${
                          privacySettings[item.key as keyof typeof privacySettings]
                            ? 'bg-primary-600'
                            : 'bg-gray-300'
                        }`}>
                          <span className={`absolute top-1 left-1 bg-white w-5 h-5 rounded-full transition ${
                            privacySettings[item.key as keyof typeof privacySettings]
                              ? 'translate-x-5'
                              : ''
                          }`} />
                        </span>
                      </label>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-6">
                  <Button
                    variant="primary"
                    className="flex items-center gap-2"
                    onClick={handlePrivacySettingsSave}
                    disabled={isSaving}
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'Saving...' : 'Save Privacy Settings'}
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Security */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-6 h-6 text-primary-600" />
                  <h2 className="font-bold text-gray-900">Security</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-900">
                    <strong>🔒 Security Tip:</strong> Keep your password strong and change it regularly. Never share your login credentials with anyone.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-semibold text-gray-900">Current Session</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          Last active: Just now
                        </p>
                      </div>
                      <Badge variant="success">Active</Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={logout}
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out of All Devices
                  </Button>
                </div>
              </CardBody>
            </Card>
          )}

          {/* Danger Zone */}
          {activeTab === 'danger' && (
            <Card className="border-2 border-red-200">
              <CardHeader className="bg-red-50">
                <div className="flex items-center gap-2">
                  <Trash2 className="w-6 h-6 text-red-600" />
                  <h2 className="font-bold text-red-900">Danger Zone</h2>
                </div>
              </CardHeader>
              <CardBody className="space-y-6">
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-900">
                    <strong>⚠️ Warning:</strong> The following actions cannot be undone.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Delete Account</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Permanently delete your account and all associated data. This action cannot be reversed.
                  </p>

                  {!deleteConfirm ? (
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => setDeleteConfirm(true)}
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete My Account
                    </Button>
                  ) : (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-4">
                      <p className="text-sm text-red-900 font-semibold">
                        Are you absolutely sure? This will:
                      </p>
                      <ul className="text-sm text-red-900 list-disc list-inside space-y-1">
                        <li>Delete your profile and all data</li>
                        <li>Cancel all upcoming sessions</li>
                        <li>Remove all badges and achievements</li>
                        <li>This cannot be undone</li>
                      </ul>

                      <div className="flex gap-3">
                        <Button
                          variant="primary"
                          className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700"
                          onClick={handleDeleteAccount}
                          disabled={isSaving}
                        >
                          <Trash2 className="w-5 h-5" />
                          {isSaving ? 'Deleting...' : 'Yes, Delete My Account'}
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setDeleteConfirm(false)}
                          disabled={isSaving}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardBody>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <RoleGuard allowedRoles={['student', 'trainer', 'company', 'admin']}>
      <DashboardLayout>
        <Suspense fallback={<Spinner size="lg" />}>
          <SettingsContent />
        </Suspense>
      </DashboardLayout>
    </RoleGuard>
  );
}
