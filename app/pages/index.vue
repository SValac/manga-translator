<script setup lang="ts">
import { ref } from 'vue'
import { useTranslatorStore } from '~/stores/translator'

const store = useTranslatorStore()
const colorMode = useColorMode()
const isPanelOpen = ref(false)
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <!-- Top bar -->
    <header class="flex shrink-0 items-center justify-between border-b border-default bg-default px-3 py-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-book-open" class="size-5 shrink-0 text-primary" />
        <span class="font-semibold">Manga Translator</span>
      </div>
      <!-- Desktop actions -->
      <div class="hidden items-center gap-1 md:flex">
        <ExportMenu />
        <ImageUploader />
        <UButton
          size="sm"
          variant="ghost"
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          @click="colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'"
        />
      </div>

      <!-- Mobile actions -->
      <div class="md:hidden">
        <HeaderMenu />
      </div>
    </header>

    <!-- Main content -->
    <main class="flex min-h-0 flex-1">
      <!-- Image panel -->
      <div class="min-h-0 flex-1 md:border-r md:border-default">
        <ImagePreview />
      </div>

      <!-- Text panel (desktop only) -->
      <aside class="hidden shrink-0 md:block md:w-80">
        <TextPanel />
      </aside>
    </main>

    <!-- Mobile FAB -->
    <div class="fixed bottom-4 right-4 md:hidden">
      <UButton
        size="lg"
        icon="i-lucide-scan-text"
        class="shadow-lg"
        :badge="store.hasExtractedTexts ? String(store.extractedTexts.length) : undefined"
        @click="isPanelOpen = true"
      />
    </div>

    <!-- Mobile slideover -->
    <USlideover
      v-model:open="isPanelOpen"
      title="Texts"
      side="bottom"
      :ui="{ content: 'h-[75dvh]' }"
    >
      <template #body>
        <div class="flex h-full flex-col">
          <TextPanel />
        </div>
      </template>
    </USlideover>
  </div>
</template>
