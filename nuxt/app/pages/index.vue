<script setup lang="ts">
import { ModalUser } from '#components'

const modal = useModal();
const router = useRouter();
const auth = useAuthStore();

function openUserModal() {
  modal.open(ModalUser)
}

useSeoMeta({
  title: 'Home',
})

</script>

<template>
  <HomeWelcome />
  <HomeDemo />
</template>
<style scoped></style>
