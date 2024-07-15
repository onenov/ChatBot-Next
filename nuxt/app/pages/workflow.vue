<template>
  <div v-if="showContent">
    <HomeTetris />
    <a-tabs size="large" animation>
      <template #extra>
        <UButton class="mr-2" icon="i-heroicons-currency-yen" size="xs" disabled>{{ totalCostForCreatedByMe }}</UButton>

        <UButton class="mr-2" icon="i-heroicons-arrow-path" size="xs" color="primary" square variant="solid"
          @click="refresh" />
        <UButton size="xs" @click="createModalVisible = true">新建</UButton>
      </template>
      <a-tab-pane key="1" size="large">
        <template #title>
          <icon-code-square />应用广场
        </template>
        <div v-if="currentPageData && currentPageData.length > 0">
          <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2">
            <ULandingCard v-for="item in currentPageData" :key="item.id" :title="item.title"
              :description="item.subtitle" @click="handleCardClick(item)" color="primary" orientation="vertical">
              <template v-slot:icon>
                <img :src="item.imageurl" alt="CustomIcon" class="w-8 h-8" />
              </template>
            </ULandingCard>
          </div>
          <div class="p-2" v-if="pagination.total > 20">
            <UPagination :current="pagination.current" :page-count="pagination.totalPages" :total="pagination.total"
              @change="handlePageChange" />
          </div>
        </div>
        <ULandingSection icon="i-heroicons-rocket-launch" title="暂无数据" description="看起来什么都还没有呢～" v-else />
      </a-tab-pane>
      <a-tab-pane key="2">
        <template #title>
          <icon-apps />我创建的
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2"
          v-if="paginatedCreatedByMeData && paginatedCreatedByMeData.length > 0">
          <ULandingCard v-for="item in paginatedCreatedByMeData" :key="item.id" :title="item.name" color="primary"
            orientation="vertical" @click="loadIframe(item)">
            <template v-slot:icon>
              <span class="text-2xl">{{ item.icon }}</span>
            </template>
            <template v-slot:description>
              <span class="text-sm text-wrap line-clamp-2">{{ item.description ? item.description : '暂无描述' }}</span>
            </template>
            <UDropdown :items="myappitems(item)" :ui="customUIConfig" :popper="{ arrow: true }" @click.stop
              class="absolute top-4 right-4 z-40">
              <UButton icon="i-heroicons-pencil-square" size="2xs" color="primary" variant="outline" />
            </UDropdown>
            <UBadge class="absolute right-12 top-4" variant="subtle"
              :color="item.mode === 'advanced-chat' || item.mode === 'workflow' ? 'cyan' : 'emerald'">
              <span class="ml-1" v-if="item.mode === 'workflow'">工作流</span>
              <span class="ml-1" v-else-if="item.mode === 'agent-chat'">AGENT</span>
              <span class="ml-1" v-else-if="item.mode === 'completion'">文本生成</span>
              <span class="ml-1" v-else-if="item.mode === 'chat'">聊天助手</span>
              <span class="ml-1" v-else-if="item.mode === 'advanced-chat'">聊天助手</span>
            </UBadge>
            <div class="mb-4"></div>
            <div class="flex absolute bottom-4 space-x-2">
              <UTooltip text="应用消耗额度" :popper="{ placement: 'top', arrow: true }">
                <UBadge color="white" variant="solid">¥{{ item.totalCost.toFixed(2) }}</UBadge>
              </UTooltip>
              <UTooltip text="全部消息" :popper="{ placement: 'top', arrow: true }">
                <UBadge color="white" variant="solid">{{ item.totalConversationCount }}</UBadge>
              </UTooltip>
              <UTooltip text="活跃用户" :popper="{ placement: 'top', arrow: true }">
                <UBadge color="white" variant="solid">{{ item.totalTerminalCount }}</UBadge>
              </UTooltip>
            </div>
            <div class="flex absolute bottom-4 space-x-2 right-4" @click.stop>
              <UButton size="2xs" color="white" variant="solid" icon="i-heroicons-eye" @click="previewApp(item.id)">
              </UButton>
            </div>
            <div v-if="createdByMePagination.total > 20">
              <UPagination :current="createdByMePagination.current" :page-count="createdByMePagination.totalPages"
                :total="createdByMePagination.total" @change="handleCreatedByMePageChange" />
            </div>
          </ULandingCard>
        </div>
        <ULandingSection icon="i-heroicons-rocket-launch" title="暂无数据" description="看起来什么都还没有呢～" v-else />
      </a-tab-pane>
      <a-tab-pane key="3">
        <template #title>
          <icon-tags />应用模板
        </template>

        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2"
          v-if="paginatedOpenTemplateData && paginatedOpenTemplateData.length > 0">
          <ULandingCard v-for="item in paginatedOpenTemplateData" :key="item.id" :title="item.name" color="primary"
            orientation="vertical" @click="loadIframe(item)">
            <template v-slot:icon>
              <span class="text-2xl">{{ item.icon }}</span>
            </template>
            <template v-slot:description>
              <span class="text-sm text-wrap line-clamp-2">{{ item.description }}</span>
            </template>

            <UButton :ui="{ rounded: 'rounded-full' }" icon="i-heroicons-clipboard-document-list" @click.stop
              class="absolute top-2 right-2 z-40" size="2xs" color="white" variant="solid"
              @click="prepareCopyItem(item)" />

          </ULandingCard>
          <div v-if="openTemplatePagination.total > 20">
            <UPagination :current="openTemplatePagination.current" :page-count="openTemplatePagination.totalPages"
              :total="openTemplatePagination.total" @change="handleOpenTemplatePageChange" />
          </div>
        </div>
        <ULandingSection icon="i-heroicons-rocket-launch" title="暂无数据" description="看起来什么都还没有呢～" v-else />
      </a-tab-pane>
      <a-tab-pane key="4">
        <template #title>
          <icon-bookmark />知识库
        </template>
        <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2"
          v-if="paginatedKnowledgeBaseData && paginatedKnowledgeBaseData.length > 0">
          <ULandingCard v-for="item in paginatedKnowledgeBaseData" :key="item.id" :title="item.name"
            :description="item.description" color="primary" orientation="vertical" @click="loadIframe(item)">
            <template v-slot:icon>
              <span class="text-3xl">
                <UIcon name="i-heroicons-rectangle-stack" />
              </span>
            </template>
            <template v-slot:description>
              <span class="text-sm text-wrap line-clamp-2">{{ item.description }}</span>
            </template>
            <UDropdown :items="knowledgeitems(item)" :ui="customUIConfig" :popper="{ arrow: true }" @click.stop
              class="absolute top-2 right-2 z-40">
              <UButton icon="i-heroicons-pencil-square" size="2xs" color="primary" variant="outline" />
            </UDropdown>
          </ULandingCard>
          <div v-if="knowledgeBasePagination.total > 20">
            <UPagination :current="knowledgeBasePagination.current" :page-count="knowledgeBasePagination.totalPages"
              :total="knowledgeBasePagination.total" @change="handleKnowledgeBasePageChange" />
          </div>
        </div>
        <ULandingSection icon="i-heroicons-rocket-launch" title="暂无数据" description="看起来什么都还没有呢～" v-else />
      </a-tab-pane>
    </a-tabs>
  </div>
  <div v-else class="main overflow-auto h-100">
    <iframe class="iframe-wraps rounded-xl border-green-500 border" scrolling="auto" :src="iframeSrc"
      :style="{ height: iframeHeight }" frameborder="0" :key="iframeKey"
      referrerpolicy="origin-when-cross-origin"></iframe>

    <div class="floating-button mobile_none flex flex-col space-y-2">
      <a-button type="primary" shape="circle" @click="showContent = true">
        <icon-close-circle />
      </a-button>
    </div>
  </div>
  <a-modal v-model:visible="createModalVisible" title="创建应用" ok-text="提交" @ok="submitCreateForm" width="auto">
    <a-form :model="createForm" layout="vertical">
      <a-form-item label="名称">
        <a-input placeholder="填写应用名称" v-model="createForm.name" />
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea placeholder="填写应用描述" v-model="createForm.description" />
      </a-form-item>
      <a-form-item label="类型">
        <a-select v-model="createForm.mode" placeholder="请选择类型">
          <a-option value="chat">基础编排</a-option>
          <a-option value="advanced-chat">工作流编排</a-option>
          <a-option value="completion">文本生成应用</a-option>
          <a-option value="agent-chat">Agent</a-option>
          <a-option value="workflow">工作流</a-option>
          <a-option value="knowledge">知识库</a-option>
        </a-select>
      </a-form-item>
      <a-form-item>
        <a-alert v-if="createForm.mode === 'chat'">使用大型语言模型构建基于聊天的助手（新手）。</a-alert>
        <a-alert v-if="createForm.mode === 'advanced-chat'">使用大型语言模型构建基于聊天的助手（进阶）。</a-alert>
        <a-alert v-if="createForm.mode === 'completion'">构建一个根据提示生成高质量文本的应用程序, 例如生成文章、摘要、翻译等。</a-alert>
        <a-alert v-if="createForm.mode === 'agent-chat'">构建一个智能Agent, 可以自主选择工具来完成任务。</a-alert>
        <a-alert v-if="createForm.mode === 'workflow'">以工作流的形式编排生成型应用, 提供更多的自定义能力。它适合有经验的用户。</a-alert>
        <a-alert v-if="createForm.mode === 'knowledge'">创建一个知识库，可以在应用中导入知识库使用。</a-alert>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="editModalVisible" title="编辑" ok-text="提交" @ok="submitEditForm" width="80%">
    <a-form :model="editForm" layout="vertical">
      <a-form-item label="名称">
        <a-input v-model="editForm.name" />
      </a-form-item>
      <a-form-item label="描述">
        <a-textarea v-model="editForm.description" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="copyModalVisible" title="复制" ok-text="提交" @ok="submitCopyForm" width="auto">
    <a-form :model="copyForm" layout="vertical">
      <a-form-item label="名称">
        <a-input v-model="copyForm.name" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="showModal" title="删除项目" @cancel="showModal = false" @ok="confirmDelete" width="50%">
    <p>你确定要删除这个项目吗？</p>
  </a-modal>
  <a-modal v-model:visible="showKnowledgeModal" title="删除项目" @cancel="showKnowledgeModal = false" width="50%"
    @ok="confirmDeleteKnowledge">
    <p>你确定要删除这个知识库吗？</p>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';

useSeoMeta({
  title: '工作台',
})


const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const modal = useModal();
const auth = useAuthStore();

const data = ref([]);
const createdByMeData = ref([]);
const openTemplateData = ref([]);
const knowledgeBaseData = ref([]);

const pagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
});
const createdByMePagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
});
const openTemplatePagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
});
const knowledgeBasePagination = ref({
  current: 1,
  pageSize: 20,
  total: 0,
  totalPages: 0,
});

const { refresh: fetchData, status: fetchDataStatus } = useFetch<any>('get_app', {
  method: 'POST',
  body: { page: 1, pageSize: 40 },
  immediate: false,
  watch: false,
  onResponse({ response }) {
    if (response?.status === 200 && response._data) {
      // console.log('ResponseData:', response._data);
      useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: '应用数据已成功获取。', color: 'emerald' });
      data.value = response._data.data;
      pagination.value.total = response._data.total;
      pagination.value.totalPages = Math.ceil(response._data.total / pagination.value.pageSize);
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取应用数据失败。', color: 'red' });
    }
  },
  onError() {
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败,请稍后再试。', color: 'red' });
  },
});

const currentPageData = computed(() => {
  const start = (pagination.value.current - 1) * pagination.value.pageSize;
  const end = start + pagination.value.pageSize;
  return data.value.slice(start, end);
});

// 在 paginatedCreatedByMeData 计算属性中增加计算总消耗额度的逻辑
const paginatedCreatedByMeData = computed(() => {
  const start = (createdByMePagination.value.current - 1) * createdByMePagination.value.pageSize;
  const end = start + createdByMePagination.value.pageSize;
  return createdByMeData.value.slice(start, end);
});

// 新增totalCostForCreatedByMe计算属性
const totalCostForCreatedByMe = computed(() => {
  return createdByMeData.value.reduce((acc, item) => acc + item.totalCost, 0).toFixed(2);
});


const paginatedOpenTemplateData = computed(() => {
  const start = (openTemplatePagination.value.current - 1) * openTemplatePagination.value.pageSize;
  const end = start + openTemplatePagination.value.pageSize;
  return openTemplateData.value.slice(start, end);
});

const paginatedKnowledgeBaseData = computed(() => {
  const start = (knowledgeBasePagination.value.current - 1) * knowledgeBasePagination.value.pageSize;
  const end = start + knowledgeBasePagination.value.pageSize;
  return knowledgeBaseData.value.slice(start, end);
});

const handlePageChange = (page) => {
  pagination.value.current = page;
};

const handleCreatedByMePageChange = (page) => {
  createdByMePagination.value.current = page;
};

const handleOpenTemplatePageChange = (page) => {
  openTemplatePagination.value.current = page;
};

const handleKnowledgeBasePageChange = (page) => {
  knowledgeBasePagination.value.current = page;
};

const fetchTags = async (type) => {
  try {
    const response = await axios.get(`${settings.value.Dify_Api}/console/api/tags?type=${type}`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

    if (response.status === 200) {
      return response.data;
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: `获取${type}标签数据失败。`, color: 'red' });
      return [];
    }
  } catch (error) {
    // console.log(`Error fetching ${type} tags:`, error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败,请稍后再试。', color: 'red' });
    return [];
  }
};
const createTag = async (name, type) => {
  try {
    const response = await axios.post(`${settings.value.Dify_Api}/console/api/tags`, {
      name,
      type,
    }, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

    if (response.status === 200 || response.status === 201) {
      // 200和201都表示创建成功
      // console.log(`Tag ${name} created successfully for type ${type}.`);
      useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: `新用户初始化成功`, color: 'emerald' });
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: `创建${type}标签失败。`, color: 'red' });
    }
  } catch (error) {
    // console.log(`Error creating ${type} tag:`, error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败,请稍后再试。', color: 'red' });
  }
};

const ensureTagsExist = async () => {
  const userId = auth.user.id.toString();

  const [appTags, knowledgeTags] = await Promise.all([
    fetchTags('app'),
    fetchTags('knowledge')
  ]);

  const appTagExists = appTags.some(tag => tag.name === userId);
  const knowledgeTagExists = knowledgeTags.some(tag => tag.name === userId);

  if (!appTagExists) {
    await createTag(userId, 'app');
  }

  if (!knowledgeTagExists) {
    await createTag(userId, 'knowledge');
  }
};

const fetchAdditionalData = async () => {
  try {
    const response = await axios.get(`${settings.value.Dify_Api}/console/api/apps?page=1&limit=100`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });
    if (response.status === 200) {
      const allData = response.data.data;
      createdByMeData.value = await Promise.all(
        allData
          .filter(item => item.tags.some(tag => tag.name === auth.user.id.toString()))
          .map(async (item) => {
            const tokenCosts = await fetchTokenCosts(item.id);
            const totalCost = tokenCosts.reduce((acc, cost) => acc + parseFloat(cost.total_price), 0);

            const terminalCounts = await fetchTerminalCounts(item.id);
            const totalTerminalCount = terminalCounts.reduce((acc, count) => acc + count.terminal_count, 0);

            const conversationCounts = await fetchConversationCounts(item.id);
            const totalConversationCount = conversationCounts.reduce((acc, count) => acc + count.conversation_count, 0);

            return { ...item, totalCost, totalTerminalCount, totalConversationCount };
          })
      );

      openTemplateData.value = allData.filter(item => item.tags.some(tag => tag.name === 'OPEN'));

      createdByMePagination.value.total = createdByMeData.value.length;
      createdByMePagination.value.totalPages = Math.ceil(createdByMeData.value.length / createdByMePagination.value.pageSize);

      openTemplatePagination.value.total = openTemplateData.value.length;
      openTemplatePagination.value.totalPages = Math.ceil(openTemplateData.value.length / openTemplatePagination.value.pageSize);
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取应用数据失败。', color: 'red' });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败, 请稍后再试。', color: 'red' });
  }
};
const fetchTokenCosts = async (appId) => {
  try {
    const response = await axios.get(`${settings.value.Dify_Api}/console/api/apps/${appId}/statistics/token-costs`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

    if (response.status === 200) {
      return response.data.data;
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取Token成本数据失败。', color: 'red' });
      return [];
    }
  } catch (error) {
    console.error('Error fetching token costs:', error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败,请稍后再试。', color: 'red' });
    return [];
  }
};
const fetchConversationCounts = async (appId) => {
  try {
    const response = await axios.get(`${settings.value.Dify_Api}/console/api/apps/${appId}/statistics/daily-conversations`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });
    if (response.status === 200) {
      return response.data.data;
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取对话数据失败。', color: 'red' });
      return [];
    }
  } catch (error) {
    console.error('Error fetching conversation counts:', error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败, 请稍后再试。', color: 'red' });
    return [];
  }
};
const fetchTerminalCounts = async (appId) => {
  try {
    const response = await axios.get(`${settings.value.Dify_Api}/console/api/apps/${appId}/statistics/daily-end-users`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });
    if (response.status === 200) {
      return response.data.data;
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取终端用户数据失败。', color: 'red' });
      return [];
    }
  } catch (error) {
    console.error('Error fetching terminal counts:', error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败, 请稍后再试。', color: 'red' });
    return [];
  }
};

const fetchKnowledgeBaseData = async () => {
  try {
    const response = await axios.get(`${settings.value.Dify_Api}/console/api/datasets?page=1&limit=100`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

    if (response.status === 200) {
      const allData = response.data.data;
      knowledgeBaseData.value = allData.filter(item => item.tags.some(tag => tag.name === auth.user.id.toString()));

      knowledgeBasePagination.value.total = knowledgeBaseData.value.length;
      knowledgeBasePagination.value.totalPages = Math.ceil(knowledgeBaseData.value.length / knowledgeBasePagination.value.pageSize);
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取知识库数据失败。', color: 'red' });
    }
  } catch (error) {
    // console.log('Error fetching knowledge base data:', error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败,请稍后再试。', color: 'red' });
  }
};

import { useRouter } from 'vue-router';
const router = useRouter();

onMounted(async () => {
  if (!auth.logged) {
    router.push('/auth/login');
    return;
  }
  fetchData();
  ensureTagsExist();
  fetchAdditionalData();
  fetchKnowledgeBaseData();
  updateAuthData();
});
const updateAuthData = async () => {
  await auth.fetchUser();
};
const refresh = () => {
  fetchAdditionalData();
  fetchKnowledgeBaseData();
  updateWorkflowBalance();
  updateAuthData();
};
const myappitems = (item) => [
  [{
    label: '编辑',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      editItem(item);
    }
  }, {
    label: '复制',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => {
      prepareCopyItem(item);
    }
  }],
  [{
    label: '删除',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      showDeleteConfirm(item);
    }
  }]
];
const knowledgeitems = (item) => [
  [{
    label: '编辑',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      editKnowledge(item);
    }
  }, {
    label: '删除',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      showDeleteKnowledgeConfirm(item);
    }
  }]
];
const customUIConfig = {
  width: 'w-20'
};

const editModalVisible = ref(false);

const editForm = ref({ name: '', description: '', id: '', icon: '', icon_background: '' });

const editItem = (item) => {
  editForm.value = {
    name: item.name,
    description: item.description,
    id: item.id,
    icon: item.icon || '',
    icon_background: item.icon_background || '',
    mode: item.mode || '', // 新增模式字段
  };
  editModalVisible.value = true;
};
const editKnowledge = (item) => {
  editForm.value = {
    name: item.name,
    description: item.description || '',
    id: item.id,
    mode: 'knowledge', // 明确设置为知识库模式
  };
  editModalVisible.value = true;
};
const submitEditForm = async () => {
  try {
    if (editForm.value.mode === 'knowledge') {
      // 知识库的编辑请求
      await axios.patch(`${settings.value.Dify_Api}/console/api/datasets/${editForm.value.id}`, {
        name: editForm.value.name,
        description: editForm.value.description,
      }, {
        headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
      });
    } else {
      // 应用的编辑请求
      await axios.put(`${settings.value.Dify_Api}/console/api/apps/${editForm.value.id}`, {
        name: editForm.value.name,
        icon: editForm.value.icon,
        icon_background: editForm.value.icon_background,
        description: editForm.value.description,
      }, {
        headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
      });
    }
    editModalVisible.value = false;
    useToast().add({
      icon: 'i-heroicons-check-circle-20-solid',
      title: '编辑成功。',
      color: 'emerald',
    });
    // 可选：刷新数据
    refresh();
  } catch (error) {
    console.error("Error during request:", error);
    useToast().add({
      icon: 'i-heroicons-x-circle-20-solid',
      title: '编辑失败，请稍后再试。',
      color: 'red',
    });
  }
};

const showModal = ref(false);
const showKnowledgeModal = ref(false);

const itemToDelete = ref<any>(null);
const knowledgeToDelete = ref<any>(null);

function showDeleteConfirm(item: any) {
  itemToDelete.value = item;
  showModal.value = true;
}
function confirmDelete() {
  if (itemToDelete.value) {
    deleteItem(itemToDelete.value);
    showModal.value = false;
  }
}

function showDeleteKnowledgeConfirm(item: any) {
  knowledgeToDelete.value = item;
  showKnowledgeModal.value = true;
}
function confirmDeleteKnowledge() {
  if (knowledgeToDelete.value) {
    deleteKnowledge(knowledgeToDelete.value);
    showKnowledgeModal.value = false;
  }
}

const deleteItem = async (item) => {
  try {
    await axios.delete(`${settings.value.Dify_Api}/console/api/apps/${item.id}`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

  } catch (error) {
    console.error('Error deleting item:', error);
  }
  useToast().add({
    icon: 'i-heroicons-check-circle-20-solid',
    title: '应用已删除',
    color: 'emerald',
  });
  refresh();
};
const deleteKnowledge = async (item) => {
  try {
    await axios.delete(`${settings.value.Dify_Api}/console/api/datasets/${item.id}`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

  } catch (error) {
    console.error('Error deleting knowledge item:', error);
  }
  useToast().add({
    icon: 'i-heroicons-check-circle-20-solid',
    title: '知识库已删除',
    color: 'emerald',
  });
  refresh();
};

const createModalVisible = ref(false);
const createForm = ref({ name: '', description: '', mode: 'chat', icon: '🤖', icon_background: '#FFEAD5' });

const submitCreateForm = async () => {
  // 检查必要的表单字段
  if (!createForm.value.name || !createForm.value.mode) {
    useToast().add({
      icon: 'i-heroicons-exclamation-circle-20-solid',
      title: '请填写完整所有必填项',
      color: 'red',
    });
    return;
  }

  try {
    let createResponse;
    if (createForm.value.mode === 'knowledge') {
      createResponse = await axios.post(`${settings.value.Dify_Api}/console/api/datasets`, {
        name: createForm.value.name,
        description: createForm.value.description,
      }, {
        headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
      });
    } else {
      createResponse = await axios.post(`${settings.value.Dify_Api}/console/api/apps`, {
        name: createForm.value.name,
        icon: createForm.value.icon,
        icon_background: createForm.value.icon_background,
        mode: createForm.value.mode,
        description: createForm.value.description,
      }, {
        headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
      });
    }

    const appId = createResponse.data.id;
    const tagType = createForm.value.mode === 'knowledge' ? 'knowledge' : 'app';

    const tagResponse = await axios.get(`${settings.value.Dify_Api}/console/api/tags`, {
      params: { type: tagType },
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

    const userTag = tagResponse.data.find(tag => tag.name === String(auth.user.id));
    if (userTag) {
      const tagId = userTag.id;
      await axios.post(`${settings.value.Dify_Api}/console/api/tag-bindings/create`, {
        tag_ids: [tagId],
        target_id: appId,
        type: tagType,
      }, {
        headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
      });
    } else {
      console.error('未找到用户标签:', auth.user.id);
    }

    createModalVisible.value = false;
    useToast().add({
      icon: 'i-heroicons-check-circle-20-solid',
      title: '应用创建完成',
      color: 'emerald',
    });
    refresh();
  } catch (error) {
    console.error("创建应用时发生错误:", error);
    useToast().add({
      icon: 'i-heroicons-x-circle-20-solid',
      title: '创建应用失败，请稍后再试。',
      color: 'red',
    });
  }
};

const copyModalVisible = ref(false);
const copyForm = ref({ name: '', id: '', icon: '', icon_background: '', mode: '' });


const prepareCopyItem = (item) => {
  copyForm.value = {
    name: item.name + '(copy)',
    id: item.id,
    icon: item.icon,
    icon_background: item.icon_background,
    mode: item.mode,
  };
  copyModalVisible.value = true;
};

const submitCopyForm = async () => {
  try {
    // Step 1: 复制应用或知识库
    let copyResponse;
    if (copyForm.value.mode === 'knowledge') {
      copyResponse = await axios.post(`${settings.value.Dify_Api}/console/api/datasets/${copyForm.value.id}/copy`, {
        name: copyForm.value.name,
        description: copyForm.value.description,
      }, {
        headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
      });
    } else {
      copyResponse = await axios.post(`${settings.value.Dify_Api}/console/api/apps/${copyForm.value.id}/copy`, {
        name: copyForm.value.name,
        icon: copyForm.value.icon,
        icon_background: copyForm.value.icon_background,
        mode: copyForm.value.mode,
        description: copyForm.value.description,
      }, {
        headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
      });
    }

    // 获取复制的应用或知识库ID
    const appId = copyResponse.data.id;

    // Step 2: 获取所有Tag信息
    const tagType = copyForm.value.mode === 'knowledge' ? 'knowledge' : 'app';
    const tagResponse = await axios.get(`${settings.value.Dify_Api}/console/api/tags?type=${tagType}`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

    // 查找名称为auth.user.id的TagID
    const userTag = tagResponse.data.find(tag => tag.name === String(auth.user.id));

    if (userTag) {
      const tagId = userTag.id;

      // Step 3: 绑定Tag和应用或知识库
      await axios.post(
        `${settings.value.Dify_Api}/console/api/tag-bindings/create`,
        {
          tag_ids: [tagId],
          target_id: appId,
          type: tagType,
        },
        {
          headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
        }
      );
    } else {
      console.error('未找到用户标签:', auth.user.id);
    }

    copyModalVisible.value = false;
    useToast().add({
      icon: 'i-heroicons-check-circle-20-solid',
      title: '复制成功',
      color: 'emerald',
    });
    refresh();
  } catch (error) {
    console.error('复制项目并绑定标签时发生错误:', error);
    useToast().add({
      icon: 'i-heroicons-x-circle-20-solid',
      title: '复制失败，请稍后再试。',
      color: 'red',
    });
  }
};
const previewApp = async (appId) => {
  try {
    const response = await axios.get(`${settings.value.Dify_Api}/console/api/apps/${appId}`, {
      headers: { Authorization: `Bearer ${settings.value.Dify_Token}` },
    });

    if (response.status === 200) {
      const data = response.data;
      let previewUrl;

      if (data.mode === 'agent-chat') {
        previewUrl = `${settings.value.Dify_Api}/chat/${data.site.code}`;
      } else {
        previewUrl = `${settings.value.Dify_Api}/${data.mode}/${data.site.code}`;
      }

      window.open(previewUrl, '_blank');
    } else {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取应用预览地址失败。', color: 'red' });
    }
  } catch (error) {
    console.error('Error fetching app preview data:', error);
    useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败，请稍后再试。', color: 'red' });
  }
};
watch(
  () => totalCostForCreatedByMe.value,
  async (newValue, oldValue) => {
    // 确保新的值不为 0
    if (parseFloat(newValue) !== 0) {
      await updateWorkflowBalance();
    }
  }
);
const updateWorkflowBalance = async () => {
  if (parseFloat(totalCostForCreatedByMe.value) === 0) {
    return;
  }

  if (auth.user.balance < totalCostForCreatedByMe.value) {
    // 余额不足，跳转到 /price 页面
    router.push('/price');
    useToast().add({
      icon: 'i-heroicons-x-circle-20-solid',
      title: '余额不足，请充值。',
      color: 'red',
    });
    return;
  }

  const { execute: postRequest } = useFetch<any>('/update-workflow-balance', {
    method: 'POST',
    body: {
      userId: auth.user.id,
      totalCostForCreatedByMe: parseFloat(totalCostForCreatedByMe.value),
    },
    immediate: false,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {

      } else {
        useToast().add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: '余额更新失败，请稍后再试。',
          color: 'red',
        });
      }
    },
    onError() {
      useToast().add({
        icon: 'i-heroicons-x-circle-20-solid',
        title: '请求失败，请稍后再试。',
        color: 'red',
      });
    },
  });

  await postRequest();
};
const showContent = ref(true);
const showResult = ref(false);
const closeResult = () => {
  showContent.value = true;
  showResult.value = false;
}
const iframeSrc = ref('');
const iframeKey = ref(0);
const loadIframe = (item) => {
  showContent.value = false;
  showResult.value = false; //无论如何都重置为false

  const id = item.id;
  if (item.permission === 'only_me') {
    iframeSrc.value = `${settings.value.Dify_Api}/datasets/${id}/documents?workflow`;
  } else if (item.mode === 'advanced-chat' || item.mode === 'workflow?workflow') {
    iframeSrc.value = `${settings.value.Dify_Api}/app/${id}/workflow?workflow`;
  } else {
    iframeSrc.value = `${settings.value.Dify_Api}/app/${id}/configuration?workflow`;
  }
  iframeKey.value += 1; // Force iframe to reload if the src is the same
  showContent.value = false;
};

const iframeHeight = ref('calc(100vh - 80px)')
const handleResize = () => {
  const width = window.innerWidth
  if (width < 720) {

    iframeHeight.value = 'calc(100vh - 148px'
  } else {
    iframeHeight.value = 'calc(100vh - 175px)'

  }
}
const handleCardClick = (item) => {
  showContent.value = false;
  showResult.value = false; //无论如何都重置为false

  iframeSrc.value = item.appurl; //改变iframe的src
  iframeKey.value += 1; //每次点击卡片都增加iframe的key

  showContent.value = false;
}
onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize();
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

watchEffect(handleResize)

const botVisible = ref(false);
const showBot = () => {
  botVisible.value = true;
};
</script>
<style>
.floating-button {
  position: fixed;
  bottom: 50%;
  right: 10px;
  z-index: 1001;
}

.floating-button-robot {
  position: fixed;
  bottom: 55%;
  right: 10px;
  z-index: 1001;
}

.arco-result {
  padding: 12px;
}

.iframe-wraps {
  width: 100%;
}
</style>
