<template>
  <ClientOnly>
    <UButton v-if="announcements.length > 0" icon="i-heroicons-envelope" size="sm" color="primary" square variant="soft"
      @click="showAnnouncement" />
    <UButton v-if="!signedIn && auth.logged" icon="i-heroicons-calendar-days" size="sm" color="primary" square
      variant="soft" @click="signIn" />
    <!-- 公告弹窗 -->
    <div v-for="(announcement, index) in announcements" :key="index">
      <a-modal v-model:visible="announcement.visible" title="公告" :hide-cancel="true" @ok="closeAnnouncement(index)"
        width="auto">
        <div v-html="announcement.content"></div>
      </a-modal>
    </div>
  </ClientOnly>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { Modal, Notification } from '@arco-design/web-vue';
const router = useRouter();
const auth = useAuthStore();
const signedIn = ref(false);
const toast = useToast();
const announcements = ref([]);
const notices = ref([]);

const closeAnnouncement = (index: number) => {
  announcements.value[index].visible = false;
};

const fetchAnnouncements = async () => {
  const { refresh: fetchData } = useFetch<any>('/get_announcements', {
    method: 'GET',
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        announcements.value = response._data.map(announcement => ({
          ...announcement,
          visible: false, // 初始状态设为不可见
        }));
      } else {
        toast.add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: response?._data?.message || '获取公告时出现问题',
          color: 'red',
        });
      }
    },
    onError(error) {
      toast.add({
        icon: 'i-heroicons-x-circle-20-solid',
        title: '获取公告时出现错误',
        color: 'red',
      });
    },
  });
  await fetchData();
};

const fetchNotices = async () => {
  const { refresh: fetchData } = useFetch<any>('/get_notices', {
    method: 'GET',
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        notices.value = response._data.map(notice => ({
          ...notice,
        }));
        showNotices();
      } else {
        toast.add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: response?._data?.message || '获取通知时出现问题',
          color: 'red',
        });
      }
    },
    onError(error) {
      toast.add({
        icon: 'i-heroicons-x-circle-20-solid',
        title: '获取通知时出现错误',
        color: 'red',
      });
    },
  });
  await fetchData();
};

const showNotices = () => {
  const lastNoticeTime = localStorage.getItem('last_notice_time');
  const oneDay = 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();

  if (!lastNoticeTime || currentTime - parseInt(lastNoticeTime, 10) > oneDay) {
    notices.value.forEach((notice: any) => {
      Notification.info({
        title: notice.title,
        content: notice.content,
        duration: 5000,
        dangerouslySetInnerHTML: true,
      });
    });
    localStorage.setItem('last_notice_time', currentTime.toString());
  }
};

const showAnnouncement = () => {
  announcements.value.forEach((announcement: any) => {
    announcement.visible = true;
  });
};

const showAnnouncements = () => {
  const lastAnnouncementTime = localStorage.getItem('last_announcement_time');
  const oneDay = 24 * 60 * 60 * 1000;
  const currentTime = new Date().getTime();

  // 检查是否需要显示公告
  const shouldShowAnnouncements = !lastAnnouncementTime || currentTime - parseInt(lastAnnouncementTime, 10) > oneDay;

  if (shouldShowAnnouncements) {
    setTimeout(() => {
      announcements.value.forEach((announcement: any) => {
        announcement.visible = true;
      });
      // 更新本地存储
      localStorage.setItem('last_announcement_time', currentTime.toString());
    }, 1000);
  } else {
    announcements.value.forEach((announcement: any) => {
      announcement.visible = false;
    });
  }
};

const checkSignin = async () => {
  const { refresh: fetchData } = useFetch<any>('/check-signin', {
    method: 'POST',
    body: { userid: auth.user.id.toString() },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200) {
        signedIn.value = response._data.signed_in;
      } else {
        toast.add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: response?._data?.message || '签到检测时出现问题',
          color: 'red',
        });
      }
    },
    onError(error) {
      toast.add({
        icon: 'i-heroicons-x-circle-20-solid',
        title: '签到检测时出现错误',
        color: 'red',
      });
    },
  });
  await fetchData();
};

const signIn = async () => {
  const { refresh: fetchData } = useFetch<any>('/signin', {
    method: 'POST',
    body: { userid: auth.user.id.toString() },
    immediate: true,
    watch: false,
    onResponse({ response }) {
      if (response?.status === 200 && response._data.success) {
        signedIn.value = true;
        toast.add({
          icon: 'i-heroicons-check-circle-20-solid',
          title: '签到成功',
          color: 'green',
        });
      } else {
        toast.add({
          icon: 'i-heroicons-x-circle-20-solid',
          title: response?._data?.message || '签到时出现问题',
          color: 'red',
        });
      }
    },
    onError(error) {
      toast.add({
        icon: 'i-heroicons-x-circle-20-solid',
        title: '签到时出现错误',
        color: 'red',
      });
    },
  });
  await fetchData();
};

onMounted(() => {
  if (auth.logged) {
    checkSignin();
  }
  fetchAnnouncements().then(() => {
    showAnnouncements();
  });
  fetchNotices();
});
</script>
