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
  Monitor,
  Image,
  FolderOpen
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
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-gray-600">Kelola event dan foto Anda dengan mudah</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <NotificationBell />
                <Button 
                  onClick={() => setIsEventFormOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Buat Event Baru</span>
                  <span className="sm:hidden">Event Baru</span>
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
                {activeSubTab === 'events' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-wedding-gold" />
                        Event Management
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Kelola event dan acara photography Anda
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Quick Actions */}
                        <div className="flex flex-col sm:flex-row gap-3">
                          <Button 
                            onClick={() => setIsEventFormOpen(true)}
                            className="bg-wedding-gold hover:bg-wedding-gold/90 text-black"
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Buat Event Baru
                          </Button>
                          <Button variant="outline">
                            <Upload className="w-4 h-4 mr-2" />
                            Import Events
                          </Button>
                        </div>

                        {/* Event List Placeholder */}
                        <div className="border rounded-lg p-8 text-center bg-gray-50">
                          <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 mb-2">Event Management</h3>
                          <p className="text-gray-600 mb-4">
                            Kelola semua event photography Anda dalam satu tempat
                          </p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                            <div className="text-center p-4 bg-white rounded-lg border">
                              <div className="text-2xl font-bold text-blue-600">0</div>
                              <div className="text-sm text-gray-600">Active Events</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border">
                              <div className="text-2xl font-bold text-green-600">0</div>
                              <div className="text-sm text-gray-600">Total Photos</div>
                            </div>
                            <div className="text-center p-4 bg-white rounded-lg border">
                              <div className="text-2xl font-bold text-purple-600">0</div>
                              <div className="text-sm text-gray-600">Total Guests</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {activeSubTab === 'photos' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Camera className="w-5 h-5 text-wedding-gold" />
                        Photo Management
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Kelola foto untuk homepage dan event
                      </p>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        {/* Photo Management Options */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Homepage Photos */}
                          <div className="border rounded-lg p-6 bg-blue-50">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                <Camera className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Homepage Gallery</h3>
                                <p className="text-sm text-gray-600">Foto untuk ditampilkan di homepage</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload ke Homepage
                              </Button>
                              <Button variant="outline" className="w-full">
                                <Image className="w-4 h-4 mr-2" />
                                Kelola Foto Homepage
                              </Button>
                            </div>
                          </div>

                          {/* Event Photos */}
                          <div className="border rounded-lg p-6 bg-green-50">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                <FolderOpen className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-900">Event Photos</h3>
                                <p className="text-sm text-gray-600">Foto untuk event spesifik</p>
                              </div>
                            </div>
                            <div className="space-y-3">
                              <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                                <Upload className="w-4 h-4 mr-2" />
                                Upload ke Event
                              </Button>
                              <Button variant="outline" className="w-full">
                                <Image className="w-4 h-4 mr-2" />
                                Kelola Foto Event
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Photo Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="text-center p-4 bg-white rounded-lg border">
                            <div className="text-2xl font-bold text-blue-600">0</div>
                            <div className="text-sm text-gray-600">Homepage Photos</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg border">
                            <div className="text-2xl font-bold text-green-600">0</div>
                            <div className="text-sm text-gray-600">Event Photos</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg border">
                            <div className="text-2xl font-bold text-purple-600">0</div>
                            <div className="text-sm text-gray-600">Total Storage</div>
                          </div>
                          <div className="text-center p-4 bg-white rounded-lg border">
                            <div className="text-2xl font-bold text-orange-600">0</div>
                            <div className="text-sm text-gray-600">DSLR Photos</div>
                          </div>
                        </div>

                        {/* Recent Photos */}
                        <div className="border rounded-lg p-6 bg-gray-50">
                          <h4 className="font-medium text-gray-900 mb-4">Recent Photos</h4>
                          <div className="text-center py-8">
                            <Image className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                            <p className="text-gray-600">No recent photos</p>
                          </div>
                        </div>
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
                        <div>
                          <h3 className="text-lg font-semibold">Color Theme</h3>
                          <p className="text-sm text-muted-foreground">
                            Pilih tema warna yang sesuai dengan brand dan event Anda
                          </p>
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
                      <CardTitle className="flex items-center gap-2">
                        <Settings className="w-5 h-5 text-wedding-gold" />
                        General Settings
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Konfigurasi umum aplikasi dan sistem
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Website Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Website Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Website Title</label>
                            <input 
                              type="text" 
                              defaultValue="HafiPortrait"
                              className="w-full p-3 border rounded-lg"
                            />
                          </div>
                          <div className="space-y-3">
                            <label className="text-sm font-medium">Website Description</label>
                            <input 
                              type="text" 
                              defaultValue="Professional Photography Services"
                              className="w-full p-3 border rounded-lg"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Upload Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Upload Configuration</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Auto Upload</p>
                              <p className="text-sm text-muted-foreground">
                                Otomatis upload foto dari DSLR
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Enabled
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Image Compression</p>
                              <p className="text-sm text-muted-foreground">
                                Kompres foto untuk menghemat storage
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Configure
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button className="bg-wedding-gold hover:bg-wedding-gold/90 text-black">
                          💾 Save Settings
                        </Button>
                        <Button variant="outline">
                          🔄 Reset to Default
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {activeSubTab === 'preferences' && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-wedding-gold" />
                        User Preferences
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-2">
                        Personalisasi pengalaman pengguna Anda
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Display Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Display Preferences</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Dark Mode</p>
                              <p className="text-sm text-muted-foreground">
                                Gunakan tema gelap untuk admin dashboard
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Auto
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Language</p>
                              <p className="text-sm text-muted-foreground">
                                Bahasa interface admin dashboard
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Bahasa Indonesia
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Notification Preferences */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Notification Preferences</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Email Notifications</p>
                              <p className="text-sm text-muted-foreground">
                                Terima notifikasi via email
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Enabled
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Push Notifications</p>
                              <p className="text-sm text-muted-foreground">
                                Notifikasi real-time di browser
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Enabled
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Privacy Settings */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Privacy & Security</h3>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Two-Factor Authentication</p>
                              <p className="text-sm text-muted-foreground">
                                Keamanan tambahan untuk login
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              Setup
                            </Button>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <p className="font-medium">Session Timeout</p>
                              <p className="text-sm text-muted-foreground">
                                Auto logout setelah tidak aktif
                              </p>
                            </div>
                            <Button variant="outline" size="sm">
                              30 minutes
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-3 pt-4 border-t">
                        <Button className="bg-wedding-gold hover:bg-wedding-gold/90 text-black">
                          💾 Save Preferences
                        </Button>
                        <Button variant="outline">
                          🔄 Reset to Default
                        </Button>
                      </div>
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