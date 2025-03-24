// This is a static page shell that doesn't use any client hooks during build
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

// Static server component
export default function Dashboard() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0;url=/dashboard-view" />
      </head>
      <body>
        <p>Redirecting to dashboard...</p>
      </body>
    </html>
  );
} 