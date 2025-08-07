import AdminHeader from '@/components/admin/admin-header';
import CollectionForm from '@/components/admin/collection-form';
import { notFound } from 'next/navigation';
import { getCollection } from '../../action';

export default async function EditCollectionPage({
  params,
}: {
  params: { id: string };
}) {
  const getParams = await params;

  const collection = await getCollection(getParams.id);

  if (!collection) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Edit Collection
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CollectionForm existingCollection={collection} />
          </div>
        </div>
      </main>
    </div>
  );
}
