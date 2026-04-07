import type { ExtractedText, ImageFile, TranslatedText, TranslationStatus } from '~/types'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTranslatorStore = defineStore('translator', () => {
  const image = ref<ImageFile | null>(null)
  const extractedTexts = ref<ExtractedText[]>([])
  const translatedTexts = ref<TranslatedText[]>([])
  const status = ref<TranslationStatus>('idle')
  const targetLanguage = useLocalStorage('manga-translator-lang', 'en')
  const error = ref<string | null>(null)
  const hoveredTextId = ref<string | null>(null)

  const hasImage = computed(() => image.value !== null)
  const hasExtractedTexts = computed(() => extractedTexts.value.length > 0)
  const isProcessing = computed(() =>
    status.value === 'uploading'
    || status.value === 'extracting'
    || status.value === 'translating',
  )

  async function setImage(file: File): Promise<void> {
    status.value = 'uploading'
    error.value = null

    if (image.value) {
      URL.revokeObjectURL(image.value.objectUrl)
    }

    const objectUrl = URL.createObjectURL(file)
    const dimensions = await getImageDimensions(objectUrl)

    image.value = {
      id: crypto.randomUUID(),
      file,
      objectUrl,
      name: file.name,
      width: dimensions.width,
      height: dimensions.height,
      uploadedAt: new Date(),
    }

    extractedTexts.value = []
    translatedTexts.value = []
    status.value = 'idle'
  }

  function clearImage(): void {
    if (image.value) {
      URL.revokeObjectURL(image.value.objectUrl)
    }
    image.value = null
    extractedTexts.value = []
    translatedTexts.value = []
    status.value = 'idle'
    error.value = null
  }

  function setTargetLanguage(lang: string): void {
    targetLanguage.value = lang
  }

  async function extractTexts(): Promise<void> {
    if (!image.value)
      return

    status.value = 'extracting'
    error.value = null
    extractedTexts.value = []
    translatedTexts.value = []

    try {
      const formData = new FormData()
      formData.append('image', image.value.file)

      const response = await $fetch<{ texts: ExtractedText[] }>('/api/ocr', {
        method: 'POST',
        body: formData,
      })

      extractedTexts.value = sortTextsByReadingOrder(response.texts)
      status.value = 'done'
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'OCR failed'
      error.value = message
      status.value = 'error'
    }
  }

  function reorderExtractedTexts(fromIndex: number, toIndex: number): void {
    const list = [...extractedTexts.value]
    const moved = list.splice(fromIndex, 1)[0]
    if (!moved)
      return
    list.splice(toIndex, 0, moved)
    extractedTexts.value = list
  }

  async function translateTexts(
    translateFn: (text: string, source: string, target: string) => Promise<string>,
  ): Promise<void> {
    if (!hasExtractedTexts.value)
      return

    status.value = 'translating'
    error.value = null
    translatedTexts.value = []

    try {
      const results: TranslatedText[] = []

      for (const extracted of extractedTexts.value) {
        const sourceLang = extracted.language ?? 'ja'
        const translated = await translateFn(extracted.content, sourceLang, targetLanguage.value)

        results.push({
          id: crypto.randomUUID(),
          sourceTextId: extracted.id,
          originalContent: extracted.content,
          translatedContent: translated,
          targetLanguage: targetLanguage.value,
          translatedAt: new Date(),
        })
      }

      translatedTexts.value = results
      status.value = 'done'
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'Translation failed'
      error.value = message
      status.value = 'error'
    }
  }

  return {
    image,
    extractedTexts,
    translatedTexts,
    status,
    targetLanguage,
    error,
    hoveredTextId,
    hasImage,
    hasExtractedTexts,
    isProcessing,
    setImage,
    clearImage,
    setTargetLanguage,
    extractTexts,
    reorderExtractedTexts,
    translateTexts,
  }
})

function sortTextsByReadingOrder(texts: ExtractedText[]): ExtractedText[] {
  if (texts.length === 0)
    return texts

  // Detect predominant language — Japanese reads right-to-left
  const langs = texts.map(t => t.language).filter(Boolean)
  const isRtl = langs.length > 0
    && langs.filter(l => l === 'ja').length / langs.length > 0.5

  // Group into rows using average block height as threshold
  const avgHeight = texts.reduce((sum, t) => sum + t.boundingBox.height, 0) / texts.length
  const rowThreshold = avgHeight * 0.6

  const rows: ExtractedText[][] = []

  for (const text of [...texts].sort((a, b) => a.boundingBox.y - b.boundingBox.y)) {
    const row = rows.find(r =>
      Math.abs(r[0]!.boundingBox.y - text.boundingBox.y) < rowThreshold,
    )
    if (row) {
      row.push(text)
    }
    else {
      rows.push([text])
    }
  }

  // Sort within each row by x — descending for RTL (Japanese), ascending otherwise
  return rows.flatMap(row =>
    row.sort((a, b) =>
      isRtl
        ? b.boundingBox.x - a.boundingBox.x
        : a.boundingBox.x - b.boundingBox.x,
    ),
  )
}

function getImageDimensions(url: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}
