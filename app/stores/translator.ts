import type { ExtractedText, ImageFile, TranslatedText, TranslationStatus } from '~/types'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTranslatorStore = defineStore('translator', () => {
  const image = ref<ImageFile | null>(null)
  const extractedTexts = ref<ExtractedText[]>([])
  const translatedTexts = ref<TranslatedText[]>([])
  const status = ref<TranslationStatus>('idle')
  const targetLanguage = ref<string>('en')
  const error = ref<string | null>(null)

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

      extractedTexts.value = response.texts
      status.value = 'done'
    }
    catch (err) {
      const message = err instanceof Error ? err.message : 'OCR failed'
      error.value = message
      status.value = 'error'
    }
  }

  async function translateTexts(): Promise<void> {
    throw new Error('Not implemented — Stage 2')
  }

  return {
    image,
    extractedTexts,
    translatedTexts,
    status,
    targetLanguage,
    error,
    hasImage,
    hasExtractedTexts,
    isProcessing,
    setImage,
    clearImage,
    setTargetLanguage,
    extractTexts,
    translateTexts,
  }
})

function getImageDimensions(url: string): Promise<{ width: number, height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight })
    img.onerror = reject
    img.src = url
  })
}
