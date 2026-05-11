'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function SettingsPage() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [notifications, setNotifications] = useState(true);
  const [dailyReminder, setDailyReminder] = useState(true);
  const [reminderTime, setReminderTime] = useState('08:00');
  const [audioQuality, setAudioQuality] = useState<'high' | 'medium' | 'low'>(
    'high'
  );
  const [savedMessage, setSavedMessage] = useState(false);

  const handleSaveSettings = () => {
    // In a real app, this would save to a database
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 3000);
  };

  return (
    <main className="flex-1 bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="max-w-4xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">
              Customize your Hifz Revision Pro experience
            </p>
          </div>
          <Link href="/">
            <Button variant="outline">← Back Home</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        {savedMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded p-4 text-green-700">
            Settings saved successfully!
          </div>
        )}

        {/* Settings Sections */}
        <div className="space-y-6">
          {/* Appearance */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Appearance</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Theme
                </label>
                <div className="flex gap-4">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                  >
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                  >
                    Dark
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Notifications */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Notifications
            </h2>
            <div className="space-y-4">
              {/* Enable Notifications */}
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-semibold text-gray-700">
                    Enable Notifications
                  </label>
                  <p className="text-sm text-gray-600">
                    Receive reminders and updates
                  </p>
                </div>
                <button
                  onClick={() => setNotifications(!notifications)}
                  className={`w-12 h-7 rounded-full transition-colors ${
                    notifications ? 'bg-blue-600' : 'bg-gray-300'
                  } relative`}
                >
                  <span
                    className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                      notifications ? 'translate-x-5' : ''
                    }`}
                  />
                </button>
              </div>

              {/* Daily Reminder */}
              {notifications && (
                <div className="space-y-2 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700">
                        Daily Study Reminder
                      </label>
                      <p className="text-sm text-gray-600">
                        Get reminded to study each day
                      </p>
                    </div>
                    <button
                      onClick={() => setDailyReminder(!dailyReminder)}
                      className={`w-12 h-7 rounded-full transition-colors ${
                        dailyReminder ? 'bg-blue-600' : 'bg-gray-300'
                      } relative`}
                    >
                      <span
                        className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${
                          dailyReminder ? 'translate-x-5' : ''
                        }`}
                      />
                    </button>
                  </div>

                  {/* Reminder Time */}
                  {dailyReminder && (
                    <div className="ml-0 pt-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Reminder Time
                      </label>
                      <input
                        type="time"
                        value={reminderTime}
                        onChange={(e) => setReminderTime(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Audio Settings */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Audio Settings
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recording Quality
                </label>
                <div className="flex gap-4">
                  <Button
                    variant={audioQuality === 'high' ? 'default' : 'outline'}
                    onClick={() => setAudioQuality('high')}
                  >
                    High (128 kbps)
                  </Button>
                  <Button
                    variant={audioQuality === 'medium' ? 'default' : 'outline'}
                    onClick={() => setAudioQuality('medium')}
                  >
                    Medium (96 kbps)
                  </Button>
                  <Button
                    variant={audioQuality === 'low' ? 'default' : 'outline'}
                    onClick={() => setAudioQuality('low')}
                  >
                    Low (64 kbps)
                  </Button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Higher quality uses more storage space
                </p>
              </div>
            </div>
          </Card>

          {/* Study Preferences */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Study Preferences
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Cards per Session
                </label>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>5</option>
                  <option selected>10</option>
                  <option>15</option>
                  <option>20</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Show Translation During Review
                </label>
                <select className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Auto-hide (click to reveal)</option>
                  <option selected>Always show</option>
                  <option>Always hide</option>
                </select>
              </div>
            </div>
          </Card>

          {/* Data & Privacy */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Data & Privacy
            </h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-sm text-blue-900">
                  Your data is stored locally on your device. No information is
                  sent to external servers. Your study progress remains private.
                </p>
              </div>

              <div>
                <Button variant="outline" className="text-red-600">
                  Export Data
                </Button>
              </div>

              <div>
                <Button variant="outline" className="text-red-600">
                  Clear All Data
                </Button>
              </div>
            </div>
          </Card>

          {/* About */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">About</h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-semibold">Version:</span> 1.0.0
              </p>
              <p>
                <span className="font-semibold">Last Updated:</span> May 2026
              </p>
              <p>
                <span className="font-semibold">License:</span> MIT
              </p>
            </div>
          </Card>

          {/* Save Button */}
          <div className="flex gap-4">
            <Button onClick={handleSaveSettings} size="lg">
              Save Settings
            </Button>
            <Button variant="outline" size="lg">
              Reset to Defaults
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
