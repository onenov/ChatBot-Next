<template>
  <HomeTetris />
  <a-tabs size="large">
    <template #extra>
      <UButton class="mr-2" icon="i-heroicons-squares-2x2" size="xs" disabled>{{ auth.user.ration }}/{{
        auth.user.vip_ration }}
      </UButton>
      <UButton class="mr-2" size="xs" type="primary" @click="showModal = true">新增应用</UButton>
    </template>
    <a-tab-pane key="1">
      <template #title>
        <icon-robot /> 客户端
      </template>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-2" v-if="chatBots && chatBots.length > 0">
        <ULandingCard v-for="(bot, index) in chatBots" :key="index" :title="bot.appname" :description="bot.describe"
          @click="showDetail(bot)" color="primary" orientation="vertical">
          <template v-slot:icon>
            <img :src="bot.channel_type === 'wx' ? 'https://io.onenov.cn/file/202405240059097.svg' :
              (bot.channel_type === 'feishu' ? 'https://io.onenov.cn/file/202405240055519.svg' :
                (bot.channel_type === 'wechatcom_app' ? 'https://io.onenov.cn/file/202405240057860.svg' :
                  ((bot.channel_type === 'wechatmp_service' || bot.channel_type === 'wechatmp') ? 'https://io.onenov.cn/file/202405240142150.svg' :
                    'https://io.onenov.cn/file/202405211802572.svg')))" alt="CustomIcon" class="w-8 h-8" />
          </template>

          <UBadge class="absolute right-6 top-4" variant="subtle" :color="bot.process_id ? 'green' : 'red'">
            <span v-if="bot.dify_app_type === 'chatbot'" class="ml-1">聊天助手</span>
            <span v-else-if="bot.dify_app_type === 'agent'" class="ml-1">Agent</span>
            <span v-else-if="bot.dify_app_type === 'workflow'" class="ml-1">工作流</span>
          </UBadge>

          <div class="flex justify-between" @click.stop>
            <div class="flex space-x-2">
              <UButton size="2xs" variant="solid" @click="copyAuthToken(bot.login_token)" v-if="bot.process_id">Token
              </UButton>

              <UButton size="2xs" variant="solid" @click="showEditConfig(bot)" v-if="bot.process_id">配置
              </UButton>

              <UButton size="2xs" variant="solid" @click="viewChatbotLogs(bot.appname)" v-if="bot.process_id">日志
              </UButton>

              <UButton size="2xs" icon="i-heroicons-play-circle" variant="solid" v-if="!bot.process_id"
                @click="startChatbot(bot.appname)"> 启动
              </UButton>
            </div>


            <UButton size="2xs" icon="i-heroicons-trash" color="red" variant="solid" v-if="!bot.process_id"
              @click="deleteChatbot(bot.appname)">
            </UButton>
            <UButton size="2xs" icon="i-heroicons-power" color="red" square variant="solid"
              @click="stopChatbot(bot.appname)" v-else>
            </UButton>
          </div>
        </ULandingCard>
      </div>

      <ULandingSection icon="i-heroicons-rocket-launch" title="暂无数据" description="看起来什么都还没有呢～" v-else />


    </a-tab-pane>
    <a-tab-pane key="2">
      <template #title>
        <icon-list /> 简介
      </template>
      <ULandingSection icon="i-heroicons-rocket-launch" title="暂无数据" description="看起来什么都还没有呢～" />
    </a-tab-pane>
    <a-tab-pane key="3">
      <template #title>
        <icon-question-circle /> 帮助
      </template>
      <ULandingSection icon="i-heroicons-rocket-launch" title="暂无数据" description="看起来什么都还没有呢～" />
    </a-tab-pane>
  </a-tabs>

  <a-modal v-model:visible="showModal" title="新增应用" @ok="handleSubmit" :unmount-on-close="true" width="auto">
    <a-form :model="form" :rules="rules" @submit="handleSubmit">
      <!-- 隐藏的UserID字段 -->
      <a-form-item label="UserID" prop="userid" style="display:none;"><a-input v-model="form.userid" /></a-form-item>
      <a-form-item label="应用名称" prop="appname">
        <a-input v-model="form.appname" placeholder="只支持英文和数字类型" />
        <template #extra>
          <div>确保名称不与现有应用冲突</div>
        </template>
      </a-form-item>
      <a-form-item label="应用描述" prop="describe">
        <a-input v-model="form.describe" placeholder="填入你的应用描述，支持中文" /></a-form-item>
      <a-form-item label="ApiKey" prop="dify_api_key">
        <a-input v-model="form.dify_api_key" placeholder="app-xxx" />
        <template #extra>
          <div>从WorkFlow获取应用ApiKey</div>
        </template>
      </a-form-item>
      <a-form-item label="助手类型" prop="dify_app_type">
        <a-radio-group v-model="form.dify_app_type">
          <a-radio value="chatbot">聊天助手</a-radio>
          <a-radio value="agent">Agent</a-radio>
          <a-radio value="workflow">工作流</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item label="通道" prop="channel_type">
        <a-radio-group v-model="form.channel_type">
          <a-radio value="wx">个人微信号</a-radio>
          <a-radio value="wechatcom_app">企业微信号</a-radio>
          <a-radio value="wechatmp">个人公众号</a-radio>
          <a-radio value="wechatmp_service">企业公众号</a-radio>
          <a-radio value="feishu">飞书机器人</a-radio>
          <!--<a-radio value="dingtalk">钉钉机器人</a-radio>-->
        </a-radio-group>
      </a-form-item>
      <!-- 仅在选择企业微信时显示 -->
      <template v-if="form.channel_type === 'wechatcom_app'">
        <a-form-item label="CorpID" prop="wechatcom_corp_id">
          <a-input v-model="form.wechatcom_corp_id" /></a-form-item>
        <a-form-item label="AgentID" prop="wechatcomapp_agent_id">
          <a-input v-model="form.wechatcomapp_agent_id" /></a-form-item>
        <a-form-item label="Secret" prop="wechatcomapp_secret">
          <a-input v-model="form.wechatcomapp_secret" /></a-form-item>
        <a-form-item label="Token" prop="wechatcomapp_token">
          <a-input v-model="form.wechatcomapp_token" /></a-form-item>
        <a-form-item label="AES Key" prop="wechatcomapp_aes_key">
          <a-input v-model="form.wechatcomapp_aes_key" /></a-form-item>
      </template>
      <!-- 仅在选择个人公众号或企业公众号时显示 -->
      <template v-if="form.channel_type === 'wechatmp' || form.channel_type === 'wechatmp_service'">
        <a-form-item label="AppID" prop="wechatmp_app_id">
          <a-input v-model="form.wechatmp_app_id" /></a-form-item>
        <a-form-item label="AppSecret" prop="wechatmp_app_secret">
          <a-input v-model="form.wechatmp_app_secret" /></a-form-item>
        <a-form-item label="Token" prop="wechatmp_token">
          <a-input v-model="form.wechatmp_token" /></a-form-item>
        <a-form-item label="AES Key" prop="wechatmp_aes_key">
          <a-input v-model="form.wechatmp_aes_key" /></a-form-item>
      </template>
      <!-- 仅在选择飞书机器人时显示 -->
      <template v-if="form.channel_type === 'feishu'">
        <a-form-item label="AppID" prop="feishu_app_id">
          <a-input v-model="form.feishu_app_id" /></a-form-item>
        <a-form-item label="AppSecret" prop="feishu_app_secret">
          <a-input v-model="form.feishu_app_secret" /></a-form-item>
        <a-form-item label="Token" prop="feishu_token">
          <a-input v-model="form.feishu_token" /></a-form-item>
        <a-form-item label="Bot名称" prop="feishu_bot_name">
          <a-input v-model="form.feishu_bot_name" /></a-form-item>
      </template>
      <!-- 仅在选择钉钉机器人时显示 -->
      <template v-if="form.channel_type === 'dingtalk'">
        <a-form-item label="钉钉ClientID" prop="dingtalk_client_id">
          <a-input v-model="form.dingtalk_client_id" /></a-form-item>
        <a-form-item label="钉钉ClientSecret" prop="dingtalk_client_secret">
          <a-input v-model="form.dingtalk_client_secret" />
        </a-form-item>
      </template>
    </a-form>
  </a-modal>
  <a-modal v-model:visible="showLogsModal" title="应用日志" :footer="false" :unmount-on-close="true" width="80%">
    <template v-if="logsContent">
      <div>
        <pre class="chatbot-log">{{ logsContent }}</pre>
      </div>
    </template>
    <template v-else>
      <p>暂无日志</p>
    </template>
  </a-modal>
  <a-modal v-model:visible="showStartModal" title="启动应用" :closable="false" :footer="false" :mask-closable="false"
    :hide-cancel="true" :esc-to-close="false" :unmount-on-close="true" width="80%">
    <template v-if="logsContent">
      <div v-if="qrCodeUrl" class="flex justify-center items-center">
        <div>
          <img class="qr" :src="qrCodeUrl" alt="二维码" />
          <a-alert v-if="logsContent.includes('Please press confirm on your phone.')" class="mt-2"
            center>请在手机上确认登录，然后请耐心等待任务启动</a-alert>

          <a-alert v-else class="mt-2" center>请用手机微信扫描登录</a-alert>
        </div>
      </div>
      <div v-if="LoginToken" class="flex justify-center items-center">
        <div class="flex justify-center items-center">
          <a-alert class="mt-2" center>请向机器人发送指令 <a-tag color="blue" @click="copyToClipboardtoken" bordered>#auth {{
            LoginToken
              }}</a-tag> 绑定管理员账户</a-alert>
        </div>
      </div>
      <pre class="overflow-auto p-4 rounded-md chatbot-logs max-h-56 mt-4">{{ logsContent }}</pre>
    </template>
    <template v-else>
      <a-alert banner center title="应用启动中">
        <template #icon>
          <icon-loading />
        </template>
        启动指令已下发，请等待任务运行。
      </a-alert>
    </template>
  </a-modal>
  <a-modal v-model:visible="showDetailModal" title="详细信息" :footer="false" :fullscreen="false" :unmount-on-close="true"
    width="60%">
    <div v-if="selectedBot" class="flex flex-col md:flex-row h-100 overflow-hidden">
      <!-- 左侧区块 -->
      <div class="w-full md:w-1/2 h-full p-4 overflow-y-auto flex-1">
        <pre class="overflow-auto rounded-md chatbot-logs max-h-96">{{ selectedBot.logsContent || '暂无日志' }}</pre>
      </div>
      <!-- 右侧区块 -->
      <div class="w-full md:w-1/2 h-full p-2">
        <div class="flex flex-col justify-between h-full">
          <div class="mb-2">
            <ULandingCard :title="selectedBot.appname" :description="selectedBot.describe"
              :color="selectedBot.process_id ? 'green' : 'red'">
              <template v-slot:icon>
                <img :src="selectedBot.channel_type === 'wx' ? 'https://io.onenov.cn/file/202405240059097.svg' :
                  (selectedBot.channel_type === 'feishu' ? 'https://io.onenov.cn/file/202405240055519.svg' :
                    (selectedBot.channel_type === 'wechatcom_app' ? 'https://io.onenov.cn/file/202405240057860.svg' :
                      ((selectedBot.channel_type === 'wechatmp_service' || selectedBot.channel_type === 'wechatmp') ? 'https://io.onenov.cn/file/202405240142150.svg' :
                        'https://io.onenov.cn/file/202405211802572.svg')))" alt="CustomIcon" class="w-8 h-8" />
              </template>
              <UBadge class="absolute right-6 top-4" variant="subtle" :color="selectedBot.process_id ? 'green' : 'red'">
                <span v-if="selectedBot.dify_app_type === 'chatbot'" class="ml-1">聊天助手</span>
                <span v-else-if="selectedBot.dify_app_type === 'agent'" class="ml-1">Agent</span>
                <span v-else-if="selectedBot.dify_app_type === 'workflow'" class="ml-1">工作流</span>
              </UBadge>
            </ULandingCard>

            <div class="mt-4 mb-2">
              <UDivider label="基本信息" />
              <div class="index-module_basic">
                <a-row :gutter="20">
                  <a-col :xs="24" :lg="24" class="cursor-pointer">
                    <div class="draw_dialog_card_title">
                      <p>进程任务：</p>
                      <p><a-tag :color="selectedBot.process_id ? 'green' : 'red'" bordered>{{
                        selectedBot.process_id ? selectedBot.process_id : '未启动'
                          }}</a-tag></p>
                    </div>
                    <div class="draw_dialog_card_title">
                      <p>认证口令：</p>
                      <p><a-tag :color="selectedBot.login_token ? 'green' : 'red'" bordered
                          @click="copyAuthToken(selectedBot.login_token)">{{
                            selectedBot.login_token ? selectedBot.login_token : '未启动'
                          }}</a-tag></p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wx'">
                      <p>登录用户：</p>
                      <p><a-tag :color="selectedBot.nickname ? 'green' : 'red'" bordered>{{
                        selectedBot.nickname ? selectedBot.nickname : '未启动' }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatcom_app'">
                      <p>登录用户：</p>
                      <p><a-tag :color="selectedBot.wechatcomapp_agent_id ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatcomapp_agent_id ?
                          selectedBot.wechatcomapp_agent_id :
                          '未启动' }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'feishu'">
                      <p>登录用户：</p>
                      <p><a-tag :color="selectedBot.feishu_bot_name ? 'green' : 'red'" bordered>{{
                        selectedBot.feishu_bot_name ? selectedBot.feishu_bot_name :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatcom_app'">
                      <p>运行端口：</p>
                      <p><a-tag :color="selectedBot.port ? 'blue' : 'red'" bordered>{{
                        selectedBot.port ? selectedBot.port : '未启动' }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'feishu'">
                      <p>运行端口：</p>
                      <p><a-tag :color="selectedBot.port ? 'blue' : 'red'" bordered>{{
                        selectedBot.port ? selectedBot.port : '未启动' }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp'">
                      <p>运行端口：</p>
                      <p><a-tag :color="selectedBot.port ? 'blue' : 'red'" bordered>{{
                        selectedBot.port ? selectedBot.port : '未启动' }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp_service'">
                      <p>运行端口：</p>
                      <p><a-tag :color="selectedBot.port ? 'blue' : 'red'" bordered>{{
                        selectedBot.port ? selectedBot.port : '未启动' }}</a-tag>
                      </p>
                    </div>

                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type !== 'wx'">
                      <p>服务器：</p>
                      <p><a-tag color="blue" bordered>{{ serverIp }}</a-tag>
                      </p>
                    </div>

                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatcom_app'">
                      <p>企业ID：</p>
                      <p><a-tag :color="selectedBot.wechatcom_corp_id ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatcom_corp_id ? selectedBot.wechatcom_corp_id :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatcom_app'">
                      <p>应用Secret</p>
                      <p><a-tag :color="selectedBot.wechatcomapp_secret ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatcomapp_secret ?
                          selectedBot.wechatcomapp_secret :
                          '未启动' }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatcom_app'">
                      <p>应用Token</p>
                      <p><a-tag :color="selectedBot.wechatcomapp_token ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatcomapp_token ? selectedBot.wechatcomapp_token
                          : '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatcom_app'">
                      <p>应用AesKey</p>
                      <p><a-tag :color="selectedBot.wechatcomapp_aes_key ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatcomapp_aes_key ?
                          selectedBot.wechatcomapp_aes_key :
                          '未启动' }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'feishu'">
                      <p>应用Id</p>
                      <p><a-tag :color="selectedBot.feishu_app_id ? 'green' : 'red'" bordered>{{
                        selectedBot.feishu_app_id ? selectedBot.feishu_app_id : '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'feishu'">
                      <p>应用Secret</p>
                      <p><a-tag :color="selectedBot.feishu_app_secret ? 'green' : 'red'" bordered>{{
                        selectedBot.feishu_app_secret ? selectedBot.feishu_app_secret :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'feishu'">
                      <p>应用Token</p>
                      <p><a-tag :color="selectedBot.feishu_token ? 'green' : 'red'" bordered>{{
                        selectedBot.feishu_token ? selectedBot.feishu_token : '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp_service'">
                      <p>AppID</p>
                      <p><a-tag :color="selectedBot.wechatmp_app_id ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_app_id ? selectedBot.wechatmp_app_id :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp_service'">
                      <p>AppSecret</p>
                      <p><a-tag :color="selectedBot.wechatmp_app_secret ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_app_secret ?
                          selectedBot.wechatmp_app_secret :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp_service'">
                      <p>Token</p>
                      <p><a-tag :color="selectedBot.wechatmp_token ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_token ? selectedBot.wechatmp_token : '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp_service'">
                      <p>AESKey</p>
                      <p><a-tag :color="selectedBot.wechatmp_aes_key ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_aes_key ? selectedBot.wechatmp_aes_key :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp'">
                      <p>AppID</p>
                      <p><a-tag :color="selectedBot.wechatmp_app_id ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_app_id ? selectedBot.wechatmp_app_id :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp'">
                      <p>AppSecret</p>
                      <p><a-tag :color="selectedBot.wechatmp_app_secret ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_app_secret ?
                          selectedBot.wechatmp_app_secret :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp'">
                      <p>Token</p>
                      <p><a-tag :color="selectedBot.wechatmp_token ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_token ? selectedBot.wechatmp_token : '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title" v-if="selectedBot.channel_type === 'wechatmp'">
                      <p>AESKey</p>
                      <p><a-tag :color="selectedBot.wechatmp_aes_key ? 'green' : 'red'" bordered>{{
                        selectedBot.wechatmp_aes_key ? selectedBot.wechatmp_aes_key :
                          '未启动'
                          }}</a-tag>
                      </p>
                    </div>
                    <div class="draw_dialog_card_title">
                      <p>更新时间：</p>
                      <p>{{ selectedBot.updated_at }}</p>
                    </div>
                  </a-col>
                </a-row>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </a-modal>
  <a-modal v-model:visible="showEditModal" title="编辑配置" @ok="handleSaveConfig" :unmount-on-close="true" width="80%">
    <a-form :model="configForm" :rules="configRules" @submit="handleSaveConfig">
      <a-textarea v-model="configForm.configContent" :auto-size="{ minRows: 10, maxRows: 15 }" />
      <a-alert class="mt-2" type="warning">警告：手动编辑配置之后需要停止并重新启动应用，如果你不知道怎么编辑请勿修改。</a-alert>
    </a-form>
  </a-modal>
</template>
<script setup lang="ts">
import { ref, onMounted, watch, defineProps, defineEmits } from 'vue';
import axios from 'axios';
import { storeToRefs } from 'pinia';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/auth';
import { Message, Modal } from "@arco-design/web-vue";
const settingsStore = useSettingsStore();
const { settings } = storeToRefs(settingsStore);
const modal = useModal();
const auth = useAuthStore();

useSeoMeta({
  title: '助手',
})
import { useRouter } from 'vue-router';
const router = useRouter();
const form = ref({
  userid: '',
  appname: '',
  describe: '',
  dify_api_key: '',
  dify_app_type: 'chatbot', // 默认值为 'chatbot'
  channel_type: 'wx' // 仅有 wx 选项
});

const chatBots = ref([]);
const serverIp = ref('');
const showModal = ref(false);
const showLogsModal = ref(false);
const showStartModal = ref(false);
const logsContent = ref('');
const qrCodeUrl = ref('');
const LoginToken = ref('');

const showDetailModal = ref(false);
const selectedBot = ref(null);

const showDetail = async (bot) => {
  selectedBot.value = bot;
  showDetailModal.value = true;

  const { refresh: fetchData, status: fetchDataStatus } = useFetch<any>('chatbot_logs', {
    method: 'POST',
    body: {
      userid: auth.user.id.toString(),
      appname: bot.appname
    },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200 && response._data) {
        useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: '日志数据已成功获取。', color: 'emerald' });
        selectedBot.value.logsContent = response._data.output || '暂无日志';
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取日志数据失败。', color: 'red' });
        selectedBot.value.logsContent = '获取日志时出现问题';
      }
    },
    onError() {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '请求失败,请稍后再试。', color: 'red' });
      selectedBot.value.logsContent = '获取日志时出现错误';
    }
  });

  await fetchData();
};

const getChatbotList = async () => {
  const { refresh: fetchData, status: fetchDataStatus } = useFetch<any>('chatbot_list', {
    method: 'POST',
    body: { userid: auth.user.id.toString() },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200 && response._data) {
        chatBots.value = response._data.data;
        serverIp.value = response._data.server_ip;
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: response?._data?.message || '获取Chatbot列表时出现问题', color: 'red' });
      }
    },
    onError(error) {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取Chatbot列表时出现错误', color: 'red' });
    },
  });
  await fetchData();
  // console.log(chatBots.value);  // 确认数据已加载
};

const rules = {
  userid: [{ required: true }],
  appname: [{ required: true }],
  describe: [{ required: true }],
  dify_api_key: [{ required: true }],
  dify_app_type: [{ required: true }],
  channel_type: [{ required: true }],
  wechatcom_corp_id: [{ required: form.channel_type === 'wechatcom_app' }],
  wechatcomapp_token: [{ required: form.channel_type === 'wechatcom_app' }],
  wechatcomapp_secret: [{ required: form.channel_type === 'wechatcom_app' }],
  wechatcomapp_agent_id: [{ required: form.channel_type === 'wechatcom_app' }],
  wechatcomapp_aes_key: [{ required: form.channel_type === 'wechatcom_app' }],
  wechatmp_app_id: [{ required: form.channel_type === 'wechatmp' || form.channel_type === 'wechatmp_service' }],
  wechatmp_app_secret: [{ required: form.channel_type === 'wechatmp' || form.channel_type === 'wechatmp_service' }],
  wechatmp_aes_key: [{ required: form.channel_type === 'wechatmp' || form.channel_type === 'wechatmp_service' }],
  wechatmp_token: [{ required: form.channel_type === 'wechatmp' || form.channel_type === 'wechatmp_service' }],
  feishu_app_id: [{ required: form.channel_type === 'feishu' }],
  feishu_app_secret: [{ required: form.channel_type === 'feishu' }],
  feishu_token: [{ required: form.channel_type === 'feishu' }],
  feishu_bot_name: [{ required: form.channel_type === 'feishu' }],
  dingtalk_client_id: [{ required: form.channel_type === 'dingtalk' }],
  dingtalk_client_secret: [{ required: form.channel_type === 'dingtalk' }]
};
const handleSubmit = async () => {
  if (auth.user.remaining_ration === 0) {
    useToast().add({
      icon: 'i-heroicons-x-circle-20-solid',
      title: '配额不足，无法创建',
      color: 'red'
    });
    return; // 退出函数，防止继续提交
  }
  form.value.userid = auth.user.id.toString();
  try {
    const { refresh: fetchData, status: fetchDataStatus } = useFetch<any>('chatbot_add', {
      method: 'POST',
      body: form.value,
      immediate: true,
      watch: false,
      onResponse({ response }) {
        if (response?.status === 200 && response._data) {
          useToast().add({
            icon: 'i-heroicons-check-circle-20-solid',
            title: response._data.message,
            color: 'emerald'
          });
          getChatbotList();
          updateAuthData();
          showModal.value = false;
        } else {
          useToast().add({
            icon: 'i-heroicons-x-circle-20-solid',
            title: response?._data?.message || '未知问题',
            color: 'red'
          });
        }
      },
      onError(error) {
        useToast().add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: '提交表单时出现错误',
          color: 'red'
        });
      },
    });

    await fetchData();
  } catch (error) {
    useToast().add({
      icon: 'i-heroicons-x-circle-20-solid',
      title: '提交表单时出现意外错误',
      color: 'red'
    });
  }
};
const startChatbot = async (appname) => {
  showStartModal.value = true;
  logsContent.value = '';
  qrCodeUrl.value = '';
  LoginToken.value = '';
  const { refresh: fetchData } = useFetch<any>('chatbot_start', {
    method: 'POST',
    body: {
      userid: auth.user.id.toString(),
      appname: appname
    },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: response._data.message, color: 'emerald' });
        if (['wechatcom_app', 'wechatmp', 'wechatmp_service', 'feishu', 'dingtalk'].includes(form.channel_type)) {
          getChatbotList();
          showStartModal.value = false;
        } else {
          pollLogs(appname);
        }
        pollLogs(appname);
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: response?._data?.message || '未知问题', color: 'red' });
        showStartModal.value = false;
      }
    },
    onError(error) {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '启动应用时出现错误', color: 'red' });
      showStartModal.value = false;
    },
  });

  await fetchData();
};
const pollLogs = async (appname) => {
  let isStarted = false;
  let hasShownConfirmMessage = false;

  // console.log('Starting pollLogs for app:', appname);

  while (!isStarted) {
    await new Promise(resolve => setTimeout(resolve, 5000)); // 等待5秒
    try {
      const { refresh: fetchLogs } = useFetch<any>('chatbot_startlogs', {
        method: 'POST',
        body: {
          userid: auth.user.id.toString(), // 确保获取的是正确的用户ID
          appname: appname
        },
        headers: { 'Accept': 'application/json' },
        immediate: true,
        watch: false,
        onResponse({ response }) {
          // console.log('Logs Response:', response);
          if (response?.status === 200) {
            logsContent.value = response._data.output || '暂无日志';
            if (response._data.login_img) {
              qrCodeUrl.value = response._data.login_img;
            }
            if (response._data.login_token) {
              LoginToken.value = response._data.login_token;
            }
            // 如果检测到登录成功, 更新状态并关闭弹窗
            if (response._data.message === '登录成功' || response._data.output.includes('http://0.0.0.0:') || response._data.output.includes('createbotdifyforchat')) {
              isStarted = true;
              showStartModal.value = false; // 关闭弹窗
              Message.success('启动成功！');
              getChatbotList();
              return; // 跳出循环
            } else if (response._data.output.includes('Please press confirm on your phone.') && !hasShownConfirmMessage) {
              // 如果检测到"请在手机上确认登录"信息且尚未显示过, 则显示提示信息
              Message.info('请在手机上确认登录');
              hasShownConfirmMessage = true;
            }
          } else {
            console.error('Error Status:', response?.status);
            Message.error(response?._data?.message || '未知问题');
            isStarted = true; // 停止轮询
            return; // 跳出循环
          }
        },
        onError(error) {
          console.error('Logs Error:', error);
          Message.error('查看日志时出现错误');
          isStarted = true; // 停止轮询
          return; // 跳出循环
        }
      });

      await fetchLogs();
    } catch (error) {
      console.error('Logs Error:', error);
      Message.error('查看日志时出现错误');
      isStarted = true; // 停止轮询
      return; // 跳出循环
    }
    // console.log('Current isStarted State:', isStarted); // 调试信息
  }
};
const viewChatbotLogs = async (appname) => {
  const { refresh: fetchData } = useFetch<any>('chatbot_logs', {
    method: 'POST',
    body: {
      userid: auth.user.id.toString(),
      appname: appname
    },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        logsContent.value = response._data.output || '暂无日志';
        showLogsModal.value = true;
        useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: response._data.message, color: 'emerald' });
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: response?._data?.message || '未知问题', color: 'red' });
      }
    },
    onError(error) {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '查看日志时出现错误', color: 'red' });
    },
  });

  await fetchData();
};
const deleteChatbot = async (appname) => {
  const { refresh: fetchData } = useFetch<any>('chatbot_delete', {
    method: 'POST',
    body: {
      userid: auth.user.id.toString(),
      appname: appname
    },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: response._data.message, color: 'emerald' });
        getChatbotList();
        updateAuthData();
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: response?._data?.message || '未知问题', color: 'red' });
      }
    },
    onError(error) {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '删除应用时出现错误', color: 'red' });
    },
  });

  await fetchData();
};
const stopChatbot = async (appname) => {
  const { refresh: fetchData } = useFetch<any>('chatbot_stop', {
    method: 'POST',
    body: {
      userid: auth.user.id.toString(),
      appname: appname
    },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: response._data.message, color: 'emerald' });
        getChatbotList();
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: response?._data?.message || '未知问题', color: 'red' });
      }
    },
    onError(error) {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '停止应用时出现错误', color: 'red' });
    },
  });

  await fetchData();
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    // 显示消息
    Message.success('复制成功！')
  } catch (err) {
    console.error('Failed to copy:', err)
    // Message.error('Failed to copy!')
  }
}

const copyToClipboardtoken = () => {
  const text = `#auth ${LoginToken.value}`;

  // 创建一个临时的textarea元素
  const textarea = document.createElement('textarea');
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  Message.success('复制成功！')
  //alert(`内容已复制: ${text}`);
}

const showEditModal = ref(false);
const configForm = ref({
  configContent: ''
});
const configRules = {
  configContent: [{ required: true, message: '配置内容不能为空', trigger: 'blur' }]
};

const showEditConfig = async (bot) => {
  const { refresh: fetchData } = useFetch<any>('chatbot_config_get', {
    method: 'POST',
    body: {
      userid: auth.user.id.toString(),
      appname: bot.appname
    },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        configForm.value.configContent = response._data.configContent;
        showEditModal.value = true;
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: response?._data?.message || '获取配置时出现问题', color: 'red' });
      }
    },
    onError(error) {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '获取配置时出现错误', color: 'red' });
    }
  });

  await fetchData();
};

const handleSaveConfig = async () => {
  const { refresh: fetchData } = useFetch<any>('chatbot_config_save', {
    method: 'POST',
    body: {
      userid: auth.user.id.toString(),
      appname: selectedBot.value.appname,
      configContent: configForm.value.configContent
    },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        useToast().add({ icon: 'i-heroicons-check-circle-20-solid', title: response._data.message, color: 'emerald' });
        showEditModal.value = false;
      } else {
        useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: response?._data?.message || '保存配置时出现问题', color: 'red' });
      }
    },
    onError(error) {
      useToast().add({ icon: 'i-heroicons-x-circle-20-solid', title: '保存配置时出现错误', color: 'red' });
    }
  });

  await fetchData();
};

const copyAuthToken = (token) => {
  const authToken = `#auth ${token}`;

  // 创建一个临时的textarea元素
  const textarea = document.createElement('textarea');
  textarea.value = authToken;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
  useToast().add({
    icon: 'i-heroicons-check-circle-20-solid',
    title: '认证口令已复制！',
    color: 'emerald',
  });
};
const updateAuthData = async () => {
  await auth.fetchUser();
};
onMounted(async () => {
  if (!auth.logged) {
    router.push('/auth/login');
    return;
  }
  getChatbotList();
  updateAuthData();
});

const myappitems = (bot: { appname: string }) => [
  [{
    label: '编辑',
    icon: 'i-heroicons-pencil-square-20-solid',
    click: () => {
      startChatbot(bot.appname);
    }
  }, {
    label: '复制',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => {
      viewChatbotLogs(bot.appname);
    }
  }, {
    label: '复制',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => {
      stopChatbot(bot.appname);
    }
  }, {
    label: '复制',
    icon: 'i-heroicons-document-duplicate-20-solid',
    click: () => {
      showEditConfig(bot.appname);
    }
  }],
  [{
    label: '删除',
    icon: 'i-heroicons-trash-20-solid',
    click: () => {
      stopChatbot(bot.appname);
    }
  }]
];
const customUIConfig = {
  width: 'w-20'
};
</script>
<style scoped>
pre.chatbot-logs {
  padding: 5px;
}

img.qr {
  border-radius: 15px;
  border: 2px solid rgb(var(--primary-6), 0.5);
}

pre.chatbot-log {
  max-height: 60vh;
}

pre.chatbot-data {
  max-height: 85vh;
}

.draw_dialog_card_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
