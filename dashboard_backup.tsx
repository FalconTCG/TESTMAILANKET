'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// Types
interface Survey {
  id: string;
  name: string;
  description: string | null;
  code: string;
  createdAt: string;
  _count: {
    responses: number;
  };
}

interface ResponseData {
  id: string;
  email: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

interface SurveyDetail {
  survey: Survey;
  ratingCounts: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
  averageRating: number;
  responseEmails: string[];
  responses: ResponseData[];
}

export default function Dashboard() {
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const [surveysByCode, setSurveysByCode] = useState<Record<string, Survey[]>>({});
  const [selectedSurvey, setSelectedSurvey] = useState<string | null>(null);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);
  const [surveyDetails, setSurveyDetails] = useState<SurveyDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'comments'>('overview');
  const [deletingSurveyId, setDeletingSurveyId] = useState<string | null>(null);
  const [confirmationText, setConfirmationText] = useState<string>('');
  const [isDeletingLoading, setIsDeletingLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchSurveys();
  }, []);

  useEffect(() => {
    if (selectedSurvey) {
      fetchSurveyDetails(selectedSurvey);
    } else {
      setSurveyDetails(null);
    }
  }, [selectedSurvey]);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/surveys');
      if (!response.ok) {
        throw new Error('Anketler alÄ±nÄ±rken bir hata oluÅŸtu');
      }
      const data = await response.json();
      setSurveys(data.surveys);
      
      // Anketleri kodlarÄ±na gÃ¶re grupla
      const groupedSurveys: Record<string, Survey[]> = {};
      data.surveys.forEach((survey: Survey) => {
        if (!groupedSurveys[survey.code]) {
          groupedSurveys[survey.code] = [];
        }
        groupedSurveys[survey.code].push(survey);
      });
      
      setSurveysByCode(groupedSurveys);
      
      // Select the first code by default if available
      const codes = Object.keys(groupedSurveys);
      if (codes.length > 0 && !selectedCode) {
        setSelectedCode(codes[0]);
        // Ä°lk kodun ilk anketini seÃ§
        if (groupedSurveys[codes[0]].length > 0) {
          setSelectedSurvey(groupedSurveys[codes[0]][0].id);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSurveyDetails = async (surveyId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/surveys/${surveyId}`);
      if (!response.ok) {
        throw new Error('Anket detaylarÄ± alÄ±nÄ±rken bir hata oluÅŸtu');
      }
      const data = await response.json();
      setSurveyDetails(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Anket kodu seÃ§ildiÄŸinde Ã§aÄŸrÄ±lÄ±r
  const handleCodeSelect = (code: string) => {
    setSelectedCode(code);
    // SeÃ§ilen kodun ilk anketini otomatik seÃ§
    if (surveysByCode[code] && surveysByCode[code].length > 0) {
      setSelectedSurvey(surveysByCode[code][0].id);
    } else {
      setSelectedSurvey(null);
    }
  };

  // SeÃ§ilen kod iÃ§in toplam istatistikleri hesapla
  const getCodeStats = () => {
    if (!selectedCode || !surveysByCode[selectedCode]) return null;

    const surveys = surveysByCode[selectedCode];
    const totalResponses = surveys.reduce((sum, survey) => sum + survey._count.responses, 0);
    
    return {
      totalSurveys: surveys.length,
      totalResponses,
      codeName: selectedCode
    };
  };

  // Prepare chart data
  const getBarChartData = () => {
    if (!surveyDetails) return null;
    
    return {
      labels: ['Ã‡ok KÃ¶tÃ¼ (1)', 'KÃ¶tÃ¼ (2)', 'Orta (3)', 'Ä°yi (4)', 'Ã‡ok Ä°yi (5)'],
      datasets: [
        {
          label: 'Cevap SayÄ±sÄ±',
          data: [
            surveyDetails.ratingCounts[1],
            surveyDetails.ratingCounts[2],
            surveyDetails.ratingCounts[3],
            surveyDetails.ratingCounts[4],
            surveyDetails.ratingCounts[5],
          ],
          backgroundColor: [
            '#d32f2f',
            '#f57c00',
            '#ffc107',
            '#4caf50',
            '#2196f3',
          ],
        },
      ],
    };
  };

  const getPieChartData = () => {
    if (!surveyDetails) return null;
    
    return {
      labels: ['Ã‡ok KÃ¶tÃ¼ (1)', 'KÃ¶tÃ¼ (2)', 'Orta (3)', 'Ä°yi (4)', 'Ã‡ok Ä°yi (5)'],
      datasets: [
        {
          data: [
            surveyDetails.ratingCounts[1],
            surveyDetails.ratingCounts[2],
            surveyDetails.ratingCounts[3],
            surveyDetails.ratingCounts[4],
            surveyDetails.ratingCounts[5],
          ],
          backgroundColor: [
            '#d32f2f',
            '#f57c00',
            '#ffc107',
            '#4caf50',
            '#2196f3',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  const getRatingEmoji = (rating: number) => {
    switch(rating) {
      case 1: return 'ğŸ˜¡';
      case 2: return 'ğŸ˜•';
      case 3: return 'ğŸ˜';
      case 4: return 'ğŸ™‚';
      case 5: return 'ğŸ˜';
      default: return '';
    }
  };

  // Anket silme prosedÃ¼rÃ¼nÃ¼ baÅŸlat
  const handleDeleteClick = (surveyId: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Anketi seÃ§me iÅŸlemini engelle
    setDeletingSurveyId(surveyId);
    setConfirmationText('');
  };

  // Silme iÅŸlemini iptal et
  const cancelDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDeletingSurveyId(null);
    setConfirmationText('');
  };

  // Anket silme iÅŸlemini gerÃ§ekleÅŸtir
  const confirmDelete = async (surveyId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    
    if (confirmationText !== 'DELETE') {
      alert('LÃ¼tfen silme iÅŸlemini onaylamak iÃ§in "DELETE" yazÄ±n.');
      return;
    }

    try {
      setIsDeletingLoading(true);
      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Anket silinirken bir hata oluÅŸtu');
      }

      // UI'Ä± gÃ¼ncelle
      await fetchSurveys();
      
      // Silinen anket seÃ§ili anket ise seÃ§imi kaldÄ±r
      if (selectedSurvey === surveyId) {
        setSelectedSurvey(null);
      }
      
      setDeletingSurveyId(null);
      setConfirmationText('');
      
      alert('Anket baÅŸarÄ±yla silindi');
    } catch (error) {
      console.error('Anket silme hatasÄ±:', error);
      alert(`Anket silinirken bir hata oluÅŸtu: ${error.message}`);
    } finally {
      setIsDeletingLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Anket SonuÃ§larÄ± Paneli</h1>
        <Link href="/create" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Yeni Anket OluÅŸtur
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-xl font-bold mb-4">Anket KodlarÄ±</h2>
          {loading && !Object.keys(surveysByCode).length ? (
            <p className="text-gray-500">YÃ¼kleniyor...</p>
          ) : (
            <div className="space-y-2">
              {Object.keys(surveysByCode).map((code) => (
                <div key={code} className="mb-4">
                  <button
                    onClick={() => handleCodeSelect(code)}
                    className={`w-full text-left p-2 rounded ${
                      selectedCode === code ? 'bg-blue-100 font-semibold' : 'hover:bg-gray-100'
                    }`}
                  >
                    <div className="font-medium">Kod: {code}</div>
                    <div className="text-sm text-gray-500">
                      {surveysByCode[code].length} anket, {surveysByCode[code].reduce((sum, s) => sum + s._count.responses, 0)} yanÄ±t
                    </div>
                  </button>
                  
                  {selectedCode === code && (
                    <div className="ml-4 mt-2 border-l-2 border-blue-200 pl-2">
                      <h3 className="text-sm font-medium mb-1">Anketler:</h3>
                      <ul className="space-y-1">
                        {surveysByCode[code].map((survey) => (
                          <li key={survey.id} className="relative">
                            <div className="flex items-center">
                              <button
                                onClick={() => setSelectedSurvey(survey.id)}
                                className={`flex-grow text-left p-1 text-sm rounded ${
                                  selectedSurvey === survey.id ? 'bg-blue-50 font-medium' : 'hover:bg-gray-50'
                                }`}
                              >
                                {survey.name} ({survey._count.responses} yanÄ±t)
                              </button>
                              
                              {deletingSurveyId === survey.id ? (
                                <div className="absolute right-0 top-0 bg-white border border-red-300 rounded-md shadow-md p-2 z-10 w-48">
                                  <p className="text-xs text-red-600 mb-2">Silmek iÃ§in 'DELETE' yazÄ±n:</p>
                                  <input 
                                    type="text"
                                    value={confirmationText}
                                    onChange={(e) => setConfirmationText(e.target.value)}
                                    className="w-full text-xs mb-2 p-1 border border-gray-300 rounded"
                                    placeholder="DELETE"
                                    autoFocus
                                  />
                                  <div className="flex justify-between">
                                    <button
                                      onClick={(e) => cancelDelete(e)}
                                      className="text-xs py-1 px-2 bg-gray-200 rounded hover:bg-gray-300"
                                    >
                                      Ä°ptal
                                    </button>
                                    <button
                                      onClick={(e) => confirmDelete(survey.id, e)}
                                      disabled={confirmationText !== 'DELETE' || isDeletingLoading}
                                      className={`text-xs py-1 px-2 rounded ${
                                        confirmationText === 'DELETE' && !isDeletingLoading
                                          ? 'bg-red-500 text-white hover:bg-red-600'
                                          : 'bg-gray-300 text-gray-500'
                                      }`}
                                    >
                                      {isDeletingLoading ? 'Siliniyor...' : 'Sil'}
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <button
                                  onClick={(e) => handleDeleteClick(survey.id, e)}
                                  className="ml-1 text-xs text-red-500 hover:text-red-700 opacity-60 hover:opacity-100"
                                  title="Anketi Sil"
                                >
                                  ğŸ—‘ï¸
                                </button>
                              )}
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {!loading && !Object.keys(surveysByCode).length && (
            <p className="text-gray-500">HenÃ¼z hiÃ§ anket oluÅŸturulmadÄ±.</p>
          )}
        </div>

        <div className="md:col-span-3">
          {loading && selectedSurvey ? (
            <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-full">
              <p className="text-gray-500">YÃ¼kleniyor...</p>
            </div>
          ) : selectedCode && getCodeStats() ? (
            <div className="mb-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-4">"{selectedCode}" Kodlu Anketler Ã–zeti</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-semibold text-gray-600">Toplam Anket</div>
                    <div className="text-3xl font-bold text-blue-600">
                      {getCodeStats()?.totalSurveys}
                    </div>
                  </div>
                  
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-semibold text-gray-600">Toplam YanÄ±t</div>
                    <div className="text-3xl font-bold text-green-600">
                      {getCodeStats()?.totalResponses}
                    </div>
                  </div>
                  
                  <div className="bg-yellow-50 rounded-lg p-4 text-center">
                    <div className="text-lg font-semibold text-gray-600">Ortalama YanÄ±t/Anket</div>
                    <div className="text-3xl font-bold text-yellow-600">
                      {getCodeStats()?.totalSurveys ? 
                        (getCodeStats()?.totalResponses! / getCodeStats()?.totalSurveys!).toFixed(1) : 
                        '0'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          
          {surveyDetails ? (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">{surveyDetails.survey.name}</h2>
              {surveyDetails.survey.description && (
                <p className="text-gray-600 mb-4">{surveyDetails.survey.description}</p>
              )}

              <div className="border-b border-gray-200 mb-6">
                <nav className="-mb-px flex" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'overview'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Genel BakÄ±ÅŸ
                  </button>
                  <button
                    onClick={() => setActiveTab('comments')}
                    className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                      activeTab === 'comments'
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    Yorumlar
                  </button>
                </nav>
              </div>

              {activeTab === 'overview' ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-blue-50 rounded-lg p-4 text-center">
                      <div className="text-lg font-semibold text-gray-600">Toplam YanÄ±t</div>
                      <div className="text-3xl font-bold text-blue-600">
                        {Object.values(surveyDetails.ratingCounts).reduce((a, b) => a + b, 0)}
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4 text-center">
                      <div className="text-lg font-semibold text-gray-600">Ortalama Puan</div>
                      <div className="text-3xl font-bold text-green-600">
                        {surveyDetails.averageRating.toFixed(1)}
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4 text-center">
                      <div className="text-lg font-semibold text-gray-600">En Ã‡ok Verilen Puan</div>
                      <div className="text-3xl font-bold text-yellow-600">
                        {Object.entries(surveyDetails.ratingCounts)
                          .sort((a, b) => b[1] - a[1])[0][0]}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Puan DaÄŸÄ±lÄ±mÄ±</h3>
                      <div className="h-64">
                        {getBarChartData() && <Bar data={getBarChartData()} options={{ maintainAspectRatio: false }} />}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold mb-3">Puan YÃ¼zdeleri</h3>
                      <div className="h-64">
                        {getPieChartData() && <Pie data={getPieChartData()} options={{ maintainAspectRatio: false }} />}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold mb-3">KatÄ±lÄ±mcÄ±lar ({surveyDetails.responseEmails.length})</h3>
                    <div className="bg-gray-50 p-3 rounded-lg max-h-40 overflow-y-auto">
                      {surveyDetails.responseEmails.length > 0 ? (
                        <ul>
                          {surveyDetails.responseEmails.map((email, index) => (
                            <li key={index} className="mb-1 text-sm text-gray-700">{email}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">HenÃ¼z yanÄ±t yok.</p>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-4">TÃ¼m Yorumlar</h3>
                  {surveyDetails.responses && surveyDetails.responses.length > 0 ? (
                    <div className="space-y-4">
                      {surveyDetails.responses
                        .filter(response => response.comment)
                        .map((response) => (
                          <div key={response.id} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-gray-700">{response.email}</span>
                              <span className="text-2xl" title={`${response.rating} puan`}>
                                {getRatingEmoji(response.rating)}
                              </span>
                            </div>
                            {response.comment && (
                              <p className="text-gray-700">{response.comment}</p>
                            )}
                            <div className="text-xs text-gray-500 mt-2">
                              {new Date(response.createdAt).toLocaleString()}
                            </div>
                          </div>
                        ))}
                        
                      {surveyDetails.responses.filter(response => response.comment).length === 0 && (
                        <p className="text-gray-500 italic">Bu anket iÃ§in henÃ¼z yorum yapÄ±lmamÄ±ÅŸ.</p>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">HenÃ¼z yanÄ±t yok.</p>
                  )}
                </>
              )}
            </div>
          ) : !selectedSurvey ? (
            <div className="bg-white rounded-lg shadow-md p-6 flex justify-center items-center h-64">
              <p className="text-gray-500">GÃ¶rÃ¼ntÃ¼lemek iÃ§in bir anket seÃ§in</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
} 
