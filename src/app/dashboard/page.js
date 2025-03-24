'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Explicitly tell Next.js to not statically generate this page
export const dynamic = 'force-dynamic';

// Loading component for suspense fallback
function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      <p className="ml-3 text-lg font-medium text-gray-700">Yükleniyor...</p>
    </div>
  );
}

// Dynamically import the client component with no SSR
const DashboardClient = dynamic(
  () => import('./client'),
  { 
    ssr: false,
    loading: Loading
  }
);

export default function Dashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardClient />
    </Suspense>
  );
} 