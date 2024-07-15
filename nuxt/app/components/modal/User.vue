<script lang="ts" setup>
const modal = useModal()
const auth = useAuthStore();
</script>
<template>
  <UModal prevent-close>
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="text-2xl leading-tight font-black">Hello；{{ auth.user.name }}</div>
          <UButton icon="i-heroicons-x-mark-20-solid" @click="modal.close" color="gray" />
        </div>

      </template>

      <UCard>
        <div class="font-bold text-lg leading-tight tracking-tighter mb-4">
          User Object
        </div>
        <pre>{{ auth.user }}</pre>
      </UCard>

    </UCard>
  </UModal>
</template>
