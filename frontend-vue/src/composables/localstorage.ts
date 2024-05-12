import { getLocalStorage, setLocalStorage } from '@/lib/utils'
import { ref, computed } from 'vue'


/**
 * Note, using this composible, update does not propage through whole app
 * when we set the value only current component re-renders. (of course)
 * Maybe I'll look into provide/inject or pinia
 * so this is useless. but I am keeping this as a note.
 * @deprecated
 */
export const useLocalStorage = (key: string, initialValue: any) => {
  const storedValue = ref(getLocalStorage(key, initialValue))

  const storage = computed({
    get() {
      return storedValue.value
    },
    set(newValue) {
      setLocalStorage(key, newValue)
      storedValue.value = newValue
    }
  })
  return storage
}
