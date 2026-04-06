# Stage 3 — Translation ⬜

Translate extracted texts using the native Web Translator API.

## Goal

After OCR extraction, the user selects a target language and clicks "Translate". The app uses the browser-native `Translator` API to translate each text block and displays the results alongside the originals.

## Browser Support

The Web Translator API requires:
- Chrome 138+ (behind `#language-detection-api` and `#translation-api` flags, or stable in newer versions)
- The translation language model must be downloaded on first use

A fallback strategy should be considered for unsupported browsers (see U5).

## Work Units

### U1 — `useTranslator` Composable (`app/composables/use-translator.ts`)
- Detect support: check `'Translator' in self` or `'translation' in self`
- Export `isSupported: Ref<boolean>`
- Export `translate(text: string, sourceLang: string, targetLang: string): Promise<string>`
  - Creates a `Translator` instance with `{ sourceLanguage, targetLanguage }`
  - Calls `translator.translate(text)`
  - Handles `ModelNotReadyError` — triggers model download and retries
- Export `detectLanguage(text: string): Promise<string>` using `LanguageDetector` API

### U2 — Store Action (`translateTexts()`)
- Set `status = 'translating'`
- Iterate over `extractedTexts`
- For each block: determine source language (from `ExtractedText.language` or detect)
- Call `translate(content, sourceLang, store.targetLanguage)`
- Build `TranslatedText` objects and push to `translatedTexts`
- Set `status = 'done'` or `status = 'error'`

### U3 — TextPanel UI Update
- Show "Translate" button (enabled only when `hasExtractedTexts && !isProcessing`)
- Show loading state while translating
- Toggle between original and translated text per block

### U4 — TextBlockCard Update
- Add translated text display below original
- Add toggle button to show/hide original
- Props: `text: ExtractedText`, `translation: TranslatedText | undefined`

### U5 — Fallback Strategy
- If `isSupported` is false, show an informational `UAlert` explaining browser requirements
- Optional: add a server-side route `POST /api/translate` using Google Cloud Translation API as fallback

## Updated Files

```
app/
  composables/
    use-translator.ts        # new
  components/
    text-block-card.vue      # updated: show translation
    text-panel.vue           # updated: translate button + toggle
  stores/
    translator.ts            # updated: translateTexts() implemented
```
