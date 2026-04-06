# Stage 1 — UI Shell ✅

Base project setup and image upload interface.

## Goal

Provide a working UI where the user can upload a manga/manhwa image, visualize it, and see the panel where extracted texts will appear in future stages.

## Status: Done

## Completed Work

### Project Setup
- Nuxt 4 + Nuxt UI 4.6.1 + Pinia + VueUse configured
- ESLint (`@antfu/eslint-config`) + Husky + lint-staged
- Docker + docker-compose for local dev
- All dependencies pinned (no `^` ranges)

### TypeScript Types (`app/types/index.ts`)
- `ImageFile` — uploaded image with objectUrl and dimensions
- `ExtractedText` — single OCR result block with bounding box
- `TranslatedText` — translated version of an extracted block
- `TranslationStatus` — `'idle' | 'uploading' | 'extracting' | 'translating' | 'done' | 'error'`
- `SupportedLanguage` — `{ code, label }` for the language selector
- `BoundingBox` — `{ x, y, width, height }`

### Pinia Store (`app/stores/translator.ts`)
- **State:** `image`, `extractedTexts`, `translatedTexts`, `status`, `targetLanguage`, `error`
- **Getters:** `hasImage`, `hasExtractedTexts`, `isProcessing`
- **Actions:** `setImage(file)`, `clearImage()`, `setTargetLanguage(lang)`
- **Stubs:** `extractTexts()`, `translateTexts()` — throw "Not implemented" until Stage 2/3

### Components
| Component | Description |
|---|---|
| `image-uploader.vue` | Compact header button — file picker trigger, shows filename when loaded |
| `image-preview.vue` | Full drop zone (drag & drop via VueUse) when empty, renders image when loaded |
| `text-panel.vue` | Language selector (`USelect`) + placeholder list for extracted texts |

### Pages
- `pages/index.vue` — split layout: fixed header + image panel (left, flex-1) + text panel (right, w-80)

## File Tree

```
app/
  types/index.ts
  stores/translator.ts
  components/
    image-uploader.vue
    image-preview.vue
    text-panel.vue
  pages/index.vue
  assets/css/main.css
  app.vue
nuxt.config.ts
docker-compose.yml
Dockerfile
eslint.config.mjs
```
