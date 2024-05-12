<script setup lang="ts">
import { useAuthStore } from '@/stores/authStore'
import DropdownMenu from '../ui/dropdown-menu/DropdownMenu.vue'
import DropdownMenuTrigger from '../ui/dropdown-menu/DropdownMenuTrigger.vue'
import Button from '../ui/button/Button.vue'
import DropdownMenuContent from '../ui/dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuLabel from '../ui/dropdown-menu/DropdownMenuLabel.vue'
import DropdownMenuSeparator from '../ui/dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuItem from '../ui/dropdown-menu/DropdownMenuItem.vue'
import { LogOut } from 'lucide-vue-next'
import DropdownMenuShortcut from '../ui/dropdown-menu/DropdownMenuShortcut.vue'


const { auth, logout } = useAuthStore()
</script>

<template>
  <div class="text-sm font-medium leading-none align-middle text-center self-center">
    {{ auth?.userDto?.userName ?? '' }}
  </div>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <div className="flex">
        <Button variant="ghost" className="flex h-8 w-8 rounded-full self-center leading-none">
          <div class="flex self-center rounded-full border-primary/40 border-2 p-1">
            <img class="w-full h-full object-contain max-w-sm" src="@/assets/avatar.svg" />
            
          </div>
        </Button>
      </div>
    </DropdownMenuTrigger>
    <DropdownMenuContent class="w-56 z-[1000]" align="end">
      <DropdownMenuLabel class="font-normal">
        <div class="flex flex-col space-y-1">
          <p class="text-xs leading-none text-muted-foreground">
            {{ auth?.userDto?.userId ?? '' }}
          </p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem @click="logout">
        <LogOut class="mr-2 h-4 w-4" />
        <span>Log out</span>
        <DropdownMenuShortcut>🚪</DropdownMenuShortcut>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
