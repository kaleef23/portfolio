// src/app/api/upload/route.ts
import { NextResponse } from 'next/server';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: `https://ik.imagekit.io/${process.env.NEXT_PUBLIC_IMAGEKIT_ID}/`,
});

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
      return NextResponse.json(
        { error: 'No file provided.' },
        { status: 400 }
      );
    }

    const fileBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(fileBuffer);
    const category = getFileType(file.name);

    const response = await imagekit.upload({
      file: buffer,
      fileName: file.name,
      folder: '/kaleef-klicks',
    });

    console.log(category);

    return NextResponse.json({
      url: response.url,
      thumbnailUrl: response.thumbnailUrl,
      category: category, // Return the determined category
    });
  } catch (error) {
    console.error('ImageKit upload error:', error);
    return NextResponse.json(
      { error: 'Image upload failed.' },
      { status: 500 }
    );
  }
}
