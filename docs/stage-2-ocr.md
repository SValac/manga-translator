# Stage 2 — OCR Integration ⬜

Connect Google Document AI to extract text blocks from the uploaded image.

## Goal

When the user clicks "Extract text", the app sends the image to a Nuxt server route that calls the Google Document AI OCR API and returns the detected text blocks with their positions.

## Environment Variables

```
GOOGLE_PROJECT_ID=
GOOGLE_LOCATION=us
GOOGLE_PROCESSOR_ID=
GOOGLE_APPLICATION_CREDENTIALS=   # path to service account JSON
```

## Work Units

### U1 — Google Cloud Setup
- Create a Google Cloud project
- Enable the Document AI API
- Create an OCR processor (type: `DOCUMENT_OCR_PROCESSOR`)
- Create a service account with `Document AI API User` role
- Download the service account JSON key

### U2 — Server Utility (`server/utils/document-ai.ts`)
- Initialize the `@google-cloud/documentai` client using env vars
- Export a `processImage(imageBase64: string, mimeType: string)` function
- Parse the response into `ExtractedText[]` — map each `paragraph` or `token` to `{ id, content, confidence, boundingBox, language }`
- Normalize bounding box coordinates to relative values (0–1) based on image dimensions

### U3 — Server Route (`server/api/ocr.post.ts`)
- Accept `multipart/form-data` with the image file
- Convert image to base64
- Call `processImage()` from the utility
- Return `{ texts: ExtractedText[] }`
- Handle errors with proper HTTP status codes

### U4 — Store Action (`extractTexts()`)
- Set `status = 'extracting'`
- Send `$fetch('/api/ocr', { method: 'POST', body: formData })`
- Populate `extractedTexts` with the response
- Set `status = 'done'` or `status = 'error'`

### U5 — TextPanel UI Update
- Replace placeholder with actual `text-block-card.vue` list
- Show loading skeleton (`USkeleton`) while extracting
- Show error toast on failure (`useToast`)

### U6 — TextBlockCard Component (`app/components/text-block-card.vue`)
- Displays: extracted text content, confidence percentage, detected language
- Props: `text: ExtractedText`

### U7 — Bounding Box Overlay (optional)
- `app/components/image-overlay.vue`
- Renders `<svg>` rectangles over `ImagePreview` matching each `BoundingBox`
- Highlight on hover linked to the corresponding `TextBlockCard`

## New Files

```
server/
  api/
    ocr.post.ts
  utils/
    document-ai.ts
app/
  components/
    text-block-card.vue
    image-overlay.vue        # optional
```

## Dependencies to Add

```bash
bun add @google-cloud/documentai
```
