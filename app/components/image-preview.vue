<script setup lang="ts">
import { useDropZone, useEventListener, useLocalStorage } from '@vueuse/core'
import { computed, ref } from 'vue'
import { useTranslatorStore } from '~/stores/translator'

const store = useTranslatorStore()
const dropZoneRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

// Zoom & pan state
const zoom = useLocalStorage('manga-translator-zoom', 1)
const panX = ref(0)
const panY = ref(0)
const isPanning = ref(false)
const lastPan = ref({ x: 0, y: 0 })

const MIN_ZOOM = 0.5
const MAX_ZOOM = 4

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) {
    if (files?.[0]) {
      resetView()
      store.setImage(files[0])
    }
  },
  dataTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
})

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    resetView()
    store.setImage(target.files[0])
    target.value = ''
  }
}

function resetView() {
  zoom.value = 1
  panX.value = 0
  panY.value = 0
}

function onWheel(e: WheelEvent) {
  if (!store.image)
    return
  e.preventDefault()
  const delta = e.deltaY > 0 ? -0.1 : 0.1
  zoom.value = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, zoom.value + delta))
}

function onPointerDown(e: PointerEvent) {
  if (zoom.value <= 1)
    return
  isPanning.value = true
  lastPan.value = { x: e.clientX - panX.value, y: e.clientY - panY.value }
  ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
}

function onPointerMove(e: PointerEvent) {
  if (!isPanning.value)
    return
  panX.value = e.clientX - lastPan.value.x
  panY.value = e.clientY - lastPan.value.y
}

function onPointerUp() {
  isPanning.value = false
}

const imgStyle = computed(() => ({
  transform: `scale(${zoom.value}) translate(${panX.value / zoom.value}px, ${panY.value / zoom.value}px)`,
  cursor: zoom.value > 1 ? (isPanning.value ? 'grabbing' : 'grab') : 'default',
  transformOrigin: 'center center',
}))

useEventListener(dropZoneRef, 'wheel', onWheel, { passive: false })
</script>

<template>
  <div
    ref="dropZoneRef"
    class="relative flex h-full items-center justify-center overflow-hidden transition-colors select-none"
    :class="isOverDropZone ? 'bg-primary/5' : 'bg-muted/30'"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="onPointerUp"
  >
    <!-- Drop overlay when dragging -->
    <div
      v-if="isOverDropZone"
      class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary"
    >
      <UIcon name="i-lucide-image-up" class="size-12 text-primary" />
      <p class="font-medium text-primary">
        Drop to upload
      </p>
    </div>

    <!-- Image + overlay -->
    <template v-if="store.image">
      <img
        :src="store.image.objectUrl"
        :alt="store.image.name"
        class="max-h-full max-w-full object-contain p-2 transition-transform duration-100"
        :style="imgStyle"
        draggable="false"
      >
      <ImageOverlay
        :zoom="zoom"
        :pan-x="panX"
        :pan-y="panY"
      />
    </template>

    <!-- Empty state -->
    <div v-else class="flex flex-col items-center gap-4 text-center">
      <div class="flex flex-col items-center gap-2 text-muted">
        <UIcon name="i-lucide-image-up" class="size-14 opacity-40" />
        <p class="font-medium">
          Drop an image here
        </p>
        <p class="text-sm opacity-70">
          or use the upload button — PNG, JPG, WEBP
        </p>
      </div>
      <UButton
        icon="i-lucide-upload"
        label="Choose image"
        variant="soft"
        @click="inputRef?.click()"
      />
      <input
        ref="inputRef"
        type="file"
        accept="image/*"
        class="hidden"
        @change="onFileChange"
      >
    </div>

    <!-- Zoom controls -->
    <div
      v-if="store.image"
      class="absolute bottom-3 right-3 flex items-center gap-1 rounded-lg border border-default bg-default/90 p-1 backdrop-blur-sm"
    >
      <UButton
        size="xs"
        variant="ghost"
        icon="i-lucide-zoom-out"
        :disabled="zoom <= MIN_ZOOM"
        @click="zoom = Math.max(MIN_ZOOM, zoom - 0.25)"
      />
      <span class="w-10 text-center text-xs text-muted">{{ Math.round(zoom * 100) }}%</span>
      <UButton
        size="xs"
        variant="ghost"
        icon="i-lucide-zoom-in"
        :disabled="zoom >= MAX_ZOOM"
        @click="zoom = Math.min(MAX_ZOOM, zoom + 0.25)"
      />
      <UButton
        size="xs"
        variant="ghost"
        icon="i-lucide-maximize-2"
        @click="resetView"
      />
    </div>
  </div>
</template>
