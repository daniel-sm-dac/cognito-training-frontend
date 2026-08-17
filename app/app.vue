<script setup lang="ts">
import { useAuth } from './composables/useAuth'
const { user } = useAuth()
const route = useRoute()
const returnTo = route.query.return_to as string
const clientAppId = route.query.client_app_id as string
</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <ClientOnly>
      <div v-if="!user">
        <nav class="top-nav">
          <NuxtLink :to="{ path: '/register', query: { return_to: returnTo, client_app_id: clientAppId } }">Register</NuxtLink>
          <!-- <NuxtLink to="/login">Login</NuxtLink> -->
        </nav>
      </div>
    </ClientOnly>
    <main>
      <NuxtPage />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  font-family: Arial, sans-serif;
  padding: 1rem;
}
.top-nav {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.top-nav a {
  color: #007bff;
  text-decoration: none;
  font-weight: 600;
}
.top-nav a:hover {
  text-decoration: underline;
}
</style>
