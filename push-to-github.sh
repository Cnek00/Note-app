#!/bin/bash

# GridNote - GitHub'a Push Rehberi
# Automated APK'yı GitHub Actions'tan almak için

echo "🚀 GridNote'u GitHub'a Push Etme Rehberi"
echo "=========================================="
echo ""

# Git ayarlarını kontrol et
echo "1️⃣  Git ayarları kontrol ediliyor..."

if [ -z "$(git config user.name)" ]; then
    echo "   ⚠️  Git ismi ayarlanmamış. Ayarlıyorum..."
    read -p "   📝 Adınız: " user_name
    git config --global user.name "$user_name"
fi

if [ -z "$(git config user.email)" ]; then
    echo "   ⚠️  Git email'i ayarlanmamış. Ayarlıyorum..."
    read -p "   📧 Email'iniz: " user_email
    git config --global user.email "$user_email"
fi

echo "   ✅ Git ayarlandı"
echo ""

# Projeyi hazırla
echo "2️⃣  Proje hazırlanıyor..."
cd "$(dirname "$0")"

if [ ! -d ".git" ]; then
    echo "   📝 Git repository başlatılıyor..."
    git init
fi

echo "   📦 Tüm dosyalar ekleniorty..."
git add .

echo "   💾 Commit oluşturuluyor..."
git commit -m "GridNote: Hata düzeltmeleri ve Android desteği" || echo "   (Zaten commit'li)"

echo "   ✅ Commit OK"
echo ""

# GitHub repository'yi al
echo "3️⃣  GitHub repository'sine push isteniyor..."
echo "   "
echo "   GitHub'da yeni bir repository oluştur:"
echo "   1. https://github.com/new adresine git"
echo "   2. Repository adını belirle (örn: gridnote)"
echo "   3. 'Create repository' butonunu tıkla"
echo "   4. Aşağıdaki URL'i kopyala:"
echo "   "
echo "   Lütfen GitHub repo URL'sini gir:"
echo "   (Örn: https://github.com/username/gridnote.git)"
read -p "   🔗 GitHub Repo URL: " repo_url

if [ -z "$repo_url" ]; then
    echo "   ❌ URL girişi gerekli"
    exit 1
fi

echo ""
echo "4️⃣  GitHub'a push ediliyor..."

git branch -M main
git remote add origin "$repo_url" 2>/dev/null || git remote set-url origin "$repo_url"
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ GitHub'a Push Başarılı!"
    echo ""
    echo "🎯 Sonraki adımlar:"
    echo "   1. GitHub'da 'Actions' sekmesini açın"
    echo "   2. 'Build Android APK' workflow'unu göreceksiniz"
    echo "   3. Tamamlandığında (✅), 'Artifacts'dan APK'yı indirin"
    echo ""
    echo "🔗 Repo: $repo_url"
    echo "📱 APK Konumu: Artifacts > GridNote-Debug-APK > app-debug.apk"
    echo ""
else
    echo "   ❌ Push başarısız. Lütfen aşağıdakileri kontrol et:"
    echo "   - GitHub URL doğru mu?"
    echo "   - GitHub hesabın erişim var mı?"
    echo "   - Internet bağlantısı aktif mi?"
    exit 1
fi
