'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Camera, 
  Upload, 
  Pause, 
  Play, 
  Settings, 
  Wifi, 
  WifiOff,
  CheckCircle,
  XCircle,
  Clock,
  FolderOpen,
  Image
} from 'lucide-react';

interface DSLRStats {
  isConnected: boolean;
  isProcessing: boolean;
  totalUploaded: number;
  failedUploads: number;
  lastUpload: string | null;
  watchFolder: string;
  eventId: string;
  uploaderName: string;
  queueSize: number;
  uploadSpeed: number; // MB/s
}

interface RecentUpload {
  id: string;
  fileName: string;
  uploadTime: string;
  fileSize: number;
  status: 'success' | 'failed' | 'uploading';
  photoUrl?: string;
}

export default function DSLRMonitor() {
  const [stats, setStats] = useState<DSLRStats>({
    isConnected: false,
    isProcessing: false,
    totalUploaded: 0,
    failedUploads: 0,
    lastUpload: null,
    watchFolder: 'C:/DCIM/100NIKON',
    eventId: '',
    uploaderName: 'Official Photographer',
    queueSize: 0,
    uploadSpeed: 0
  });

  const [recentUploads, setRecentUploads] = useState<RecentUpload[]>([]);
  const [settings, setSettings] = useState({
    autoUpload: true,
    eventId: '',
    uploaderName: 'Official Photographer',
    watchFolder: 'C:/DCIM/100NIKON'
  });

  // Simulate real-time updates (replace with actual WebSocket/API calls)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate stats update
      setStats(prev => ({
        ...prev,
        isConnected: Math.random() > 0.1, // 90% uptime
        totalUploaded: prev.totalUploaded + (Math.random() > 0.8 ? 1 : 0),
        uploadSpeed: Math.random() * 5 + 1 // 1-6 MB/s
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handlePauseResume = () => {
    setStats(prev => ({ ...prev, isProcessing: !prev.isProcessing }));
  };

  const handleSettingsUpdate = () => {
    setStats(prev => ({
      ...prev,
      eventId: settings.eventId,
      uploaderName: settings.uploaderName,
      watchFolder: settings.watchFolder
    }));
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatUploadTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  return (
    <div className="mobile-spacing">
      {/* Header */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <div>
            <h2 className="mobile-card-title flex items-center gap-2">
              <Camera className="h-5 w-5" />
              DSLR Monitor
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Monitor upload otomatis dari Nikon D7100
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <Badge variant={stats.isConnected ? "default" : "destructive"} className="text-xs">
              {stats.isConnected ? (
                <>
                  <Wifi className="h-3 w-3 mr-1" />
                  Connected
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 mr-1" />
                  Disconnected
                </>
              )}
            </Badge>
            
            <button
              className={`mobile-btn touch-feedback ${
                stats.isProcessing ? 'mobile-btn-destructive' : 'mobile-btn-primary'
              }`}
              onClick={handlePauseResume}
            >
              {stats.isProcessing ? (
                <>
                  <Pause className="h-4 w-4 mr-1" />
                  Pause
                </>
              ) : (
                <>
                  <Play className="h-4 w-4 mr-1" />
                  Resume
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Total Uploaded</span>
            <Upload className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-2xl font-bold">{stats.totalUploaded}</div>
            <p className="text-xs text-muted-foreground">
              {stats.failedUploads} failed
            </p>
          </div>
        </div>

        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Upload Speed</span>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-2xl font-bold">{stats.uploadSpeed.toFixed(1)} MB/s</div>
            <p className="text-xs text-muted-foreground">
              {stats.queueSize} in queue
            </p>
          </div>
        </div>

        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Last Upload</span>
            <Image className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-sm font-bold">
              {stats.lastUpload ? formatUploadTime(stats.lastUpload) : 'Never'}
            </div>
            <p className="text-xs text-muted-foreground">
              Event: {stats.eventId || 'Not set'}
            </p>
          </div>
        </div>

        <div className="mobile-card">
          <div className="mobile-card-header">
            <span className="text-sm font-medium">Watch Folder</span>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="mobile-card-content">
            <div className="text-xs font-mono break-all">
              {stats.watchFolder}
            </div>
            <p className="text-xs text-muted-foreground">
              Monitoring active
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Settings Panel */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <h3 className="mobile-card-title flex items-center gap-2">
              <Settings className="h-5 w-5" />
              DSLR Settings
            </h3>
          </div>
          <div className="mobile-card-content mobile-spacing">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-upload">Auto Upload</Label>
              <Switch
                id="auto-upload"
                checked={settings.autoUpload}
                onCheckedChange={(checked) => 
                  setSettings(prev => ({ ...prev, autoUpload: checked }))
                }
              />
            </div>

            <Separator />

            <div className="mobile-form-group">
              <label htmlFor="event-id" className="mobile-label">Active Event ID</label>
              <input
                id="event-id"
                className="mobile-input"
                value={settings.eventId}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, eventId: e.target.value }))
                }
                placeholder="Enter event ID"
              />
            </div>

            <div className="mobile-form-group">
              <label htmlFor="uploader-name" className="mobile-label">Photographer Name</label>
              <input
                id="uploader-name"
                className="mobile-input"
                value={settings.uploaderName}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, uploaderName: e.target.value }))
                }
                placeholder="Official Photographer"
              />
            </div>

            <div className="mobile-form-group">
              <label htmlFor="watch-folder" className="mobile-label">Watch Folder</label>
              <input
                id="watch-folder"
                className="mobile-input"
                value={settings.watchFolder}
                onChange={(e) => 
                  setSettings(prev => ({ ...prev, watchFolder: e.target.value }))
                }
                placeholder="C:/DCIM/100NIKON"
              />
            </div>

            <button onClick={handleSettingsUpdate} className="mobile-btn mobile-btn-primary touch-feedback w-full">
              Update Settings
            </button>
          </div>
        </div>

        {/* Recent Uploads */}
        <div className="mobile-card">
          <div className="mobile-card-header">
            <h3 className="mobile-card-title">Recent Uploads</h3>
            <p className="text-sm text-muted-foreground">Latest photos uploaded from DSLR</p>
          </div>
          <div className="mobile-card-content">
            <div className="mobile-spacing">
              {recentUploads.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No recent uploads</p>
                  <p className="text-sm">Photos will appear here when uploaded</p>
                </div>
              ) : (
                recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-center justify-between p-3 border rounded-lg touch-feedback">
                    <div className="flex items-center gap-3">
                      {upload.status === 'success' && (
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                      {upload.status === 'failed' && (
                        <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                      )}
                      {upload.status === 'uploading' && (
                        <Clock className="h-4 w-4 text-yellow-500 animate-spin flex-shrink-0" />
                      )}
                      
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-sm truncate">{upload.fileName}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(upload.fileSize)} • {formatUploadTime(upload.uploadTime)}
                        </p>
                      </div>
                    </div>
                    
                    <Badge variant={
                      upload.status === 'success' ? 'default' :
                      upload.status === 'failed' ? 'destructive' : 'secondary'
                    } className="text-xs flex-shrink-0">
                      {upload.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mobile-card">
        <div className="mobile-card-header">
          <h3 className="mobile-card-title">System Status</h3>
        </div>
        <div className="mobile-card-content">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center touch-feedback">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${
                stats.isConnected ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
              }`}>
                <Camera className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Camera</p>
              <p className="text-xs text-muted-foreground">
                {stats.isConnected ? 'Connected' : 'Disconnected'}
              </p>
            </div>

            <div className="text-center touch-feedback">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${
                stats.isProcessing ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
              }`}>
                <Upload className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Upload Service</p>
              <p className="text-xs text-muted-foreground">
                {stats.isProcessing ? 'Active' : 'Paused'}
              </p>
            </div>

            <div className="text-center touch-feedback">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 bg-green-100 text-green-600 transition-colors">
                <Wifi className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Internet</p>
              <p className="text-xs text-muted-foreground">Connected</p>
            </div>

            <div className="text-center touch-feedback">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full mb-2 bg-green-100 text-green-600 transition-colors">
                <FolderOpen className="h-5 w-5" />
              </div>
              <p className="text-sm font-medium">Storage</p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}