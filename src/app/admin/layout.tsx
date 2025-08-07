// src/app/admin/layout.tsx
import "../globals.css"
import AuthProvider from '@/components/admin/auth-provider';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
