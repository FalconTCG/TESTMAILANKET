// This is a static page shell that doesn't use any client hooks during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

// Using a completely static server component
export default function Dashboard() {
  return (
    <ClientDashboard />
  );
}

// Client component wrapper
'use client';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

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
const DashboardClientComponent = dynamic(
  () => import('./client'),
  { 
    ssr: false,
    loading: Loading
  }
);

function ClientDashboard() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardClientComponent />
    </Suspense>
  );
} 