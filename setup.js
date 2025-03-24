const fs = require('fs');
const readline = require('readline');
const { execSync } = require('child_process');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Default values
const defaults = {
  EMAIL_HOST: 'smtp.example.com',
  EMAIL_PORT: '587',
  EMAIL_SECURE: 'false',
  EMAIL_USER: 'your_email@example.com',
  EMAIL_PASS: 'your_password',
  EMAIL_FROM: 'survey@example.com',
  NEXT_PUBLIC_APP_URL: 'http://localhost:3000'
};

const envFile = '.env';
let envContent = '';

// Check if .env exists and read it
if (fs.existsSync(envFile)) {
  envContent = fs.readFileSync(envFile, 'utf8');
}

// Existing database URL
const dbUrlMatch = envContent.match(/DATABASE_URL="(.+)"/);
const dbUrl = dbUrlMatch ? dbUrlMatch[1] : 'file:./dev.db';

console.log('\n🔧 Email Anket Sistemi Kurulum Yardımcısı\n');
console.log('Bu script, e-posta gönderme ve diğer ayarları yapılandırmanıza yardımcı olacak.\n');
console.log('Her bir ayar için varsayılan değer parantez içinde gösterilir.');
console.log('Varsayılan değeri kullanmak için boş bırakıp Enter tuşuna basabilirsiniz.\n');

// Prepare questions
const questions = [
  {
    name: 'EMAIL_HOST',
    question: `SMTP sunucu adresi (${defaults.EMAIL_HOST}): `
  },
  {
    name: 'EMAIL_PORT',
    question: `SMTP port (${defaults.EMAIL_PORT}): `
  },
  {
    name: 'EMAIL_SECURE',
    question: `Güvenli bağlantı kullan (${defaults.EMAIL_SECURE}): `
  },
  {
    name: 'EMAIL_USER',
    question: `E-posta kullanıcı adı (${defaults.EMAIL_USER}): `
  },
  {
    name: 'EMAIL_PASS',
    question: `E-posta şifresi (${defaults.EMAIL_PASS}): `
  },
  {
    name: 'EMAIL_FROM',
    question: `Gönderen e-posta adresi (${defaults.EMAIL_FROM}): `
  },
  {
    name: 'NEXT_PUBLIC_APP_URL',
    question: `Uygulama URL'si (${defaults.NEXT_PUBLIC_APP_URL}): `
  }
];

// Store answers
const answers = {};

// Ask questions one by one
const askQuestion = (index) => {
  if (index >= questions.length) {
    generateEnvFile();
    return;
  }

  const question = questions[index];
  rl.question(question.question, (answer) => {
    answers[question.name] = answer.trim() || defaults[question.name];
    askQuestion(index + 1);
  });
};

// Generate the .env file
const generateEnvFile = () => {
  const envContent = `# Environment variables declared in this file are automatically made available to Prisma.
# See the documentation for more detail: https://pris.ly/d/prisma-schema#accessing-environment-variables-from-the-schema

# Prisma supports the native connection string format for PostgreSQL, MySQL, SQLite, SQL Server, MongoDB and CockroachDB.
# See the documentation for all the connection string options: https://pris.ly/d/connection-strings

DATABASE_URL="${dbUrl}"

# Email settings
EMAIL_HOST="${answers.EMAIL_HOST}"
EMAIL_PORT="${answers.EMAIL_PORT}"
EMAIL_SECURE="${answers.EMAIL_SECURE}"
EMAIL_USER="${answers.EMAIL_USER}"
EMAIL_PASS="${answers.EMAIL_PASS}"
EMAIL_FROM="${answers.EMAIL_FROM}"
NEXT_PUBLIC_APP_URL="${answers.NEXT_PUBLIC_APP_URL}"
`;

  fs.writeFileSync(envFile, envContent);
  console.log('\n✅ .env dosyası başarıyla oluşturuldu!\n');

  console.log('📋 Kurulumu tamamlamak için aşağıdaki adımları izleyin:');
  console.log('1. Veritabanını oluşturmak için: npx prisma db push');
  console.log('2. Uygulamayı başlatmak için: npm run dev');
  console.log('3. Tarayıcınızda http://localhost:3000 adresini açın\n');

  console.log('📧 E-posta gönderimi için:');
  console.log('- Test amaçlı bir Ethereal hesabı otomatik olarak oluşturulacaktır');
  console.log('- Gerçek e-posta gönderimleri için kendi SMTP ayarlarınızı kullanın');
  console.log('- Gmail kullanıyorsanız, "uygulama şifresi" oluşturmanız gerekebilir\n');

  console.log('🎉 İyi çalışmalar! 🎉\n');
  rl.close();

  // Ask if user wants to initialize the database now
  const initDbQuestion = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  initDbQuestion.question('Veritabanını şimdi oluşturmak ister misiniz? (E/h): ', (answer) => {
    if (!answer || answer.toLowerCase() === 'e') {
      console.log('\nVeritabanı oluşturuluyor...');
      try {
        execSync('npx prisma db push', { stdio: 'inherit' });
        console.log('✅ Veritabanı başarıyla oluşturuldu!');
      } catch (error) {
        console.error('❌ Veritabanı oluşturulurken bir hata oluştu:', error.message);
      }
    }
    initDbQuestion.close();
  });
};

// Start asking questions
askQuestion(0); 