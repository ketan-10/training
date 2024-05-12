<script setup lang="ts">
import RenderMenu from '@/components/home/RenderMenu.vue'
import request from '@/lib/axios.config'
import { findMenuFromPathName, menuToTree } from '@/lib/helpers'
import router from '@/router'
import { useQuery } from '@tanstack/vue-query'
import { Loader } from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'

// const { data, isLoading, isSuccess } = useQuery<any>({
//   queryKey: ['/home/routes'],
//   queryFn: () => request('/home/routes')
// })

// const menuList = computed(() => menuToTree(data?.value?.data))
const isLoading = ref(false)
const menuList = [
  {
    menuId: '1',
    menuName: 'Dashboard 1',
    children: [
      {
        menuId: '2',
        menuName: 'Child 1'
      },
      {
        menuId: '3',
        menuName: 'Child 2'
      },
      {
        menuId: '4',
        menuName: 'Child 3'
      }
    ]
  },
  {
    menuId: '5',
    menuName: 'Dashboard 2',
    children: [
      {
        menuId: '11',
        menuName: 'Child 1'
      },
      {
        menuId: '12',
        menuName: 'Child 2'
      }
    ]
  },
  {
    menuId: '6',
    menuName: 'Dashboard 3'
  },
  {
    menuId: '7',
    menuName: 'Dashboard 4',
    children: [
      {
        menuId: '8',
        menuName: 'Child 1'
      },
      {
        menuId: '9',
        menuName: 'Child 2'
      },
      {
        menuId: '10',
        menuName: 'Child 3'
      }
    ]
  }
]

const route = useRoute()

const menuPath = findMenuFromPathName(route.fullPath)

defineProps<{
  setMenu?: (isOpen: boolean) => void
}>()
</script>

<template>
  <div v-if="isLoading" className="flex flex-col justify-start p-3">
    <div className="text-gray-200 top-5 left-5 self-center">
      <Loader />
    </div>
  </div>
  <div>
    <div className="text-gray-200 flex flex-col justify-start">
      <div>
        <RenderMenu
          v-for="m in menuList"
          :menu="m"
          :menuPath="menuPath"
          :key="m.menuId"
          :setMenu="setMenu"
          :root="true"
        />
      </div>
    </div>
  </div>
</template>
