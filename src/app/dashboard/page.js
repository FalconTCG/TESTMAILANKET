// Static HTML page with server-side rendering only - no client components
export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Anket Yönetim Paneli</h1>
      <p className="mb-8">Lütfen bekleyin, yönlendiriliyorsunuz...</p>
      <a 
        href="/dashboard-view" 
        className="bg-indigo-600 text-white px-4 py-2 rounded shadow hover:bg-indigo-700 transition-colors"
      >
        Yönetim Paneline Git
      </a>
      
      {/* Client-side redirect script */}
      <script 
        dangerouslySetInnerHTML={{
          __html: `
            window.location.href = '/dashboard-view';
          `
        }}
      />
    </div>
  );
} 