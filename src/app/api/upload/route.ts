// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Configurable constants
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];
const TIMEOUT_MS = 30000; // 30 seconds timeout

function getFileType(file: File): 'image' | 'video' {
  if (ALLOWED_IMAGE_TYPES.includes(file.type)) return 'image';
  if (ALLOWED_VIDEO_TYPES.includes(file.type)) return 'video';
  
  // Fallback to extension check if type not recognized
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'];
  const extension = (file.name.match(/\.[0-9a-z]+$/i)?.[0] || '').toLowerCase();
  return videoExtensions.includes(extension) ? 'video' : 'image';
}

async function uploadWithTimeout(
  filePath: string,
  file: File,
  contentType: string
) {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error('Upload timed out. Please try again.'));
    }, TIMEOUT_MS);

    supabase.storage
      .from('media')
      .upload(filePath, file, {
        contentType,
        upsert: false,
        cacheControl: '3600'
      })
      .then((result) => {
        clearTimeout(timeout);
        if (result.error) {
          reject(result.error);
        } else {
          resolve(result);
        }
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

    // Use our timeout wrapper
    await uploadWithTimeout(filePath, file, file.type);

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
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