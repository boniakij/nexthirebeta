'use client';

import { Card, CardBody, CardHeader, Button, Input } from '@/components/ui';
import { Settings as SettingsIcon, Lock, Bell, Eye } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <SettingsIcon className="w-5 h-5" />
            Account Settings
          </h2>
        </CardHeader>
        <CardBody className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address</label>
            <Input placeholder="trainer@example.com" disabled />
            <p className="text-xs text-gray-500 mt-2">Your registered email address</p>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Username</label>
            <Input placeholder="trainer_name" />
          </div>
          <Button variant="primary" className="w-full">Save Changes</Button>
        </CardBody>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Security
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Button variant="outline" className="w-full justify-start">Change Password</Button>
          <Button variant="outline" className="w-full justify-start">Enable Two-Factor Authentication</Button>
          <Button variant="outline" className="w-full justify-start">Manage Login Sessions</Button>
        </CardBody>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">Email Notifications</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">SMS Alerts</label>
            <input type="checkbox" className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">In-app Notifications</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </CardBody>
      </Card>

      {/* Privacy Settings */}
      <Card>
        <CardHeader>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Privacy
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">Public Profile</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">Show Ratings</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-900">Allow Messages from Students</label>
            <input type="checkbox" defaultChecked className="w-5 h-5" />
          </div>
        </CardBody>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <h2 className="font-bold text-lg text-red-700">Danger Zone</h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Deactivate Account
          </Button>
          <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
            Delete Account Permanently
          </Button>
        </CardBody>
      </Card>
    </div>
  );
}
