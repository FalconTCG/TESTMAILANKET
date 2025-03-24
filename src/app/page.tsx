import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  const features = [
    {
      icon: '⭐',
      title: '5 Seçenekli Puanlama Sistemi',
      description: 'Etkili emoji puanlama sistemi ile müşteri memnuniyetini ölçün',
    },
    {
      icon: '📊',
      title: 'Görsel Analizler',
      description: 'Sonuçları net ve anlaşılır grafiklerle görselleştirin',
    },
    {
      icon: '📝',
      title: 'Müşteri Yorumları',
      description: 'Sayısal verinin ötesinde metin tabanlı geri bildirim toplayın',
    },
    {
      icon: '📋',
      title: 'Anket Şablonları',
      description: 'Hazır şablonlar ile hızlıca anketler oluşturun',
    },
    {
      icon: '📨',
      title: 'Otomatik E-posta Gönderimi',
      description: 'E-posta gönderimlerini otomatize edin ve takip edin',
    },
    {
      icon: '📱',
      title: 'Mobil Uyumlu Tasarım',
      description: 'Her cihazda mükemmel görünen anketler oluşturun',
    },
  ];

  const testimonials = [
    {
      quote: "AnketApp sayesinde müşteri geri bildirimlerini toplamak çok daha kolay hale geldi. Kullanımı son derece basit.",
      author: "Ayşe Yılmaz",
      company: "Pazarlama Müdürü, TechCorp"
    },
    {
      quote: "Anketleri özelleştirmek ve sonuçlarını analiz etmek için harika bir platform. İşimizi çok kolaylaştırdı.",
      author: "Mehmet Demir",
      company: "Müşteri İlişkileri, GlobalSoft"
    },
    {
      quote: "Pastel renkli arayüzü ve kullanıcı dostu tasarımı ile rakiplerinden ayrılıyor. Kesinlikle tavsiye ederim.",
      author: "Zeynep Kara",
      company: "UX Tasarımcı, DesignStudio"
    }
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-pastel-blue/30 to-pastel-purple/30 -z-10"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pastel-yellow rounded-full blur-3xl opacity-20 -z-10"></div>
        <div className="absolute bottom-10 left-10 w-60 h-60 bg-pastel-green rounded-full blur-3xl opacity-20 -z-10"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="lg:w-1/2 text-center lg:text-left">
              <div className="inline-block px-3 py-1 mb-4 bg-primary/10 text-primary rounded-full text-sm font-medium">
                Modern Anket Çözümü
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-pastel-purple to-primary-dark bg-clip-text text-transparent">
                Müşteri Memnuniyetini Ölçmenin En Profesyonel Yolu
              </h1>
              <p className="text-lg text-text-secondary mb-8 max-w-xl mx-auto lg:mx-0">
                AnketApp, profesyonel e-posta anketleri ile müşterilerinizden değerli geri bildirimler toplamanızı sağlayan modern ve kullanıcı dostu bir platformdur.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 mb-6">
                <Link href="/create">
                  <Button size="lg" className="rounded-full px-8 py-6 shadow-medium text-base">
                    <span className="mr-2">🚀</span> Hemen Başla
                  </Button>
                </Link>
                <Link href="/templates">
                  <Button size="lg" variant="outline" className="rounded-full px-8 py-6 text-base">
                    <span className="mr-2">📋</span> Şablonları İncele
                  </Button>
                </Link>
              </div>
              <p className="text-sm text-text-light">
                <span className="inline-block mr-2">✓</span> Kurulum gerektirmez
                <span className="inline-block mx-2">✓</span> 14 gün ücretsiz deneme
                <span className="inline-block mx-2">✓</span> Kredi kartı gerekmez
              </p>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-2xl shadow-medium overflow-hidden border border-white/20 backdrop-blur-sm bg-white/30">
                <div className="absolute top-0 left-0 w-full h-10 bg-gradient-to-r from-pastel-blue to-pastel-purple flex items-center px-4">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 rounded-full bg-pastel-pink"></div>
                    <div className="w-3 h-3 rounded-full bg-pastel-yellow"></div>
                    <div className="w-3 h-3 rounded-full bg-pastel-green"></div>
                  </div>
                </div>
                <div className="pt-12 p-4">
                  <div className="bg-white rounded-lg shadow-soft p-6">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 rounded-full bg-pastel-blue/30 flex items-center justify-center text-primary text-2xl mr-4">
                        📮
                      </div>
                      <div>
                        <h3 className="font-semibold">Müşteri Memnuniyet Anketi</h3>
                        <p className="text-sm text-text-light">Ürün ve hizmetlerimizi değerlendirin</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div className="p-4 bg-background rounded-lg">
                        <p className="font-medium mb-2">Hizmetimizden ne kadar memnun kaldınız?</p>
                        <div className="flex justify-center">
                          <div className="flex space-x-3">
                            {[1, 2, 3, 4, 5].map((rating) => (
                              <div key={rating} className={`w-10 h-10 flex items-center justify-center rounded-full ${rating === 4 ? 'bg-primary text-white' : 'bg-gray-100'}`}>
                                {rating}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="p-4 bg-background rounded-lg">
                        <p className="font-medium mb-2">Yorumlarınız</p>
                        <div className="h-8 bg-white rounded border border-gray-200"></div>
                      </div>
                      <button className="w-full py-2 rounded-lg bg-primary text-white font-medium">
                        Gönder
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute top-20 -right-4 w-20 h-20 bg-pastel-yellow/40 rounded-full blur-xl -z-1"></div>
              <div className="absolute bottom-10 -left-4 w-16 h-16 bg-pastel-pink/40 rounded-full blur-xl -z-1"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-8 bg-background-light border-y border-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <p className="text-center text-sm font-medium text-text-light mb-6">GÜVEN DUYULAN MARKALAR</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {['Company A', 'Company B', 'Company C', 'Company D', 'Company E'].map((company, index) => (
              <div key={index} className="text-xl font-semibold text-text-light/30">
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-3 bg-secondary/20 text-secondary-dark rounded-full text-sm font-medium">
              ÖZELLİKLER
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Neden AnketApp?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Profesyonel özelliklerle donatılmış AnketApp, müşteri memnuniyetini ölçmek için ihtiyacınız olan her şeyi sunar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card group hover:shadow-medium transition-all duration-300 hover:-translate-y-1 bg-white/80 backdrop-blur-sm border-t border-l border-white/50">
                <div className="bg-gradient-to-br from-background to-transparent w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-background-light">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <div className="inline-block px-3 py-1 mb-3 bg-pastel-yellow/30 text-yellow-700 rounded-full text-sm font-medium">
              REFERANSLAR
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Müşterilerimiz Ne Diyor?</h2>
            <p className="text-text-secondary max-w-2xl mx-auto">
              Binlerce memnun kullanıcıdan birkaçının AnketApp hakkındaki görüşleri
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-soft p-8 border border-gray-100 relative">
                <div className="absolute -top-4 -left-4 text-4xl opacity-20">❝</div>
                <p className="mb-6 text-text-secondary italic relative z-10">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pastel-purple flex items-center justify-center text-white font-bold mr-3">
                    {testimonial.author.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary">{testimonial.author}</p>
                    <p className="text-sm text-text-light">{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-primary mb-2">500+</p>
              <p className="text-text-secondary">Memnun Müşteri</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">10,000+</p>
              <p className="text-text-secondary">Gönderilen Anket</p>
            </div>
            <div>
              <p className="text-5xl font-bold text-primary mb-2">95%</p>
              <p className="text-text-secondary">Müşteri Memnuniyeti</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/80 to-pastel-purple/80 -z-10"></div>
        <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-primary/10 to-transparent bg-no-repeat bg-cover opacity-10 -z-5"></div>
        
        <div className="container mx-auto px-4 max-w-6xl relative z-10">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-12 md:p-16 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Müşteri Görüşlerinizi Toplamaya Hemen Başlayın
            </h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-10 text-lg">
              Kullanımı kolay arayüzü, profesyonel şablonları ve detaylı analizleriyle AnketApp, işletmenizin büyümesine yardımcı olacak.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/create">
                <Button size="lg" className="rounded-full px-10 py-7 bg-white text-primary hover:bg-white/90 text-base font-semibold shadow-lg">
                  <span className="mr-2">🚀</span> Ücretsiz Başlayın
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button size="lg" variant="outline" className="rounded-full px-10 py-7 text-white border-white hover:bg-white/10 text-base font-semibold">
                  <span className="mr-2">🔍</span> Demo Göster
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 