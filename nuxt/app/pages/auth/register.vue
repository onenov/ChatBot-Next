<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
});

useSeoMeta({
  title: '注册',
})
</script>
<template>
  <HomeTetris />
  <UCard class="w-full max-w-md mx-auto my-20 z-[40]">
    <h1 class="text-3xl font-black mb-6 leading-tight tracking-tight">注册</h1>
    <AuthRegister />
  </UCard>
</template>
