<script setup lang="ts">
import { ref } from 'vue'
import Collapsible from '../ui/collapsible/Collapsible.vue'
import CollapsibleTrigger from '../ui/collapsible/CollapsibleTrigger.vue'
import { cn } from '@/lib/utils'
import CollapsibleContent from '../ui/collapsible/CollapsibleContent.vue'
import { ChevronDown, ChevronUp } from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    menu?: any
    menuPath: string
    root?: boolean
    setMenu?: (isOpen: boolean) => void
  }>(),
  {
    root: false
  }
)

const isOpen = ref(false)

function clickSmallScreen() {
  window.innerWidth < 770 && props.setMenu && props.setMenu(false)
}
</script>

<template>
  <div v-if="!menu.children?.length">
    <RouterLink :to="'/' + menu.menuId">
      <div
        @click="clickSmallScreen"
        :class="
          cn(
            'cursor-pointer flex flex-col border-muted p-2 bg-accent text-xs',
            menu.menuId?.toUpperCase() == menuPath?.toUpperCase()
              ? 'bg-secondary font-semibold'
              : 'hover:text-white hover:font-bold'
          )
        "
      >
        {{ menu.menuName }}
      </div>
    </RouterLink>
  </div>
  <div v-else>
    <Collapsible v-model="isOpen">
      <CollapsibleTrigger asChild>
        <div
          :class="
            cn(
              'hover:text-white hover:font-semibold cursor-pointer flex p-2 justify-between text-xs',
              root ? 'bg-primary' : 'bg-accent',
              isOpen && 'font-semibold text-white'
            )
          "
        >
          {{ menu.menuName }}
          <div>
            <ChevronDown v-if="isOpen" class="w-4 h-4" />
            <ChevronUp v-else class="w-4 h-4" />
          </div>
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent class="CollapsibleContent bg-accent space-y-2">
        <div class="pl-2">
          <RenderMenu
            v-for="m in menu.children"
            :key="m.menuId"
            :menu="m"
            :menuPath="menuPath"
            :setMenu="setMenu"
          />
        </div>
      </CollapsibleContent>
    </Collapsible>
  </div>
</template>
