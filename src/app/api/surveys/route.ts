import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendSurveyEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
  try {
    const surveys = await prisma.survey.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        _count: {
          select: { responses: true },
        },
      },
    });

    return NextResponse.json({ surveys });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json({ message: 'Anketler alınırken bir hata oluştu' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, description, emails, templateId, code, isExistingSurvey, existingSurveyId } = data;

    // Doğrulama
    if (!name.trim()) {
      return NextResponse.json({ message: 'Anket adı gerekli' }, { status: 400 });
    }

    if (!emails || emails.length === 0) {
      return NextResponse.json({ message: 'En az bir e-posta adresi gerekli' }, { status: 400 });
    }

    if (!code) {
      return NextResponse.json({ message: 'Anket kodu gerekli' }, { status: 400 });
    }

    // Mevcut bir anket kullanılıyorsa ilgili bilgileri getir
    let templateIdToUse = templateId;
    let surveyToUse;
    
    if (isExistingSurvey && existingSurveyId) {
      const existingSurvey = await prisma.survey.findUnique({
        where: { id: existingSurveyId },
        select: { id: true, title: true, description: true, code: true, templateId: true },
      });
      
      if (existingSurvey) {
        templateIdToUse = existingSurvey.templateId;
        surveyToUse = existingSurvey;
      } else {
        return NextResponse.json({ message: 'Seçilen anket bulunamadı' }, { status: 404 });
      }
    }

    // Anket oluştur veya mevcut anketi kullan
    let survey;
    if (isExistingSurvey && surveyToUse) {
      survey = surveyToUse; // Mevcut anketi kullan
      console.log(`Mevcut anket kullanılıyor: ${survey.id}`);
    } else {
      // Yeni anket oluştur
      survey = await prisma.survey.create({
        data: {
          title: name,
          description,
          code: code,
          ...(templateIdToUse ? { templateId: templateIdToUse } : {}),
        },
      });
      console.log(`Yeni anket oluşturuldu: ${survey.id}`);
    }

    // Her e-posta için anket gönder
    let successCount = 0;
    let failureCount = 0;
    const emailResults = [];

    for (const email of emails) {
      try {
        const result = await sendSurveyEmail(email, survey);
        emailResults.push({ email, success: true });
        successCount++;
        console.log(`E-posta başarıyla gönderildi: ${email}`);
      } catch (error) {
        console.error(`E-posta gönderilirken hata oluştu (${email}):`, error);
        emailResults.push({ email, success: false, error: error.message });
        failureCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Anket oluşturuldu. ${successCount} e-posta başarıyla gönderildi, ${failureCount} e-posta gönderilemedi.`,
      surveyId: survey.id,
      emailResults,
    });
  } catch (error) {
    console.error('Error creating survey:', error);
    return NextResponse.json(
      { message: 'Anket oluşturulurken bir hata oluştu' },
      { status: 500 }
    );
  }
} 