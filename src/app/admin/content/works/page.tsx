import { getSiteContent } from '@/app/admin/action';
import AdminHeader from '@/components/admin/admin-header';
import WorksContentForm from './works-content-form';

export const dynamic = 'force-dynamic';

export default async function AdminWorksContentPage() {
    const siteContent = await getSiteContent();

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminHeader />
            <main className="p-4 sm:p-6 lg:p-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-2xl font-bold text-gray-900 mb-6">
                        Edit Works Page Images
                    </h1>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <WorksContentForm existingContent={siteContent.works} />
                    </div>
                </div>
            </main>
        </div>
    );
}