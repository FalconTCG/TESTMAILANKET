# E-posta Anket Sistemi

Bu uygulama, firmalar veya bireyler tarafından sunulan hizmet kalitesini değerlendirmek için 5 seçenekli ikon tabanlı e-posta anketleri göndermenizi sağlar. Alıcılar ikonları tıklayarak değerlendirme yaptığında, yanıtlar otomatik olarak kaydedilir ve bir dashboard üzerinden grafiksel analizlerle birlikte görüntülenebilir.

## Özellikler

- 5 seçenekli ikon değerlendirme sistemi (çok kötü'den çok iyi'ye)
- Toplu e-posta gönderimi
- Otomatik yanıt toplama
- Yorum ekleme imkanı
- Grafiksel analiz dashboardu
- Yanıt istatistikleri (ortalama puan, toplam yanıt, en çok verilen puan)
- Yorum ve geri bildirim yönetimi

## Başlangıç

### Gereksinimler

- Node.js 18 veya üzeri
- NPM veya Yarn

### Hızlı Başlangıç

Tüm kurulum adımlarını otomatik olarak gerçekleştiren çalıştırma scriptlerini kullanabilirsiniz:

- **Windows için**: `run.bat` dosyasını çift tıklayarak çalıştırın
- **Linux/macOS için**: Terminal'de şu komutu çalıştırın:
  ```
  chmod +x run.sh && ./run.sh
  ```

Bu scriptler, gerekli bağımlılıkları yükleyecek, kurulum yardımcısını çalıştıracak ve uygulamayı başlatacaktır.

### Manuel Kurulum

1. Projeyi klonlayın
   ```
   git clone https://github.com/yourusername/email-anket-sistemi.git
   cd email-anket-sistemi
   ```

2. Bağımlılıkları yükleyin
   ```
   npm install
   ```

3. Kurulum yardımcısını çalıştırın
   ```
   npm run setup
   ```
   Bu komut, e-posta ayarlarınızı yapılandırmanıza yardımcı olacak ve veritabanını oluşturacaktır.

4. Uygulamayı başlatın
   ```
   npm run dev
   ```

5. Tarayıcınızda `http://localhost:3000` adresini açın

### Manuel E-posta Ayarları

Kurulum yardımcısını kullanmak yerine, `.env` dosyasında e-posta ayarlarınızı manuel olarak yapılandırabilirsiniz:

```
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
EMAIL_FROM=survey@example.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Kullanım

1. Ana sayfadan "Anket Oluştur" butonuna tıklayın
2. Anket adı, açıklama ve e-posta adreslerini girin (virgülle ayırın)
3. "Anketi Oluştur ve Gönder" butonuna tıklayın
4. Alıcılar e-posta içindeki ikonları tıklayarak anketi yanıtlar
5. Alıcılar opsiyonel olarak yorum ekleyebilir
6. Sonuçları "Sonuçları Görüntüle" butonuna tıklayarak dashboard'da izleyin
7. "Yorumlar" sekmesinden alınan tüm yorumları görüntüleyin

## Nasıl Çalışır?

1. Sistem, nodemailer kullanarak belirtilen e-posta adreslerine 5 seçenekli ikon değerlendirme anketi gönderir
2. Alıcılar e-postadaki ikonlara tıklayarak değerlendirme yapar
3. Sistem, alıcının tıkladığı ikona göre puanı kaydeder ve alıcıya bir teşekkür sayfası gösterir
4. Alıcılar isteğe bağlı olarak yorum ekleyebilir
5. Tüm yanıtlar veritabanında saklanır ve dashboard'da görüntülenir
6. Dashboard'da yanıtların grafiksel analizleri sunulur

## Proje Yapısı

- `/prisma` - Veritabanı modelleri
- `/src/app` - Next.js sayfa bileşenleri
- `/src/app/api` - API endpoint'leri
- `/src/components` - Paylaşılan UI bileşenleri
- `/src/lib` - Yardımcı fonksiyonlar ve araçlar

## Lisans

MIT 