<script setup lang="ts">
import { useExport } from '~/composables/use-export'
import { useTranslatorStore } from '~/stores/translator'

const FILENAME_REGEX = /\.[^.]+$/

const store = useTranslatorStore()
const toast = useToast()
const { copyToClipboard, downloadTxt } = useExport()

const items = [
  [
    {
      label: 'Copy to clipboard',
      icon: 'i-lucide-clipboard',
      onSelect: handleCopy,
    },
    {
      label: 'Download .txt',
      icon: 'i-lucide-download',
      onSelect: handleDownload,
    },
  ],
]

async function handleCopy() {
  await copyToClipboard(store.extractedTexts, store.translatedTexts)
  toast.add({
    title: 'Copied!',
    description: `${store.translatedTexts.length} translations copied to clipboard`,
    color: 'success',
    icon: 'i-lucide-clipboard-check',
  })
}

function handleDownload() {
  const name = store.image?.name.replace(FILENAME_REGEX, '') ?? 'translation'
  downloadTxt(store.extractedTexts, store.translatedTexts, `${name}-translation.txt`)
}
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      size="sm"
      variant="ghost"
      icon="i-lucide-download"
      label="Export"
      :disabled="store.translatedTexts.length === 0"
    />
  </UDropdownMenu>
</template>
