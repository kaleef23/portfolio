// src/app/admin/new/page.tsx
import AdminHeader from '@/components/admin/admin-header';
import CollectionForm from '@/components/admin/collection-form';

export default function NewCollectionPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-josephin">
      <AdminHeader />
      <main className="p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Add New Collection
          </h1>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CollectionForm />
          </div>
        </div>
      </main>
    </div>
  );
}
