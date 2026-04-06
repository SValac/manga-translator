<script setup lang="ts">
import type { ExtractedText } from '~/types'

defineProps<{
  text: ExtractedText
}>()
</script>

<template>
  <div class="rounded-lg border border-default bg-default p-3 text-sm">
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
