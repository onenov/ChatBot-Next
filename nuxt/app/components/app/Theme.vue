<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
const colorMode = useColorMode();
const isDark = computed({
  get() {
    return colorMode.value === "dark";
  },
  set(value: boolean) {
    colorMode.preference = value ? "dark" : "light";
    document.body.setAttribute('arco-theme', value ? 'dark' : 'light');
    // Log the current arco-theme value
    // console.log('arco-theme set to:', value ? 'dark' : 'light');
  },
});

onMounted(() => {
  document.body.setAttribute('arco-theme', colorMode.value === 'dark' ? 'dark' : 'light');
  // Log the initial arco-theme value
  // console.log('arco-theme on mount:', colorMode.value === 'dark' ? 'dark' : 'light');
});
</script>

<template>
  <ClientOnly>
    <UButton :icon="isDark ? 'i-heroicons-moon-20-solid' : 'i-heroicons-sun-20-solid'" color="gray" variant="soft"
      aria-label="Theme" @click="isDark = !isDark" />
    <template #fallback>
      <USkeleton class="w-8 h-8 rounded-md" />
    </template>
  </ClientOnly>
</template>
