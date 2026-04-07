// Web Translator API — Chrome 138+
// https://developer.chrome.com/docs/ai/translator-api

type TranslatorOptions = {
  sourceLanguage: string
  targetLanguage: string
}

type Translator = {
  translate: (text: string) => Promise<string>
  destroy: () => void
}

type TranslatorCapabilities = {
  languagePairAvailable: (source: string, target: string) => 'readily' | 'after-download' | 'no'
}

type TranslatorStatic = {
  availability: (options: TranslatorOptions) => Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>
  create: (options: TranslatorOptions) => Promise<Translator>
}

type LanguageDetector = {
  detect: (text: string) => Promise<{ detectedLanguage: string, confidence: number }[]>
  destroy: () => void
}

type LanguageDetectorStatic = {
  availability: () => Promise<'unavailable' | 'downloadable' | 'downloading' | 'available'>
  create: () => Promise<LanguageDetector>
}

// eslint-disable-next-line ts/consistent-type-definitions
declare interface Window {
  Translator?: TranslatorStatic
  LanguageDetector?: LanguageDetectorStatic
  translation?: {
    canTranslate: (options: TranslatorOptions) => Promise<'no' | 'readily' | 'after-download'>
    createTranslator: (options: TranslatorOptions) => Promise<Translator>
  }
}
