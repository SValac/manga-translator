import { ref } from 'vue'

const MIN_CHROME_VERSION = 138
const CHROME_VERSION_REGEX = /Chrome\/(\d+)/

export function useTranslator() {
  const isSupported = ref(false)
  const chromeVersion = ref<number | null>(null)

  if (import.meta.client) {
    const match = navigator.userAgent.match(CHROME_VERSION_REGEX)
    const version = match?.[1] ? Number.parseInt(match[1], 10) : null
    chromeVersion.value = version

    isSupported.value = (
      version !== null
      && version >= MIN_CHROME_VERSION
      && ('Translator' in window || 'translation' in window)
    )
  }

  async function translate(
    text: string,
    sourceLang: string,
    targetLang: string,
  ): Promise<string> {
    if (sourceLang === targetLang)
      return text

    if ('Translator' in window && window.Translator) {
      const availability = await window.Translator.availability({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      })

      if (availability === 'unavailable') {
        throw new Error(`Translation unavailable for ${sourceLang} → ${targetLang}`)
      }

      const translator = await window.Translator.create({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      })

      const result = await translator.translate(text)
      translator.destroy()
      return result
    }

    if ('translation' in window && window.translation) {
      const canTranslate = await window.translation.canTranslate({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      })

      if (canTranslate === 'no') {
        throw new Error(`Translation unavailable for ${sourceLang} → ${targetLang}`)
      }

      const translator = await window.translation.createTranslator({
        sourceLanguage: sourceLang,
        targetLanguage: targetLang,
      })

      const result = await translator.translate(text)
      translator.destroy()
      return result
    }

    throw new Error('Web Translator API not available')
  }

  return { isSupported, chromeVersion, minVersion: MIN_CHROME_VERSION, translate }
}
