<script setup lang="ts">
import UserProfile from '@/components/home/UserProfile.vue'
import { Menu } from 'lucide-vue-next'

const emit = defineEmits<{
  hamburgerClick: [value: boolean]
}>()

</script>

<template>
  <div class="bg-white flex w-full shadow align-middle">
    <div class="flex justify-between w-full items-center p-3">
      <div class="cursor-pointer" @click="$emit('hamburgerClick', true)">
        <Menu class="h-6 w-6"></Menu>
      </div>
      <div class="flex gap-5">
        <UserProfile />
      </div>
    </div>
  </div>
</template>
