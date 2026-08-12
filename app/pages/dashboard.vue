<script setup lang="ts">
const { user, logout } = useAuth()

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}

</script>


<template>
  <div class="dashboard-page">
    <div v-if="user">
      <!-- <h1>Dashboard</h1> -->
      <h1>Welcome, {{ user.email }}</h1>
      <button @click="handleLogout">Sign out</button>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem;
}
button {
  padding: 0.75rem 1.25rem;
  background-color: #007bff;
  border: none;
  color: white;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
}
</style>
