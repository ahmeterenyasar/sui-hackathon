#!/bin/bash

# On-chain LinkTree - Move Contract Deployment Script

echo "🏗️  Move Contract Deployment"
echo "============================"
echo ""

# Check if in move directory
if [ ! -f "Move.toml" ]; then
    echo "❌ Move.toml bulunamadı!"
    echo "Bu scripti move/ klasöründen çalıştırın."
    exit 1
fi

echo "✅ Move package bulundu"
echo ""

# Check if sui CLI is installed
if ! command -v sui &> /dev/null; then
    echo "❌ Sui CLI kurulu değil!"
    echo ""
    echo "Kurmak için: https://docs.sui.io/guides/developer/getting-started/sui-install"
    exit 1
fi

echo "✅ Sui CLI bulundu"
echo ""

# Get active address
ACTIVE_ADDRESS=$(sui client active-address 2>/dev/null)
if [ -z "$ACTIVE_ADDRESS" ]; then
    echo "❌ Aktif cüzdan adresi bulunamadı!"
    echo "Önce 'sui client' ile bir cüzdan ayarlayın."
    exit 1
fi

echo "📍 Aktif adres: $ACTIVE_ADDRESS"
echo ""

# Get network
ACTIVE_ENV=$(sui client active-env 2>/dev/null)
echo "🌐 Network: $ACTIVE_ENV"
echo ""

# Build the contract first
echo "🔨 Contract build ediliyor..."
sui move build

if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Build başarısız!"
    exit 1
fi

echo ""
echo "✅ Build başarılı!"
echo ""

# Ask for confirmation
read -p "Contract'ı deploy etmek istiyor musunuz? (y/N): " CONFIRM
if [[ ! $CONFIRM =~ ^[Yy]$ ]]; then
    echo "Deployment iptal edildi."
    exit 0
fi

echo ""
echo "🚀 Contract deploy ediliyor..."
echo "Bu işlem birkaç saniye sürebilir..."
echo ""

# Deploy the contract
RESULT=$(sui client publish --gas-budget 100000000 --json 2>&1)

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment başarılı!"
    echo ""
    
    # Extract Package ID
    PACKAGE_ID=$(echo "$RESULT" | grep -o '"packageId":"[^"]*"' | cut -d'"' -f4)
    
    if [ -n "$PACKAGE_ID" ]; then
        echo "📦 Package ID: $PACKAGE_ID"
        echo ""
        echo "⚠️  ÖNEMLİ: Bu Package ID'yi kaydedin!"
        echo ""
        echo "Şu dosyayı güncelleyin:"
        echo "  kumru-chain/src/CreateProfile.tsx"
        echo ""
        echo "Şu satırı bulun ve Package ID'yi değiştirin:"
        echo "  const PACKAGE_ID = '$PACKAGE_ID'"
        echo ""
        
        # Save to file
        echo "$PACKAGE_ID" > ../kumru-chain/PACKAGE_ID.txt
        echo "✅ Package ID '../kumru-chain/PACKAGE_ID.txt' dosyasına kaydedildi"
    fi
    
    echo ""
    echo "🔍 Sui Explorer'da görüntüle:"
    if [[ $ACTIVE_ENV == *"testnet"* ]]; then
        echo "  https://suiscan.xyz/testnet/object/$PACKAGE_ID"
    elif [[ $ACTIVE_ENV == *"mainnet"* ]]; then
        echo "  https://suiscan.xyz/mainnet/object/$PACKAGE_ID"
    else
        echo "  https://suiscan.xyz/$ACTIVE_ENV/object/$PACKAGE_ID"
    fi
else
    echo ""
    echo "❌ Deployment başarısız!"
    echo ""
    echo "Hata detayları:"
    echo "$RESULT"
    exit 1
fi
