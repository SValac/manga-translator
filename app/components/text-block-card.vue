<script setup lang="ts">
import type { ExtractedText, TranslatedText } from '~/types'
import { ref } from 'vue'
import { useTranslatorStore } from '~/stores/translator'

const props = defineProps<{
  text: ExtractedText
  translation?: TranslatedText
}>()

const store = useTranslatorStore()
const showOriginal = ref(false)
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
    <!-- Translated content -->
    <template v-if="translation && !showOriginal">
      <p class="leading-relaxed text-default">
        {{ translation.translatedContent }}
      </p>
      <button
        class="mt-1 text-xs text-muted underline-offset-2 hover:underline"
        @click.stop="showOriginal = true"
      >
        Show original
      </button>
    </template>

    <!-- Original content -->
    <template v-else>
      <p class="leading-relaxed text-default">
        {{ text.content }}
      </p>
      <button
        v-if="translation"
        class="mt-1 text-xs text-muted underline-offset-2 hover:underline"
        @click.stop="showOriginal = false"
      >
        Show translation
      </button>
    </template>

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
