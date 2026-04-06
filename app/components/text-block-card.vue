<script setup lang="ts">
import type { ExtractedText } from '~/types'
import { useTranslatorStore } from '~/stores/translator'

const props = defineProps<{
  text: ExtractedText
}>()

const store = useTranslatorStore()
</script>

<template>
  <div
    class="cursor-default rounded-lg border p-3 text-sm transition-colors"
    :class="store.hoveredTextId === text.id
      ? 'border-primary bg-primary/5'
      : 'border-default bg-default hover:border-primary/50'"
    @mouseenter="store.hoveredTextId = props.text.id"
    @mouseleave="store.hoveredTextId = null"
  >
    <p class="leading-relaxed text-default">
      {{ text.content }}
    </p>
    <div class="mt-2 flex items-center gap-2">
      <UBadge
        v-if="text.language"
        :label="text.language.toUpperCase()"
        variant="soft"
        color="neutral"
        size="sm"
      />
      <span class="text-xs text-muted">
        {{ Math.round(text.confidence * 100) }}% confidence
      </span>
    </div>
  </div>
</template>
