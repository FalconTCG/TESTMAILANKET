import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveyId = params.id;

    // Get the survey
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        _count: {
          select: { responses: true },
        },
      },
    });

    if (!survey) {
      return NextResponse.json({ message: 'Anket bulunamadı' }, { status: 404 });
    }

    // Get all responses for this survey
    const responses = await prisma.response.findMany({
      where: { surveyId },
      orderBy: { createdAt: 'desc' },
    });

    // Calculate rating counts and average
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    responses.forEach((response) => {
      if (response.rating >= 1 && response.rating <= 5) {
        ratingCounts[response.rating as 1 | 2 | 3 | 4 | 5]++;
      }
    });

    const totalRatingPoints = responses.reduce((sum, response) => sum + response.rating, 0);
    const averageRating = responses.length > 0 ? totalRatingPoints / responses.length : 0;

    // Get unique responder emails
    const responseEmails = [...new Set(responses.map((r) => r.email))];

    return NextResponse.json({
      survey,
      ratingCounts,
      averageRating,
      responseEmails,
      responses, // Include full response data for display in dashboard
    });
  } catch (error) {
    console.error('Anket detayları alınırken hata:', error);
    return NextResponse.json(
      { message: 'Anket detayları alınırken bir hata oluştu' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveyId = params.id;

    // Önce ankete bağlı yanıtları sil
    await prisma.response.deleteMany({
      where: { surveyId },
    });

    // Sonra anketi sil
    const survey = await prisma.survey.delete({
      where: { id: surveyId },
    });

    if (!survey) {
      return NextResponse.json({ message: 'Anket bulunamadı' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Anket ve ilişkili yanıtlar başarıyla silindi',
    });
  } catch (error) {
    console.error('Anket silinirken hata:', error);
    return NextResponse.json(
      { success: false, message: 'Anket silinirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 