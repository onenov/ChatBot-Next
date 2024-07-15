<script lang="ts" setup>
definePageMeta({
  middleware: ["auth"],
});

const links = [
  [
    {
      label: "个人中心",
      icon: "i-heroicons-user",
      to: "/account/general",
    },
    {
      label: "消耗总览",
      to: "/account/log",
      icon: "i-heroicons-clock",
    },
    {
      label: "登陆历史",
      icon: "i-heroicons-device-phone-mobile",
      to: "/account/devices",
    },
  ],
];
</script>
<template>
  <NuxtLayout>
    <UHorizontalNavigation :links="links" class="border-b border-gray-200 dark:border-gray-800 mb-4" />
    <NuxtPage class="col-span-10 md:col-span-8" />
  </NuxtLayout>
</template>
