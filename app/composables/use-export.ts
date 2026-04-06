import type { TranslatedText } from '~/types'

export function useExport() {
  function formatTexts(texts: TranslatedText[]): string {
    return texts
      .map((t, i) =>
        `[${i + 1}]\nOriginal: ${t.originalContent}\nTranslation (${t.targetLanguage}): ${t.translatedContent}`,
      )
      .join('\n\n')
  }

  async function copyToClipboard(texts: TranslatedText[]): Promise<void> {
    const content = formatTexts(texts)
    await navigator.clipboard.writeText(content)
  }

  function downloadTxt(texts: TranslatedText[], filename = 'translation.txt'): void {
    const content = formatTexts(texts)
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
