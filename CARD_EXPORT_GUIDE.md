# 📤 Individual Card Export Guide

## Notaları Farklı Formatlarda Kaydetme

GridNote artık her notayı ayrı ayrı **7 farklı formatta** kaydedebiliyor!

---

## 🎯 Nasıl Kullanılır?

### 1. **Sağ Tık Kontekst Menüsü (Easiest Way)**

```
Not kartına sağ tık yapın → "Save As" menüsü → İstediğiniz format seçin
```

**Adımlar:**
1. Herhangi bir nota kartı üzerine sağ tık yapın
2. Context menüsü açılır
3. "Save As:" bölümüne tıklayın
4. Format seçin (JSON, Markdown, HTML, PDF, Text)
5. Dosya otomatik indirilir

---

## 📁 Desteklenen Formatlar

### **JSON** - `export-cardAsJSON()`
- Full metin ve metadata
- Tarafları kopyalamak için ideal
- Backup için en iyi
- Dosya: `not-adı.json`

```js
import { exportCardAsJSON } from '@/utils/cardExport';
exportCardAsJSON(card);
```

---

### **Markdown** - `exportCardAsMarkdown()`
- Temiz, okunabilir format
- Başka uygulamalarda açılabilir
- GitHub, Notion vb. ile uyumlu
- Dosya: `not-adı.md`

```
# Not Başlığı

Not içeriği...

**Etiketler:** etiket1, etiket2
```

---

### **HTML** - `exportCardAsHTML()`
- Web tarayıcısında açılabilir
- Stil koruyarak kaydedilir
- Paylaşıma uygun
- Dosya: `not-adı.html`

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Not Başlığı</title>
  </head>
  <body>
    <!-- Stil verilmiş içerik -->
  </body>
</html>
```

---

### **PDF** - `exportCardAsPDF()`
- Yazdırılabilir format
- Profesyonel dokümanter
- Paylaşım için ideal
- Dosya: `not-adı.pdf`

**PDF'de Görünecek:**
- ✅ Not başlığı
- ✅ Oluşturma/güncelleme tarihi
- ✅ Not içeriği
- ✅ Etiketler

---

### **Text** - `exportCardAsText()`
- Basit metin dosyası
- Tüm formatlı dökümanlarda açılabilir
- Hafif ve basit
- Dosya: `not-adı.txt`

```
Not Başlığı
===========

Not içeriği buraya...

Etiketler: etiket1, etiket2

---
Created: 15.4.2026, 10:30
Updated: 15.4.2026, 11:45
```

---

## 🖥️ Context Menü Seçenekleri

Sağ tık menüsünde görecekleriniz:

```
┌─────────────────────┐
│ ✏️ Edit Note        │
├─────────────────────┤
│ 📋 Duplicate        │
├─────────────────────┤
│ 💾 Save As:         │
│  📄 JSON            │
│  📝 Markdown        │
│  🌐 HTML            │
│  📑 PDF             │
│  📋 Text            │
├─────────────────────┤
│ 🗑️ Delete           │
└─────────────────────┘
```

---

## 💡 Kullanım Örnekleri

### **Örnek 1: Notu Markdown'da Kaydetme**

```
1. Notu seç
2. Sağ tık
3. "Save As" → "Markdown"
4. Markdown dosyası indir
5. Obsidian, VS Code vb. açar
```

### **Örnek 2: Notu PDF Olarak Paylaşma**

```
1. Notu seç
2. Sağ tık
3. "Save As" → "PDF"
4. PDF dosyası indir
5. E-mail ile gönder
```

### **Örnek 3: Yedekleme JSON'da**

```
1. Tüm notlara sağ tık
2. "Save As" → "JSON"
3. Tüm notlar JSON dosyasında kaydedilir
4. Bilgisayarına kaydet (backup)
```

---

## 🚀 Programmatik Kullanım

Eğer manuel olarak export etmek istiyorsanız:

```typescript
import { 
  exportCardAsJSON,
  exportCardAsMarkdown,
  exportCardAsHTML,
  exportCardAsPDF,
  exportCardAsText
} from '@/utils/cardExport';
import { NoteCard } from '@/types';

// Notu al
const card: NoteCard = {
  id: '123',
  title: 'My Note',
  content: '<p>Content...</p>',
  tags: ['work', 'important'],
  // ... diğer alanlar
};

// Export et
exportCardAsJSON(card);       // → my-note.json
exportCardAsMarkdown(card);   // → my-note.md
exportCardAsHTML(card);       // → my-note.html
await exportCardAsPDF(card);  // → my-note.pdf
exportCardAsText(card);       // → my-note.txt
```

---

## 📊 Her Formatta Neler Kaydedilir?

| Elemam | JSON | MD | HTML | PDF | Text |
|--------|------|-----|------|-----|------|
| Başlık | ✅ | ✅ | ✅ | ✅ | ✅ |
| İçerik | ✅ | ✅ | ✅ | ✅ | ✅ |
| Etiketler | ✅ | ✅ | ✅ | ✅ | ✅ |
| Tarihler | ✅ | ✅ | ✅ | ✅ | ✅ |
| Stil | ✅ | ❌ | ✅ | ✅ | ❌ |
| Metadata | ✅ | ❌ | ✅ | ✅ | ❌ |

---

## ⌨️ Klavye Kısayolları

> Yakında kısayol eklenecek:
> - `Alt + S` - Sağ tık menüsünü aç
> - - `J` - JSON'da kaydet
> - `M` - Markdown'da kaydet
> - `H` - HTML'de kaydet
> - `P` - PDF'de kaydet
> - `T` - Text'te kaydet

---

## 🔗 Diğer Export Özellikleri

Bütün canvas'ı export etmek istiyorsanız → **Export Modal** kullanın:
- Toolbar'dan "Export" butonuna tıklayın
- Tüm notaları aynı anda export edin
- Canvas için PDF raporu oluşturun

---

## 🎨 Dosya Adlandırması

Exportler otomatik olarak adlandırılır:
```
[Not Başlığı].json
[Not Başlığı].md
[Not Başlığı].html
[Not Başlığı].pdf
[Not Başlığı].txt
```

Eğer başlık boşsa: `note-1.json`, `note-1.md` vb.

---

## ⚙️ İleri Özellikler

### Batch Export (Gelecek)
```js
// Birden çok notu aynı anda export et
exportMultipleCards(cards, format);
```

### Cloud Sync (Gelecek)
```js
// Cloud'a otomatik kaydet
await exportCardToCloud(card, format);
```

### Scheduled Backup (Gelecek)
```js
// Günlük otomatik backup
enableAutoBackup(cards, {
  frequency: 'daily',
  format: 'json',
  destination: 'cloud'
});
```

---

## 🐛 Sorunlar Giderme

### PDF Export Başarısız Oldu?
- Tarayıcıda pop-up engeli açık olabilir
- İnterneti kontrol et (HTML2PDF çalışıyor mu?)
- Başka bir format dene

### Dosya İndirmedi?
- Download klasörünü kontrol et
- Farklı bir tarayıcı dene
- Cache'i temizle

### Karakter Sorunu?
- JSON formatını dene (tüm karakterleri korur)
- Kodlama UTF-8'de mi?
- Özel karakterler varsa Text yerine JSON kullan

---

## 📝 Örnek İş Akışı

**Senaryo: Toplantı Notlarını Hazırlama**

```
1. GridNote'ta "Q2 Strategy" notu yaz
2. Etiketler ekle: #meeting, #important
3. Sağ tık → "Save As" → "Markdown"
4. Markdown dosyasını Teams'e upload et
5. Takım üyeleri görüntüleyebilir/edit edebilir
6. Değişiklikleri PDF olarak kaydet → Arşive
```

---

## 🎉 Başla!

Artık her notu istediğiniz formatta kaydedebilirsiniz!

**Sağ tık + kaydet = Basit ve hızlı!** 🚀
