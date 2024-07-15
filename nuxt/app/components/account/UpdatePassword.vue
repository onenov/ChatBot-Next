<script lang="ts" setup>
const form = ref();
const auth = useAuthStore();

const state = reactive({
  current_password: "",
  password: "",
  password_confirmation: "",
});

const { refresh: onSubmit, status: accountPasswordStatus } = useFetch<any>("account/password", {
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
        title: "密码已成功更新。",
        color: "emerald",
      });

      state.current_password = "";
      state.password = "";
      state.password_confirmation = "";
    }
  }
});

const { refresh: sendResetPasswordEmail, status: resetPasswordEmailStatus } = useFetch<any>("forgot-password", {
  method: "POST",
  body: { email: auth.user.email },
  immediate: false,
  watch: false,
  onResponse({ response }) {
    if (response._data?.ok) {
      useToast().add({
        icon: "i-heroicons-check-circle-20-solid",
        title: "重置密码的链接已发送到您的电子邮件。",
        color: "emerald",
      });
    }
  }
});
</script>

<template>
  <div>
    <UForm v-if="auth.user.has_password" ref="form" :state="state" @submit="onSubmit" class="space-y-4">
      <UFormGroup label="当前密码" name="current_password" required>
        <UInput v-model="state.current_password" type="password" autocomplete="off" />
      </UFormGroup>

      <UFormGroup label="新密码" name="password" hint="最少8个字符" :ui="{ hint: 'text-xs text-gray-500 dark:text-gray-400' }"
        required>
        <UInput v-model="state.password" type="password" autocomplete="off" />
      </UFormGroup>

      <UFormGroup label="确认密码" name="password_confirmation" required>
        <UInput v-model="state.password_confirmation" type="password" autocomplete="off" />
      </UFormGroup>

      <div class="pt-2">
        <UButton type="submit" label="保存" :loading="accountPasswordStatus === 'pending'" />
      </div>
    </UForm>

    <UAlert v-else icon="i-heroicons-information-circle-20-solid" title="发送指向您的电子邮件的链接以重置您的密码。"
      description="To create a password for your account, you must go through the password recovery process." :actions="[
        {
          label: 'Send link to Email',
          variant: 'solid',
          color: 'gray',
          loading: resetPasswordEmailStatus === 'pending',
          click: sendResetPasswordEmail,
        },
      ]" />
  </div>
</template>
