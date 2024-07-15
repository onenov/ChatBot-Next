<script lang="ts" setup>
const form = ref();
const auth = useAuthStore();
const quotaDescription = computed(() => `你还可以创建 ${auth.user.remaining_ration} 个Bot`);
const progressColor = computed(() => {
  if (auth.user.remaining_ration === 0) {
    return 'red';
  } else if (auth.user.remaining_ration === 1) {
    return 'yellow';
  } else {
    return 'green';
  }
});

// 手动触发更新auth数据
const updateAuthData = async () => {
  await auth.fetchUser();
};

// 在组件挂载时更新用户数据
onMounted(() => {
  updateAuthData();
});

</script>
<template>
  <div class="z-[40] mb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
    <UDashboardCard icon="i-heroicons-currency-yen">
      <template v-slot:title>
        <div class="text-lg font-bold">
          余额 ¥ {{ auth.user.balance }}
        </div>
      </template>
      <template v-slot:description>
        <div class="text-base font-medium" v-if="auth.user.vip_expiry_date">
          会员有效期至 {{ auth.user.vip_expiry_date }}
        </div>
        <div class="text-base font-medium" v-else>
          你还不是会员呢
        </div>
      </template>
      <UProgress :color="green" :value="auth.user.vip_level" :max="4" />
    </UDashboardCard>
    <UDashboardCard icon="i-heroicons-cube-transparent">
      <template v-slot:title>
        <div class="text-lg font-bold">
          配额 {{ auth.user.ration }} / {{ auth.user.vip_ration }}
        </div>
      </template>
      <template v-slot:description>
        <div class="text-base font-medium">
          你还可以创建 {{ auth.user.remaining_ration }} 个Bot
        </div>
      </template>
      <UProgress :color="progressColor" :value="auth.user.ration" :max="auth.user.vip_ration" />
    </UDashboardCard>
  </div>
</template>
