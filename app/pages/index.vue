<script setup lang="ts">
import { ref } from 'vue'
import { useTranslatorStore } from '~/stores/translator'

const store = useTranslatorStore()
const colorMode = useColorMode()
const isPanelOpen = ref(false)

function toggleColorMode() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <!-- Top bar -->
    <header class="flex shrink-0 items-center justify-between border-b border-default bg-default px-4 py-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-book-open" class="size-5 text-primary" />
        <span class="font-semibold">Manga Translator</span>
      </div>

      <div class="flex items-center gap-1">
        <ExportMenu />
        <ImageUploader />
        <UButton
          size="sm"
          variant="ghost"
          :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
          @click="toggleColorMode"
        />
        <!-- Mobile: open panel -->
        <UButton
          class="md:hidden"
          size="sm"
          variant="ghost"
          icon="i-lucide-panel-right"
          :badge="store.hasExtractedTexts ? String(store.extractedTexts.length) : undefined"
          @click="isPanelOpen = true"
        />
      </div>
    </header>

    <!-- Main content (desktop) -->
    <main class="flex min-h-0 flex-1">
      <!-- Image panel -->
      <div class="min-h-0 flex-1 md:border-r md:border-default">
        <ImagePreview />
      </div>

      <!-- Text panel (desktop) -->
      <aside class="hidden shrink-0 md:block md:w-80">
        <TextPanel />
      </aside>
    </main>

    <!-- Text panel (mobile slideover) -->
    <USlideover
      v-model:open="isPanelOpen"
      title="Extracted texts"
      side="bottom"
      class="md:hidden"
    >
      <template #body>
        <TextPanel />
      </template>
    </USlideover>
  </div>
</template>
