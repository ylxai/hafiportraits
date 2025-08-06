/**
 * Admin Dashboard with Grouped Tabs
 * Mobile-friendly navigation with organized sections
 */

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useRequireAuth } from "@/hooks/use-auth";
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
  FolderOpen,
  Trash,
  Crown
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
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/lib/database";
import type { EventFormData } from "@/components/admin/EventForm";

export default function AdminDashboardGrouped() {
  const auth = useRequireAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Show loading while checking authentication
  if (auth.isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will be redirected by useRequireAuth)
  if (!auth.isAuthenticated) {
    return null;
  }
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeSubTab, setActiveSubTab] = useState('overview');
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  // Photo management states
  const [selectedPhotoTab, setSelectedPhotoTab] = useState("homepage");
  const [selectedEventForPhotos, setSelectedEventForPhotos] = useState("");
  const [isHomepageUploadOpen, setIsHomepageUploadOpen] = useState(false);
  const [isOfficialUploadOpen, setIsOfficialUploadOpen] = useState(false);

  // Fetch admin stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/admin/stats'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/stats");
      return response.json();
    },
  });

  // Fetch events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['/api/admin/events'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/events");
      return response.json() as Promise<Event[]>;
    },
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("POST", "/api/admin/events", eventData);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to create event');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsEventFormOpen(false);
      setEditingEvent(null);
      toast({
        title: "Event Berhasil Dibuat!",
        description: "Event baru telah ditambahkan ke sistem.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Membuat Event",
        description: "Terjadi kesalahan saat membuat event.",
        variant: "destructive",
      });
    },
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async (eventData: any) => {
      const response = await apiRequest("PUT", `/api/admin/events/${eventData.id}`, eventData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsEventFormOpen(false);
      setEditingEvent(null);
      toast({
        title: "Event Berhasil Diperbarui!",
        description: "Event telah diperbarui dengan sukses.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Memperbarui Event",
        description: "Terjadi kesalahan saat memperbarui event.",
        variant: "destructive",
      });
    },
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (eventId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/events/${eventId}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/events'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Event Berhasil Dihapus!",
        description: "Event telah dihapus dari sistem.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Menghapus Event",
        description: "Terjadi kesalahan saat menghapus event.",
        variant: "destructive",
      });
    },
  });

  // Fetch photos for homepage
  const { data: homepagePhotos = [], isLoading: homepagePhotosLoading } = useQuery({
    queryKey: ['/api/admin/photos/homepage'],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/photos/homepage");
      return response.json();
    },
  });

  // Fetch photos for selected event
  const { data: eventPhotos = [], isLoading: eventPhotosLoading } = useQuery({
    queryKey: ['/api/admin/photos/event', selectedEventForPhotos],
    queryFn: async () => {
      if (!selectedEventForPhotos) return [];
      const response = await apiRequest("GET", `/api/events/${selectedEventForPhotos}/photos`);
      return response.json();
    },
    enabled: !!selectedEventForPhotos,
  });

  // Upload homepage photo mutation
  const uploadHomepagePhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiRequest("POST", "/api/admin/photos/homepage", formData);
      return response.json();
    },
    onSuccess: (data, file) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/homepage'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsHomepageUploadOpen(false);
      
      // Dispatch notification event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('admin-upload-success', {
          detail: {
            type: 'upload_success',
            data: {
              fileName: file.name,
              eventName: 'Homepage Gallery',
              message: `${file.name} berhasil diupload ke galeri homepage`
            }
          }
        }));
      }
      
      toast({
        title: "Foto Berhasil Diupload!",
        description: "Foto telah ditambahkan ke galeri homepage.",
      });
    },
    onError: (error, file) => {
      // Dispatch notification event for error
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('admin-upload-failed', {
          detail: {
            type: 'upload_failed',
            data: {
              fileName: file.name,
              eventName: 'Homepage Gallery',
              message: `Gagal mengupload ${file.name} ke galeri homepage`
            }
          }
        }));
      }
      
      toast({
        title: "Gagal Upload Foto",
        description: "Terjadi kesalahan saat mengupload foto.",
        variant: "destructive",
      });
    },
  });

  // Delete photo mutation
  const deletePhotoMutation = useMutation({
    mutationFn: async (photoId: string) => {
      const response = await apiRequest("DELETE", `/api/admin/photos/${photoId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to delete photo');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/homepage'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/event', selectedEventForPhotos] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      toast({
        title: "Foto Berhasil Dihapus!",
        description: "Foto telah dihapus dari sistem.",
      });
    },
    onError: () => {
      toast({
        title: "Gagal Menghapus Foto",
        description: "Terjadi kesalahan saat menghapus foto.",
        variant: "destructive",
      });
    },
  });

  const handleHomepagePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 10MB.",
          variant: "destructive",
        });
        return;
      }
      uploadHomepagePhotoMutation.mutate(file);
    });
  };

  // Upload official photo mutation
  const uploadOfficialPhotoMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('uploaderName', 'Admin');
      formData.append('albumName', 'Official');
      const response = await apiRequest("POST", `/api/events/${selectedEventForPhotos}/photos`, formData);
      return response.json();
    },
    onSuccess: (data, file) => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/photos/event', selectedEventForPhotos] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/stats'] });
      setIsOfficialUploadOpen(false);
      
      // Get event name for notification
      const eventName = events.find(e => e.id === selectedEventForPhotos)?.name || 'Event';
      
      // Dispatch notification event
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('admin-upload-success', {
          detail: {
            type: 'upload_success',
            data: {
              fileName: file.name,
              eventName: eventName,
              message: `${file.name} berhasil diupload ke album Official - ${eventName}`
            }
          }
        }));
      }
      
      toast({
        title: "Foto Official Berhasil Diupload!",
        description: "Foto telah ditambahkan ke album Official event.",
      });
    },
    onError: (error, file) => {
      // Get event name for notification
      const eventName = events.find(e => e.id === selectedEventForPhotos)?.name || 'Event';
      
      // Dispatch notification event for error
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('admin-upload-failed', {
          detail: {
            type: 'upload_failed',
            data: {
              fileName: file.name,
              eventName: eventName,
              message: `Gagal mengupload ${file.name} ke album Official - ${eventName}`
            }
          }
        }));
      }
      
      toast({
        title: "Gagal Upload Foto Official",
        description: "Terjadi kesalahan saat mengupload foto official.",
        variant: "destructive",
      });
    },
  });

  const handleOfficialPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File Terlalu Besar",
          description: "Ukuran file maksimal 10MB.",
          variant: "destructive",
        });
        return;
      }
      uploadOfficialPhotoMutation.mutate(file);
    });
  };

  const handleSaveEvent = (data: EventFormData & { id?: string }) => {
    if (editingEvent && editingEvent.id) {
      updateEventMutation.mutate({ ...data, id: editingEvent.id });
    } else {
      createEventMutation.mutate(data);
    }
  };

  const handleStartEdit = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };
  
  const handleCancelForm = () => {
    setEditingEvent(null);
    setIsEventFormOpen(false);
  };
  

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
              <div className="flex items-center gap-4">
                <NotificationBell />
                
                {/* User Info & Logout */}
                <div className="flex items-center gap-3 bg-white rounded-lg px-4 py-2 shadow-sm border">
                  <div className="hidden sm:block text-right">
                    <p className="text-sm font-medium text-gray-900">{auth.user?.full_name}</p>
                    <p className="text-xs text-gray-500">@{auth.user?.username}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-dynamic-primary rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {auth.user?.full_name?.charAt(0) || auth.user?.username?.charAt(0)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={auth.logout}
                      className="text-gray-500 hover:text-red-600 px-2"
                      title="Logout"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </Button>
                  </div>
                </div>
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
                    <StatsCards stats={stats} />
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

                        {/* Event Management dengan CRUD */}
                        {eventsLoading ? (
                          <div className="text-center py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold mx-auto"></div>
                            <p className="mt-2 text-gray-600">Memuat events...</p>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            {/* Event Statistics */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="text-center p-4 bg-white rounded-lg border">
                                <div className="text-2xl font-bold text-blue-600">{events.length}</div>
                                <div className="text-sm text-gray-600">Total Events</div>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg border">
                                <div className="text-2xl font-bold text-green-600">
                                  {events.filter(e => new Date(e.date) >= new Date()).length}
                                </div>
                                <div className="text-sm text-gray-600">Upcoming Events</div>
                              </div>
                              <div className="text-center p-4 bg-white rounded-lg border">
                                <div className="text-2xl font-bold text-purple-600">
                                  {events.filter(e => e.is_premium).length}
                                </div>
                                <div className="text-sm text-gray-600">Premium Events</div>
                              </div>
                            </div>

                            {/* Event List */}
                            <EventList 
                              events={events}
                              onEdit={handleStartEdit}
                              onDelete={(eventId) => deleteEventMutation.mutate(eventId)}
                            />
                          </div>
                        )}
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
                      <Tabs value={selectedPhotoTab} onValueChange={setSelectedPhotoTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                          <TabsTrigger value="homepage" className="flex items-center gap-2">
                            <Image className="w-4 h-4" />
                            Homepage Gallery
                          </TabsTrigger>
                          <TabsTrigger value="events" className="flex items-center gap-2">
                            <FolderOpen className="w-4 h-4" />
                            Event Gallery
                          </TabsTrigger>
                        </TabsList>

                        {/* Homepage Photos Tab */}
                        <TabsContent value="homepage" className="space-y-4">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Foto Galeri Homepage</h3>
                            <Button 
                              onClick={() => setIsHomepageUploadOpen(true)} 
                              className="bg-wedding-gold hover:bg-wedding-gold/90 text-black"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Upload Foto
                            </Button>
                          </div>

                          {/* Upload Modal */}
                          {isHomepageUploadOpen && (
                            <Card className="mb-6 border-wedding-gold/20">
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Upload className="w-5 h-5 text-wedding-gold" />
                                  Upload Foto Homepage
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Pilih Foto</label>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleHomepagePhotoUpload}
                                    className="w-full p-2 border rounded-lg mt-1"
                                  />
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Ukuran maksimal 10MB per file.
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => setIsHomepageUploadOpen(false)}
                                    variant="outline"
                                  >
                                    Batal
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Loading Indicator */}
                          {uploadHomepagePhotoMutation.isPending && (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-gold"></div>
                              <span className="ml-2 text-sm text-gray-600">Mengupload foto...</span>
                            </div>
                          )}

                          {/* Photo Grid */}
                          {homepagePhotosLoading ? (
                            <div className="text-center py-8">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold mx-auto"></div>
                            </div>
                          ) : homepagePhotos.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                              {homepagePhotos.map((photo: any) => (
                                <div key={photo.id} className="relative group">
                                  <img
                                    src={photo.url}
                                    alt={photo.original_name}
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                                    <Button
                                      size="sm"
                                      variant="destructive"
                                      className="opacity-0 group-hover:opacity-100"
                                      onClick={() => {
                                        if (confirm('Yakin ingin menghapus foto ini?')) {
                                          deletePhotoMutation.mutate(photo.id);
                                        }
                                      }}
                                    >
                                      <Trash className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>Belum ada foto di galeri homepage.</p>
                            </div>
                          )}
                        </TabsContent>

                        {/* Event Photos Tab */}
                        <TabsContent value="events" className="space-y-4">
                          <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                            <h3 className="text-lg font-semibold">Foto Galeri Event</h3>
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                              <select
                                value={selectedEventForPhotos}
                                onChange={(e) => setSelectedEventForPhotos(e.target.value)}
                                className="px-3 py-2 border rounded-md"
                              >
                                <option value="">Pilih Event</option>
                                {events.map((event: Event) => (
                                  <option key={event.id} value={event.id}>
                                    {event.name}
                                  </option>
                                ))}
                              </select>
                              {selectedEventForPhotos && (
                                <Button
                                  onClick={() => setIsOfficialUploadOpen(true)}
                                  className="bg-wedding-gold hover:bg-wedding-gold/90 text-black"
                                >
                                  <Crown className="w-4 h-4 mr-2" />
                                  Upload Foto Official
                                </Button>
                              )}
                            </div>
                          </div>

                          {/* Official Photo Upload Modal */}
                          {isOfficialUploadOpen && selectedEventForPhotos && (
                            <Card className="mb-6 border-wedding-gold/20">
                              <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                  <Crown className="w-5 h-5 text-wedding-gold" />
                                  Upload Foto Official ke Event
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <label className="text-sm font-medium">Pilih Foto Official</label>
                                  <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={handleOfficialPhotoUpload}
                                    className="w-full p-2 border rounded-lg mt-1"
                                  />
                                  <p className="text-sm text-muted-foreground mt-1">
                                    Foto akan diupload ke album "Official" dengan uploader "Admin". Ukuran maksimal 10MB per file.
                                  </p>
                                </div>
                                <div className="flex space-x-2">
                                  <Button
                                    onClick={() => setIsOfficialUploadOpen(false)}
                                    variant="outline"
                                  >
                                    Batal
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          )}

                          {/* Loading Indicator for Official Upload */}
                          {uploadOfficialPhotoMutation.isPending && (
                            <div className="flex items-center justify-center py-4">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-wedding-gold"></div>
                              <span className="ml-2 text-sm text-gray-600">Mengupload foto official...</span>
                            </div>
                          )}

                          {selectedEventForPhotos ? (
                            eventPhotosLoading ? (
                              <div className="text-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-wedding-gold mx-auto"></div>
                              </div>
                            ) : eventPhotos.length > 0 ? (
                              <div>
                                {/* Group photos by album */}
                                {["Official", "Tamu", "Bridesmaid"].map(albumName => { 
                                  const albumPhotos = eventPhotos.filter((photo: any) => photo.album_name === albumName);
                                  if (albumPhotos.length === 0) return null;
                                  
                                  return (
                                    <div key={albumName} className="mb-8">
                                      <h4 className="text-md font-semibold mb-4 text-wedding-gold flex items-center gap-2">
                                        {albumName === "Official" && <Crown className="w-4 h-4" />}
                                        Album {albumName} ({albumPhotos.length} foto)
                                      </h4>
                                      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                        {albumPhotos.map((photo: any) => (
                                          <div key={photo.id} className="relative group">
                                            <img
                                              src={photo.url}
                                              alt={photo.original_name}
                                              className="w-full h-24 object-cover rounded-lg"
                                            />
                                            <div className="absolute bottom-1 left-1 right-1 text-xs text-white bg-black/50 rounded px-1 py-0.5 truncate">
                                              {photo.uploader_name || 'Anonim'}
                                            </div>
                                            {/* Delete button for all photos (admin can delete any photo) */}
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all rounded-lg flex items-center justify-center">
                                              <Button
                                                size="sm"
                                                variant="destructive"
                                                className="opacity-0 group-hover:opacity-100"
                                                onClick={(e) => {
                                                  e.stopPropagation();
                                                  const albumText = albumName === "Official" ? "foto official" : `foto dari album ${albumName}`;
                                                  if (confirm(`Yakin ingin menghapus ${albumText} ini?`)) {
                                                    deletePhotoMutation.mutate(photo.id);
                                                  }
                                                }}
                                              >
                                                <Trash className="w-3 h-3" />
                                              </Button>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="text-center py-12 text-gray-500">
                                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                                <p>Belum ada foto di event ini.</p>
                              </div>
                            )
                          ) : (
                            <div className="text-center py-12 text-gray-500">
                              <FolderOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                              <p>Pilih event untuk melihat foto-fotonya.</p>
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
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
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <EventForm 
                  editingEvent={editingEvent}
                  onSave={handleSaveEvent}
                  onCancel={handleCancelForm}
                  isSaving={createEventMutation.isPending || updateEventMutation.isPending}
                />
              </div>
            </div>
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