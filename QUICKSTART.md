# 🚀 Quick Start Guide

## Hızlı Başlangıç

### 1️⃣ Move Kontratını Deploy Et

```bash
cd move
./deploy.sh
```

📦 Package ID'yi kopyala ve `kumru-chain/src/CreateProfile.tsx` + `kumru-chain/src/Dashboard.tsx` dosyalarına yapıştır.

### 2️⃣ Frontend'i Çalıştır

```bash
cd ../kumru-chain
npm install
npm run dev
```

🌐 Tarayıcıda: http://localhost:5173

### 3️⃣ Test Et

1. Cüzdan bağla (Sui Wallet extension gerekli)
2. Dashboard'a git
3. Profil oluştur veya güncelle
4. Profil sayfanı görüntüle

### 4️⃣ Walrus'a Deploy Et

```bash
npm run build
npm run deploy:walrus
```

🎉 Walrus URL'yi paylaş!

---

## 📁 Proje Yapısı

```
sui-hackathon/
├── move/                   # Smart contracts
│   ├── sources/
│   │   └── profile.move    # Profile kontratı
│   └── deploy.sh           # Deploy scripti
│
├── kumru-chain/            # Frontend
│   ├── src/
│   │   ├── App.tsx         # Ana sayfa & routing
│   │   ├── Dashboard.tsx   # Profil yönetimi
│   │   ├── CreateProfile.tsx
│   │   └── ProfileView.tsx
│   └── deploy-walrus.sh    # Walrus deploy
│
├── README.md               # Ana dökümantasyon
├── DEPLOYMENT_GUIDE.md     # Detaylı deployment
└── WALRUS_GUIDE.md         # Walrus Sites rehberi
```

---

## 🎯 Özellikler

- ✅ **Cüzdan ile giriş** - Sui Wallet entegrasyonu
- ✅ **Dashboard** - Profil oluştur ve düzenle
- ✅ **Real-time Preview** - Değişiklikleri anında gör
- ✅ **Dynamic Links** - Sınırsız link ekle
- ✅ **On-chain Storage** - Veriler blockchain'de
- ✅ **Walrus Sites** - Tam on-chain hosting
- ✅ **SPA Routing** - Temiz URL'ler

---

## 🔗 Linkler

- 📖 [Ana README](./README.md)
- 🚀 [Deployment Guide](./DEPLOYMENT_GUIDE.md)
- 🌊 [Walrus Guide](./WALRUS_GUIDE.md)
- 📦 [Sui Docs](https://docs.sui.io)
- 🐳 [Walrus Docs](https://docs.wal.app)

---

## 💻 Gereksinimler

- Node.js 18+
- Sui CLI
- Sui Wallet (browser extension)
- Cargo & Rust (Walrus için)

---

## 🆘 Yardım

Sorun mu yaşıyorsun?

1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) → Sorun giderme
2. [WALRUS_GUIDE.md](./WALRUS_GUIDE.md) → Walrus sorunları
3. GitHub Issues → Yeni issue aç

---

**Built with ❤️ on Sui + Walrus**
