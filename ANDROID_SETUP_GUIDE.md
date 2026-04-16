# GridNote Android Setup Guide

A complete guide to install and build GridNote for Android.

---

## 📱 Option 1: Direct APK Installation (Easiest)

### Requirements:
- GridNote APK file (`gridnote-release.apk`)
- Android phone (Android 7.0 or newer)
- USB cable for computer transfer

### Steps:

1. **Transfer APK to Your Phone**
   - Copy the APK file to your phone via USB or cloud storage (Google Drive, OneDrive, etc.)

2. **Enable Installation from Unknown Sources** (First time only)
   - Go to **Settings** > **Security** > **Unknown Sources** on your phone
   - Note: Location may vary depending on Android version

3. **Open and Install the APK**
   - Find the APK file in your file manager
   - Double-click or tap it
   - Click **Install**
   - After installation completes, click **Open** to launch the app

4. **Start Using GridNote**
   - The app will start immediately
   - All notes are automatically saved to your device

---

## 🛠️ Option 2: Build APK from Source (For Developers)

### Requirements:
- **Java Development Kit (JDK)** - version 11+
- **Android SDK** - API Level 24+
- **Gradle** (comes with Android SDK)
- **Node.js** - v18+
- **npm** or **yarn**

### Installation Steps:

#### **A. Install Java Development Kit (JDK)**

**macOS:**
```bash
# Using Homebrew
brew install java

# Verify installation
java -version
```

**Windows:**
1. Download JDK from https://www.oracle.com/java/technologies/javase-downloads.html
2. Follow the installation wizard
3. Test in Command Prompt: `java -version`

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install default-jdk
java -version
```

#### **B. Install Android SDK**

**macOS (with Homebrew):**
```bash
# Install Android Studio (includes SDK)
brew install android-studio

# Or just Android SDK Command-Line Tools:
brew install android-commandlinetools
```

**Windows:**
1. Download Android Studio from https://developer.android.com/studio
2. Follow the installation wizard
3. In SDK Manager, install:
   - Android SDK Platform 36 (or newer)
   - Android SDK Build-Tools 36.0.0
   - Android Emulator (optional)

**Linux (Ubuntu/Debian):**
```bash
# Download from Android Studio website or use snap:
sudo snap install android-studio --classic
```

#### **C. Set Environment Variables**

**macOS/Linux:**
Add to `~/.bashrc` or `~/.zshrc`:
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
# or Linux: export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

Then run:
```bash
source ~/.bashrc  # or ~/.zshrc
```

**Windows:**
1. Open System Properties > Environment Variables
2. Create **New** User Variable:
   - **Variable name:** `ANDROID_HOME`
   - **Variable value:** `C:\Users\YourUsername\AppData\Local\Android\sdk`
3. Add new entry to PATH: `%ANDROID_HOME%\platform-tools`

#### **D. Install Required SDK Packages**

```bash
sdkmanager "platforms;android-36"
sdkmanager "build-tools;36.0.0"
```

### Building the APK:

1. **Prepare the Project**
   ```bash
   cd /path/to/gridnote
   npm install          # Install dependencies (may already be done)
   npm run build        # Compile web assets
   ```

2. **Sync Android Files**
   ```bash
   npm run capacitor:build  # Copy web assets to Android
   ```

3. **Create the APK** (Two options):

   **Quick Build (Debug APK - for testing):**
   ```bash
   cd android
   ./gradlew assembleDebug
   ```
   APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

   **Release Build (Production APK - for distribution):**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   APK location: `android/app/build/outputs/apk/release/app-release.apk`

### Installing to Phone:

1. **Enable USB Debugging**
   - Phone > **Settings** > **About Phone** > **Build Number** (tap 7 times)
   - **Settings** > **Developer Options** > **USB Debugging**

2. **Install the APK**
   ```bash
   adb install android/app/build/outputs/apk/debug/app-debug.apk
   ```

3. **Run the App**
   ```bash
   adb shell am start -n com.gridnote.app/com.gridnote.app.MainActivity
   ```

---

## 🔄 Installing Updates

After updating the app:

```bash
npm run build
npm run capacitor:build
cd android
./gradlew assembleRelease
```

Then install the new APK to your phone.

---

## ❓ FAQ

**Q: Can't find "Unknown Sources"**
A: On Android 12+, go to **Settings** > **Apps & Notifications** > **Special App Access** > **Install Unknown Apps** and select your file manager.

**Q: Build is failing**
A: Check:
- `ANDROID_HOME` environment variable is set correctly
- `adb` command works: `adb --version`
- Android SDK Build Tools are installed: `sdkmanager --list`

**Q: Phone doesn't detect the app**
A: 
- Restart your phone
- Try a different USB cable
- Verify device is connected: `adb devices`

**Q: App installs but won't open**
A:
- Restart your phone
- Ensure sufficient device storage
- Verify phone is Android 7.0+

---

## 📊 System Requirements

| Component | Required Version |
|-----------|------------------|
| Android OS | 7.0+ (API 24+) |
| Phone Storage | At least 100MB |
| RAM | At least 2GB |
| Java | JDK 11+ |
| Android SDK | API 36 |

---

## 📞 Troubleshooting

### APK Installation Fails:

1. **"Failed to parse APK" error:**
   - Check if the APK file is corrupted
   - Download it again

2. **"Insufficient storage" error:**
   - Clear phone cache and remove unnecessary files

3. **"Installation failed: apps are incompatible" error:**
   - Ensure phone is Android 7.0 or newer

### Build Fails:

```bash
# Clean Gradle cache
cd android
./gradlew clean

# Try building again
./gradlew assembleRelease
```

---

## 🎯 Usage Tips

- **Right-click/Long Press:** Get export options for your cards
- **Search:** Use the top interface to search for notes
- **Tags:** Add tags to organize your notes
- **Canvas:** Arrange cards on the canvas visually
- **Cut/Copy/Paste:** Use standard keyboard shortcuts

---

## 💡 Pro Tips

1. **Backup Notes:** Since notes are stored locally:
   - GridNote > Export > Choose JSON
   - Upload file to cloud storage or computer

2. **Performance:**
   - Keep images under 100KB
   - Don't open too many cards on one canvas

3. **Privacy:**
   - All data stored locally on device
   - No internet connection required

---

**Questions? Open an issue on GitHub or contact us!**
