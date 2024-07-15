<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
</script>

<template>
  <div>
    <NuxtLink to="/" class="font-black text-2xl leading-tight tracking-tight">
      <span class="text-gray-700 dark:text-gray-100">{{ settings.Web_Title }}</span>
      <span class="text-primary-500">Next</span>
    </NuxtLink>
  </div>
</template>
