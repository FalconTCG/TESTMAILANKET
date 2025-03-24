#!/bin/bash

echo "Email Anket Sistemi Başlatılıyor..."
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
  echo "Bağımlılıkları yüklüyoruz, lütfen bekleyin..."
  npm install
  if [ $? -ne 0 ]; then
    echo "Bağımlılıkları yüklerken bir hata oluştu!"
    exit 1
  fi
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "Kurulum scripti çalıştırılıyor..."
  npm run setup
  if [ $? -ne 0 ]; then
    echo "Kurulum sırasında bir hata oluştu!"
    exit 1
  fi
fi

echo ""
echo "Uygulama başlatılıyor..."
echo "Tarayıcınızda http://localhost:3000 adresini açın"
echo ""
echo "Uygulamayı durdurmak için Ctrl+C tuşuna basın"
echo ""

npm run dev 