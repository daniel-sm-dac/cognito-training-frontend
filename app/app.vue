<script setup lang="ts">
import { useAuth } from './composables/useAuth'
const { user } = useAuth()

</script>

<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />
    <ClientOnly>
      <div v-if="!user">
        <nav class="top-nav">
          <NuxtLink to="/register">Register</NuxtLink>
          <NuxtLink to="/login">Login</NuxtLink>
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
