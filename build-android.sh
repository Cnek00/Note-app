#!/bin/bash

# GridNote Android APK Build Script
# Otomatik olarak web'i derler ve Android APK'sını oluşturur

set -e  # Hata durumunda çık

echo "🚀 GridNote Android APK Oluşturucu"
echo "===================================="
echo ""

# Renk Tanımları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Adım 1: Ortam kontrolü
echo -e "${YELLOW}✓ Ortam Kontrolü...${NC}"

if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js bulunamadı. Lütfen Node.js yükleyin.${NC}"
    exit 1
fi

if ! command -v java &> /dev/null; then
    echo -e "${RED}✗ Java bulunamadı. Lütfen JDK 11+ yükleyin.${NC}"
    exit 1
fi

# Kontrol et ki ANDROID_HOME ayarlanmış mı
if [ -z "$ANDROID_HOME" ]; then
    # macOS için standart konumları dene
    if [ -d "$HOME/Library/Android/sdk" ]; then
        export ANDROID_HOME="$HOME/Library/Android/sdk"
        echo -e "${GREEN}✓ Android SDK bulundu: $ANDROID_HOME${NC}"
    elif [ -d "$HOME/Android/Sdk" ]; then
        export ANDROID_HOME="$HOME/Android/Sdk"
        echo -e "${GREEN}✓ Android SDK bulundu: $ANDROID_HOME${NC}"
    else
        echo -e "${RED}✗ ANDROID_HOME ayarlanmamış ve SDK bulunamadı.${NC}"
        echo ""
        echo "Android SDK kurmak için:"
        echo "  brew install android-studio"
        echo ""
        echo "Veya: https://developer.android.com/studio"
        echo ""
        exit 1
    fi
fi

echo -e "${GREEN}✓ Java: $(java -version 2>&1 | head -n 1)${NC}"
echo -e "${GREEN}✓ Node: $(node --version)${NC}"
echo -e "${GREEN}✓ ANDROID_HOME: $ANDROID_HOME${NC}"
echo ""

# Adım 2: Bağımlılıkları yükle
echo -e "${YELLOW}✓ Adım 1/4: Bağımlılıklar yükleniyor...${NC}"
npm install > /dev/null 2>&1 || npm install

# Adım 3: Web varlıklarını derle
echo -e "${YELLOW}✓ Adım 2/4: Web varlıkları derleniyor...${NC}"
npm run build

# Adım 4: Android'e senkronize et
echo -e "${YELLOW}✓ Adım 3/4: Android'e senkronize ediliyor...${NC}"
npm run capacitor:build

# Adım 5: APK'yı oluştur
echo -e "${YELLOW}✓ Adım 4/4: APK oluşturuluyor...${NC}"
cd android

# Sorun: Ne tür bir build istendiğini sor
echo ""
echo "Hangi tür APK oluşturmak istiyorsunuz?"
echo "1) Debug APK (test için, hızlı - önerilir)"
echo "2) Release APK (dağıtım için, daha yavaş)"
read -p "Seçiminizi girin (1 veya 2): " BUILD_TYPE

if [ "$BUILD_TYPE" = "2" ]; then
    BUILD_TASK="assembleRelease"
    BUILD_NAME="Sürüm (Release)"
    BUILD_PATH="app/build/outputs/apk/release/app-release.apk"
else
    BUILD_TASK="assembleDebug"
    BUILD_NAME="Debug"
    BUILD_PATH="app/build/outputs/apk/debug/app-debug.apk"
fi

echo ""
echo -e "${YELLOW}🛠️  $BUILD_NAME APK oluşturuluyor (bu biraz zaman alabilir)...${NC}"

./gradlew $BUILD_TASK

echo ""
echo -e "${GREEN}✅ APK Başarıyla Oluşturuldu!${NC}"
echo ""
echo -e "${GREEN}📁 APK Konumu: $(pwd)/$BUILD_PATH${NC}"
echo ""
echo "Sonraki Adımlar:"
echo "1. APK'yı telefonunuza USB/Cloud üzerinden kopyalayın"
echo "2. Telefonunuzda 'Bilinmeyen Kaynaklar' öğesini etkinleştirin"
echo "3. APK'yı açıp 'Kur' öğesine tıklayın"
echo "4. Kurulum bittikten sonra 'Aç' öğesine tıklayın"
echo ""
echo "💡 İpucu: Telefonunuza Android USB Hata Ayıklaması ile kurdu:"
echo "         adb install $BUILD_PATH"
echo ""

cd - > /dev/null
