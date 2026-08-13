<script setup lang="ts">


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
    <div v-if="user">
      <!-- <h1>Dashboard</h1> -->
      <h1>Welcome, {{ user.email }}</h1>
      <button @click="handleLogout">Sign out</button>
    </div>
  </div>
  <div>
    <p v-if="error">{{ error }}</p>
    <ul v-else>
      <li v-for="u in users" :key="u.userId">{{ u.email }} — {{ u.role }}</li>
    </ul>
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
