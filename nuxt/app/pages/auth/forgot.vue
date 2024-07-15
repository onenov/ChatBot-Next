<script lang="ts" setup>
definePageMeta({
  middleware: ['guest'],
});

useSeoMeta({
  title: '重置密码',
})
</script>
<template>
  <HomeTetris />
  <UCard class="w-full max-w-md mx-auto my-20 z-[99]">
    <h1 class="text-3xl font-black mb-6 leading-tight tracking-tight">重置密码</h1>
    <AuthForgotPassword />
  </UCard>
</template>
