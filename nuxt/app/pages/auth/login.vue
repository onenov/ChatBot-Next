<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
});

useSeoMeta({
  title: '登陆',
})
</script>
<template>
  <HomeTetris />
  <UCard class="w-full max-w-md mx-auto my-20 z-[99]">
    <h1 class="text-3xl font-black mb-6 leading-tight tracking-tight">登陆</h1>
    <AuthLogin />
  </UCard>
</template>
