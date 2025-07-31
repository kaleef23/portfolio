'use client';

import Link from 'next/link';
import { useAuth } from './auth-provider';
import { Button } from '../ui/button';

export default function AdminHeader() {
  const { logout } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/admin"
            className="text-xl font-bold text-gray-800 hover:text-primary"
          >
            Admin Dashboard
          </Link>
          <Button onClick={logout} variant="outline" size="sm">
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
