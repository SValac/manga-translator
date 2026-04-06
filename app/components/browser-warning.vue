<script setup lang="ts">
defineProps<{
  minVersion: number
  currentVersion: number | null
}>()
</script>

<template>
  <UAlert
    color="warning"
    variant="soft"
    icon="i-lucide-triangle-alert"
    title="Chrome {{ minVersion }}+ required"
    :description="currentVersion
      ? `Your Chrome version (${currentVersion}) doesn't support the Web Translator API. Please update to Chrome ${minVersion} or newer.`
      : `This feature requires Google Chrome ${minVersion}+ with the Web Translator API. Other browsers are not supported.`"
  />
</template>
