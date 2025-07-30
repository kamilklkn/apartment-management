# Apartman Aidat Takip Sistemi

Modern ve kullanıcı dostu apartman aidat takip sistemi. Next.js, Supabase ve Tailwind CSS ile geliştirilmiştir.

## Özellikler

✅ **Excel Dosyası Yükleme**: Banka hesap özetlerini otomatik işleme
✅ **Kullanıcı Dashboard**: Kişisel ödeme takibi ve borç görüntüleme
✅ **Admin Paneli**: Kullanıcı yönetimi ve parametre ayarları
✅ **Otomatik Eşleştirme**: Ödemeleri kullanıcılarla otomatik eşleştirme
✅ **Duplikasyon Kontrolü**: Aynı ödemenin tekrar kaydedilmesini engelleme
✅ **Responsive Tasarım**: Mobil ve masaüstü uyumlu
✅ **Güvenli Giriş**: Kullanıcı bazlı kimlik doğrulama

## Kurulum

### 1. Projeyi İndirin
```bash
git clone <your-repo-url>
cd apartment-management
npm install
```

### 2. Supabase Kurulumu
1. [supabase.com](https://supabase.com) hesabı oluşturun
2. Yeni proje oluşturun
3. SQL Editor'den database tablolarını oluşturun
4. API anahtarlarını kopyalayın

### 3. Environment Variables
`.env.local` dosyası oluşturun:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 4. Geliştirme Sunucusu
```bash
npm run dev
```

## Kullanım

### Kullanıcı Girişi
- Daire numaranız ile giriş yapın
- Varsayılan şifre: `apartment123`

### Admin Girişi
- Daire numarası: `999`
- Şifre: `admin123`

## Deployment (Vercel)

1. GitHub'a projeyi yükleyin
2. Vercel hesabı oluşturun
3. Projeyi import edin
4. Environment variables ekleyin
5. Deploy edin

## Teknik Detaylar

- **Frontend**: Next.js 14, React 18, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Custom JWT-less auth
- **File Processing**: xlsx library
- **Deployment**: Vercel

## Güvenlik

- SQL injection koruması
- XSS koruması
- Rate limiting
- Input validation
- Secure environment variables

## Lisans

MIT License