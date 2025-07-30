// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

function getFileType(fileName: string): 'image' | 'video' {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv'];
  const extension = (fileName.match(/\.[0-9a-z]+$/i)?.[0] || '').toLowerCase();
  return videoExtensions.includes(extension) ? 'video' : 'image';
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file provided.' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const category = getFileType(file.name);
    const filePath = `${category}s/${Date.now()}-${file.name}`;

    const { error: uploadError } = await supabase.storage
      .from('media') // You must create a 'media' bucket in Supabase Storage
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      console.error(uploadError);
      return NextResponse.json({ error: 'Failed to upload file.' }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from('media')
      .getPublicUrl(filePath);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      category,
    });
  } catch (error) {
    console.error('Supabase upload error:', error);
    return NextResponse.json({ error: 'Upload failed.' }, { status: 500 });
  }
}
