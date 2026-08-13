<script setup lang="ts">
import { ref } from 'vue'
const { user, logout, getTokens, authFetch } = useAuth()
const error = ref('')
const users = ref<any[]>([])
// TEMP DEBUG - remove after testing

onMounted(async () => {
  const tokens = await getTokens()
  console.log('tokens result:', tokens)
  if (!tokens.idToken) {
    console.warn('No idToken — session may not be ready yet')
    return
  }
  console.log('raw token:', tokens.idToken)

  try {
    const res = await authFetch('https://8p7gwoln99.execute-api.ap-southeast-1.amazonaws.com/dev/users', {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }) //for testing only (need to properly call this)
    
    if (res.status === 403) {
      error.value = 'dont have permission'
      return
    }

    if (res.status === 401) {
      error.value = 'Please log in again.'
      return
    }

    if (!res.ok) throw new Error(`Request failed: ${res.status}`)
    console.log("response: ", res)
    const data = await res.json()
    users.value = data.users
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to load users.'
  }
})

async function handleLogout() {
  await logout()
  await navigateTo('/login')
}

</script>

<template>
  <div class="dashboard-page">
    <header v-if="user" class="dashboard-header">
      <div>
        <h1>Dashboard</h1>
        <p class="welcome">Welcome back, {{ user.email }}</p>
      </div>
      <button class="btn-outline" @click="handleLogout">Sign out</button>
    </header>

    <section class="users-section">
      <p v-if="error" class="error">{{ error }}</p>
      <ul v-else class="user-list">
        <li v-for="u in users" :key="u.userId" class="user-row">
          <span class="email">{{ u.email }}</span>
          <span class="role">{{ u.role }}</span>
        </li>
      </ul>
    </section>
  </div>
</template>

<style scoped>
.dashboard-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.dashboard-header h1 {
  font-size: 1.5rem;
  margin: 0 0 0.25rem;
}

.welcome {
  color: #6b7280;
  margin: 0;
  font-size: 0.9rem;
}

.btn-outline {
  padding: 0.5rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-outline:hover {
  background: #f9fafb;
}

.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.user-row {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
}

.user-row:last-child {
  border-bottom: none;
}

.email {
  color: #111827;
}

.role {
  color: #6b7280;
  font-size: 0.85rem;
  text-transform: capitalize;
}

.error {
  color: #dc2626;
}
</style>