import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { isAuthenticated, restoreSession } = useAuth()

  if (!isAuthenticated.value) {
    await restoreSession()
  }

  const protectedRoutes = ['/dashboard']
  if (protectedRoutes.includes(to.path) && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})