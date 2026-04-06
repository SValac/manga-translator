<script setup lang="ts">
import { useExport } from '~/composables/use-export'
import { useTranslatorStore } from '~/stores/translator'

const FILE_EXTENSION_REGEX = /\.[^.]+$/

const store = useTranslatorStore()
const colorMode = useColorMode()
const toast = useToast()
const { copyToClipboard, downloadTxt } = useExport()
const inputRef = ref<HTMLInputElement | null>(null)

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    store.setImage(target.files[0])
    target.value = ''
  }
}

async function handleCopy() {
  await copyToClipboard(store.translatedTexts)
  toast.add({
    title: 'Copied!',
    description: `${store.translatedTexts.length} translations copied to clipboard`,
    color: 'success',
    icon: 'i-lucide-clipboard-check',
  })
}

function handleDownload() {
  const name = store.image?.name.replace(FILE_EXTENSION_REGEX, '') ?? 'translation'
  downloadTxt(store.translatedTexts, `${name}-translation.txt`)
}

const items = computed(() => [
  [
    {
      label: store.hasImage ? `Change image` : 'Upload image',
      icon: 'i-lucide-image-up',
      onSelect: () => inputRef.value?.click(),
    },
  ],
  [
    {
      label: 'Copy translations',
      icon: 'i-lucide-clipboard',
      disabled: store.translatedTexts.length === 0,
      onSelect: handleCopy,
    },
    {
      label: 'Download .txt',
      icon: 'i-lucide-download',
      disabled: store.translatedTexts.length === 0,
      onSelect: handleDownload,
    },
  ],
  [
    {
      label: colorMode.value === 'dark' ? 'Light mode' : 'Dark mode',
      icon: colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon',
      onSelect: () => {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
      },
    },
  ],
])
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      size="sm"
      variant="ghost"
      icon="i-lucide-ellipsis-vertical"
    />
  </UDropdownMenu>
  <input
    ref="inputRef"
    type="file"
    accept="image/*"
    class="hidden"
    @change="onFileChange"
  >
</template>
