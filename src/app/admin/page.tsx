/**
 * Admin Dashboard with Grouped Tabs
 * Mobile-friendly navigation with organized sections
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Calendar, 
  Camera, 
  Settings, 
  Bell, 
  Palette,
  Plus,
  Upload,
  TrendingUp,
  Users,
  Activity,
  Monitor
} from "lucide-react";

// Import existing components
import EventList from "@/components/admin/EventList";
import EventForm from "@/components/admin/EventForm";
import StatsCards from "@/components/admin/StatsCards";
import DSLRMonitor from "@/components/admin/dslr-monitor";
import NotificationManager from "@/components/admin/notification-manager";
import { ColorPaletteProvider } from "@/components/ui/color-palette-provider";
import { ColorPaletteSwitcher } from "@/components/ui/color-palette-switcher";
import NotificationBell from "@/components/ui/notification-bell";
import { ToastProvider } from "@/components/ui/toast-notification";

export default function AdminDashboardGrouped() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);

  return (
    <ColorPaletteProvider>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Kelola event dan foto Anda dengan mudah</p>
              </div>
              <div className="flex items-center gap-4">
                <ColorPaletteSwitcher variant="button" size="sm" />
                <NotificationBell />
                <Button 
                  onClick={() => setIsEventFormOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Buat Event Baru
                </Button>
              </div>
            </div>

            {/* Grouped Tabs */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              {/* Main Tab Navigation */}
              <TabsList className="grid w-full grid-cols-4 mb-6 h-12">
                <TabsTrigger value="dashboard" className="flex items-center gap-2 py-3">
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">📊 Dashboard</span>
                  <span className="sm:hidden">📊</span>
                </TabsTrigger>
                <TabsTrigger value="content" className="flex items-center gap-2 py-3">
                  <Camera className="w-4 h-4" />
                  <span className="hidden sm:inline">📸 Content</span>
                  <span className="sm:hidden">📸</span>
                </TabsTrigger>
                <TabsTrigger value="system" className="flex items-center gap-2 py-3">
                  <Bell className="w-4 h-4" />
                  <span className="hidden sm:inline">🔔 System</span>
                  <span className="sm:hidden">🔔</span>
                </TabsTrigger>
                <TabsTrigger value="customization" className="flex items-center gap-2 py-3">
                  <Palette className="w-4 h-4" />
                  <span className="hidden sm:inline">🎨 Customize</span>
                  <span className="sm:hidden">🎨</span>
                </TabsTrigger>
              </TabsList>

              {/* DASHBOARD TAB */}
              <TabsContent value="dashboard" className="space-y-6">
                {/* Sub-navigation */}
                <div className="border-b">
                  <nav className="flex space-x-8 overflow-x-auto">
                    <SubTabButton
                      active={activeSubTab === 'overview'}
                      onClick={() => setActiveSubTab('overview')}
                      icon="📊"
                      label="Overview"
                    />
                    <SubTabButton
                      active={activeSubTab === 'analytics'}
                      onClick={() => setActiveSubTab('analytics')}
                      icon="📈"
                      label="Analytics"
                    />
                    <SubTabButton
                      active={activeSubTab === 'reports'}
                      onClick={() => setActiveSubTab('reports')}
                      icon="📋"
                      label="Reports"
                    />
                  </nav>
                </div>

                {/* Dashboard Content */}
                {activeSubTab === 'overview' && (
                  <div className="space-y-6">
                    <StatsCards />
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Recent Activity
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm">New event created: Wedding Sarah & John</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              <span className="text-sm">25 photos uploaded via DSLR</span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                              <span className="text-sm">Color theme changed to Luxury Wedding</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5" />
                            Quick Actions
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <Button 
                            onClick={() => setIsEventFormOpen(true)}
                            className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-black"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Create New Event
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photos
                          </Button>
                          <Button variant="outline" className="w-full">
                            <Users className="w-4 h-4 mr-2" />
                            Manage Guests
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeSubTab === 'analytics' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>📈 Analytics Dashboard</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Detailed insights and performance metrics
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-6 bg-blue-50 rounded-lg">
                          <div className="text-3xl font-bold text-blue-600">1,247</div>
                          <div className="text-sm text-blue-800">Total Photos</div>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-lg">
                          <div className="text-3xl font-bold text-green-600">23</div>
                          <div className="text-sm text-green-800">Active Events</div>
                        </div>
                        <div className="text-center p-6 bg-purple-50 rounded-lg">
                          <div className="text-3xl font-bold text-purple-600">89%</div>
                          <div className="text-sm text-purple-800">Satisfaction Rate</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSubTab === 'reports' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>📋 Reports & Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Comprehensive reports and business insights will be displayed here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* CONTENT TAB */}
              <TabsContent value="content" className="space-y-6">
                {/* Sub-navigation */}
                <div className="border-b">
                  <nav className="flex space-x-8 overflow-x-auto">
                    <SubTabButton
                      active={activeSubTab === 'events'}
                      onClick={() => setActiveSubTab('events')}
                      icon="📅"
                      label="Events"
                    />
                    <SubTabButton
                      active={activeSubTab === 'photos'}
                      onClick={() => setActiveSubTab('photos')}
                      icon="📸"
                      label="Photos"
                    />
                    <SubTabButton
                      active={activeSubTab === 'dslr'}
                      onClick={() => setActiveSubTab('dslr')}
                      icon="📷"
                      label="DSLR"
                    />
                  </nav>
                </div>

                {/* Content based on sub-tab */}
                {activeSubTab === 'events' && <EventList />}
                {activeSubTab === 'photos' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>📸 Photo Management</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        Manage and organize your photo collections
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <Camera className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Photo Management</h3>
                        <p className="text-gray-600 mb-4">Advanced photo management features coming soon</p>
                        <Button variant="outline">
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Photos
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {activeSubTab === 'dslr' && <DSLRMonitor />}
              </TabsContent>

              {/* SYSTEM TAB */}
              <TabsContent value="system" className="space-y-6">
                {/* Sub-navigation */}
                <div className="border-b">
                  <nav className="flex space-x-8 overflow-x-auto">
                    <SubTabButton
                      active={activeSubTab === 'notifications'}
                      onClick={() => setActiveSubTab('notifications')}
                      icon="🔔"
                      label="Notifications"
                    />
                    <SubTabButton
                      active={activeSubTab === 'monitoring'}
                      onClick={() => setActiveSubTab('monitoring')}
                      icon="📊"
                      label="Monitoring"
                    />
                    <SubTabButton
                      active={activeSubTab === 'performance'}
                      onClick={() => setActiveSubTab('performance')}
                      icon="⚡"
                      label="Performance"
                    />
                  </nav>
                </div>

                {/* System Content */}
                {activeSubTab === 'notifications' && <NotificationManager />}
                {activeSubTab === 'monitoring' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Monitor className="w-5 h-5" />
                        System Monitoring
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <h4 className="font-medium">Server Status</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">API Server</span>
                              <span className="text-sm text-green-600 font-medium">✅ Online</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Database</span>
                              <span className="text-sm text-green-600 font-medium">✅ Connected</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Storage</span>
                              <span className="text-sm text-green-600 font-medium">✅ Available</span>
                            </div>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-medium">DSLR Status</h4>
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Camera Connection</span>
                              <span className="text-sm text-green-600 font-medium">✅ Connected</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Auto Upload</span>
                              <span className="text-sm text-green-600 font-medium">✅ Active</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-sm">Watermark</span>
                              <span className="text-sm text-blue-600 font-medium">🏷️ Enabled</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                {activeSubTab === 'performance' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>⚡ Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">2.3s</div>
                          <div className="text-sm text-green-800">Avg Upload Time</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">99.8%</div>
                          <div className="text-sm text-blue-800">Uptime</div>
                        </div>
                        <div className="text-center p-4 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">1.2GB</div>
                          <div className="text-sm text-purple-800">Storage Used</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              {/* CUSTOMIZATION TAB */}
              <TabsContent value="customization" className="space-y-6">
                {/* Sub-navigation */}
                <div className="border-b">
                  <nav className="flex space-x-8 overflow-x-auto">
                    <SubTabButton
                      active={activeSubTab === 'appearance'}
                      onClick={() => setActiveSubTab('appearance')}
                      icon="🎨"
                      label="Appearance"
                    />
                    <SubTabButton
                      active={activeSubTab === 'settings'}
                      onClick={() => setActiveSubTab('settings')}
                      icon="⚙️"
                      label="Settings"
                    />
                    <SubTabButton
                      active={activeSubTab === 'preferences'}
                      onClick={() => setActiveSubTab('preferences')}
                      icon="🔧"
                      label="Preferences"
                    />
                  </nav>
                </div>

                {/* Customization Content */}
                {activeSubTab === 'appearance' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Palette className="w-5 h-5 text-wedding-gold" />
                        Website Appearance
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Kelola tampilan dan tema warna website HafiPortrait
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Color Palette Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold">Color Theme</h3>
                            <p className="text-sm text-muted-foreground">
                              Pilih tema warna yang sesuai dengan brand dan event Anda
                            </p>
                          </div>
                          <ColorPaletteSwitcher variant="button" size="sm" />
                        </div>
                        
                        {/* Inline Color Palette Selector */}
                        <div className="border rounded-lg p-6 bg-gray-50">
                          <ColorPaletteSwitcher variant="inline" showLabel={false} />
                        </div>
                        
                        {/* Color Palette Info */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-2">💡 Tips Pemilihan Tema:</h4>
                          <ul className="text-sm text-blue-800 space-y-1">
                            <li>• <strong>🏆 Luxury Wedding</strong> - Terbaik untuk photography business</li>
                            <li>• <strong>Elegant Photography</strong> - Professional dan timeless</li>
                            <li>• <strong>Champagne Gold</strong> - Perfect untuk celebration events</li>
                            <li>• <strong>Rose Gold Premium</strong> - Ideal untuk feminine events</li>
                            <li>• <strong>Vintage Sepia</strong> - Classic photography feel</li>
                          </ul>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button className="bg-wedding-gold hover:bg-wedding-gold/90 text-black">
                          💾 Save Changes
                        </Button>
                        <Button variant="outline">
                          🔄 Reset to Default
                        </Button>
                        <Button variant="outline">
                          📱 Preview on Mobile
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSubTab === 'settings' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>⚙️ General Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>General application settings will be displayed here</p>
                    </CardContent>
                  </Card>
                )}

                {activeSubTab === 'preferences' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>🔧 User Preferences</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>User preferences and customization options will be shown here</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Event Form Modal */}
          {isEventFormOpen && (
            <EventForm 
              onClose={() => setIsEventFormOpen(false)}
              onSubmit={() => setIsEventFormOpen(false)}
            />
          )}
        </div>
      </ToastProvider>
    </ColorPaletteProvider>
  );
}

// Sub-tab button component
function SubTabButton({ 
  active, 
  onClick, 
  icon, 
  label 
}: { 
  active: boolean; 
  onClick: () => void; 
  icon: string; 
  label: string; 
}) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
        active
          ? 'border-wedding-gold text-wedding-gold'
          : 'border-transparent text-gray-500 hover:text-gray-700'
      }`}
    >
      {icon} {label}
    </button>
  );
}