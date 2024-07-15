<script lang="ts" setup>
const router = useRouter();
const form = ref();

const state = reactive({
  name: "",
  email: "",
  password: "",
  password_confirmation: "",
});

const { refresh: onSubmit, status: registerStatus } = useFetch<any>("register", {
  method: "POST",
  body: state,
  immediate: false,
  watch: false,
  async onResponse({ response }) {
    if (response?.status === 422) {
      form.value.setErrors(response._data?.errors);
    } else if (response._data?.ok) {
      useToast().add({
        icon: "i-heroicons-check-circle-20-solid",
        title: "您已成功注册！",
        color: "emerald",
        actions: [
          {
            label: "登陆",
            to: "/auth/login",
            color: "emerald",
          },
        ],
      });

      router.push("/auth/login");
    }
  }
});
</script>

<template>
  <div class="space-y-4">
    <UForm ref="form" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormGroup label="用户名" name="name" required>
        <UInput v-model="state.name" type="text" autofocus />
      </UFormGroup>

      <UFormGroup label="邮箱" name="email" required>
        <UInput v-model="state.email" placeholder="you@example.com" icon="i-heroicons-envelope" trailing type="email" />
      </UFormGroup>

      <UFormGroup label="密码" name="password" hint="min 8 characters"
        :ui="{ hint: 'text-xs text-gray-500 dark:text-gray-400' }" required>
        <UInput v-model="state.password" type="password" autocomplete="off" />
      </UFormGroup>

      <UFormGroup label="重复密码" name="password_confirmation" required>
        <UInput v-model="state.password_confirmation" type="password" autocomplete="off" />
      </UFormGroup>

      <div class="flex items-center justify-end space-x-4">
        <UButton type="submit" label="注册" :loading="registerStatus === 'pending'" />
      </div>
    </UForm>

    <div class="text-sm">
      已经有一个帐户？
      <NuxtLink class="text-sm" to="/auth/login">登陆</NuxtLink>
    </div>
  </div>
</template>
