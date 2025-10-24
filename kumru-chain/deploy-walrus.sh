#!/bin/bash

# On-chain LinkTree - Walrus Deployment Script

echo "🚀 On-chain LinkTree Deployment"
echo "================================"
echo ""

# Check if dist directory exists
if [ ! -d "dist" ]; then
    echo "❌ dist klasörü bulunamadı!"
    echo "Önce 'npm run build' komutunu çalıştırın."
    exit 1
fi

echo "📦 Build klasörü bulundu: dist/"
echo ""

# Check if site-builder is installed
if ! command -v site-builder &> /dev/null; then
    echo "⚠️  site-builder kurulu değil!"
    echo ""
    echo "Kurmak için şu komutu çalıştırın:"
    echo "cargo install --git https://github.com/MystenLabs/walrus-sites.git site-builder"
    echo ""
    exit 1
fi

echo "✅ site-builder bulundu"
echo ""

# Ask for epochs
read -p "Kaç epoch için deploy etmek istiyorsunuz? [default: 1]: " EPOCHS
EPOCHS=${EPOCHS:-1}

echo ""
echo "🌐 Walrus Sites'a deploy ediliyor..."
echo "Epochs: $EPOCHS"
echo ""

# Deploy to Walrus
site-builder publish --epochs "$EPOCHS" ./dist

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment başarılı!"
    echo ""
    echo "🎉 Projeniz artık Walrus Sites üzerinde yayında!"
    echo ""
    echo "📝 NOT: ws-resources.json dosyasını güncellemeyi unutmayın:"
    echo "   object_id alanına deployment çıktısındaki object ID'yi ekleyin"
    echo ""
    echo "📝 Çıktıdaki Walrus Site URL'yi kopyalayıp paylaşabilirsiniz."
else
    echo ""
    echo "❌ Deployment başarısız!"
    echo "Hata detayları yukarıda gösterilmektedir."
    exit 1
fi
