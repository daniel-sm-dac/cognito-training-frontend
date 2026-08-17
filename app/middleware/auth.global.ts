import { useAuth } from '../composables/useAuth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const { isAuthenticated, restoreSession } = useAuth()

  if (!isAuthenticated.value) {
    await restoreSession()
  }

  // const protectedRoutesDashboard = ['/dashboard']
  // const protectedRoutesLogin= ['/login']
  // if (protectedRoutesDashboard.includes(to.path) && !isAuthenticated.value) {
  //   return navigateTo('/login')
  // }

  // if (protectedRoutesLogin.includes(to.path) && isAuthenticated.value) {
  //   return navigateTo('/dashboard')
  // }

})