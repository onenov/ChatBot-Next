<script setup lang="ts">

</script>

<template>

  <ULandingHero class="z-40 py-40">
    <template #headline>
      <UBadge color="primary" variant="subtle">测试预览版 v1.0.1</UBadge>
    </template>
    <template #title>
      <span>ChatBot </span><span class="text-primary-500">Next</span>
    </template>
    <template #description>
      <div class="">提供从 Agent 构建到 AI workflow 编排、RAG 检索、模型管理等能力，轻松构建和运营生成式 AI 原生应用。<br>简化了令人惊叹且响应迅速的 ChatBot 应用程序的创建。
      </div>
    </template>
    <div class="flex flex-wrap gap-x-6 gap-y-3 justify-center">
      <NuxtLink to="/workflow">
        <UButton size="lg" color="primary" variant="solid" :trailing="false"> 立即开始
          <UIcon name="i-heroicons-chevron-right" />
        </UButton>
      </NuxtLink>
      <NuxtLink to="https://nov.craft.me/Hd9T8EOH0PDXD3" target="_blank">
        <UButton size="lg" color="primary" variant="solid" :trailing="false"> 文档
          <UIcon name="i-heroicons-document-text" />
        </UButton>
      </NuxtLink>
    </div>
  </ULandingHero>
  <HomeTetris />
</template>
