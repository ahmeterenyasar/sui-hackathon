# 🌊 Walrus Sites Deployment Rehberi

Bu rehber, On-chain LinkTree projenizi Walrus Sites üzerinde yayınlamanız için detaylı bilgiler içerir.

## 📚 Walrus Sites Nedir?

Walrus Sites, web sitelerini tamamen **on-chain** olarak barındıran bir platformdur. Geleneksel web hosting'den farklı olarak:

- ✅ Merkeziyetsiz storage
- ✅ Sansüre dayanıklı
- ✅ Kalıcı (silinmez)
- ✅ Sui blockchain üzerinde çalışır

## 🛠️ Kurulum

### 1. Walrus Site Builder'ı Yükle

```bash
cargo install --git https://github.com/MystenLabs/walrus-sites.git site-builder
```

Kurulumu doğrula:
```bash
site-builder --version
```

### 2. Projeyi Build Et

```bash
cd kumru-chain
npm run build
```

Bu komut `dist/` klasörü oluşturur.

## 📝 Konfigürasyon

### ws-resources.json

Bu dosya Walrus Sites konfigürasyonunu içerir:

```json
{
  "site_name": "OnChain LinkTree",
  "object_id": "YOUR_WALRUS_OBJECT_ID_HERE"
}
```

- **site_name**: Site adınız (opsiyonel)
- **object_id**: İlk deployment sonrası buraya object ID'yi ekleyin

### _redirects Dosyası

`public/_redirects` dosyası SPA routing için gereklidir:

```
/*    /index.html   200
```

Bu, tüm route'ları `index.html`'e yönlendirir (React Router için gerekli).

## 🚀 Deployment

### Otomatik Deployment (Önerilen)

```bash
npm run deploy:walrus
```

Script size epoch sayısını sorar. Testnet için `1` epoch yeterlidir.

### Manuel Deployment

```bash
site-builder publish --epochs 1 ./dist
```

### Deployment Çıktısı

Başarılı bir deployment sonrası şöyle bir çıktı görürsünüz:

```
Created new site: OnChain LinkTree
New site object ID: 0xfcafadd6894321705815d0b1f28246589d7e7127f52e417dc2338fa663a6e003
Browse the resulting site at: https://2oeqhsperzidl1mcmbpmf4zmvgrqjp0t1kfslb9jmr3v9s46ly.walrus.site
```

**ÖNEMLİ:** Bu bilgileri kaydedin:
- Object ID → `ws-resources.json`'a ekleyin
- Walrus URL → Paylaşmak için kullanın

## 🔄 Güncelleme

Sitenizi güncellemek için:

1. Değişiklikleri yapın
2. Build edin: `npm run build`
3. **Aynı object ID ile** tekrar deploy edin:

```bash
site-builder update --epochs 1 ./dist
```

veya `ws-resources.json`'da object ID varsa:

```bash
site-builder publish --epochs 1 ./dist
```

## 🌐 Routing

### Hash Routing vs Browser Routing

Walrus Sites, SPA'ler için **browser routing** desteği sunar. `_redirects` dosyası ile:

- ✅ `/profile/0x123...` gibi temiz URL'ler çalışır
- ✅ Hash routing (`#/profile/...`) gerekmez
- ✅ Direct navigation desteklenir

### Dynamic Routes

React Router'daki dynamic route'lar otomatik çalışır:

```tsx
<Route path="/profile/:objectId" element={<ProfileView />} />
```

URL: `https://your-site.walrus.site/profile/0x123...`

## 📊 Epochs ve Maliyet

### Epoch Nedir?

Sui blockchain'de bir epoch yaklaşık **24 saat**dir. Walrus Sites'a deploy ederken kaç epoch için ödeme yapacağınızı seçersiniz.

### Maliyet Hesaplama

```
Maliyet = Dosya Boyutu × Epoch Sayısı × Epoch Fiyatı
```

**Örnek:**
- Dosya boyutu: 2 MB
- Epoch sayısı: 1
- Testnet: Ücretsiz (faucet kullanın)

### Epoch Uzatma

Site'iniz expire olmadan önce epoch uzatabilirsiniz:

```bash
site-builder extend --object-id 0xYOUR_OBJECT_ID --epochs 10
```

## 🔗 Linking

### Internal Links

Kendi site'nizdeki sayfalara link:

```tsx
<Link to="/dashboard">Dashboard</Link>
```

### External Links

Diğer Walrus Sites'a link:

```html
<a href="https://other-site.walrus.site">Other Site</a>
```

### Sui Objects'e Link

Profil sayfalarınıza link:

```
https://your-site.walrus.site/profile/0x123abc...
```

## 📱 Custom Domain (SuiNS)

### SuiNS Adı Satın Al

```bash
# SuiNS portal'dan domain satın alın
# Örnek: mysite.sui
```

### Domain'i Walrus Site'a Bağla

1. SuiNS portal'da domain ayarlarına git
2. Walrus site object ID'nizi ekleyin
3. Domain propagation'ı bekleyin (birkaç dakika)

Artık site'nize `https://mysite.sui` ile erişilebilir!

## 🐛 Sorun Giderme

### "Object not found" hatası

```bash
# Sui wallet'ınızda yeterli bakiye olduğundan emin olun
sui client gas

# Gerekirse faucet kullanın
sui client faucet
```

### "Site expired" hatası

Site'nizin epoch'u dolmuş. Yeniden deploy edin:

```bash
site-builder publish --epochs 1 ./dist
```

### Routing çalışmıyor

`public/_redirects` dosyasının build'e dahil olduğundan emin olun:

```bash
ls -la dist/_redirects
```

### CORS hataları

Walrus Sites CORS'u otomatik handle eder. Sorun devam ederse:

1. Browser cache'i temizleyin
2. Incognito modda deneyin
3. Farklı browser'da test edin

## 📚 Referanslar

- [Walrus Sites Docs](https://docs.wal.app/walrus-sites/)
- [Site Builder Tutorial](https://docs.wal.app/walrus-sites/tutorial-publish.html)
- [Routing Guide](https://docs.wal.app/walrus-sites/routing.html)
- [Linking Guide](https://docs.wal.app/walrus-sites/linking.html)

## 💡 Best Practices

### 1. Build Optimization

```bash
# Vite build otomatik optimize eder
npm run build

# Dosya boyutlarını kontrol et
du -sh dist/*
```

### 2. Asset Management

- Images'ları optimize edin (WebP kullanın)
- Lazy loading kullanın
- Code splitting yapın (Vite otomatik)

### 3. Cache Busting

Vite otomatik hash ekler:

```
main.abc123.js
style.def456.css
```

### 4. Testing

Deploy öncesi local test:

```bash
npm run preview
```

## 🎯 Checklist

Deploy öncesi kontrol listesi:

- [ ] `npm run build` hatasız çalışıyor
- [ ] `dist/` klasörü oluşturuldu
- [ ] `dist/_redirects` dosyası var
- [ ] `ws-resources.json` konfigüre edildi (güncelleme için)
- [ ] Sui wallet'ta yeterli bakiye var
- [ ] site-builder kurulu

Deploy sonrası:

- [ ] Site URL'si çalışıyor
- [ ] Routing tüm sayfalarda çalışıyor
- [ ] Cüzdan bağlama çalışıyor
- [ ] Transaction'lar başarılı
- [ ] Object ID kayıtlı

---

**Happy Deploying! 🌊**
