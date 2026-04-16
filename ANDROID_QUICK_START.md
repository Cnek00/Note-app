# 🚀 GridNote Android - Hızlı Başlangıç

Kardeşiniz için GridNote'u Android'e kurmayı 5 dakika içinde tamamlayabilirsiniz!

---

## ⚡ En Hızlı Yöntem: APK Dosyasını Al ve Kur

### Sizin için hazırlanan APK:
Eğer ben (`cenkbelit@`) sizin için APK'yı önceden derlediyysem:

```
GridNote APK Klasörü: /Users/cenkbelit/Downloads/gridnote-docs/gridnote/android/app/build/outputs/apk/
```

APK Dosyasını Telefonunuza Aktarın:

1. **Android Telefonunuzda Kurulum**
   - APK dosyasını telefonunuza USB/Bluetooth/Cloud ile gönderin
   - Dosya yöneticisinde APK'yı bulun ve tıklayın
   - "Kur" düğmesini tıklayın
   - Bitti! 🎉

---

## 📋 Adım Adım: APK'yı Kendiniz Oluşturun

### Tüm Platform için Gerekli Araçlar:
- **Node.js** (v18+) - [nodejs.org](https://nodejs.org)
- **Java JDK** (11+) - [oracle.com](https://www.oracle.com/java/)
- **Android SDK** - Android Studio'dan [developer.android.com](https://developer.android.com/studio)

### macOS - En Kolay Yöntem:

```bash
# 1. Homebrew'den aracları kur
brew install java
brew install android-studio

# 2. Ortam değişkenlerini ayarla (~/.zshrc veya ~/.bash_profile)
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 3. Projeye git
cd /path/to/gridnote

# 4. Build Scriptini Çalıştır (Otomatik)
./build-android.sh

# Veya Manuel Yapı:
npm run build
npm run capacitor:build
cd android
./gradlew assembleRelease
```

APK şu konumda olacak:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Windows - Adım Adım:

1. **Android Studio Kur**
   - https://developer.android.com/studio adresinden indir
   - Kurulum sihirbazında "Android SDK" seçeneğini işaretle

2. **Java Kur**
   - JDK'yı https://www.oracle.com/java/ adresinden indir
   - Kurulum sihirbazını takip et

3. **Node.js Kur**
   - https://nodejs.org adresinden indir und kurallı

4. **Ortam Değişkenlerini Ayarla**
   - Sistem Özellikleri → Ortam Değişkenleri
   - Yeni Değişken: `ANDROID_HOME = C:\Users\YourUsername\AppData\Local\Android\sdk`

5. **Build Scriptini Çalıştır**
   - PowerShell'de projeye git: `cd C:\path\to\gridnote`
   - Çalıştır: `.\build-android.bat`

### Linux (Ubuntu/Debian):

```bash
# 1. Araçları Kur
sudo apt update
sudo apt install default-jdk
sudo snap install android-studio --classic
sudo apt install gradle

# 2. Ortam Değişkenlerini Ayarla (~/.bashrc)
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# 3. Build'i Çalıştır
cd /path/to/gridnote
./build-android.sh
```

---

## 🎯 Oluşturma Sonrası - Telefonunuza Kuruluyor

### USB Kablası ile (En Güvenilir):

```bash
# USB Hata Ayıklamasını etkinleştirin:
# Telefon Settings > Developer Options > USB Debugging

# APK'yı kurun:
cd android
adb install app/build/outputs/apk/release/app-release.apk

# Uygulamayı başlatın:
adb shell am start -n com.gridnote.app/com.gridnote.app.MainActivity
```

### APK Dosyasını Direktleri Kopyalayarak:

1. APK dosyasını bulun: `android/app/build/outputs/apk/release/app-release.apk`
2. Google Drive veya Dropbox'a yükle
3. Telefondan indir ve aç
4. "Bilinmeyen Kaynaklar" öğesini etkinleştir (varsa)
5. Kur'a tıkla

---

## 🔧 Sorun Giderme

### "ADBkomanı bulunamadı"
```bash
# macOS/Linux: Ortam değişkenini kontrol et
echo $ANDROID_HOME

# Windows: Sistem Özellikleri > Ortam Değişkenleri kontrol et
```

### "ANDROID_HOME ayarlanmamış"
```bash
# macOS/Linux (~/.zshrc veya ~/.bash_profile):
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools

# Sonra:
source ~/.zshrc
```

### "Gradle build başarısız"
```bash
cd android
./gradlew clean
./gradlew assembleRelease
```

### "Yeterli depolama alanı yok"
- Telefonun depolama alanını kontrol et (en az 100MB)
- Cache'i temizle: Ayarlar > Depolama > Uygulamalar

---

##👥 Kardeşiniz için İpuçları

GridNote kullanırken:

```
🎨 Tuval Ortamı:
  - Sağ tık: Kartı dışa aktarken seçenekler alın
  - Şekil: Kartları canvas üzerinde arrange edin
  - İşaretler: Kartları taşımak için tutun ve sürükleyin

📝 Not Oluşturma:
  - "+ Nota" butonuna tıklayın
  - Başlık ve içerik ekleyin
  - Etiket ekleyin (isteğe bağlı)
  - Renk seçin

🔍 Bulma:
  - SearchBox'ı kullanarak notlarınızda arama yapın
  - Etiketlerle filtreleme yapın

💾 Dışa Aktar:
  - Sağ tık → Dışa Aktar → Biçim seçin (JSON, PDF, Markdown)
  - Dosyalı cloud'a kaydet
```

---

## 📚 Tam Dokümantasyon

Detaylı talimatlar için bkz:
- **[ANDROID_KURULUM_REHBERI.md](./ANDROID_KURULUM_REHBERI.md)** - Kapsamlı kurulum kılavuzu (TR)
- **[ANDROID_SETUP_GUIDE.md](./ANDROID_SETUP_GUIDE.md)** - Kapsamlı kurulum kılavuzu (EN)

---

## ✅ Kontrol Listesi

Telefonunuza GridNote kurdum utmadan önce kontrol edin:

- [ ] Java yüklü (`java -version` çalışıyor)
- [ ] Node.js yüklü (`node --version` çalışıyor)  
- [ ] Android SDK yüklü (`ANDROID_HOME` ayarlandı)
- [ ] `npm install` başarılı
- [ ] `npm run build` başarılı
- [ ] `./gradlew assembleRelease` başarılı
- [ ] APK dosyası oluşturuldu
- [ ] Telefonda USB Hata Ayıklaması etkinleştirildi (varsa)
- [ ] APK telefonunuza kuruldu

---

## 🎉 Tamamlandı!

Kardeşinız artık GridNote'u kullanabilir!

```
Oyunuları katılmak için:
1. Notlar oluştur
2. Canvas'ta organize et
3. Etiketlerle kategori oluştur
4. Dışa akta paylaş
5. Hoşlan!
```

---

**Sorular var mı? [GitHub Issues](https://github.com) adresinde sorun açın!**
