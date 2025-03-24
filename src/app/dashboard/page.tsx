'use client';

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Chart as ChartJS, 
  ArcElement,
  Tooltip, 
  Legend,
  Title,
} from 'chart.js';

// ChartJS'i kaydet
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

// Linter hatalarını önlemek için açık bir dönüş tipi belirtiyorum
function Dashboard(): React.ReactElement {
  const searchParams = useSearchParams();
  const [surveys, setSurveys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null);
  const [surveyResponses, setSurveyResponses] = useState<any[]>([]);
  
  // View mode state (normal, edit, responses)
  const [viewMode, setViewMode] = useState<string>('normal');
  
  // Edit form state
  const [editForm, setEditForm] = useState({
    title: '',
    description: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  
  // Silme işlemi için yeni state'ler
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [surveyToDelete, setSurveyToDelete] = useState<string | null>(null);
  const [deletingSurvey, setDeletingSurvey] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Anket listesini yenileme için bir state değişkeni
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // ChartDataLabels eklentisini tarayıcı tarafında yükle
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const registerPlugin = async () => {
        try {
          const chartDataLabels = await import('chartjs-plugin-datalabels');
          ChartJS.register(chartDataLabels.default);
        } catch (err) {
          console.warn('chartjs-plugin-datalabels yüklenemedi', err);
        }
      };
      registerPlugin();
    }
  }, []);

  // URL'den surveyId ve view alınacak
  useEffect(() => {
    const surveyId = searchParams.get('surveyId');
    const view = searchParams.get('view');
    
    if (surveyId) {
      setSelectedSurveyId(surveyId);
    }
    
    // View mode kontrolü
    if (view === 'edit') {
      setViewMode('edit');
    } else if (view === 'responses') {
      setViewMode('responses');
    } else {
      setViewMode('normal');
    }
  }, [searchParams]);

  // Düzenleme modunda anket verilerini form içine doldur
  useEffect(() => {
    if (viewMode === 'edit' && selectedSurveyId) {
      const selectedSurvey = surveys.find(s => s.id === selectedSurveyId);
      if (selectedSurvey) {
        setEditForm({
          title: selectedSurvey.title,
          description: selectedSurvey.description
        });
      }
    }
  }, [viewMode, selectedSurveyId, surveys]);

  // Anketleri getirme
  useEffect(() => {
  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/surveys');
        
      if (!response.ok) {
          throw new Error('Anketler getirilemedi');
        }
        
        const data = await response.json();
        if (data.surveys && Array.isArray(data.surveys)) {
          // API yanıtını UI'da kullanılacak formata dönüştür
          const formattedSurveys = data.surveys.map((survey: any) => ({
            id: survey.id,
            title: survey.title,
            description: survey.description,
            responsesCount: survey._count?.responses || 0,
            createdAt: survey.createdAt,
          }));
          
          setSurveys(formattedSurveys);
        } else {
          throw new Error('Geçersiz API yanıtı');
        }
      } catch (error) {
        console.error('Anketleri getirme hatası:', error);
        setError('Anketler yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

    fetchSurveys();
  }, [refreshTrigger]); // refreshTrigger değiştiğinde anketleri tekrar getir

  // Anket yanıtlarını getirme
  useEffect(() => {
    if (selectedSurveyId) {
      console.log('Seçilen anket değişti:', selectedSurveyId);
      
      const fetchResponses = async () => {
        try {
          const response = await fetch(`/api/surveys/${selectedSurveyId}`);
          
      if (!response.ok) {
            throw new Error('Yanıtlar getirilemedi');
      }
          
      const data = await response.json();
          
          // API'den gelen yanıtları uygulama için uygun formata dönüştür
          if (data.responses && Array.isArray(data.responses)) {
            const formattedResponses = data.responses.map((item: any) => ({
              id: item.id,
              surveyId: item.surveyId,
              respondent: item.email,
              submittedAt: item.createdAt,
              answers: [
                { 
                  question: 'Değerlendirmeniz', 
                  answer: `${item.rating} - ${item.rating === 5 ? 'Çok iyi' : 
                                            item.rating === 4 ? 'İyi' : 
                                            item.rating === 3 ? 'Orta' : 
                                            item.rating === 2 ? 'Kötü' : 
                                            item.rating === 1 ? 'Çok kötü' : 'Belirtilmemiş'}` 
                },
                { question: 'Yorumunuz', answer: item.comment || '-' }
              ]
            }));
            
            console.log('Filtrelenen yanıtlar:', formattedResponses.length);
            setSurveyResponses(formattedResponses);
          } else {
            setSurveyResponses([]);
          }
        } catch (error) {
          console.error('Yanıtları getirme hatası:', error);
          setError('Yanıtlar yüklenirken bir hata oluştu');
          setSurveyResponses([]);
        }
      };
      
      fetchResponses();
    }
  }, [selectedSurveyId]);

  // Tüm anketler için istatistikleri hesapla
  const totalSurveys = surveys.length;
  const totalResponses = surveys.reduce((acc, survey) => acc + survey.responsesCount, 0);
  const avgResponsesPerSurvey = totalSurveys > 0 ? Math.round(totalResponses / totalSurveys) : 0;

  // Seçilen anket için yanıtlarda en çok tekrar eden cevapları bulmaya çalışalım
  const getResponseDistribution = () => {
    if (!selectedSurveyId || surveyResponses.length === 0) {
      console.log('Grafik için veri yok:', selectedSurveyId, surveyResponses.length);
      return null;
    }
    
    console.log('Grafik verisi oluşturuluyor:', selectedSurveyId, surveyResponses.length);
    
    // İlk sorunun yanıtlarının dağılımını hesaplayalım
    const firstQuestion = surveyResponses[0]?.answers[0]?.question;
    if (!firstQuestion) return null;
    
    const answerCounts: {[key: string]: number} = {};
    surveyResponses.forEach(response => {
      const answer = response.answers.find(a => a.question === firstQuestion)?.answer;
      if (answer) {
        answerCounts[answer] = (answerCounts[answer] || 0) + 1;
      }
    });

    // Emoji/ikon sembollerini ekleyelim
    const emojis = {
      '1 - Çok kötü': '😠',
      '2 - Kötü': '☹️',
      '3 - Kararsızım': '😐',
      '3 - Orta': '😐',
      '4 - Memnunum': '🙂',
      '4 - İyi': '🙂',
      '5 - Çok memnunum': '😄',
      '5 - Çok iyi': '😄',
      'Evet': '✅',
      'Hayır': '❌',
      'Belki': '❓',
      'Kesinlikle': '⭐',
      'Mükemmel': '🌟',
      'Çok iyi': '😄',
      'İyi': '🙂',
      'Orta': '😐',
      'Kötü': '☹️',
      'Çok Kötü': '😠',
      'Tatmin edici': '😊',
      'Yüksek': '📈',
      'Düşük': '📉',
      'Kısmen': '🔄',
    };
    
    // Toplam yanıt sayısını hesaplayalım
    const totalCount = Object.values(answerCounts).reduce((sum, count) => sum + count, 0);
    
    // Değerlendirme puanlarını sıralama için bir fonksiyon
    const getRatingValue = (answer: string): number => {
      if (answer.startsWith('5')) return 5;
      if (answer.startsWith('4')) return 4;
      if (answer.startsWith('3')) return 3;
      if (answer.startsWith('2')) return 2;
      if (answer.startsWith('1')) return 1;
      return 0;
    };
    
    // Cevapları puan sırasına göre sıralayalım (5'ten 1'e)
    const sortedAnswers = Object.entries(answerCounts).sort((a, b) => 
      getRatingValue(b[0]) - getRatingValue(a[0])
    );
    
    // Formatlı etiketleri oluşturalım
    const formattedLabels = sortedAnswers.map(([answer, count]) => {
      const emoji = emojis[answer] || '📊';
      const percentage = Math.round((count / totalCount) * 100);
      return `${emoji} ${answer}: ${count} (%${percentage})`;
    });
    
    // Puana göre renk belirleme
    const getColorByRating = (answer: string) => {
      const rating = getRatingValue(answer);
      
      switch(rating) {
        case 5: return { 
          bg: 'rgba(0, 123, 255, 0.9)',   // Mavi (5)
          border: 'rgb(0, 123, 255)' 
        };
        case 4: return { 
          bg: 'rgba(40, 167, 69, 0.9)',   // Yeşil (4)
          border: 'rgb(40, 167, 69)' 
        };
        case 3: return { 
          bg: 'rgba(255, 193, 7, 0.9)',   // Sarı (3)
          border: 'rgb(255, 193, 7)' 
        };
        case 2: return { 
          bg: 'rgba(255, 128, 0, 0.9)',   // Turuncu (2)
          border: 'rgb(255, 128, 0)' 
        };
        case 1: return { 
          bg: 'rgba(220, 53, 69, 0.9)',   // Kırmızı (1)
          border: 'rgb(220, 53, 69)' 
        };
        default: return { 
          bg: 'rgba(108, 117, 125, 0.9)', // Gri (diğer)
          border: 'rgb(108, 117, 125)' 
        };
      }
    };
    
    const backgroundColors = sortedAnswers.map(([answer]) => getColorByRating(answer).bg);
    const borderColors = sortedAnswers.map(([answer]) => getColorByRating(answer).border);
    
    return {
      labels: formattedLabels,
      datasets: [
        {
          data: sortedAnswers.map(([_, count]) => count),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          borderRadius: 8,
          hoverOffset: 15,
          spacing: 2,
        }
      ]
    };
  };
  
  const responseDistribution = getResponseDistribution();
  
  // Pasta grafiği için seçenekler
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 13,
            weight: 'bold' as const
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle',
          boxWidth: 10,
        },
        title: {
          display: true,
          text: 'Cevap Dağılımı',
          font: {
            size: 16,
            weight: 'bold' as const
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
            const percentage = Math.round((value / total) * 100);
            return `${value} yanıt (%${percentage})`;
          }
        }
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold' as const,
          size: 13
        },
        formatter: (value: number, context: any) => {
          const total = context.dataset.data.reduce((acc: number, data: number) => acc + data, 0);
          const percentage = Math.round((value / total) * 100);
          return percentage > 5 ? `%${percentage}` : '';
        }
      }
    },
    cutout: '60%',
    radius: '90%'
  };

  // Anket silme işlevini ekleyelim
  const handleDeleteClick = (surveyId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Tıklamanın survey seçme işlevini tetiklememesi için
    setSurveyToDelete(surveyId);
    setShowDeleteModal(true);
    setDeleteConfirmText('');
    setDeleteError(null);
  };

  const handleDeleteConfirm = async () => {
    if (deleteConfirmText !== 'Delete') {
      setDeleteError('Silmek için "Delete" yazmalısınız');
      return;
    }

    if (!surveyToDelete) return;

    setDeletingSurvey(true);
    try {
      // API'ye delete isteği gönder
      const response = await fetch(`/api/surveys/${surveyToDelete}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Silme işlemi başarısız oldu');
      }
      
      // Anketleri tekrar getir
      setRefreshTrigger(prev => prev + 1);
      
      // Seçili anket silindiyse seçimi temizle
      if (selectedSurveyId === surveyToDelete) {
        setSelectedSurveyId(null);
        setSurveyResponses([]);
      }
      
      setShowDeleteModal(false);
      setSurveyToDelete(null);
    } catch (error) {
      setDeleteError('Anket silinirken bir hata oluştu: ' + error.message);
      console.error('Anket silme hatası:', error);
    } finally {
      setDeletingSurvey(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setSurveyToDelete(null);
    setDeleteConfirmText('');
    setDeleteError(null);
  };

  // Anket güncelleme işlevi
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSurveyId) return;
    if (!editForm.title.trim()) {
      setSaveError('Anket başlığı boş olamaz');
      return;
    }
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      // Gerçek uygulamada burada API'ye istek atılabilir
      // await fetch(`/api/surveys/${selectedSurveyId}`, { 
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(editForm)
      // });
      
      // Şimdilik UI'da güncelleyelim
      setSurveys(surveys.map(survey => {
        if (survey.id === selectedSurveyId) {
          return { ...survey, ...editForm };
        }
        return survey;
      }));
      
      // Normal görünüme dön
      window.location.href = `/dashboard?surveyId=${selectedSurveyId}`;
    } catch (error) {
      setSaveError('Anket güncellenirken bir hata oluştu.');
      console.error('Anket güncelleme hatası:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900">Yükleniyor...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600">Hata: {error}</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Başlık - Gradient arka plan ile şık tasarım */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Anket Yönetim Paneli</h1>
            <div className="flex items-center gap-4">
              {/* Yeni Anket Oluştur Butonu */}
              <Link 
                href="/create" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium shadow-sm text-sm transition-colors"
              >
                ✨ Yeni Anket Oluştur
              </Link>
              {/* Seçili anket bilgisi */}
              {selectedSurveyId && (
                <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
                  Seçili Anket: {surveys.find(s => s.id === selectedSurveyId)?.title}
                  {viewMode === 'edit' && ' (Düzenleme Modu)'}
                  {viewMode === 'responses' && ' (Yanıt Görüntüleme)'}
        </div>
      )}
            </div>
          </div>
        </div>

        {/* Ana İçerik */}
        <div className="mt-6 grid grid-cols-1 gap-5">
          {/* Düzenleme Formu - Sadece edit modunda göster */}
          {viewMode === 'edit' && selectedSurveyId && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Anket Düzenle</h3>
                <form onSubmit={handleEditSubmit}>
                  <div className="mb-4">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Anket Başlığı
                    </label>
                    <input
                      type="text"
                      id="title"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                      placeholder="Anket başlığını girin"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Anket Açıklaması
                    </label>
                    <textarea
                      id="description"
                      className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                      value={editForm.description}
                      onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                      placeholder="Anket açıklamasını girin"
                      rows={4}
                    />
                  </div>
                  
                  {saveError && (
                    <div className="mb-4 p-2 bg-red-50 text-red-700 rounded-md">
                      {saveError}
                    </div>
                  )}
                  
                  <div className="flex justify-end space-x-3">
                    <Link
                      href={`/dashboard?surveyId=${selectedSurveyId}`}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                                    >
                                      İptal
                    </Link>
                                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      disabled={isSaving}
                    >
                      {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                    </button>
                                  </div>
                </form>
                            </div>
                    </div>
                  )}

          {/* Yanıt Görüntüleme - Sadece responses modunda göster */}
          {viewMode === 'responses' && selectedSurveyId && surveyResponses.length > 0 && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  "{surveys.find(s => s.id === selectedSurveyId)?.title}" Anketi Yanıtları
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-posta
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Derecelendirme
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Yorum
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {surveyResponses.map((response) => {
                        // Derecelendirme puanını al
                        const ratingAnswer = response.answers.find(a => a.answer.includes(' - '));
                        const rating = ratingAnswer ? ratingAnswer.answer.split(' - ')[0] : '-';
                        
                        // Emoji ve renk belirle
                        let emoji = '';
                        let textColorClass = '';
                        
                        if (rating === '5') {
                          emoji = '😄';
                          textColorClass = 'text-blue-600';
                        } else if (rating === '4') {
                          emoji = '🙂';
                          textColorClass = 'text-green-600';
                        } else if (rating === '3') {
                          emoji = '😐';
                          textColorClass = 'text-yellow-600';
                        } else if (rating === '2') {
                          emoji = '☹️';
                          textColorClass = 'text-orange-600';
                        } else if (rating === '1') {
                          emoji = '😠';
                          textColorClass = 'text-red-600';
                        }
                        
                        return (
                          <tr key={response.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {response.respondent}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`text-sm ${textColorClass} font-medium`}>
                                {emoji} {ratingAnswer ? ratingAnswer.answer : '-'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-normal text-sm text-gray-500 max-w-md truncate">
                              {response.answers.length > 1 ? response.answers[1]?.answer : '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(response.submittedAt).toLocaleString('tr-TR')}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 flex justify-end">
                  <Link
                    href={`/dashboard?surveyId=${selectedSurveyId}`}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md shadow-sm hover:bg-indigo-50"
                  >
                    Geri Dön
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Yanıt bulunamadı mesajı */}
          {viewMode === 'responses' && selectedSurveyId && surveyResponses.length === 0 && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  "{surveys.find(s => s.id === selectedSurveyId)?.title}" Anketi Yanıtları
                </h3>
                <div className="py-8 text-center">
                  <span className="text-3xl mb-4 block">📝</span>
                  <p className="text-gray-500 mb-4">Bu anket için henüz yanıt bulunmamaktadır.</p>
                  <Link
                    href={`/dashboard?surveyId=${selectedSurveyId}`}
                    className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-300 rounded-md shadow-sm hover:bg-indigo-50"
                  >
                    Geri Dön
                  </Link>
                </div>
        </div>
            </div>
          )}

          {/* Diğer bileşenleri sadece edit veya responses modunda değilken göster */}
          {viewMode !== 'edit' && viewMode !== 'responses' && (
            <>
              {/* Genel İstatistikler - Modern kartlar */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Genel İstatistikler</h3>
                  <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                    <div className="bg-indigo-50 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dl>
                          <dt className="text-sm font-medium text-indigo-600 truncate">Toplam Anket</dt>
                          <dd className="mt-1 text-3xl font-semibold text-indigo-800">{totalSurveys}</dd>
                        </dl>
                      </div>
                    </div>
                    <div className="bg-purple-50 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dl>
                          <dt className="text-sm font-medium text-purple-600 truncate">Toplam Yanıt</dt>
                          <dd className="mt-1 text-3xl font-semibold text-purple-800">{totalResponses}</dd>
                        </dl>
                  </div>
                    </div>
                    <div className="bg-pink-50 overflow-hidden shadow rounded-lg">
                      <div className="px-4 py-5 sm:p-6">
                        <dl>
                          <dt className="text-sm font-medium text-pink-600 truncate">Anket Başına Ortalama Yanıt</dt>
                          <dd className="mt-1 text-3xl font-semibold text-pink-800">{avgResponsesPerSurvey}</dd>
                        </dl>
                  </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Anket Listesi */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900">Anketleriniz</h3>
                  <div className="mt-5 overflow-x-auto">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                      {surveys.map((survey) => (
                        <div 
                          key={survey.id}
                          onClick={() => setSelectedSurveyId(survey.id)}
                          className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer overflow-hidden ${
                            selectedSurveyId === survey.id ? 'ring-2 ring-indigo-500 shadow-md' : ''
                          }`}
                        >
                          <div className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium bg-indigo-100 text-indigo-800 rounded-full px-3 py-1">
                                {new Date(survey.createdAt).toLocaleDateString('tr-TR')}
                              </span>
                              <span className="text-xs font-medium bg-green-100 text-green-800 rounded-full px-3 py-1">
                                {survey.responsesCount} yanıt
                              </span>
                            </div>
                            <h4 className="text-lg font-semibold text-gray-900 mt-3 mb-1">{survey.title}</h4>
                            <p className="text-sm text-gray-500 line-clamp-2">{survey.description}</p>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 flex justify-between flex-wrap gap-2">
                            <Link href={`/dashboard?surveyId=${survey.id}`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                              Detaylar
                            </Link>
                            <Link href={`/dashboard?surveyId=${survey.id}&view=responses`} className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                              Yanıtları Gör
                            </Link>
                  <button
                              onClick={(e) => handleDeleteClick(survey.id, e)}
                              className="text-sm font-medium text-red-600 hover:text-red-500"
                              type="button"
                            >
                              Sil
                  </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Grafikler - Anket analizi */}
              {selectedSurveyId && responseDistribution && (
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <h3 className="text-lg font-medium text-gray-900">Yanıt Dağılımı</h3>
                
                    {/* Emoji Açıklamaları - Sabit Emoji Sıralaması */}
                    <div className="flex justify-center items-center mt-4 mb-6 bg-gray-50 p-4 rounded-lg shadow-sm">
                      <div className="grid grid-cols-5 gap-2 w-full">
                        {/* 5 - Çok İyi */}
                        <div className="flex flex-col items-center">
                          <div className="text-3xl mb-1" style={{color: 'rgb(0, 123, 255)'}}>😄</div>
                          <div className="text-sm font-medium">5 - Çok İyi</div>
                      </div>
                    
                        {/* 4 - İyi */}
                        <div className="flex flex-col items-center">
                          <div className="text-3xl mb-1" style={{color: 'rgb(40, 167, 69)'}}>🙂</div>
                          <div className="text-sm font-medium">4 - İyi</div>
                    </div>
                    
                        {/* 3 - Orta */}
                        <div className="flex flex-col items-center">
                          <div className="text-3xl mb-1" style={{color: 'rgb(255, 193, 7)'}}>😐</div>
                          <div className="text-sm font-medium">3 - Orta</div>
                      </div>
                    
                        {/* 2 - Kötü */}
                        <div className="flex flex-col items-center">
                          <div className="text-3xl mb-1" style={{color: 'rgb(255, 128, 0)'}}>☹️</div>
                          <div className="text-sm font-medium">2 - Kötü</div>
                    </div>
                    
                        {/* 1 - Çok Kötü */}
                        <div className="flex flex-col items-center">
                          <div className="text-3xl mb-1" style={{color: 'rgb(220, 53, 69)'}}>😠</div>
                          <div className="text-sm font-medium">1 - Çok Kötü</div>
                      </div>
                    </div>
                  </div>

                    {/* Sadece pasta grafiği gösteriliyor */}
                    <div className="mt-6">
                      {/* Seçilen anket adı */}
                      <div className="text-center mb-4">
                        <h4 className="text-xl font-semibold text-indigo-800">
                          {surveys.find(s => s.id === selectedSurveyId)?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          Toplam Yanıt: {surveyResponses.length} | Soru: {surveyResponses[0]?.answers[0]?.question}
                        </p>
                    </div>
                    
                      {/* 2D pasta grafiği */}
                      <div className="relative h-[400px]">
                        <Doughnut 
                          data={responseDistribution} 
                          options={pieOptions}
                        />
                      </div>

                      {/* Yanıt sayılarını gösteren açıklama metni */}
                      <div className="text-center mt-6 text-sm text-gray-600">
                        Grafikte yanıt sayıları ve oranları gösterilmektedir. Her dilimin üzerine geldiğinizde detayları görebilirsiniz.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
                      )}
                    </div>
                  </div>

      {/* Silme Onay Modalı */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Anketi Sil</h3>
            <p className="text-gray-600 mb-4">
              Bu anketi silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve tüm yanıtlar silinecektir.
            </p>
            <div className="mb-4">
              <label htmlFor="deleteConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                Silmek için "Delete" yazın
              </label>
              <input
                type="text"
                id="deleteConfirm"
                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="Delete"
              />
              {deleteError && (
                <p className="mt-1 text-sm text-red-600">{deleteError}</p>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50"
                onClick={handleDeleteCancel}
                disabled={deletingSurvey}
              >
                İptal
              </button>
              <button
                type="button"
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={handleDeleteConfirm}
                disabled={deletingSurvey}
              >
                {deletingSurvey ? 'Siliniyor...' : 'Anketi Sil'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 

export default Dashboard;