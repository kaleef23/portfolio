// utils/firebaseUpload.ts
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '@/lib/firebase';

// Reuse the same constants and functions from above
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
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024;

function getFileType(file: File): 'image' | 'video' {
    if (ALLOWED_IMAGE_TYPES.includes(file.type)) return 'image';
    if (ALLOWED_VIDEO_TYPES.includes(file.type)) return 'video';

    const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v', '.3gp'];
    const extension = (file.name.match(/\.[0-9a-z]+$/i)?.[0] || '').toLowerCase();
    return videoExtensions.includes(extension) ? 'video' : 'image';
}

export interface UploadResult {
    url: string;
    category: 'image' | 'video';
}

export async function uploadToFirebase(file: File): Promise<UploadResult> {
    // Validate file
    if (!file) {
        throw new Error('No file provided.');
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`File too large. Maximum size is 2GB.`);
    }

    const category = getFileType(file);

    // Validate file type
    if (category === 'image' && !ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error('Invalid image format. Allowed: JPEG, PNG, WebP, GIF, TIFF');
    }

    if (category === 'video' && !ALLOWED_VIDEO_TYPES.includes(file.type)) {
        throw new Error('Invalid video format. Allowed: MP4, WebM, MOV, AVI, MPEG, OGG, MKV');
    }

    const sanitizedName = file.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-.]/g, '');
    const filePath = `${category}s/${Date.now()}-${sanitizedName}`;

    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);

    return { url: downloadURL, category };
}