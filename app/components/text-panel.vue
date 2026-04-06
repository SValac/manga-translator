<script setup lang="ts">
import type { SupportedLanguage } from '~/types'
import { useTranslatorStore } from '~/stores/translator'

const store = useTranslatorStore()

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
</script>

<template>
  <div class="flex h-full flex-col gap-4 p-4">
    <div class="flex flex-col gap-1">
      <label class="text-xs font-medium text-muted uppercase tracking-wide">Target language</label>
      <USelect
        :model-value="store.targetLanguage"
        :items="languages"
        value-key="code"
        label-key="label"
        @update:model-value="store.setTargetLanguage"
      />
    </div>

    <USeparator />

    <div class="flex flex-1 flex-col gap-2 overflow-y-auto">
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-default">Extracted texts</span>
        <UBadge
          v-if="store.hasExtractedTexts"
          :label="String(store.extractedTexts.length)"
          variant="soft"
        />
      </div>

      <div v-if="!store.hasExtractedTexts" class="flex flex-1 flex-col items-center justify-center gap-2 text-muted">
        <UIcon name="i-lucide-scan-text" class="size-10 opacity-30" />
        <p class="text-center text-sm">
          Extracted texts will appear here
        </p>
      </div>

      <UCard
        v-for="text in store.extractedTexts"
        v-else
        :key="text.id"
        class="text-sm"
      >
        <p class="text-default">
          {{ text.content }}
        </p>
        <p v-if="text.language" class="mt-1 text-xs text-muted">
          {{ text.language }} · {{ Math.round(text.confidence * 100) }}% confidence
        </p>
      </UCard>
    </div>

    <UButton
      icon="i-lucide-scan-text"
      label="Extract text"
      block
      :disabled="!store.hasImage || store.isProcessing"
      :loading="store.status === 'extracting'"
    />
  </div>
</template>
