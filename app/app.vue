<template>
  <div class="app-shell">
    <NuxtRouteAnnouncer />

    <nav class="top-nav">
      <NuxtLink to="/register">Register</NuxtLink>
      <NuxtLink to="/login">Login</NuxtLink>
      <NuxtLink to="/dashboard">Dashboard</NuxtLink>
    </nav>

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
