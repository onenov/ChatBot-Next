<template>
  <HomeTetris />
  <UPageHero class="z-[40] mb-4" title="一站式 AI 智能体搭建平台" description="打造 7*24h 在线智能客服" align="left">
    <div class="mb-4" v-if="auth.logged">
      <p class="text-2xl font-bold mb-2 mt-10">会员兑换</p>

      <p class="text-lg mb-2 mr-10 flex">你可以使用我们的测试卡密 <UBadge class="ml-2" size="xs" color="orange">
          testcard
        </UBadge>
      </p>
      <a-input-search v-model:value="cardCode" :style="{ width: '100%' }" size="large" placeholder="填写兑换卡密"
        button-text="兑换" search-button @search="handleRedeemCard" allow-clear />
    </div>
  </UPageHero>

  <div v-if="vips.length > 0" class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 p-2">
    <UPricingCard v-for="(vip, index) in vips" :key="index" :title="vip.title" :description="vip.subtitle"
      :price="vip.price" :discount="vip.discount_price" :cycle="`/${vip.valid_days}天`"
      :highlight="vip.testimonials === 1" :badge="{ label: `可创建${vip.ration}个Bot` }"
      :button="{ label: 'Buy now', onClick: handleBuyNow }" orientation="vertical" align="bottom"
      :features="[vip.description1, vip.description2, vip.description3, vip.description4]" />
  </div>
  <UDivider label="OR" />
  <div v-if="highestVip" class="p-2">
    <UPricingCard :title="highestVip.title" :description="highestVip.subtitle" :price="highestVip.price"
      :discount="highestVip.discount_price" :cycle="`/${highestVip.valid_days}天`"
      :highlight="highestVip.testimonials === 1" :badge="{ label: `可创建${highestVip.ration}个Bot` }"
      :button="{ label: 'Buy now', onClick: handleBuyNow }" orientation="horizontal" align="bottom"
      :features="[highestVip.description1, highestVip.description2, highestVip.description3, highestVip.description4]" />
  </div>



  <UPageHero class="z-[40] mb-4" title="常见问题" description="如果你有更多未解决的问题，请联系客服。" align="center" :links="[{ label: '个人中心', size: 'lg', to: '/account/general' }, {
    label: '联系客服', color: 'gray'
    , size: 'lg', trailingIcon: 'i-heroicons-arrow-right-20-solid', click: handleContactUs
  }]">
  </UPageHero>

  <div class="p-2 mt-4">
    <ULandingFAQ :items="items" multiple />
  </div>
  <Modal v-model:visible="modalVisible" :title="isContact ? '联系客服' : '扫码支付'" okText="确认" @ok="modalVisible = false"
    :footer="false" width="auto">
    <div class="max-w-xs">
      <img :src="modalImageSrc" alt="展示图片" style="width: 100%;" />
    </div>
    <a-alert banner center v-if="isContact" type="info" show-icon>
      请扫码添加客服
    </a-alert>
    <a-alert banner center v-else type="info" show-icon>
      请在支付成功后联系客服
    </a-alert>
  </Modal>
</template>
<script setup lang="ts">
import { Modal } from '@arco-design/web-vue';
import { useAuthStore } from '@/stores/auth';

import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';

const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);

const auth = useAuthStore();

useSeoMeta({
  title: '会员',
})

const items = [{
  label: 'ChatBotNext 怎么收费？',
  content: '平台根据 资源容量、功能权益、服务支持 的不同，划分不同的版本套餐，为不同需求的客户提供可选择的版本订阅服务。'
}, {
  label: '配额是什么？',
  content: '配额是可以启动机器人的数量。'
}, {
  label: '余额用来做什么？',
  content: '余额用来抵扣工作台创建应用的消耗。'
}, {
  label: '我应该怎么付费？',
  content: '我们暂不提供在线支付购买套餐，你可以获取有效卡密兑换会员。'
}]

const vips = ref([]);
const highestVip = ref(null);
const cardCode = ref('');
const toast = useToast();

const fetchVips = async () => {
  const { refresh: fetchData } = useFetch('/vips', {
    method: 'GET',
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        const data = response._data;
        data.sort((a, b) => a.level - b.level); // 按等级升序排序
        highestVip.value = data.pop(); // 提取最高等级的会员信息
        vips.value = data; // 剩下的会员信息
      } else {
        toast.add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: response?._data?.message || '获取套餐时出现问题',
          color: 'red',
        });
      }
    },
    onError(error) {
      toast.add({
        icon: 'i-heroicons-x-circle-20-solid',
        title: '获取套餐时出现错误',
        color: 'red',
      });
    },
  });

  await fetchData();
};
const handleRedeemCard = async (value: string, ev: MouseEvent) => {
  if (!value.trim()) {
    toast.add({
      icon: 'i-heroicons-x-circle-20-solid',
      title: '请输入有效的卡密',
      color: 'red',
    });
    return;
  }

  const { refresh: redeemCard } = useFetch('/redeem-card', {
    method: 'POST',
    body: { userid: auth.user.id, card_code: value },
    immediate: false,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        toast.add({
          icon: 'i-heroicons-check-circle-20-solid',
          title: response._data.message,
          color: 'emerald',
        });
        fetchVips();
      } else {
        toast.add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: response?._data?.message || '兑换卡密时出现问题',
          color: 'red',
        });
      }
    },
    onError(error) {
      toast.add({
        icon: 'i-heroicons-x-circle-20-solid',
        title: '兑换卡密时出现错误',
        color: 'red',
      });
    },
  });
  await redeemCard();
};
const modalVisible = ref(false);
const modalImageSrc = ref('');
const isContact = ref(false);
const handleContactUs = () => {
  const customerUrl = settings.value.Customer;
  const isImage = /\.(png|jpe?g|webp)$/i.test(customerUrl);
  if (isImage) {
    isContact.value = true;
    modalImageSrc.value = customerUrl;
    modalVisible.value = true;
  } else {
    window.open(customerUrl, '_blank');
  }
};

const handleBuyNow = () => {
  const purchaseUrl = settings.value.Purchase;
  const isImage = /\.(png|jpe?g|webp)$/i.test(purchaseUrl);
  if (isImage) {
    isContact.value = false;
    modalImageSrc.value = purchaseUrl;
    modalVisible.value = true;
  } else {
    window.open(purchaseUrl, '_blank');
  }
};
onMounted(() => {
  fetchVips();
});
</script>
