<script setup lang="ts">
import { useElementSize } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useTranslatorStore } from '~/stores/translator'

const store = useTranslatorStore()
const containerRef = ref<HTMLDivElement | null>(null)
const { width: containerW, height: containerH } = useElementSize(containerRef)

// Calculate the rendered image bounds within the object-contain container
const imageBounds = computed(() => {
  if (!store.image || containerW.value === 0 || containerH.value === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  // p-2 = 8px padding on each side
  const padding = 8
  const availW = containerW.value - padding * 2
  const availH = containerH.value - padding * 2

  const { width: imgW, height: imgH } = store.image
  const scale = Math.min(availW / imgW, availH / imgH)
  const renderedW = imgW * scale
  const renderedH = imgH * scale

  return {
    x: padding + (availW - renderedW) / 2,
    y: padding + (availH - renderedH) / 2,
    width: renderedW,
    height: renderedH,
  }
})

function toPixels(box: { x: number, y: number, width: number, height: number }) {
  const b = imageBounds.value
  return {
    x: b.x + box.x * b.width,
    y: b.y + box.y * b.height,
    width: box.width * b.width,
    height: box.height * b.height,
  }
}
</script>

<template>
  <div ref="containerRef" class="pointer-events-none absolute inset-0">
    <svg
      v-if="store.hasExtractedTexts"
      class="absolute inset-0 h-full w-full"
    >
      <rect
        v-for="text in store.extractedTexts"
        :key="text.id"
        v-bind="toPixels(text.boundingBox)"
        class="transition-all duration-150"
        :fill="store.hoveredTextId === text.id ? 'color-mix(in srgb, var(--ui-primary) 15%, transparent)' : 'transparent'"
        :stroke="store.hoveredTextId === text.id ? 'var(--ui-primary)' : 'color-mix(in srgb, var(--ui-primary) 50%, transparent)'"
        stroke-width="1.5"
        rx="2"
      />
    </svg>
  </div>
</template>
