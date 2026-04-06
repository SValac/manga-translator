# Stage 4 — Polish & UX ⬜

Quality of life improvements and UX refinements.

## Goal

Make the app feel complete and production-ready with export, navigation, zoom, and visual polish.

## Work Units

### U1 — Dark / Light Mode Toggle
- Add `ColorModeButton` in the header using Nuxt UI's built-in color mode support
- Ensure all semantic color tokens work in both modes

### U2 — Export Translations
- "Copy all" button — copies extracted + translated pairs to clipboard
- "Export .txt" button — downloads a plain text file with the translations
- Composable `useExport(texts: TranslatedText[])` to encapsulate both behaviors

### U3 — Multi-Page Support
- Allow uploading multiple images (array of `ImageFile` in the store)
- Image carousel/navigation in `ImagePreview` (prev/next arrows)
- Each page has its own `extractedTexts` and `translatedTexts`

### U4 — Image Zoom & Pan
- Add zoom in/out controls to `ImagePreview`
- Support mouse wheel zoom and drag-to-pan
- Use VueUse `useZoom` or implement with `transform: scale()` + pointer events

### U5 — Bounding Box Highlight Sync
- When hovering a `TextBlockCard`, highlight the corresponding bounding box on the image
- When clicking a bounding box on the image, scroll to and highlight the corresponding card
- Implement via a `hoveredTextId: Ref<string | null>` in the store

### U6 — Persist User Preferences
- Save `targetLanguage` to `localStorage` using VueUse `useLocalStorage`
- Restore on app load

### U7 — Error Handling & Toasts
- Standardize all error paths to use `useToast()` with `color: 'error'`
- Add retry buttons on OCR and translation failures
- Show confidence warning toast if average confidence < 70%

### U8 — Mobile Refinements
- On small screens: full-width image, text panel slides up as a drawer (`USlideover`)
- Touch-friendly controls for zoom and navigation
