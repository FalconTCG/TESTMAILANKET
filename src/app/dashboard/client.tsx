'use client';

import { useSearchParams } from 'next/navigation';
import Dashboard from './page';

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const initialSurveyId = searchParams.get('surveyId');
  const initialView = searchParams.get('view');
  
  return <Dashboard initialSurveyId={initialSurveyId} initialView={initialView} />;
} 