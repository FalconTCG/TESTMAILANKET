export default function NotFound() {
  // Kullanıcıya sadece bir yükleniyor mesajı göster
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-500 mb-4"></div>
        <h2 className="text-lg font-medium text-gray-700">Yükleniyor...</h2>
      </div>
    </div>
  );
} 