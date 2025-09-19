'use client';

import Link from 'next/link';
import { useAuth } from './auth-provider';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

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

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin/content/about"
              className="text-sm text-gray-800 hover:text-primary"
            >
              About Page
            </Link>
            <Link
              href="/admin/content/works"
              className="text-sm text-gray-800 hover:text-primary"
            >
              Works Page
            </Link>
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  Content <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/admin/content/about">About Page</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/content/works">Works Page</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
