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
  query,
  setDoc,
  updateDoc,
  where,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { Collection, SiteContent, WorksImages } from '@/lib/types';
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
    const plainData: Collection = {
      id: docSnap.id,
      title: data.title,
      description: data.description,
      posterImageUrl: data.posterImageUrl,
      posterImageCategory: data.posterImageCategory || 'image', // Default to image
      images: data.images,
      tag: data.tag,
      createdAt: data.createdAt?.toDate()?.toISOString() ?? new Date().toISOString(),
    };
    return plainData;
  } else {
    return null;
  }
}

export async function getCollectionsByTag(tag: string): Promise<Collection[]> {
  const q = query(collection(db, 'collections'), where('tag', '==', tag));
  const collectionsSnapshot = await getDocs(q);
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

// Site Content Actions
export async function getSiteContent(): Promise<SiteContent> {
  const docRef = doc(db, 'siteContent', 'global');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as SiteContent;
  } else {
    // Return default content if the document doesn't exist
    return {
      about: {
        col1: {
          paragraph1: 'Kaleef Lawal is a Nigerian-born visual artist and photographer based in Berlin. His work explores the intersections of identity, tradition, and contemporary expression, drawing from a deep- rooted passion for storytelling. For over eight years, Kaleef has utilized light, form, and emotion to create images that convey meaning beyond words',
          paragraph2: 'He holds a Certificate in Photography from the Africa Digital Media Institute in Nairobi and a BA in Photography from the University of Europe for Applied Sciences in Berlin. In 2022, Kaleef completed a six-month internship with renowned Dutch photographer Erwin Olaf at his Amsterdam studio—an experience that deeply influenced his approach to conceptual and staged photography',
        },
        col2: {
          paragraph1: 'His work spans portraiture, fashion, and conceptual projects, often centered around themes of cultural heritage, mental health, and belonging. Whether capturing the bold lines of a dancer’s body or the symbolic power of traditional objects, Kaleef’s photographs invite viewers to pause, reflect, and reconnect with themselves and with culture.',
          paragraph2: 'Kaleef’s images have been exhibited internationally and recognized with several awards, including the 1st Prize at The Art Report Africa Prize (2023), the People’s Choice Award at the BBA Photography Prize (2022), and the MPB European Award (2022).',
        },
        exhibitions: '2023 - Die Brücke Art Jam, Group show, Berlin Art Week, Berlin, Germany\n' +
          '2022 - BBA photography prize, Group Show, BBA gallery, Berlin, Germany\n' +
          '2021 - NFT week, Group show, Door Door Gallery, New York, USA\n' +
          '2021 - Portrait Show, Group show, Through the Lens Collective Gallery, Johannesburg, South Africa\n',
      },
    };
  }
}

export async function updateSiteContent(data: Partial<SiteContent>) {
  try {
    const docRef = doc(db, 'siteContent', 'global');
    // Use set with merge to create the document if it doesn't exist, or update it if it does
    await setDoc(docRef, data, { merge: true });

    // Revalidate all relevant paths
    revalidatePath('/admin/content/about');
    revalidatePath('/admin/content/works');
    revalidatePath('/about');
    revalidatePath('/works');

    return { success: true };
  } catch (error) {
    console.error('Error updating site content: ', error);
    return { success: false, error: 'Failed to update site content.' };
  }
}

// Works Images Actions
export async function getWorksImages(): Promise<WorksImages> {
  const docRef = doc(db, 'worksImages', 'global');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as WorksImages;
  } else {
    // Return default content if the document doesn't exist
    return {
      images: {
        default: 'https://cdn.pixabay.com/photo/2023/06/27/10/51/pier-8091934_960_720.jpg',
        artistic: 'https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/kaleef_lawal_07.jpg?updatedAt=175204105271',
        commercial: 'https://ik.imagekit.io/qlc53zzxb/kaleef-lawal/schlau%20x%20kaleef%2032.jpg?updatedAt=1752041052497',
      },
    };
  }
}

export async function updateWorksImages(data: Partial<WorksImages>) {
  try {
    const docRef = doc(db, 'worksImages', 'global');
    // Use set with merge to create the document if it doesn't exist, or update it if it does
    await setDoc(docRef, data, { merge: true });

    // Revalidate all relevant paths
    revalidatePath('/admin/content/works');
    revalidatePath('/works');

    return { success: true };
  } catch (error) {
    console.error('Error updating works images: ', error);
    return { success: false, error: 'Failed to update works images.' };
  }
}