<script setup lang="ts">
import type { SupportedLanguage } from '~/types'
import { useTranslatorStore } from '~/stores/translator'

const store = useTranslatorStore()
const toast = useToast()

const languages: SupportedLanguage[] = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'pt', label: 'Portuguese' },
  { code: 'ja', label: 'Japanese' },
  { code: 'ko', label: 'Korean' },
  { code: 'zh', label: 'Chinese' },
  { code: 'fr', label: 'French' },
  { code: 'de', label: 'German' },
]

async function handleExtract() {
  await store.extractTexts()
  if (store.status === 'error') {
    toast.add({
      title: 'Extraction failed',
      description: store.error ?? 'An unexpected error occurred',
      color: 'error',
      icon: 'i-lucide-circle-x',
    })
  }
}
</script>

<template>
  <div class="flex h-full flex-col gap-4 p-4">
    <!-- Language selector -->
    <div class="flex flex-col gap-1">
      <label class="text-xs font-medium uppercase tracking-wide text-muted">Target language</label>
      <USelect
        :model-value="store.targetLanguage"
        :items="languages"
        value-key="code"
        label-key="label"
        @update:model-value="store.setTargetLanguage"
      />
    </div>

    <USeparator />

    <!-- Text list -->
    <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-default">Extracted texts</span>
        <UBadge
          v-if="store.hasExtractedTexts"
          :label="String(store.extractedTexts.length)"
          variant="soft"
        />
      </div>

      <!-- Skeleton while extracting -->
      <template v-if="store.status === 'extracting'">
        <div
          v-for="i in 4"
          :key="i"
          class="flex flex-col gap-2 rounded-lg border border-default p-3"
        >
          <USkeleton class="h-4 w-full" />
          <USkeleton class="h-4 w-3/4" />
          <USkeleton class="mt-1 h-3 w-1/3" />
        </div>
      </template>

      <!-- Empty state -->
      <div
        v-else-if="!store.hasExtractedTexts"
        class="flex flex-1 flex-col items-center justify-center gap-2 text-muted"
      >
        <UIcon name="i-lucide-scan-text" class="size-10 opacity-30" />
        <p class="text-center text-sm">
          {{ store.hasImage ? 'Click "Extract text" to start' : 'Upload an image first' }}
        </p>
      </div>

      <!-- Text blocks -->
      <TextBlockCard
        v-for="text in store.extractedTexts"
        v-else
        :key="text.id"
        :text="text"
      />
    </div>

    <!-- Extract button -->
    <UButton
      icon="i-lucide-scan-text"
      label="Extract text"
      block
      :disabled="!store.hasImage || store.isProcessing"
      :loading="store.status === 'extracting'"
      @click="handleExtract"
    />
  </div>
</template>
