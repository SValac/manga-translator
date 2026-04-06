<script setup lang="ts">
</script>

<template>
  <div class="flex h-screen flex-col overflow-hidden">
    <!-- Top bar -->
    <header class="flex shrink-0 items-center justify-between border-b border-default bg-default px-4 py-2">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-book-open" class="size-5 text-primary" />
        <span class="font-semibold">Manga Translator</span>
      </div>
      <ImageUploader />
    </header>

    <!-- Main content -->
    <main class="flex min-h-0 flex-1 flex-col md:flex-row">
      <!-- Image panel -->
      <div class="min-h-0 flex-1 md:border-r md:border-default">
        <ImagePreview />
      </div>

      <!-- Text panel -->
      <aside class="h-72 shrink-0 overflow-hidden border-t border-default md:h-auto md:w-80 md:border-t-0">
        <TextPanel />
      </aside>
    </main>
  </div>
</template>
