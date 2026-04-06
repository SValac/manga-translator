# Manga Translator — Implementation Plan

App for extracting and translating text from manga/manhwa images using Google Document AI (OCR) and the native Web Translator API.

## Stack

| Layer | Technology |
|---|---|
| Framework | Nuxt 4 |
| UI | Nuxt UI 4.6.1 |
| State | Pinia |
| Utilities | VueUse |
| Language | TypeScript |
| Runtime | Bun |
| OCR | Google Document AI |
| Translation | Web Translator API (native browser) |

## Stages

| Stage | Description | Status |
|---|---|---|
| [Stage 1 — UI Shell](./stage-1-ui-shell.md) | Base setup, image upload, split layout | ✅ Done |
| [Stage 2 — OCR Integration](./stage-2-ocr.md) | Google Document AI, text extraction | ⬜ Pending |
| [Stage 3 — Translation](./stage-3-translation.md) | Web Translator API, display translations | ⬜ Pending |
| [Stage 4 — Polish & UX](./stage-4-polish.md) | Export, zoom, multi-page, dark mode | ⬜ Pending |

## Data Flow

```
User uploads image
      ↓
store.setImage(file)        → ImageFile stored, objectUrl created
      ↓
store.extractTexts()        → POST /api/ocr → Document AI
      ↓                        returns ExtractedText[]
store.extractedTexts        → TextPanel renders text blocks
      ↓
store.translateTexts()      → Web Translator API
      ↓                        returns TranslatedText[]
store.translatedTexts       → TextPanel renders translations
```
