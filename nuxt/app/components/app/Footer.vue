<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
</script>
<template>
  <footer class="bg-background/75 border-t border-dashed border-gray-200/80 dark:border-gray-800/80">
    <UContainer class="flex justify-between py-4 text-sm">
      <span> {{ settings.Web_Title }} {{ new Date().getFullYear() }} </span>
      <NuxtLink to="https://orence.net" target="_blank"> ORENCE </NuxtLink>
    </UContainer>
  </footer>
</template>
