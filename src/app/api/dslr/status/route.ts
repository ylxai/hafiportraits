import { NextRequest, NextResponse } from 'next/server';

// Simulasi status DSLR service
// Dalam implementasi nyata, ini akan connect ke actual service
let dslrStatus = {
  isConnected: true,
  isProcessing: true,
  totalUploaded: 45,
  failedUploads: 2,
  lastUpload: new Date().toISOString(),
  watchFolder: 'C:/DCIM/100NIKON',
  eventId: 'event-123',
  uploaderName: 'Official Photographer',
  queueSize: 0,
  uploadSpeed: 3.2
};

export async function GET() {
  try {
    // Dalam implementasi nyata, query actual DSLR service status
    // Bisa via HTTP endpoint, file system, atau database
    
    return NextResponse.json({
      success: true,
      data: dslrStatus
    });
  } catch (error) {
    console.error('Error getting DSLR status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get DSLR status' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, settings } = body;

    switch (action) {
      case 'pause':
        dslrStatus.isProcessing = false;
        break;
      case 'resume':
        dslrStatus.isProcessing = true;
        break;
      case 'update_settings':
        if (settings) {
          dslrStatus = { ...dslrStatus, ...settings };
        }
        break;
      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      data: dslrStatus
    });
  } catch (error) {
    console.error('Error updating DSLR status:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update DSLR status' },
      { status: 500 }
    );
  }
}