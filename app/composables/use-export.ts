import type { ExtractedText, TranslatedText } from '~/types'

export function useExport() {
  function orderedTranslations(
    extractedTexts: ExtractedText[],
    translatedTexts: TranslatedText[],
  ): TranslatedText[] {
    const map = Object.fromEntries(translatedTexts.map(t => [t.sourceTextId, t]))
    return extractedTexts.flatMap(e => (map[e.id] ? [map[e.id]!] : []))
  }

  function formatTexts(texts: TranslatedText[]): string {
    return texts
      .map((t, i) =>
        `[${i + 1}]\nOriginal: ${t.originalContent}\nTranslation (${t.targetLanguage}): ${t.translatedContent}`,
      )
      .join('\n\n')
  }

  async function copyToClipboard(
    extractedTexts: ExtractedText[],
    translatedTexts: TranslatedText[],
  ): Promise<void> {
    const content = formatTexts(orderedTranslations(extractedTexts, translatedTexts))
    await navigator.clipboard.writeText(content)
  }

  function downloadTxt(
    extractedTexts: ExtractedText[],
    translatedTexts: TranslatedText[],
    filename = 'translation.txt',
  ): void {
    const content = formatTexts(orderedTranslations(extractedTexts, translatedTexts))
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return { copyToClipboard, downloadTxt }
}
