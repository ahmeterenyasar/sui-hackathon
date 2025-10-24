# 🔗 On-chain LinkTree - Sui Blockchain

Tamamen merkeziyetsiz, Sui Blockchain üzerinde çalışan LinkTree alternatifi.

## 🎯 Özellikler

- ✅ **Cüzdan ile giriş** - Sui cüzdanınızı bağlayın
- ✅ **On-chain profil** - Bio, avatar ve linkler blockchain'de saklanır
- ✅ **Paylaşılabilir URL** - Her profil için benzersiz URL
- ✅ **Walrus Sites** - Frontend tamamen on-chain barındırılıyor
- ✅ **Sansüre dayanıklı** - Hiç kimse profilinizi silemez

## 🚀 Kurulum

### 1. Bağımlılıkları Yükle

```bash
cd kumru-chain
npm install
```

### 2. Move Kontratını Deploy Et

```bash
cd ../move
sui client publish --gas-budget 100000000
```

Deploy sonrası aldığınız **Package ID**'yi şu dosyalardaki `PACKAGE_ID` değişkenine ekleyin:
- `kumru-chain/src/CreateProfile.tsx`
- `kumru-chain/src/Dashboard.tsx`

```typescript
const PACKAGE_ID = 'YOUR_PACKAGE_ID_HERE'
```

### 3. Development Server'ı Başlat

```bash
cd ../kumru-chain
npm run dev
```

## 📦 Walrus Sites'a Deploy

### 1. Build

```bash
cd kumru-chain
npm run build
```

### 2. Walrus Site Builder Kur

```bash
cargo install --git https://github.com/MystenLabs/walrus-sites.git site-builder
```

### 3. Deploy

```bash
site-builder publish --epochs 1 ./dist
```

Çıktıdaki **Walrus Site URL**'yi kullanarak projenizi paylaşabilirsiniz!

## 🏗️ Proje Yapısı

```
├── move/                      # Move smart contracts
│   ├── sources/
│   │   └── profile.move       # Profil kontratı
│   └── Move.toml
├── kumru-chain/               # React frontend
│   ├── src/
│   │   ├── App.tsx            # Ana uygulama & routing
│   │   ├── Dashboard.tsx      # Profil yönetimi dashboard
│   │   ├── CreateProfile.tsx  # Profil oluşturma formu
│   │   ├── ProfileView.tsx    # Profil görüntüleme
│   │   ├── main.tsx           # Web3 provider setup
│   │   └── index.css          # Animasyonlu arka plan
│   ├── public/
│   │   └── _redirects         # Walrus Sites routing
│   ├── ws-resources.json      # Walrus Sites config
│   └── package.json
└── README.md
```

## 🔧 Teknolojiler

- **Blockchain**: Sui Network (Testnet)
- **Smart Contract**: Move
- **Frontend**: React + TypeScript + Vite
- **Web3**: Mysten dApp Kit
- **Styling**: Tailwind CSS
- **Hosting**: Walrus Sites

## 📝 Kullanım

### Dashboard

1. Ana sayfadan "Dashboard" butonuna tıklayın
2. Profiliniz yoksa oluşturma formu görünür
3. Profiliniz varsa:
   - Sol tarafta profil önizlemesi
   - Sağ tarafta düzenleme formu
   - "Düzenle" butonuna tıklayarak linklerinizi güncelleyebilirsiniz

### Profil Oluşturma

1. "Cüzdan Bağla" butonuna tıklayın
2. Sui cüzdanınızı seçin ve bağlayın
3. Dashboard'a gidin veya "Profil Oluştur" butonuna tıklayın
4. Bio, avatar URL ve linklerinizi girin
5. Transaction'ı onaylayın
6. Sui Explorer'da kontrol edin!

### Profil Görüntüleme

Profil URL formatı:
```
/profile/{OBJECT_ID}
```

Object ID'yi Dashboard'dan veya Sui Explorer'dan alabilirsiniz.

## 🧪 Test

### Local Test

```bash
cd kumru-chain
npm run dev
```

Tarayıcıda `http://localhost:5173` adresine gidin.

### Move Kontrat Test

```bash
cd move
sui move test
```

## 🎨 Özelleştirme

### Renkler

`tailwind.config.js` dosyasında tema renklerini değiştirebilirsiniz:

```javascript
theme: {
  extend: {
    colors: {
      primary: '#your-color',
    },
  },
}
```

### Animasyonlar

`kumru-chain/src/index.css` dosyasındaki particle animasyonlarını özelleştirebilirsiniz.

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing`)
3. Commit yapın (`git commit -m 'Add amazing feature'`)
4. Push yapın (`git push origin feature/amazing`)
5. Pull Request açın

## 📄 Lisans

MIT License

## 🔗 Bağlantılar

- [Sui Documentation](https://docs.sui.io)
- [Walrus Sites](https://docs.walrus.site)
- [Mysten dApp Kit](https://sdk.mystenlabs.com/dapp-kit)

## 💡 Avantajlı Özellikler

Bu proje şu ek özelliklere sahiptir:

- ✨ **Dashboard** - Profillerinizi görüntüleme ve düzenleme
- 🎯 **Real-time Önizleme** - Değişiklikleri anında görün
- ✨ **Avatar desteği** - Profil resmi ekleyebilirsiniz
- 🎯 **Dinamik linkler** - Sınırsız sayıda link ekleyebilirsiniz
- 🔍 **Title + URL** - Her link için açıklayıcı başlık
- 🎨 **Modern UI** - Gradient'ler ve animasyonlu arka plan
- 📱 **Responsive** - Mobil uyumlu tasarım
- 🔄 **Update fonksiyonu** - Mevcut profilleri güncelleyin
- 🌐 **Walrus Sites** - Tam on-chain hosting

## 🐛 Bilinen Sorunlar

- Move kontratı deploy edilmeden frontend çalışmaz
- Package ID mutlaka `CreateProfile.tsx`'te güncellenmelidir

## 📞 Destek

Sorularınız için issue açabilirsiniz!

---

**Built with ❤️ on Sui Network**