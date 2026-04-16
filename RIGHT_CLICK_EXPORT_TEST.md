# 🧪 Right-Click Export Feature - Test Guide

## Yeni Özellik: Notu Sağ Tık ile Kaydet

### ✅ Neler Eklendi?

1. **`src/utils/cardExport.ts`** - 5 export formatı
2. **`src/components/cards/CardContextMenu.tsx`** - Sağ tık menüsü
3. **`src/components/cards/CardContextMenu.css`** - Menü stilleri
4. **`src/components/canvas/NoteCard.tsx`** - Context menu entegrasyonu

---

## 🚀 Hızlı Test

### Adım 1: Değişiklikleri Kontrol Et

```bash
# Dosyaları kontrol et
ls -la src/utils/cardExport.ts
ls -la src/components/cards/CardContextMenu.*
```

### Adım 2: Dev Server'ı Başlat

```bash
npm run dev
```

### Adım 3: Testi Yap

```
1. Tarayıcı açıl (http://localhost:1420)
2. GridNote'ta bir nota kartı ekle
3. Nota üzerine SAĞ TIK yap
4. Menü açılmalı
5. "Save As" bölümündeki formatlardan birini seç
6. Dosya indirilmeli!
```

---

## 📋 Çıkacak Menü

```
┌────────────────────┐
│ ✏️ Edit Note       │
├────────────────────┤
│ 📋 Duplicate       │
├────────────────────┤
│ 💾 SAVE AS:        │
│   📄 JSON          │
│   📝 Markdown      │
│   🌐 HTML          │
│   📑 PDF           │
│   📋 Text          │
├────────────────────┤
│ 🗑️ Delete          │
└────────────────────┘
```

---

## 🔍 Her Format için Test

### 1️⃣ JSON Test
```
Sağ tık → "Save As" → "JSON"
↓
✅ Dosya: nota-başlığı.json
✅ İçerik: tam metadata ile
✅ Açılabilir: Herhangi bir editor
```

### 2️⃣ Markdown Test
```
Sağ tık → "Save As" → "Markdown"
↓
✅ Dosya: nota-başlığı.md
✅ İçerik: # başlık + içerik
✅ Açılabilir: VS Code, Obsidian, Notion
```

### 3️⃣ HTML Test
```
Sağ tık → "Save As" → "HTML"
↓
✅ Dosya: nota-başlığı.html
✅ İçerik: stillendirilmiş
✅ Açılabilir: Tarayıcı, Word
```

### 4️⃣ PDF Test
```
Sağ tık → "Save As" → "PDF"
↓
✅ Dosya: nota-başlığı.pdf
✅ İçerik: yazdırılabilir
✅ Açılabilir: PDF reader
```

### 5️⃣ Text Test
```
Sağ tık → "Save As" → "Text"
↓
✅ Dosya: nota-başlığı.txt
✅ İçerik: basit metin
✅ Açılabilir: Herhangi bir editor
```

---

## 🛠️ Sorun Gidirme

### Menü Açılmadı?
```
❌ Sorun: Sağ tık menüsü görmüyorum

✅ Çöz:
1. Browser console'ü açın (F12)
2. Hata mesajı var mı kontrol edin
3. CardContextMenu component import edilmiş mi?
4. NoteCard.tsx'de contextMenu kodu var mı?
5. onContextMenu handler var mı?
```

### Export Başarısız?
```
❌ Sorun: Açılış/İndir hatası

✅ Çöz:
1. Console'da hata var mı?
2. Dependencies yüklü mü? (npm install)
3. Dosya çok büyük mü?
4. Browser engeli açık mı?
```

### Menü Yanlış Yerde Açıldı?
```
❌ Sorun: Menü faremin yanında değil

✅ Çöz:
1. CardContextMenu.tsx'de CSS var mı?
2. position: fixed doğru mu?
3. z-index yeterli mi (1001)?
```

---

## 📦 Dosya Yapısı

```
src/
├── utils/
│   └── cardExport.ts              ← New: Export functions
├── components/
│   ├── cards/                     ← New folder
│   │   ├── CardContextMenu.tsx    ← New: Context menu UI
│   │   └── CardContextMenu.css    ← New: Menü stilleri
│   └── canvas/
│       └── NoteCard.tsx           ← Modified: +context menu
```

---

## 🎯 Test Checklist

- [ ] Sağ tık menüsü açılıyor
- [ ] "Edit Note" seçeneği var
- [ ] "Duplicate" seçeneği var
- [ ] "Save As" başlığı görünüyor
- [ ] JSON export çalışıyor
- [ ] Markdown export çalışıyor
- [ ] HTML export çalışıyor
- [ ] PDF export çalışıyor
- [ ] Text export çalışıyor
- [ ] "Delete" seçeneği var
- [ ] Menü kapatılabiliyor (başka yere tıkla)
- [ ] Dosya adı doğru
- [ ] Dosya içeriği doğru

---

## 🚀 Production Build

Test başarılı olduktan sonra:

```bash
# Build
npm run build

# Desktop (Tauri)
npm run tauri build

# Test yap
npm run preview
```

---

## 📝 Kolay Referans

### Bağlantılar
- **Export Util**: `src/utils/cardExport.ts`
- **Context Menu UI**: `src/components/cards/CardContextMenu.tsx`
- **NoteCard**: `src/components/canvas/NoteCard.tsx`

### İman Fonksiyonlar
```js
exportCardAsJSON(card)       // → JSON dosyası
exportCardAsMarkdown(card)   // → Markdown dosyası
exportCardAsHTML(card)       // → HTML dosyası
exportCardAsPDF(card)        // → PDF dosyası (async)
exportCardAsText(card)       // → Text dosyası
```

---

## 🎉 Hazırsa Başla!

1. `npm run dev` çalıştır
2. Not yard ve sağ tık yap
3. Format seç ve indir
4. Test et ve eğlen! 🚀

Sorularınız olursa console.log() ile debug edin!
