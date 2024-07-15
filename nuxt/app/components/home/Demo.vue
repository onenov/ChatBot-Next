<template>

  <div class="grid grid-cols-1 md:grid-cols-5 gap-6 h-full gap-y-6 relative max-w-6xl mx-auto">
    <!-- Left Column -->
    <div class="md:col-span-3 space-y-4 flex flex-col h-full gap-y-2">
      <ULandingCard title="应用" description="应用即基于各类业务场景，组合大模型、知识库等原子能力搭建并进行个性化配置的专属“数字员工”。"
        icon="i-heroicons-face-smile" color="indigo" orientation="horizontal">

        <div class="flex justify-center items-center">
          <img src="https://io.onenov.cn/file/202407130340221.svg" class="w-9/12 rounded-md">
        </div>
      </ULandingCard>

      <ULandingCard title="知识库" description="基于RAG架构的知识库能力，帮助企业利用自有知识定制化AI，把知识教给一个“数字大脑”。" icon="i-heroicons-book-open"
        color="primary" orientation="horizontal">
        <div class="flex justify-center items-center">
          <img src="https://io.onenov.cn/file/202407130341465.svg" class="w-9/12 rounded-md">
        </div>
      </ULandingCard>
      <ULandingCard title="插件" description="基于Agent架构的高可扩展插件能力，让智能体与外部服务进行交互，除了“大脑”还拥有“手和脚” 。"
        icon="i-heroicons-puzzle-piece" color="cyan" orientation="horizontal">
        <div class="flex justify-center items-center">
          <img src="https://io.onenov.cn/file/202407130341710.svg" class="w-9/12 rounded-md">
        </div>
      </ULandingCard>
    </div>
    <!-- Right Column -->
    <div class="md:col-span-2 space-y-4 flex flex-col h-full gap-y-2">
      <ULandingCard title="工作流" description="实用WorkFlow功能，进一步增强AI对流程型复杂任务的理解和执行能力，以实现“可计划”的Agent。"
        icon="i-heroicons-squares-plus" color="sky" orientation="vertical">
        <div class="flex justify-center items-center">
          <img src="https://io.onenov.cn/file/202407130341425.svg" class="w-9/12 rounded-md">
        </div>
      </ULandingCard>
      <ULandingCard title="应用接入" description="支持一键接入主流IM平台、办公协同平台等，还可通过封装能力嵌入您的Web网站，或通过API接入自研/第三方系统使用。"
        icon="i-heroicons-sparkles" color="teal" orientation="vertical">
        <div class="flex justify-center items-center">
          <img src="https://io.onenov.cn/file/202407130353575.svg" class="w-9/12 rounded-md">
        </div>
      </ULandingCard>
    </div>
  </div>

</template>
