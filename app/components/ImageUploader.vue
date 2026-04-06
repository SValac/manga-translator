<script setup lang="ts">
import { ref } from 'vue';
import { useTranslatorStore } from '~/stores/translator';

const store = useTranslatorStore();
const inputRef = ref<HTMLInputElement | null>(null);

function onFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files?.[0]) {
    store.setImage(target.files[0]);
    target.value = '';
  }
}

function openFilePicker() {
  inputRef.value?.click();
}
</script>

<template>
  <div class="flex items-center gap-2">
    <template v-if="store.hasImage">
      <UIcon name="i-lucide-image" class="size-4 shrink-0 text-muted" />
      <span class="max-w-40 truncate text-sm text-muted">{{ store.image?.name }}</span>
      <UButton size="sm" variant="ghost" icon="i-lucide-refresh-cw" label="Change" @click="openFilePicker" />
    </template>

    <UButton v-else icon="i-lucide-upload" label="Upload image" size="sm" @click="openFilePicker" />

    <input ref="inputRef" type="file" accept="image/*" class="hidden" @change="onFileChange">
  </div>
</template>
