<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useAuthStore } from '@/stores/auth'; // 根据您的实际路径调整
import dayjs from 'dayjs'; // 确保已经安装 dayjs

const auth = useAuthStore();
const userLogs = ref([]);

// 获取用户日志的方法
const fetchUserLogs = async (userId: string) => {
  const { refresh: fetchData, status: fetchDataStatus } = useFetch<any>(`/user-logs/${userId}`, {
    method: 'GET',
    immediate: false,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200 && response._data) {
        userLogs.value = response._data;
      } else {
        console.error('获取用户日志时出现问题', response?._data?.message || '未知错误');
      }
    },
    onError(error) {
      console.error('获取用户日志时出现错误', error);
    }
  });

  await fetchData();
  // console.log(userLogs.value); // 确认数据已加载
};

onMounted(() => {
  const userId = auth.user.id.toString();
  fetchUserLogs(userId);
});

const columns = computed(() => [
  { key: 'id', label: 'ID' },
  // { key: 'user_id', label: 'User ID' },
  { key: 'balance', label: '金额' },
  { key: 'balance_before', label: '变更前' },
  { key: 'balance_after', label: '变更后' },
  { key: 'change_type', label: '属性' },
  { key: 'description', label: '描述' },
  //{ key: 'created_at', label: 'Created At', format: val => dayjs(val).format('YYYY-MM-DD HH:mm') },
  { key: 'updated_at', label: '时间', format: val => dayjs(val).format('YYYY-MM-DD HH:mm') }
]);

useSeoMeta({
  title: 'User Logs',
});
</script>

<template>
  <UCard :ui="{ body: { padding: 'p-0' } }">
    <UTable :rows="userLogs" :columns="columns" size="lg">
      <template #header="{ column }">
        <th>{{ column.label }}</th>
      </template>
      <template #cell="{ row, column }">
        <td v-if="column.format">{{ column.format(row[column.key]) }}</td>
        <td v-else>{{ row[column.key] }}</td>
      </template>
    </UTable>
  </UCard>
</template>
