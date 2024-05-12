import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getLocalStorage, setLocalStorage } from '@/lib/utils'
import router from '@/router'

const AUTH_LOCAL_KEY = 'user'

// replacement of @/composables/localstorage.ts

export const useAuthStore = defineStore('authStore', () => {
  const auth = ref(getLocalStorage(AUTH_LOCAL_KEY, null))
  function setAuth(value: any) {
    auth.value = value
    setLocalStorage(AUTH_LOCAL_KEY, value)
  }

  function logout() {
    setAuth('')
    router.replace({ path: '/login' })
  }

  return { auth, setAuth, logout }
})
