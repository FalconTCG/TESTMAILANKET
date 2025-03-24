'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Template {
  id: string;
  name: string;
  description: string | null;
}

export default function Templates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTemplate),
      });

      if (!response.ok) {
        throw new Error('Failed to create template');
      }

      setNewTemplate({ name: '', description: '' });
      fetchTemplates();
    } catch (error) {
      console.error('Error creating template:', error);
      alert('Failed to create template. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    if (!confirm('Bu şablonu silmek istediğinizden emin misiniz?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/templates?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete template');
      }
      
      // Silme başarılı olduğunda şablon listesini güncelle
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      alert('Şablon silinirken bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-20 right-20 w-72 h-72 bg-pastel-teal rounded-full blur-3xl opacity-10 -z-10"></div>
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-pastel-orange rounded-full blur-3xl opacity-10 -z-10"></div>
      
      <div className="mb-12">
        <div className="inline-block px-3 py-1 mb-3 bg-pastel-yellow/30 text-yellow-700 rounded-full text-sm font-medium">
          ŞABLONLAR
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Anket Şablonları</h1>
        <p className="text-text-secondary max-w-2xl">
          Yeni şablonlar oluşturun ve anketlerinizi daha hızlı hazırlayın. Şablonlar tüm anketlerinizde kullanılabilir.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-5">
          <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-lg bg-pastel-purple/30 flex items-center justify-center text-primary text-xl mr-4">
                📋
              </div>
              <h2 className="text-xl font-semibold">Yeni Şablon Oluştur</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">
                  Şablon Adı <span className="text-red-500">*</span>
                </label>
                <Input
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  required
                  placeholder="Müşteri Memnuniyet Anketi"
                  hint="Şablonunuzu tanımlayıcı bir isim verin"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Açıklama
                </label>
                <Textarea
                  value={newTemplate.description}
                  onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                  placeholder="Bu şablon müşteri memnuniyetini ölçmek için 5 soru içerir..."
                  hint="Şablonun içeriği ve kullanım amacı"
                />
              </div>

              <div className="pt-4">
                <Button 
                  type="submit" 
                  variant="secondary"
                  className="w-full rounded-lg py-3" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      İşleniyor...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">➕</span> Şablon Oluştur
                    </span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-lg bg-pastel-blue/30 flex items-center justify-center text-primary text-xl mr-4">
                  🗂️
                </div>
                <h2 className="text-xl font-semibold">Mevcut Şablonlar</h2>
              </div>
              <span className="text-sm bg-pastel-blue/20 text-primary px-3 py-1 rounded-full">
                {templates.length} şablon
              </span>
            </div>
            
            {templates.length === 0 ? (
              <div className="p-8 text-center bg-background-light rounded-lg border border-dashed border-gray-200">
                <div className="text-4xl mb-3">📝</div>
                <h3 className="text-lg font-medium mb-2">Henüz şablon bulunmuyor</h3>
                <p className="text-text-secondary">
                  İlk şablonunuzu oluşturarak başlayın. Şablonlar tüm anketlerinizde kullanılabilir.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className="p-5 border rounded-xl shadow-soft hover:shadow-medium transition-shadow bg-white/80 backdrop-blur-sm"
                  >
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg text-text-primary">{template.name}</h3>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        Şablon
                      </span>
                    </div>
                    {template.description && (
                      <p className="text-text-secondary mt-2">{template.description}</p>
                    )}
                    <div className="flex justify-end mt-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-sm mr-2"
                        onClick={() => alert(`Bu şablonu kullanmak için anket oluşturma sayfasına gidin.`)}
                      >
                        Kullan
                      </Button>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        className="text-sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                      >
                        Sil
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-6 p-4 bg-pastel-green/10 border border-pastel-green/30 rounded-lg text-sm text-text-secondary">
            <p className="flex items-center">
              <span className="mr-2 text-lg">💡</span>
              <span>İpucu: Şablonlar, benzer anketleri tekrar tekrar oluşturmanıza gerek kalmadan kullanmanızı sağlar.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 