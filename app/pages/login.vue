<template>
  <div class="auth-page">
    <h1>Login</h1>
    <form @submit.prevent="submitLogin">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <button type="submit" :disabled="submitting">Login</button>
    </form>

    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

interface LoginForm {
  email: string
  password: string
}

const form = reactive<LoginForm>({
  email: '',
  password: '',
})

const submitting = ref(false)
const error = ref('')
const success = ref('')
const { login } = useAuth()

async function submitLogin() {
  error.value = ''
  success.value = ''
  submitting.value = true

  try {
    const result = await login(form.email, form.password)

    if (result.success) {
      success.value = 'Login successful'
      form.email = ''
      form.password = ''
      await navigateTo('/dashboard')
    } else {
      error.value = result.error ?? 'Login failed. Please try again.'
    }
  } catch {
    error.value = 'Login failed. Please try again.'
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem;
}
.form-group {
  margin-bottom: 1rem;
}
label {
  display: block;
  margin-bottom: 0.25rem;
}
input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
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
button:disabled {
  background-color: #a0aec0;
  cursor: not-allowed;
}
.error {
  margin-top: 1rem;
  color: #d9534f;
}
.success {
  margin-top: 1rem;
  color: #28a745;
}
</style>
