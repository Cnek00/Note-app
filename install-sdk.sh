#!/bin/bash

# GridNote - SDK Otomatik Kurulumcusu
# Bu script, Android SDK'yı otomatik olarak kurar

set -e

echo "🚀 Android SDK Otomatik Kurulu..."
echo ""

# macOS'ta SDK yolu
SDK_PATH="$HOME/Library/Android/sdk"
SDK_TOOLS_PATH="$HOME/Library/Android/sdk/cmdline-tools"

echo "1️⃣  SDK dizini oluşturuluyor..."
mkdir -p "$SDK_PATH"
mkdir -p "$SDK_TOOLS_PATH"

echo "2️⃣  Android Command-Line Tools indiriliyor..."
cd /tmp

# macOS için IntelliJ tabanlı tools'u indir
if [[ -f "commandlinetools-mac-*_latest.zip" ]]; then
  echo "   ✓ Tools zaten var"
else
  echo "   ⏳ Downloading... (100MB, birkaç dakika alabilir)"
  curl -o commandlinetools-mac.zip "https://dl.google.com/android/repository/commandlinetools-mac-11076708_latest.zip" 2>/dev/null || {
    echo "   ⚠️  İndirme başarısız. Alternatif: Brew ile kur"
    brew install android-commandlinetools 2>/dev/null
    exit 0
  }
fi

echo "3️⃣  SDK tools kuruluyor..."
cd "$SDK_TOOLS_PATH"
unzip -q /tmp/commandlinetools-mac.zip || echo "   ⚠️  Unzip hatası (muhtemelen zaten var)"

echo "4️⃣  gerekli SDK platforms'u kuruluyor..."
echo "   ⏳ Biraz zaman alabilir..."

# SDK Platform Packages kurul
"$SDK_PATH/cmdline-tools/bin/sdkmanager" --install \
  "platforms;android-36" \
  "build-tools;36.0.0" \
  --sdk_root="$SDK_PATH" 2>/dev/null || {
  echo "   ⚠️  SDK kurulumunda sorun. Lütfen Android Studio'yu açıp SDK Manager'dan manuel kur"
}

echo ""
echo "✅ SDK kurulumu tamamlandı!"
echo "   Konum: $SDK_PATH"
echo ""
echo "🎯 Sonraki adım: ./build-android.sh komutunu çalıştır"
