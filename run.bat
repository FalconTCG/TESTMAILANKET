@echo off
echo Email Anket Sistemi Başlatılıyor...
echo.

REM Check if node_modules exists
if not exist node_modules (
  echo Bagimliliklari yukluyoruz, lutfen bekleyin...
  call npm install
  if %ERRORLEVEL% NEQ 0 (
    echo Bagimliliklari yuklerken bir hata olustu!
    pause
    exit /b 1
  )
)

REM Check if .env file exists
if not exist .env (
  echo Kurulum scripti calistiriliyor...
  call npm run setup
  if %ERRORLEVEL% NEQ 0 (
    echo Kurulum sirasinda bir hata olustu!
    pause
    exit /b 1
  )
)

echo.
echo Uygulama baslatiliyor...
echo Tarayicinizda http://localhost:3000 adresini acin
echo.
echo Uygulamayi durdurmak icin Ctrl+C tusuna basin, sonra Y yazin
echo.

call npm run dev

pause 