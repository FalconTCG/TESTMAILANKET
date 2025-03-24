import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const surveyId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const email = searchParams.get('email');
    const ratingStr = searchParams.get('rating');
    const comment = searchParams.get('comment') || '';
    
    if (!email) {
      return NextResponse.json({ message: 'E-posta adresi gereklidir' }, { status: 400 });
    }
    
    if (!ratingStr || isNaN(parseInt(ratingStr))) {
      return NextResponse.json({ message: 'Geçerli bir derecelendirme gereklidir' }, { status: 400 });
    }
    
    const rating = parseInt(ratingStr);
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: 'Derecelendirme 1 ile 5 arasında olmalıdır' }, { status: 400 });
    }
    
    // Check if survey exists
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
    });
    
    if (!survey) {
      return NextResponse.json({ message: 'Anket bulunamadı' }, { status: 404 });
    }
    
    // Doğrudan yeni bir cevap oluştur
    // Aynı e-postadan gelen önceki cevapları kontrol etmeyi kaldırdık
    await prisma.response.create({
      data: {
        email,
        rating,
        comment,
        surveyId,
      },
    });
    
    // Return a thank you page with comment form if not already provided
    return new NextResponse(
      `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Teşekkürler</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background-color: #f5f5f5;
            padding: 20px;
          }
          .container {
            text-align: center;
            max-width: 500px;
            padding: 40px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-bottom: 20px;
          }
          p {
            color: #666;
            margin-bottom: 30px;
            font-size: 18px;
          }
          .rating {
            font-size: 72px;
            margin: 20px 0;
          }
          .form-container {
            margin-top: 30px;
            text-align: left;
            display: ${comment ? 'none' : 'block'};
          }
          textarea {
            width: 100%;
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
            margin-bottom: 15px;
            font-family: Arial, sans-serif;
          }
          button {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 10px 20px;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 16px;
            margin: 4px 2px;
            cursor: pointer;
            border-radius: 4px;
          }
          .comment-text {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9f9f9;
            border-radius: 4px;
            font-style: italic;
            text-align: left;
            display: ${comment ? 'block' : 'none'};
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Değerlendirmeniz için teşekkürler!</h1>
          <p>Verdiğiniz ${rating} puanlık değerlendirme başarıyla kaydedildi.</p>
          <div class="rating">
            ${rating === 1 ? '😡' : rating === 2 ? '😕' : rating === 3 ? '😐' : rating === 4 ? '🙂' : '😍'}
          </div>
          
          <div class="comment-text" id="commentDisplay">
            ${comment ? `<p><strong>Yorumunuz:</strong></p><p>"${comment}"</p>` : ''}
          </div>
          
          <div class="form-container" id="commentForm">
            <p>Eklemek istediğiniz bir yorum var mı?</p>
            <form id="feedbackForm" method="get">
              <input type="hidden" name="email" value="${email}">
              <input type="hidden" name="rating" value="${rating}">
              <textarea name="comment" rows="4" placeholder="Yorumunuzu buraya yazın (isteğe bağlı)"></textarea>
              <button type="submit">Yorumu Gönder</button>
            </form>
          </div>
          
          <p>Geri bildiriminiz bizim için çok değerli.</p>
        </div>
        
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            const form = document.getElementById('feedbackForm');
            if (form) {
              form.action = window.location.pathname;
            }
          });
        </script>
      </body>
      </html>
      `,
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    );
  } catch (error) {
    console.error('Anket yanıtlama hatası:', error);
    return NextResponse.json(
      { message: 'Yanıt kaydedilirken bir hata oluştu' },
      { status: 500 }
    );
  }
} 