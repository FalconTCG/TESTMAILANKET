import { Suspense } from 'react';
import DashboardClient from './client';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<div className="text-center py-10">Yükleniyor...</div>}>
      <DashboardClient />
    </Suspense>
  );
} 