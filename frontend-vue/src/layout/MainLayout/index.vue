<script setup lang="ts">
import Header from './Header.vue'
import Drawer from './Drawer.vue'
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'
import { cn, isTokenValid } from '@/lib/utils'
import router from '@/router'
import { ref } from 'vue'
import ScrollArea from '@/components/ui/scroll-area/ScrollArea.vue'

const { auth } = useAuthStore()
const isMenu = ref(true)

if (!auth || !isTokenValid(auth.token)) {
  router.replace({ path: '/login' })
}

function setMenu(isOpen: boolean) {
  isMenu.value = isOpen
}
</script>

<template>
  <div class="flex w-full">
    <div
      v-if="isMenu"
      class="fixed mo:bg-background/80 mo:inset-0 mo:backdrop-blur-sm z-30"
      @click="isMenu = !isMenu"
    >
      <div
        class="flex w-56 shadow h-14 p-3 self-center flex-shrink-0 justify-start align-middle items-center gap-4 bg-white"
      >
        <img class="max-h-full object-contain" src="@/assets/logo.svg" />
        <div class="capitalize font-semibold">Training Portal</div>
      </div>
      <ScrollArea
        class="z-[900] h-[calc(100vh-3.5rem)] w-56 flex-shrink-0 bg-primary"
        @Click="(e: any) => e.stopPropagation()"
      >
        <Drawer :setMenu="setMenu"/>
      </ScrollArea>
    </div>

    <div class="w-full">
      <div :class="cn('z-[9] top-0 left-0 fixed h-14 flex w-full', isMenu && 'md:pl-56')">
        <Header @hamburgerClick="isMenu = !isMenu" />
      </div>
      <div :class="cn('pt-14 w-full min-h-screen', isMenu && 'md:pl-56')">
        <RouterView />
      </div>
    </div>
  </div>

  <!-- <Drawer /> -->
  <!-- <RouterView /> -->
</template>
