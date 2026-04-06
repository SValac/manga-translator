<script setup lang="ts">
import { useDropZone } from '@vueuse/core'
import { ref } from 'vue'
import { useTranslatorStore } from '~/stores/translator'

const store = useTranslatorStore()
const dropZoneRef = ref<HTMLDivElement | null>(null)
const inputRef = ref<HTMLInputElement | null>(null)

const { isOverDropZone } = useDropZone(dropZoneRef, {
  onDrop(files) {
    if (files?.[0])
      store.setImage(files[0])
  },
  dataTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
})

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files?.[0]) {
    store.setImage(target.files[0])
    target.value = ''
  }
}
</script>

<template>
  <div
    ref="dropZoneRef"
    class="relative flex h-full items-center justify-center overflow-hidden transition-colors"
    :class="isOverDropZone ? 'bg-primary/5' : 'bg-muted/30'"
  >
    <!-- Drop overlay when dragging -->
    <div v-if="isOverDropZone" class="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-primary">
      <UIcon name="i-lucide-image-up" class="size-12 text-primary" />
      <p class="font-medium text-primary">
        Drop to upload
      </p>
    </div>

    <!-- Image -->
    <img
      v-if="store.image"
      :src="store.image.objectUrl"
      :alt="store.image.name"
      class="max-h-full max-w-full object-contain p-2"
    >

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
  </div>
</template>
