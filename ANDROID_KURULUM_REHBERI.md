# GridNote Android Kurulum Rehberi

GridNote'u kardeşinizin telefonuna kurmak ve kullanmak için bu rehberi takip edin.

---

## 📱 Seçenek 1: APK Dosyasını Doğrudan Android'e Yükleme (En Kolay)

### Gerekli Araçlar:
- GridNote APK dosyası (`gridnote-release.apk`)
- Android telefon (Android 7.0 veya üstü)
- USB kablosu (çalışan bir cihaza kurmanız için)

### Adımlar:

1. **APK Dosyasını Telefonunuza Taşıyın**
   - APK dosyasını USB üzerinden veya cloud depolaması (Google Drive, OneDrive vb.) aracılığıyla telefonunuza kopyalayın

2. **Bilinmeyen Kaynakları Etkinleştirin** (İlk kez yapılası)
   - Telefonda **Ayarlar** > **Güvenlik** > **Bilinmeyen Kaynaklar** öğesini etkinleştirin
   - Android sürümüne göre konumu değişebilir, öğesine bakın

3. **APK Dosyasını Açın ve Kurun**
   - Dosya yöneticisinde APK dosyasını bulun
   - Çift tıklayın veya dokunun
   - **Kur** düğmesine tıklayın
   - Kurulum bittikten sonra **Aç** düğmesini tıklayın

4. **İçeri Giriş**
   - GridNote açılır açılmaz, uygulamayı hemen kullanmaya başlayabilirsiniz
   - Notlar otomatik olarak cihazda kaydedilir

---

## 🛠️ Seçenek 2: Kaynaktan APK Oluşturma (Geliştirici için)

### Gerekli Araçlar:
- **Java Development Kit (JDK)** - en az v11
- **Android SDK** - API Level 24+ 
- **Gradle** (Android SDK'sıyla birlikte gelir)
- **Node.js** - v18+
- **npm** veya **yarn**

### Kurulum Adımları:

#### **A. Java Development Kit (JDK) Kurulum**

**macOS:**
```bash
# Homebrew ile kurulum
brew install java

# Yüklü olduğunu kontrol edin
java -version
```

**Windows:**
1. https://www.oracle.com/java/technologies/javase-jdk11-downloads.html adresinden JDK'yı indirin
2. Kurulum sihirbazını takip edin
3. Komut isteminde test edin: `java -version`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install default-jdk
java -version
```

#### **B. Android SDK Kurulation**

**macOS (Homebrew ile):**
```bash
# Android Studio'yu kurun (içinde SDK vardır)
brew install android-studio

# Veya sadece Android SDK Command-Line Tools:
brew install android-commandlinetools
```

**Windows:**
1. https://developer.android.com/studio adresinden Android Studio indirin
2. Kurulum sihirbazını takip edin
3. SDK Manager'dan aşağıdakileri kurun:
   - Android SDK Platform 36 (veya daha yeni)
   - Android SDK Build-Tools 36.0.0
   - Android Emulator (isteğe bağlı)

**Linux (Ubuntu/Debian):**
```bash
# Android Studio adresinden indirin veya snap kullanın:
sudo snap install android-studio --classic
```

#### **C. Ortam Değişkenlerini Ayarlayın**

**macOS/Linux:**
`~/.bashrc` veya `~/.zshrc` dosyasına ekleyin:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
# veya Linux: export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Sonra çalıştırın:
```bash
source ~/.bashrc  # veya ~/.zshrc
```

**Windows:**
1. Sistem Özellikleri > Ortam Değişkenleri açın
2. **Yeni** kullanıcı değişkeni:
   - **Değişken adı:** `ANDROID_HOME`
   - **Değişken değeri:** `C:\Users\YourUsername\AppData\Local\Android\sdk`
3. **Yeni** PATH öğesi ekleyin: `%ANDROID_HOME%\platform-tools`

#### **D. Gerekli SDK Paketlerini Kurun**

```bash
sdkmanager "platforms;android-36"
sdkmanager "build-tools;36.0.0"
```

### APK Oluşturma Adımları:

1. **Projeyi Hazırlayın**
   ```bash
   cd /path/to/gridnote
   npm install          # Bağımlılıkları yükleyin (zaten yapılmış olabilir)
   npm run build        # Web varlıklarını derleyin
   ```

2. **Android Dosyalarını Senkronize Edin**
   ```bash
   npm run capacitor:build  # Web-varlıklarını Android'e taşı
   ```

3. **APK Oluşturun** (İki seçenek):

   **Hızlı Oluştur (Debug APK - test için):**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   APK şu konumda olacaktır: `android/app/build/outputs/apk/debug/app-debug.apk`

   **Sürüm Oluştur (Release APK - dağıtım için):**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   APK şu konumda olacaktır: `android/app/build/outputs/apk/release/app-release.apk`

### Telefona Kurma:

1. **USB Hata Ayıklamasını Etkinleştirin**
   - Telefon > **Ayarlar** > **Verici Hakkında** > **Sürüm Numarası** üzerine 7 kez dokunun
   - **Ayarlar** > **Geliştirici Seçenekleri** > **USB Hata Ayıklaması**'nı etkinleştirin

2. **APK'yı Kurun**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Çalıştırın**
   ```bash
   adb shell am start -n com.gridnote.app/com.gridnote.app.MainActivity
   ```

---

## 🔄 Düzenli Güncellemeleri Kurma

Uygulama güncelledikten sonra:

```bash
npm run build
npm run capacitor:syncc
cd android
./gradlew assembleRelease
```

Sonra yeni APK'yı telefonunuza kurun.

---

## ❓ Sık Sorulan Sorular

**S: "Bilinmeyen kaynakları" bulamıyorum**
C: Telefonunuz Android 12+ için, Play Store yerine kurulum için izin vermeniz gerekebilir:
- Dosya Yöneticisi > **İzinler** > "Dosyaları yüklemeye izin ver" öğesini bulun

**S: Kurulum oluşturulmuyor**
C: Kontrol edin:
- `ANDROID_HOME` ortam değişkeninin doğru şekilde ayarlandığını
- `adb` komutu çalışıyor mu: `adb --version`
- Android SDK derlemelerinin yüklü olduğunu: `sdkmanager --list`

**S: Telefonum uygulamayı algılamıyor**
C: 
- Telefonu yeniden başlatın
- USB kablosunu değiştirmeyi deneyin
- `adb devices` ile cihazın bağlı olduğunu kontrol edin

**S: Uygulama telefonuna kuruluyor ancak açılmıyor**
C:
- Telefonu yeniden başlatın
- Cihazda yeterli depolama alanı olduğundan emin olun
- Telefonun Android 7.0'dan yeni olduğunu kontrol edin

---

## 📊 Sistem Gereksinimleri

| Bileşen | Gerekli Sürüm |
|---------|---------------|
| Android OS | 7.0+ (API 24+) |
| Telefon Depolaması | En az 100MB |
| RAM | En az 2GB |
| Java | JDK 11+ |
| Android SDK | API 36 |

---

## 📞 Sorun Giderme

### APK Kurulumu Başarısız Olursa:

1. **"App paketinin ayrıştırılması başarısız oldu" hatası:**
   - APK dosyasının bozuk olup olmadığını kontrol edin
   - Dosyayı yeniden indirmeyi deneyin

2. **"Yeterli depolama alanı yok" hatası:**
   - Telefonunuzda önbelleği temizleyin
   - Gereksiz dosyaları silin

3. **"Kurulum başarısız - uygulamalar uyumlu değil" hatası:**
   - Telefonun Android sürümünün en az 7.0 olduğundan emin olun

### Oluşturma Başarısız Olursa:

```bash
# Gradle önbelleğini temizleyin
cd android
./gradlew clean

# Yeniden başlamayı deneyin
./gradlew assembleRelease
```

---

## 🎯 Ozellik Ip Uçları

GridNote'u telefonunuzda kullanırken:

- **Sağ Tık / Uzun Basma:** Kartlarınızı dışa aktarmak için seçenekler alın
- **Arama:** Müdürü aramak için üst arayüzü kullanın
- **Etiketler:** Notlarınızı organize etmek için etiketler ekleyin
- **Şekil:** Kartları mevcut konumda bulunduğunu görmek
- **Kesme/Kopyala/Yapıştır:** Standart klavye kısayollarını kullanın

---

## 💡 İpuçları

1. **Veri Yedeklemesi:** Notlarınız cihazda yerel olarak depolanır, yedek almak için:
   - GridNote > Dışa Aktar > JSON seçin
   - Dosyayı bulut depolamasına veya bilgisayara yükleyin

2. **Yüksek Performans:** 
   - Büyük resim eklemeyin (100KB altında tutun)
   - Çok fazla kart aynı tuval üzerinde açmayın

3. **Güvenlik:**
   - GridNote; tüm verileri yerel olarak saklar
   - İnternet bağlantısı gerekmez

---

**Sorular? E-posta gönder veya GitHub'da sorun açın!**
