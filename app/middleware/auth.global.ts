import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  console.log('here are the middleware')
  if (import.meta.server) return

  const { isAuthenticated, restoreSession } = useAuth()
  console.log("isAuthenticate: ", isAuthenticated)

  if (!isAuthenticated.value) {
    await restoreSession()
  }

  const protectedRoutes = ['/dashboard']
  if (protectedRoutes.includes(to.path) && !isAuthenticated.value) {
    return navigateTo('/login')
  }
})