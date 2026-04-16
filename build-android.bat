@echo off
REM GridNote Android APK Build Script for Windows

setlocal enabledelayedexpansion

echo.
echo GridNote Android APK Olusturucu (Windows)
echo ==========================================
echo.

REM Renk kodu (Windows 10+)
cls
color 0A

REM Oncal kontrolu
echo [*] Ortam Kontrolu...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js bulunamadi. Lutfen Node.js yukleyin.
    pause
    exit /b 1
)

where java >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Java bulunamadi. Lutfen JDK 11+ yukleyin.
    pause
    exit /b 1
)

if not defined ANDROID_HOME (
    echo [X] ANDROID_HOME ortam degiskeni ayarlanmamis.
    echo.
    echo Lutfen Sistem Ozellikleri ^> Ortam Degiskenleri'nden:
    echo    Degisken adi: ANDROID_HOME
    echo    Degisken degeri: C:\Users\YourUsername\AppData\Local\Android\sdk
    echo.
    pause
    exit /b 1
)

echo [OK] Java: 
java -version 2>&1 | findstr /R "version"
echo [OK] Node: 
for /f "tokens=*" %%i in ('node --version') do echo %%i
echo [OK] ANDROID_HOME: %ANDROID_HOME%
echo.

REM Adim 1: Baglantilari yukle
echo [*] Adim 1/4: Baglantilari yukleyen
call npm install
if %ERRORLEVEL% NEQ 0 goto error

REM Adim 2: Web varliklarini derle
echo [*] Adim 2/4: Web varliklari derleniyor
call npm run build
if %ERRORLEVEL% NEQ 0 goto error

REM Adim 3: Android'e senkronize et
echo [*] Adim 3/4: Android'e senkronize ediliyor
call npm run capacitor:build
if %ERRORLEVEL% NEQ 0 goto error

REM Adim 4: APK'yi olustur
echo [*] Adim 4/4: APK olusturuluyor
cd android

echo.
echo Hangi tur APK olusturmak istiyorsunuz?
echo 1) Debug APK (test icin, hizli - onerilir)
echo 2) Release APK (dagitim icin, daha yavass)
echo.
set /p BUILD_TYPE="Seciminizi girin (1 veya 2): "

if "%BUILD_TYPE%"=="2" (
    set BUILD_TASK=assembleRelease
    set BUILD_NAME=Surum (Release)
    set BUILD_PATH=app\build\outputs\apk\release\app-release.apk
) else (
    set BUILD_TASK=assembleDebug
    set BUILD_NAME=Debug
    set BUILD_PATH=app\build\outputs\apk\debug\app-debug.apk
)

echo.
echo [*] %BUILD_NAME% APK olusturuluyor (bu biraz zaman alabilir)...
echo.

call gradlew.bat %BUILD_TASK%
if %ERRORLEVEL% NEQ 0 goto error

echo.
echo [OK] APK Basarıyla Olusturuldu!
echo.
echo [*] APK Konumu: %cd%\%BUILD_PATH%
echo.
echo Sonraki Adimlar:
echo 1. APK'yi telefonunuza USB/Cloud uzerinden kopyalayin
echo 2. Telefonunuzda "Bilinmeyen Kaynaklar" ogesini etkinlestirin
echo 3. APK'yi acip "Kur" ogesine tiklayin
echo 4. Kurulum bittikten sonra "Ac" ogesine tiklayin
echo.
echo [*] Ipucu: Telefonunuza Android USB Hata Ayiklama ile Kurun:
echo         adb install %BUILD_PATH%
echo.
pause
cd - > nul
goto end

:error
echo.
echo [X] Hata Olusstu! Yukaridaki hata mesajini kontrol edin.
echo.
pause
exit /b 1

:end
exit /b 0
