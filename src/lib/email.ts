import nodemailer from 'nodemailer';

type Rating = 1 | 2 | 3 | 4 | 5;

interface SendSurveyEmailParams {
  to: string;
  surveyId: string;
  surveyName: string;
}

// E-posta göndericisini oluştur - .env ayarlarına göre uygun seçeneği seç
export async function createTransporter() {
  try {
    // .env'de EMAIL_USE_ETHEREAL=true ise Ethereal test hesabı kullan
    if (process.env.EMAIL_USE_ETHEREAL === 'true') {
      console.log('Creating Ethereal test account for email testing...');
      const testAccount = await nodemailer.createTestAccount();
      console.log('Test account created:', testAccount.user);
      
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      console.log('Ethereal transporter created');
      return { transporter, testAccount, isTest: true };
    } 
    // Gerçek SMTP sunucusu kullan
    else {
      console.log('Using real SMTP server with settings from .env');
      
      // .env'den SMTP ayarlarını doğrula
      if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error('Missing SMTP configuration in .env file');
      }
      
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: parseInt(process.env.EMAIL_PORT || '587'),
        secure: process.env.EMAIL_SECURE === 'true',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      
      console.log('Real SMTP transporter created');
      return { transporter, isTest: false };
    }
  } catch (error) {
    console.error('Error creating email transporter:', error);
    throw error;
  }
}

export async function sendSurveyEmail(emailTo: string, survey: any) {
  try {
    console.log(`Attempting to send survey email to ${emailTo} for survey: ${survey.title} (${survey.id})`);
    
    const { transporter, testAccount, isTest } = await createTransporter();
    
    // Generate rating URLs
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';
    console.log('Using base URL for email links:', baseUrl);
    
    const ratingUrls = {
      1: `${baseUrl}/api/surveys/${survey.id}/respond?email=${encodeURIComponent(emailTo)}&rating=1`,
      2: `${baseUrl}/api/surveys/${survey.id}/respond?email=${encodeURIComponent(emailTo)}&rating=2`,
      3: `${baseUrl}/api/surveys/${survey.id}/respond?email=${encodeURIComponent(emailTo)}&rating=3`,
      4: `${baseUrl}/api/surveys/${survey.id}/respond?email=${encodeURIComponent(emailTo)}&rating=4`,
      5: `${baseUrl}/api/surveys/${survey.id}/respond?email=${encodeURIComponent(emailTo)}&rating=5`,
    };

    // Create email HTML with rating icons
    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
        <h2 style="color: #334155; text-align: center;">${survey.title}</h2>
        <p style="color: #64748B; margin-bottom: 30px; text-align: center;">Lütfen hizmetimizi değerlendirin</p>
        
        <div style="display: flex; justify-content: space-between; margin: 30px 0;">
          <a href="${ratingUrls[1]}" style="text-decoration: none; text-align: center; display: block; width: 18%;">
            <div style="font-size: 40px; margin-bottom: 10px;">😡</div>
            <div style="color: #d32f2f; font-size: 14px;">Çok Kötü</div>
          </a>
          
          <a href="${ratingUrls[2]}" style="text-decoration: none; text-align: center; display: block; width: 18%;">
            <div style="font-size: 40px; margin-bottom: 10px;">😕</div>
            <div style="color: #f57c00; font-size: 14px;">Kötü</div>
          </a>
          
          <a href="${ratingUrls[3]}" style="text-decoration: none; text-align: center; display: block; width: 18%;">
            <div style="font-size: 40px; margin-bottom: 10px;">😐</div>
            <div style="color: #ffc107; font-size: 14px;">Orta</div>
          </a>
          
          <a href="${ratingUrls[4]}" style="text-decoration: none; text-align: center; display: block; width: 18%;">
            <div style="font-size: 40px; margin-bottom: 10px;">🙂</div>
            <div style="color: #4caf50; font-size: 14px;">İyi</div>
          </a>
          
          <a href="${ratingUrls[5]}" style="text-decoration: none; text-align: center; display: block; width: 18%;">
            <div style="font-size: 40px; margin-bottom: 10px;">😍</div>
            <div style="color: #2196f3; font-size: 14px;">Çok İyi</div>
          </a>
        </div>
        
        <p style="color: #64748B; margin: 30px 0 15px; text-align: center;">Bir ikon seçtikten sonra ek yorumlarınızı da paylaşabilirsiniz.</p>
        
        <p style="color: #94A3B8; font-size: 12px; text-align: center; margin-top: 30px;">
          Bu e-posta otomatik olarak gönderilmiştir. Lütfen yanıtlamayınız.
        </p>
      </div>
    `;

    console.log('Sending email with HTML content (length):', emailHtml.length);

    // Gönderici e-posta adresini ayarla
    const fromEmail = isTest 
      ? `"Anket Sistemi" <${testAccount.user}>`
      : `"Anket Sistemi" <${process.env.EMAIL_FROM || 'noreply@anketsistemi.com'}>`;

    // Send the email
    const info = await transporter.sendMail({
      from: fromEmail,
      to: emailTo,
      subject: `${survey.title} - Değerlendirme Anketi`,
      html: emailHtml,
    });

    console.log('Email sent successfully:', info.messageId);
    
    // Test hesabı kullanılıyorsa, önizleme URL'sini logla
    if (isTest) {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('\n=========================================================');
      console.log('📧 E-POSTA ÖNİZLEMESİ İÇİN AŞAĞIDAN DEVAM EDİN 📧');
      console.log('=========================================================');
      console.log('Test e-postanızı görmek için bu linki tarayıcınızda açın:');
      console.log(previewUrl);
      console.log('=========================================================\n');
      
      return {
        messageId: info.messageId,
        previewUrl,
        success: true
      };
    }
    
    return {
      messageId: info.messageId,
      success: true
    };
  } catch (error) {
    console.error('E-posta gönderimi sırasında hata oluştu:', error);
    return {
      error: error.message,
      success: false
    };
  }
} 