# Adding New Languages to Banking Token System

## 🌍 Quick Guide to Adding Languages

This guide shows you how to add new languages and voices to the banking token announcement system.

## 📝 Step-by-Step Process

### Step 1: Find Available ResponsiveVoice Voices

Visit the [ResponsiveVoice API documentation](https://responsivevoice.org/api/) or use the test page (`responsive-voice.html`) to explore available voices.

**Common voice naming patterns:**

- `Language Name Female` (e.g., "Hindi Female")
- `Language Name Male` (e.g., "Hindi Male")
- `Language (Country) Female` (e.g., "Chinese (Hong Kong) Female")

### Step 2: Add Language Configuration

Open `banking-token.html` and locate the `VOICE_CONFIG` object (around line 850). Add your new language:

```javascript
const VOICE_CONFIG = {
  // ... existing languages ...

  // NEW LANGUAGE TEMPLATE
  ur: {
    // Language code (ISO 639-1)
    name: "Urdu", // English name
    nativeName: "اردو", // Native language name
    voices: [
      {
        name: "Urdu Female", // Display name
        voice: "Urdu Female", // ResponsiveVoice voice name
        gender: "female", // "male" or "female"
      },
      {
        name: "Urdu Male",
        voice: "Urdu Male",
        gender: "male",
      },
    ],
    labels: {
      tokenNumber: "ٹوکن نمبر", // Translated: Token Number
      counterNumber: "کاؤنٹر نمبر", // Translated: Counter Number
      pleaseGoTo: "براہ کرم جائیں کاؤنٹر", // Translated: Please go to counter
    },
    charMap: {
      // Numbers 0-9 (spoken in target language)
      0: "صفر",
      1: "ایک",
      2: "دو",
      3: "تین",
      4: "چار",
      5: "پانچ",
      6: "چھ",
      7: "سات",
      8: "آٹھ",
      9: "نو",

      // Letters A-Z (how to pronounce in target language)
      a: "اے",
      b: "بی",
      c: "سی",
      d: "ڈی",
      e: "ای",
      f: "ایف",
      g: "جی",
      h: "ایچ",
      i: "آئی",
      j: "جے",
      k: "کے",
      l: "ایل",
      m: "ایم",
      n: "این",
      o: "او",
      p: "پی",
      q: "کیو",
      r: "آر",
      s: "ایس",
      t: "ٹی",
      u: "یو",
      v: "وی",
      w: "ڈبلیو",
      x: "ایکس",
      y: "وائی",
      z: "زیڈ",
    },
  },
};
```

### Step 3: Add Language to Dropdown

Find the `<select id="languageSelect">` element (around line 770) and add your language:

```html
<select id="languageSelect" onchange="updateVoiceOptions()">
  <option value="en">English</option>
  <option value="bn">বাংলা (Bangla)</option>
  <!-- ... existing options ... -->

  <!-- ADD NEW LANGUAGE HERE -->
  <option value="ur">اردو (Urdu)</option>
</select>
```

### Step 4: Test Your Language

1. Save the file
2. Open `banking-token.html` in your browser
3. Select your new language from the dropdown
4. Choose a voice (male/female)
5. Enter test token (e.g., "A123")
6. Click "Announce Token"
7. Verify pronunciation is correct

## 🎯 Character Mapping Guide

### Understanding `charMap`

The `charMap` object defines how each character should be pronounced:

```javascript
charMap: {
  "0": "zero",     // How to say the digit 0
  "a": "A",        // How to say the letter A
  // etc.
}
```

### Examples by Language Type

#### English-based Languages

```javascript
// Numbers spoken as words
"0": "zero", "1": "one", "2": "two", ...

// Letters spoken as letter names
"a": "A", "b": "B", "c": "C", ...
```

#### Non-Latin Script Languages (Arabic, Hindi, etc.)

```javascript
// Numbers in native script/pronunciation
"0": "शून्य",  // Hindi: shunya (zero)
"1": "एक",     // Hindi: ek (one)

// Letters transliterated to native pronunciation
"a": "ए",      // Hindi: "ay" sound
"b": "बी",     // Hindi: "bee" sound
```

#### Tonal Languages (Chinese, Vietnamese, etc.)

```javascript
// Use native number words
"0": "零",  // Chinese: líng (zero)
"1": "一",  // Chinese: yī (one)

// Use phonetic pronunciation for letters
"a": "A",   // Usually keep Latin letters as-is
"b": "B",
```

## 📋 Complete Template

Copy and customize this template:

```javascript
// LANGUAGE CODE: Use ISO 639-1 two-letter code
// Examples: ur (Urdu), vi (Vietnamese), th (Thai), pl (Polish)
languageCode: {
  // English name of the language
  name: "Language Name",

  // How the language writes its own name
  nativeName: "Native Script Name",

  // Voice options (minimum 1, typically 2-6)
  voices: [
    { name: "Display Name 1", voice: "ResponsiveVoice Name 1", gender: "female" },
    { name: "Display Name 2", voice: "ResponsiveVoice Name 2", gender: "male" },
  ],

  // UI labels in target language
  labels: {
    tokenNumber: "Token Number (translated)",
    counterNumber: "Counter Number (translated)",
    pleaseGoTo: "Please go to counter (translated)",
  },

  // How to pronounce each character
  charMap: {
    // Digits 0-9
    "0": "zero (translated)",
    "1": "one (translated)",
    "2": "two (translated)",
    "3": "three (translated)",
    "4": "four (translated)",
    "5": "five (translated)",
    "6": "six (translated)",
    "7": "seven (translated)",
    "8": "eight (translated)",
    "9": "nine (translated)",

    // Letters A-Z (lowercase keys)
    "a": "A pronunciation", "b": "B pronunciation", "c": "C pronunciation",
    "d": "D pronunciation", "e": "E pronunciation", "f": "F pronunciation",
    "g": "G pronunciation", "h": "H pronunciation", "i": "I pronunciation",
    "j": "J pronunciation", "k": "K pronunciation", "l": "L pronunciation",
    "m": "M pronunciation", "n": "N pronunciation", "o": "O pronunciation",
    "p": "P pronunciation", "q": "Q pronunciation", "r": "R pronunciation",
    "s": "S pronunciation", "t": "T pronunciation", "u": "U pronunciation",
    "v": "V pronunciation", "w": "W pronunciation", "x": "X pronunciation",
    "y": "Y pronunciation", "z": "Z pronunciation"
  }
}
```

## 🔍 Finding the Right Translations

### For Labels

Use Google Translate or native speaker consultation:

1. "Token Number" → Your language
2. "Counter Number" → Your language
3. "Please go to counter" → Your language

### For Character Pronunciation

Ask: "How do you say the letter 'A' in [language]?"

**Examples:**

- English: "A" → "A" (letter name)
- Spanish: "A" → "A" (ah sound)
- Hindi: "A" → "ए" (transliteration)
- Arabic: "A" → "إيه" (transliteration)

## ✅ Quality Checklist

Before finalizing your new language:

- [ ] Voice name matches ResponsiveVoice exactly
- [ ] All 10 digits (0-9) have translations
- [ ] All 26 letters (a-z) have pronunciations
- [ ] Labels are accurate translations
- [ ] Tested with real token examples
- [ ] Male and female voices available
- [ ] Pronunciation is clear and understandable
- [ ] Character pause is natural (handled by system)

## 🎤 Adding Regional Variants

If a language has multiple regional voices:

```javascript
es: {
  name: "Spanish",
  nativeName: "Español",
  voices: [
    // Spain Spanish
    { name: "Spanish (Spain) Female", voice: "Spanish Female", gender: "female" },
    { name: "Spanish (Spain) Male", voice: "Spanish Male", gender: "male" },

    // Latin American Spanish
    { name: "Spanish (Latin America) Female", voice: "Spanish Latin American Female", gender: "female" },
    { name: "Spanish (Latin America) Male", voice: "Spanish Latin American Male", gender: "male" },

    // Mexican Spanish
    { name: "Spanish (Mexico) Female", voice: "Spanish Mexican Female", gender: "female" },
    { name: "Spanish (Mexico) Male", voice: "Spanish Mexican Male", gender: "male" },
  ],
  // ... rest of config
}
```

## 🌟 Common Language Codes

Quick reference for popular languages:

| Code | Language   | Native Name      |
| ---- | ---------- | ---------------- |
| `af` | Afrikaans  | Afrikaans        |
| `am` | Amharic    | አማርኛ             |
| `cs` | Czech      | Čeština          |
| `da` | Danish     | Dansk            |
| `el` | Greek      | Ελληνικά         |
| `fi` | Finnish    | Suomi            |
| `he` | Hebrew     | עברית            |
| `hu` | Hungarian  | Magyar           |
| `id` | Indonesian | Bahasa Indonesia |
| `it` | Italian    | Italiano         |
| `ms` | Malay      | Bahasa Melayu    |
| `nl` | Dutch      | Nederlands       |
| `no` | Norwegian  | Norsk            |
| `pl` | Polish     | Polski           |
| `pt` | Portuguese | Português        |
| `ru` | Russian    | Русский          |
| `sv` | Swedish    | Svenska          |
| `sw` | Swahili    | Kiswahili        |
| `ta` | Tamil      | தமிழ்            |
| `te` | Telugu     | తెలుగు           |
| `th` | Thai       | ไทย              |
| `tr` | Turkish    | Türkçe           |
| `ur` | Urdu       | اردو             |
| `vi` | Vietnamese | Tiếng Việt       |

## 💡 Pro Tips

1. **Test with native speakers** - Ensure pronunciation sounds natural
2. **Use responsive voice test page** - Explore available voices first
3. **Check ResponsiveVoice docs** - Verify voice availability for your plan
4. **Consider regional variants** - Some languages have multiple regional pronunciations
5. **Document your changes** - Add comments for future reference
6. **Keep backups** - Save a copy before making major changes

## 🐛 Troubleshooting

### Voice Not Available

- Check ResponsiveVoice documentation for correct voice name
- Some voices require premium API plan
- Try alternative voice names (e.g., "Hindi Female" vs "Hindi India Female")

### Incorrect Pronunciation

- Review `charMap` translations
- Test individual characters
- Consult native speakers for accuracy
- Check for special character handling

### UI Display Issues

- Ensure UTF-8 encoding in HTML
- Test with different browsers
- Check font support for script type
- Verify native name displays correctly

## 📞 Need Help?

- **ResponsiveVoice Voice List**: https://responsivevoice.org/text-to-speech-languages/
- **ISO Language Codes**: https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
- **Translation Help**: Google Translate, DeepL, or native speakers

---

**Happy extending! 🚀**
