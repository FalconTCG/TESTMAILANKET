'use client';

import React, { useEffect, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import Link from 'next/link';
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

// Some direct exports to control page behavior
export const dynamic = 'force-dynamic';
export const runtime = 'edge';

export default function DashboardView() {
  const [mounted, setMounted] = useState(false);
  const [surveys, setSurveys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [surveyResponses, setSurveyResponses] = useState([]);
  
  // Browser tarafında çalıştığını doğrula
  useEffect(() => {
    setMounted(true);
    
    // URL'den parametreleri alma
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const surveyId = urlParams.get('surveyId');
      
      if (surveyId) {
        setSelectedSurveyId(surveyId);
      }
    }
    
    // ChartDataLabels eklentisini yükle
    const registerPlugin = async () => {
      try {
        const chartDataLabels = await import('chartjs-plugin-datalabels');
        ChartJS.register(chartDataLabels.default);
      } catch (err) {
        console.warn('chartjs-plugin-datalabels yüklenemedi', err);
      }
    };
    registerPlugin();
  }, []);

  // Anketleri getirme
  useEffect(() => {
    if (!mounted) return;
    
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
          const formattedSurveys = data.surveys.map((survey) => ({
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
  }, [mounted]); 

  // Anket yanıtlarını getirme
  useEffect(() => {
    if (!mounted || !selectedSurveyId) return;
    
    const fetchResponses = async () => {
      try {
        const response = await fetch(`/api/surveys/${selectedSurveyId}`);
        
        if (!response.ok) {
          throw new Error('Yanıtlar getirilemedi');
        }
        
        const data = await response.json();
        
        // API'den gelen yanıtları uygulama için uygun formata dönüştür
        if (data.responses && Array.isArray(data.responses)) {
          const formattedResponses = data.responses.map((item) => ({
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
  }, [selectedSurveyId, mounted]);

  // Anket seçildiğinde
  const handleSurveySelection = (surveyId) => {
    setSelectedSurveyId(surveyId);
    // URL'yi güncelle
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('surveyId', surveyId);
      window.history.pushState({}, '', url);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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
      {/* Başlık kısmı */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-white mb-4 md:mb-0">Anket Yönetim Paneli</h1>
            <div className="flex items-center gap-4">
              <Link 
                href="/create" 
                className="bg-white text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-md font-medium shadow-sm text-sm transition-colors"
              >
                ✨ Yeni Anket Oluştur
              </Link>
              {selectedSurveyId && (
                <div className="text-white text-sm bg-white/20 px-3 py-1 rounded-full">
                  Seçili Anket: {surveys.find(s => s.id === selectedSurveyId)?.title}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Ana içerik */}
        <div className="mt-6 grid grid-cols-1 gap-5">
          {/* Anket listesi */}
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <h3 className="text-lg font-medium text-gray-900">Anketleriniz</h3>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {surveys.map((survey) => (
                  <div 
                    key={survey.id}
                    onClick={() => handleSurveySelection(survey.id)}
                    className={`bg-white border rounded-lg shadow-sm hover:shadow-md transition-all cursor-pointer p-4 ${
                      selectedSurveyId === survey.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                  >
                    <h4 className="text-lg font-semibold">{survey.title}</h4>
                    <p className="text-sm text-gray-500 my-2">{survey.description}</p>
                    <div className="flex justify-between mt-4">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        Yanıtlar: {survey.responsesCount}
                      </span>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Silme işlemi
                        }}
                        className="text-xs text-red-600 hover:text-red-800"
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
      </div>
    </div>
  );
} 