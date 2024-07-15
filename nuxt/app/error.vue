<script setup lang="ts">
const props = defineProps({
  error: Object,
});

const handleError = () => clearError({ redirect: "/" });

useSeoMeta({
  title: 'Error',
})
</script>

<template>
  <HomeTetris />
  <UContainer class="py-5 flex items-center justify-center z-[100]">
    <AppLogo />
  </UContainer>
  <UContainer class="flex-grow flex flex-col items-center justify-center space-y-5 z-[100]">
    <h1 class="text-9xl font-bold">{{ error?.statusCode }}</h1>
    <div>{{ error?.message }}</div>
    <div v-if="error?.statusCode >= 500" v-html="error?.stack"></div>
    <div>
      <UButton @click="handleError" size="xl" variant="outline" label="Go back" />
    </div>
  </UContainer>
</template>
