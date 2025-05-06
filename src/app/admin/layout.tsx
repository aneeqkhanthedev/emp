import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Admin Panel | EmployeePass',
  description: 'Manage employee access and view statuses.',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>; // Simple layout wrapper
}
