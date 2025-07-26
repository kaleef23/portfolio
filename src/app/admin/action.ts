// src/app/admin/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Collection } from '@/lib/types';
import { verifyPassword } from '@/lib/password';

// Helper to convert Firestore data to a plain object
const toPlainObject = (obj: any): Omit<Collection, 'id'> & { createdAt: string } => {
  const plain = { ...obj };
  if (plain.createdAt && typeof plain.createdAt.toDate === 'function') {
    plain.createdAt = plain.createdAt.toDate().toISOString();
  } else {
    plain.createdAt = new Date().toISOString();
  }
  return plain as Omit<Collection, 'id'> & { createdAt: string };
};

export async function getCollections(): Promise<Collection[]> {
  const collectionsSnapshot = await getDocs(collection(db, 'collections'));
  const collectionsWithTimestamps: (Collection & { rawCreatedAt?: Timestamp })[] = [];
  collectionsSnapshot.forEach((doc) => {
    const data = doc.data();
    collectionsWithTimestamps.push({
      id: doc.id,
      ...data,
      rawCreatedAt: data.createdAt, // Keep raw timestamp for sorting
    } as Collection & { rawCreatedAt?: Timestamp });
  });

  // Sort using the raw timestamp
  collectionsWithTimestamps.sort(
    (a, b) =>
      (b.rawCreatedAt?.toMillis() ?? 0) - (a.rawCreatedAt?.toMillis() ?? 0)
  );

  // Convert to plain objects for serialization
  const collections: Collection[] = collectionsWithTimestamps.map((c) => {
    const { rawCreatedAt, ...rest } = c;
    return {
      ...rest,
      createdAt: new Date().toISOString(),
    };
  });

  return collections;
}

export async function getCollection(id: string): Promise<Collection | null> {
  const docRef = doc(db, 'collections', id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    // Manually convert the Timestamp to a serializable format (ISO string)
    const plainData: Collection = {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      posterImageUrl: data.posterImageUrl,
      images: data.images,
      // Convert Timestamp to ISO string if it exists
      createdAt: data.createdAt?.toDate()?.toISOString() ?? new Date().toISOString(),
    };
    return plainData;
  } else {
    return null;
  }
}

export async function addCollection(
  data: Omit<Collection, 'id' | 'createdAt'>
) {
  try {
    const docRef = await addDoc(collection(db, 'collections'), {
      ...data,
      createdAt: new Date(),
    });
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding document: ', error);
    return { success: false, error: 'Failed to add collection.' };
  }
}

export async function updateCollection(
  id: string,
  data: Partial<Omit<Collection, 'id' | 'createdAt'>>
) {
  try {
    const docRef = doc(db, 'collections', id);
    await updateDoc(docRef, data);
    revalidatePath('/admin');
    revalidatePath(`/admin/edit/${id}`);
    revalidatePath(`/collection/${id}`);
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error updating document: ', error);
    return { success: false, error: 'Failed to update collection.' };
  }
}

export async function deleteCollection(id: string) {
  try {
    await deleteDoc(doc(db, 'collections', id));
    revalidatePath('/admin');
    revalidatePath('/');
    return { success: true };
  } catch (error) {
    console.error('Error deleting document: ', error);
    return { success: false, error: 'Failed to delete collection.' };
  }
}

export async function checkPassword(password: string) {
  const isValid = await verifyPassword(password);
  return { success: isValid };
}
