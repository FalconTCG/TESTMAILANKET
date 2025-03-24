'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Rating } from '@/components/Rating';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface Template {
  id: string;
  name: string;
  description: string | null;
}

export default function CreateSurvey() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState<string[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const [existingSurveys, setExistingSurveys] = useState<{id: string, title: string, code: string}[]>([]);
  const [selectedExistingSurvey, setSelectedExistingSurvey] = useState<string>('');
  const [isExistingSurvey, setIsExistingSurvey] = useState(false);

  // Anket kodu otomatik olarak oluşturulur
  useEffect(() => {
    if (!isExistingSurvey) {
      generateSurveyCode();
    }
  }, [isExistingSurvey]);

  // Anket kodu oluşturma fonksiyonu - YIL-AY-GUN-2RAKAM formatında
  const generateSurveyCode = () => {
    const now = new Date();
    const year = now.getFullYear();
    // Ay ve gün için iki basamaklı formatta (01, 02, ... 12)
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    // Random 2 rakamlı sayı
    const randomNum = Math.floor(Math.random() * 100).toString().padStart(2, '0');
    
    const newCode = `${year}-${month}-${day}-${randomNum}`;
    setCode(newCode);
  };

  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const response = await fetch('/api/templates');
        const data = await response.json();
        setTemplates(data);
      } catch (error) {
        console.error('Error fetching templates:', error);
      }
    };

    const fetchExistingSurveys = async () => {
      try {
        const response = await fetch('/api/surveys');
        const data = await response.json();
        
        // Anketleri kodlarına göre grupla
        const uniqueSurveys = new Map();
        data.surveys.forEach((survey: any) => {
          // Geçerli ID'ye sahip anketleri işle
          if (survey && survey.id) {
            // Her kod için en son oluşturulan anketi al
            if (!uniqueSurveys.has(survey.code) || 
                new Date(survey.createdAt) > new Date(uniqueSurveys.get(survey.code).createdAt)) {
              uniqueSurveys.set(survey.code, {
                id: survey.id,
                title: survey.title,
                code: survey.code,
                createdAt: survey.createdAt
              });
            }
          }
        });
        
        // Map'i array'e dönüştür
        const surveyArray: {id: string, title: string, code: string, createdAt: string}[] = [];
        uniqueSurveys.forEach((value) => {
          // Ekstra kontrol: sadece geçerli ID'si olan anketleri listeye ekle
          if (value && value.id) {
            surveyArray.push(value);
          }
        });
        
        console.log('Mevcut anketler yüklendi:', surveyArray.length);
        setExistingSurveys(surveyArray);
      } catch (error) {
        console.error('Error fetching surveys:', error);
      }
    };

    fetchTemplates();
    fetchExistingSurveys();
  }, []);

  const addEmail = () => {
    if (!email) return;
    if (!emails.includes(email)) {
      setEmails([...emails, email]);
      setEmail('');
    } else {
      alert('Bu e-posta adresi zaten eklenmiş!');
    }
  };

  const removeEmail = (emailToRemove: string) => {
    setEmails(emails.filter(e => e !== emailToRemove));
  };

  // Mevcut anket seçildiğinde bilgilerini doldur
  useEffect(() => {
    if (selectedExistingSurvey && isExistingSurvey) {
      const survey = existingSurveys.find(s => s.id === selectedExistingSurvey);
      if (survey) {
        setTitle(survey.title);
        setCode(survey.code);
      }
    }
  }, [selectedExistingSurvey, isExistingSurvey, existingSurveys]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (!title.trim()) {
        alert('Lütfen anket başlığı girin');
        setIsLoading(false);
        return;
      }
      
      if (emails.length === 0) {
        alert('Lütfen en az bir e-posta adresi ekleyin');
        setIsLoading(false);
        return;
      }
      
      const requestBody = {
        name: title,
        description,
        emails: emails,
        templateId: selectedTemplate || null,
        code: isExistingSurvey ? existingSurveys.find(s => s.id === selectedExistingSurvey)?.code : code,
        isExistingSurvey,
        existingSurveyId: isExistingSurvey ? selectedExistingSurvey : null
      };
      
      console.log('Anket gönderiliyor:', requestBody);
      
      const response = await fetch('/api/surveys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      console.log('API yanıtı:', data);
      
      if (!response.ok) {
        throw new Error(data.message || 'Anket oluşturulurken bir hata oluştu');
      }

      // Başarılı işlem
      alert('Anket başarıyla oluşturuldu! E-posta(lar) gönderildi. Konsoldaki log mesajlarını inceleyiniz.');
      
      setTitle('');
      setDescription('');
      setEmail('');
      setEmails([]);
      setSelectedTemplate('');
      generateSurveyCode(); // Yeni kod oluştur
      setSelectedExistingSurvey('');
      setIsExistingSurvey(false);
      
      // Dashboard'a yönlendir
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating survey:', error);
      alert(`Anket oluşturma hatası: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-pastel-blue rounded-full blur-3xl opacity-20 -z-10"></div>
      <div className="absolute bottom-20 left-10 w-60 h-60 bg-pastel-purple rounded-full blur-3xl opacity-10 -z-10"></div>
      
      <div className="mb-12">
        <div className="inline-block px-3 py-1 mb-3 bg-secondary/20 text-secondary-dark rounded-full text-sm font-medium">
          YENİ ANKET
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Profesyonel Anket Oluştur</h1>
        <p className="text-text-secondary max-w-2xl">
          Müşterilerinizden değerli geri bildirimler toplamak için yeni bir anket oluşturun veya mevcut bir anketi kullanarak e-postalar gönderin.
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-6">Anket Bilgileri</h2>
            
            <div className="mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="newSurvey"
                    name="surveyType"
                    checked={!isExistingSurvey}
                    onChange={() => setIsExistingSurvey(false)}
                    className="mr-2"
                  />
                  <label htmlFor="newSurvey" className="text-sm font-medium">Yeni Anket Oluştur</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="radio"
                    id="existingSurvey"
                    name="surveyType"
                    checked={isExistingSurvey}
                    onChange={() => setIsExistingSurvey(true)}
                    className="mr-2"
                  />
                  <label htmlFor="existingSurvey" className="text-sm font-medium">Mevcut Anket Kullan</label>
                </div>
              </div>
              
              {isExistingSurvey && (
                <div className="form-group mb-4">
                  <label className="form-label">
                    Mevcut Anket Seç <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={selectedExistingSurvey}
                    onChange={(e) => setSelectedExistingSurvey(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="">Anket seçin</option>
                    {existingSurveys.map((survey) => (
                      <option key={survey.id} value={survey.id}>
                        {survey.title} (Kod: {survey.code})
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">
                    Daha önce oluşturduğunuz bir anketi seçerek aynı anket altında sonuçları toplayabilirsiniz
                  </p>
                </div>
              )}
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="form-group">
                <label className="form-label">
                  Anket Başlığı <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="Müşteri Memnuniyet Anketi"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={isExistingSurvey}
                />
                <p className="form-hint">
                  Anketinize açıklayıcı bir başlık verin
                </p>
              </div>

              {!isExistingSurvey && (
                <div className="form-group">
                  <label className="form-label">
                    Anket Kodu <span className="text-red-500">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={code}
                      readOnly
                      className="w-full p-2 border border-gray-300 rounded-l-md bg-gray-50"
                    />
                    <button
                      type="button"
                      onClick={generateSurveyCode}
                      className="bg-gray-200 text-gray-600 px-3 rounded-r-md hover:bg-gray-300"
                      title="Yeni kod oluştur"
                    >
                      🔄
                    </button>
                  </div>
                  <p className="form-hint">
                    Otomatik oluşturulan anket kodu (YIL-AY-GUN-ID formatında)
                  </p>
                </div>
              )}

              {!isExistingSurvey && (
                <div className="form-group">
                  <label className="form-label">
                    Oluşturma Tarihi
                  </label>
                  <input
                    type="text"
                    value={new Date().toLocaleDateString('tr-TR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                    readOnly
                    className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  />
                  <p className="form-hint">
                    Anketin oluşturulduğu tarih otomatik olarak kaydedilir
                  </p>
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Açıklama
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Ürün ve hizmetlerimizi değerlendirmeniz için hazırladığımız kısa anket..."
                  className="w-full p-2 border border-gray-300 rounded-md h-24"
                  disabled={isExistingSurvey}
                />
                <p className="form-hint">
                  Müşterilerinize anketin amacını açıklayın
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  E-posta Adresleri <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ornek@sirketiniz.com"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  />
                  <button
                    type="button"
                    onClick={addEmail}
                    className="bg-blue-500 text-white px-4 rounded-r-md hover:bg-blue-600"
                  >
                    Ekle
                  </button>
                </div>
                <p className="form-hint">
                  Anket gönderilecek e-posta adreslerini ekleyin
                </p>
                
                {emails.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-md max-h-40 overflow-y-auto">
                    <p className="text-sm text-gray-500 mb-2">Eklenmiş E-postalar:</p>
                    <ul className="space-y-1">
                      {emails.map((email, index) => (
                        <li key={index} className="flex justify-between items-center text-sm">
                          <span>{email}</span>
                          <button
                            type="button"
                            onClick={() => removeEmail(email)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {!isExistingSurvey && (
                <div className="form-group">
                  <label className="form-label">
                    Şablon Seç (Opsiyonel)
                  </label>
                  <select
                    value={selectedTemplate}
                    onChange={(e) => setSelectedTemplate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Şablon Kullanma</option>
                    {templates.map((template) => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                  <p className="form-hint">
                    Önceden hazırlanmış bir şablon kullanarak zaman kazanın
                  </p>
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  className="w-full rounded-lg py-3 bg-primary text-white hover:bg-primary-dark" 
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      İşleniyor...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center">
                      <span className="mr-2">{isExistingSurvey ? '📧' : '📝'}</span> 
                      {isExistingSurvey ? 'Anket Gönder' : 'Anket Oluştur'}
                    </span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-soft p-8 border border-gray-100 space-y-8">
            <div>
              <h2 className="text-xl font-semibold mb-4">Anket Önizleme</h2>
              <p className="text-text-secondary text-sm mb-6">
                Anketiniz alıcılarınıza bu şekilde görünecektir
              </p>
              
              <div className="p-4 bg-background rounded-lg mb-4">
                <p className="font-medium mb-3">Hizmetimizden ne kadar memnun kaldınız?</p>
                <div className="flex justify-center mb-2">
                  <Rating value={0} readOnly size="lg" />
                </div>
              </div>
              
              <div className="p-4 bg-background rounded-lg">
                <p className="font-medium mb-3">Yorumlarınız</p>
                <div className="h-20 bg-white rounded border border-gray-200 p-2 text-sm text-text-light">
                  Yorumunuzu buraya yazabilirsiniz...
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-2">Bilgileriniz güvende</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-sm text-text-secondary">
                  <span className="mr-2 text-primary">✓</span>
                  Anket yanıtları şifrelenmiş olarak saklanır
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <span className="mr-2 text-primary">✓</span>
                  E-posta adresiniz üçüncü taraflarla paylaşılmaz
                </li>
                <li className="flex items-center text-sm text-text-secondary">
                  <span className="mr-2 text-primary">✓</span>
                  İstediğiniz zaman anketinizi silebilirsiniz
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 