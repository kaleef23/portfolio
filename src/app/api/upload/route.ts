// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Configurable constants
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2GB - Firebase supports up to 5TB!
const MAX_FILE_SIZE_FOR_DISPLAY = "2GB"; // For user-friendly error messages

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/tiff'];
const ALLOWED_VIDEO_TYPES = [
  'video/mp4', 
  'video/webm', 
  'video/quicktime', 
  'video/x-msvideo', 
  'video/mpeg',
  'video/ogg',
  'video/x-matroska'
];
const TIMEOUT_MS = 60000; // Increased to 60 seconds for larger files

function getFileType(file: File): 'image' | 'video' {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) return 'image';
  if (ALLOWED_VIDEO_TYPES.includes(file.type)) return 'video';
  
  // Fallback to extension check if type not recognized
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp'];
  const extension = (file.name.match(/\.[0-9a-z]+$/i)?.[0] || '').toLowerCase();
  return videoExtensions.includes(extension) ? 'video' : 'image';
}

async function uploadWithTimeout(
  storageRef: any,
  file: File
) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Upload timed out. Please try again.'));
    }, TIMEOUT_MS);

    uploadBytes(storageRef, file)
      .then((snapshot) => {
        clearTimeout(timeout);
        resolve(snapshot);
      })
      .catch((error) => {
        clearTimeout(timeout);
        reject(error);
      });
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided.' }, 
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.` },
        { status: 400 }
      );
    }

    const category = getFileType(file);
    const sanitizedName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-.]/g, '');
    const filePath = `${category}s/${Date.now()}-${sanitizedName}`;

    // Create a storage reference
    const storageRef = ref(storage, filePath);

    // Use our timeout wrapper
    await uploadWithTimeout(storageRef, file);

    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef);

    return NextResponse.json({
      url: downloadURL,
      category,
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    
    if (error.message.includes('timed out')) {
      return NextResponse.json(
        { error: error.message },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Upload failed.' },
      { status: 500 }
    );
  }
}