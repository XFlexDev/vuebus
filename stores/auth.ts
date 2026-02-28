import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<{ id: string; name: string; email: string } | null>(null)

  const isLoggedIn = computed(() => !!user.value)

  function login(email: string, _password: string) {
    // Demo-only auth: accept anything
    user.value = { id: 'u_demo', name: 'Miska', email }
  }

  function logout() {
    user.value = null
  }

  return { user, isLoggedIn, login, logout }
})
