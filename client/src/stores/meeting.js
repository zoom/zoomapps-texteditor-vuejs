import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMeetingStore = defineStore('meeting', () => {
  const meetingId = ref('')

  // const doubleCount = computed(() => count.value * 2)

  function update(state) {
    meetingId.value = state
  }

  return { meetingId, update }
})
