# GridNote Android APK - Kurulum Sorun Çözümü

## Sorun
```
SDK location not found. Define a valid SDK location with an ANDROID_HOME...
```

Bu hata, Android SDK'nın bilgisayarınızda yüklü olmadığını gösterir.

---

## ✅ Çözüm 1: GitHub Actions'da Otomatik Derleme (Önerilir)

**Avantajları:**
- ✅ Hiçbir şey yüklemeye gerek yok
- ✅ Cloud'da derlenip GitHub'dan indirilir
- ✅ Her push'ta otomatik güncelleme
- ✅ Kardeşe bağlantı gönderebildiğiniz APK

### Nasıl Yapılır:

1. **Projeyi GitHub'a Upload Et**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YourUsername/gridnote.git
   git push -u origin main
   ```

2. **APK'yı Otomatik İndir**
   - GitHub'da repo gididiv "Actions" sekmesini açın
   - "Build Android APK" workflow'unu göreceksiniz
   - Çalıştığını görmek için bir kaç dakika bekleyin
   - Tamamlandığında "Artifacts" bölümünde APK dosyalarını indirin

3. **APK'yı Kardeşinize Ver**
   - İndirilen `GridNote-Release-APK` dosyasını açın
   - `app-release.apk`'yı kardeşinize gönder
   - Kurulum talimatları için `ANDROID_QUICK_START.md`'yi gönder

**Dosya Konumu:**
```
GitHub Actions Artifacts:
  - GridNote-Debug-APK (test için)
  - GridNote-Release-APK (kardeş için - bu seçin!)
```

---

## ⚙️ Çözüm 2: Lokal Build (Android SDK Gerekli)

Bilgisayarınızda derleme yapmak istiyorsanız:

### macOS:

```bash
# 1. Android Studio'yu yükleyin (brew ile)
brew install --cask android-studio

# 2. Android SDK Platform Tools'u ekleyin (Android Studio'da)
# Açın: Android Studio > Settings > SDK Manager > Android SDK
# Kurulu: Platform 36, Build Tools 36.0.0

# 3. Ortam değişkenini .zshrc/.bash_profile'a ekleyin
echo 'export ANDROID_HOME=$HOME/Library/Android/sdk' >> ~/.zshrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.zshrc

# 4. Terminal'i yeniden açıp build'i çalıştırın
source ~/.zshrc
./build-android.sh
```

### Windows:

1. [Android Studio](https://developer.android.com/studio) indirin ve kurun
2. Kurulum sırasında "Android SDK" seçeneğini işaretleyin
3. Sistem Özellikleri > Ortam Değişkenleri:
   - Yeni değişken: `ANDROID_HOME`
   - Değer: `C:\Users\YourUsername\AppData\Local\Android\sdk`
   - PATH'e ekle: `%ANDROID_HOME%\platform-tools`
4. PowerShell'i yeniden açıp şunu çalıştırın:
   ```
   build-android.bat
   ```

### Linux (Ubuntu/Debian):

```bash
# 1. Android Studio'yu yükleyin
sudo snap install android-studio --classic

# 2. Ortam değişkenini ~/.bashrc'ye ekleyin
echo 'export ANDROID_HOME=$HOME/Android/Sdk' >> ~/.bashrc
echo 'export PATH=$PATH:$ANDROID_HOME/platform-tools' >> ~/.bashrc

# 3. Yeniden başlatıp build çalıştırın
source ~/.bashrc
./build-android.sh
```

---

## 🎯 Hızlı Karar Ağacı

```
                   APK Oluşturmak İstiyorum
                            |
                    ________|________
                   |                |
        GitHub Actions'ı Kullan     Lokal Build
        (Tavsiye Edilir)           (25 dakika)
              |                        |
         ✅ Hiçbir kurulum          ⏳ Android Studio
         ✅ Cloud'da derlen         ⏳ SDK downloads
         ✅ Otomatik sync           ⏳ 25 dakika bekleme
         ✅ Hız                     ❌ Bilgisayarı zorlama
               |                        |
         GitHub'a push                build-android.sh
              → Actions çalış         → APK create
              → 5 dakika               → Bitti!
              → Artifacts'dan indir
```

---

## 📊 Seçim Tablosu

| Özellik | GitHub Actions | Lokal Build |
|---------|---|---|
| Kurulum Zamanı | 0 dakika | 25 dakika |
| İlk Build | 3-5 dakika | 5 dakika |
| Tekrar Build | 3-5 dakika | 2-3 dakika |
| Bilgisayar Kaynağı | Hiçbiri | Yüksek |
| Kardeş Kullanımı | ✅ Ideal | ✅ Çalışır |
| Tavsiye | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 🚀 Tercih Edilir Akış

### Adım 1: GitHub'a Push Et
```bash
git init
git add .
git commit -m "GridNote Android"
git branch -M main
git remote add origin https://github.com/YourUsername/gridnote.git
git push -u origin main
```

### Adım 2: GitHub Actions'ı Bekle
- İnternet tarayıcısında GitHub repo'nuzu açın
- "Actions" sekmesini tıklayın
- "Build Android APK" workflow'unu göreceksiniz
- Yeşil checkmark (✅) göründüğünde bitti

### Adım 3: APK'yı İndir
- Workflow çalıştırısından "Artifacts" tıklayın
- `GridNote-Release-APK` indir
- app-release.apk dosyasını aç

### Adım 4: Kardeşe Ver
- APK dosyasını Email/Cloud'a yükle
- `ANDROID_QUICK_START.md`'yi gönder
- Kurulum talimatları oku

---

## ❓ SSS

**S: GitHub Actions ne kadar uzun sürüyor?**
C: İlk build 3-5 dakika, tekrar build'ler 2-3 dakika alıyor.

**S: APK dosyası nerede?**
C: GitHub repo > Actions > Workflow çalıştırısı > Artifacts > İndir

**S: Lokal alternativ var mı?**
C: Evet, ama 25 dakika kurulum gerekir. GitHub Actions daha hızlı.

**S: APK güncelleme?**
C: Kodu değiştir → git push → Actions otomatik derle → APK indir

---

## 📞 Hala Sorun mu Yaşıyorsunuz?

1. **GitHub Actions'ın çalışmadığını görüyorum:**
   - Repo'ya push ettiğinizden emin olun
   - Actions sekmesini yenile (F5)
   - Workflow'un adı: "Build Android APK"

2. **APK'yı bulamıyorum:**
   - GitHub > Actions > Son çalıştırma > Scroll aşağı
   - "Artifacts" bölümü altında listeli olmalı

3. **Lokal build hala başarısız:**
   - `ANDROID_HOME` ortam değişkenini kontrol et
   - `sdkmanager --list` çalışıyor mu?
   - `/android/local.properties` dosyasının var olup olmadığını kontrol et

---

## 💡 Pro İpuçları

- 🔄 **Otomatik güncellemeleri Aç:** GitHub Settings > Actions secin
- 📦 **Sürüm Release'i Oluştur:** GitHub'da tag oluştur, workflow otomatik release yapacak
- 📱 **Google Play'e Upload:** GitHub Releases'teki APK'yı Google Play Console'a yükle
- 🔐 **Signing Anahtarı:** Production için keystore oluştur ve GitHub Secrets'a ekle

---

**En Hızlı Başlangıç: GitHub Actions'ı Kullanın! 🚀**

5 adım, 5 dakika, APK hazır.
