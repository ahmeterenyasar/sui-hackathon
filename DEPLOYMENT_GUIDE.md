# 📘 Deployment Rehberi

Bu rehber, On-chain LinkTree projesini baştan sona deploy etmeniz için adım adım talimatlar içerir.

## 📋 Ön Gereksinimler

### 1. Sui CLI Kurulumu

```bash
# macOS/Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
cargo install --locked --git https://github.com/MystenLabs/sui.git --branch testnet sui
```

Kurulumu doğrula:
```bash
sui --version
```

### 2. Sui Cüzdan Kurulumu

```bash
# Yeni cüzdan oluştur
sui client new-address ed25519

# Testnet'e bağlan
sui client new-env --alias testnet --rpc https://fullnode.testnet.sui.io:443
sui client switch --env testnet
```

### 3. Testnet Faucet (Test SUI Al)

```bash
sui client faucet
```

veya Discord Faucet: https://discord.com/channels/916379725201563759/971488439931392130

Bakiyeyi kontrol et:
```bash
sui client gas
```

### 4. Node.js & NPM

Node.js 18+ gerekli:
```bash
node --version  # v18.0.0 veya üzeri olmalı
npm --version
```

---

## 🚀 Adım 1: Move Kontratını Deploy Et

### 1.1. Move Klasörüne Git

```bash
cd move
```

### 1.2. Build Test

```bash
sui move build
```

Hata yoksa devam et.

### 1.3. Deploy Script'ini Çalıştır

```bash
./deploy.sh
```

Script otomatik olarak:
- ✅ Build yapar
- ✅ Contract'ı deploy eder
- ✅ Package ID'yi kaydeder

### 1.4. Package ID'yi Kaydet

Deploy sonrası göreceğiniz **Package ID**'yi kopyalayın:

```
📦 Package ID: 0xabcdef123456789...
```

Bu ID `kumru-chain/PACKAGE_ID.txt` dosyasına otomatik kaydedilir.

---

## 🎨 Adım 2: Frontend'i Yapılandır

### 2.1. Frontend Klasörüne Git

```bash
cd ../kumru-chain
```

### 2.2. Package ID'yi Güncelle

`src/CreateProfile.tsx` dosyasını açın ve şu satırı bulun:

```typescript
const PACKAGE_ID = 'YOUR_PACKAGE_ID_HERE'
```

Aldığınız Package ID ile değiştirin:

```typescript
const PACKAGE_ID = '0xabcdef123456789...'
```

### 2.3. Bağımlılıkları Kur

```bash
npm install
```

### 2.4. Local Test

```bash
npm run dev
```

Tarayıcıda `http://localhost:5173` adresine gidin.

**Test Adımları:**
1. ✅ "Cüzdan Bağla" butonuna tıkla
2. ✅ Sui cüzdanını bağla (Sui Wallet browser extension gerekli)
3. ✅ "Profil Oluştur" butonuna tıkla
4. ✅ Form'u doldur ve gönder
5. ✅ Transaction'ı onayla
6. ✅ Sui Explorer'da kontrol et

---

## 🌐 Adım 3: Walrus Sites'a Deploy

### 3.1. Walrus Site Builder Kur

```bash
cargo install --git https://github.com/MystenLabs/walrus-sites.git site-builder
```

Kurulumu doğrula:
```bash
site-builder --version
```

### 3.2. Build

```bash
npm run build
```

Bu komut `dist/` klasörü oluşturur.

### 3.3. Deploy

#### Otomatik (Script ile):

```bash
npm run deploy:walrus
```

#### Manuel:

```bash
site-builder publish --epochs 1 ./dist
```

### 3.4. Walrus URL'yi Kaydet

Deploy sonrası göreceğiniz URL'yi kaydedin:

```
✅ Walrus Site URL: https://XXXXXXXX.walrus.site
```

Bu URL'yi paylaşabilirsiniz!

---

## 🔍 Adım 4: Doğrulama

### 4.1. Contract'ı Doğrula

Sui Explorer'da kontrol et:
- Testnet: https://suiscan.xyz/testnet/object/{PACKAGE_ID}

### 4.2. Frontend'i Test Et

1. **Local Test:**
   ```bash
   npm run dev
   ```
   
2. **Walrus Test:**
   Walrus URL'nizi tarayıcıda açın

### 4.3. Profil Oluştur ve Test Et

1. Cüzdan bağla
2. Profil oluştur
3. Transaction'ı Explorer'da kontrol et
4. Object ID'yi not et
5. `/profile/{OBJECT_ID}` adresine git
6. Profilin görüntülendiğini doğrula

---

## 🐛 Sorun Giderme

### "insufficient gas" hatası

```bash
# Daha fazla test SUI al
sui client faucet
```

### Package ID bulunamıyor

```bash
# PACKAGE_ID.txt dosyasını kontrol et
cat kumru-chain/PACKAGE_ID.txt

# veya deploy log'larını kontrol et
```

### Build hatası

```bash
# Node modules'ı temizle
rm -rf node_modules package-lock.json
npm install

# Tailwind CSS'i yeniden kur
npm install -D tailwindcss postcss autoprefixer
```

### Walrus deployment hatası

```bash
# Sui wallet'ınızda yeterli bakiye olduğundan emin olun
sui client gas

# Gerekirse faucet kullanın
sui client faucet
```

### "Module not found" hatası

Package ID'yi doğru yere yazdığınızdan emin olun:
```
kumru-chain/src/CreateProfile.tsx
```

---

## 📊 Maliyet Tahmini

| İşlem | Tahmini Gas | Açıklama |
|-------|-------------|----------|
| Contract Deploy | ~0.05 SUI | One-time |
| Profil Oluştur | ~0.001 SUI | Per profile |
| Profil Güncelle | ~0.001 SUI | Per update |
| Walrus Deploy | ~0.1 SUI | Per epoch |

---

## 🎉 Deployment Tamamlandı!

Başarılı bir deployment sonrası:

1. ✅ Move contract Sui testnet'te
2. ✅ Frontend Walrus Sites'ta
3. ✅ Tamamen merkeziyetsiz bir LinkTree uygulamanız var!

### Sıradaki Adımlar:

- 🎨 Tasarımı özelleştir
- 🔗 SuiNS domain ekle
- 📱 Daha fazla social link tipi ekle
- 🎯 Analytics ekle

---

## 📞 Yardım

Sorunlarla karşılaşırsanız:

1. GitHub Issues: Repository'de issue açın
2. Sui Discord: https://discord.gg/sui
3. Documentation: https://docs.sui.io

---

**Mutlu Deployment! 🚀**
