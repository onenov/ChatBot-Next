<script lang="ts" setup>
useSeoMeta({
  title: 'Account',
})
</script>
<template>
  <UCard :ui="{ body: { base: 'grid grid-cols-12 gap-6 md:gap-8' } }">
    <div class="col-span-12 lg:col-span-4">
      <div class="text-lg font-semibold mb-2">基本信息</div>
      <div class="text-sm opacity-80">
        了解你的用户等级，配额、剩余额度和有效期
      </div>
    </div>
    <div class="col-span-12 lg:col-span-8">
      <AccountAbout />
    </div>
    <UDivider class="col-span-12" />
    <div class="col-span-12 lg:col-span-4">
      <div class="text-lg font-semibold mb-2">简介</div>
      <div class="text-sm opacity-80">
        更新您的个人资料信息和电子邮件地址。
      </div>
    </div>
    <div class="col-span-12 lg:col-span-8">
      <AccountUpdateProfile />
    </div>
    <UDivider class="col-span-12" />
    <div class="col-span-12 lg:col-span-4">
      <div class="text-lg font-semibold mb-2">更新密码</div>
      <div class="text-sm opacity-80">
        确保您的帐户使用长而随机的密码以保持安全。
      </div>
    </div>
    <div class="col-span-12 lg:col-span-8">
      <AccountUpdatePassword />
    </div>
  </UCard>
</template>
