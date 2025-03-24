'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateSurvey() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    emails: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const emailList = formData.emails
        .split(',')
        .map((email) => email.trim())
        .filter((email) => email);

      if (emailList.length === 0) {
        throw new Error('En az bir e-posta adresi girmelisiniz.');
      }

      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description,
          emails: emailList,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Anket oluşturulurken bir hata oluştu.');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Anket oluşturulurken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Yeni Anket Oluştur</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Anket Adı
          </label>
          <input
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            name="name"
            type="text"
            placeholder="Müşteri Memnuniyeti Anketi"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
            Açıklama (İsteğe Bağlı)
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="description"
            name="description"
            placeholder="Hizmetlerimizi değerlendirmeniz için kısa bir anket"
            value={formData.description}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emails">
            E-posta Adresleri (virgülle ayırın)
          </label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            id="emails"
            name="emails"
            placeholder="ornek@firma.com, musteri@example.com"
            value={formData.emails}
            onChange={handleChange}
            rows={4}
            required
          />
          <p className="text-gray-600 text-xs italic">Her bir e-posta adresini virgülle ayırın.</p>
        </div>

        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Gönderiliyor...' : 'Anketi Oluştur ve Gönder'}
          </button>
          <button
            className="inline-block align-baseline font-bold text-sm text-gray-500 hover:text-gray-800"
            type="button"
            onClick={() => router.push('/')}
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
} 