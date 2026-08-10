<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

interface RegisterForm {
  email: string
  password: string
  confirmPassword: string
  givenName: string
  familyName: string
}

const form = reactive<RegisterForm>({
  email: '',
  password: '',
  confirmPassword: '',
  givenName: '',
  familyName: ''
})

const submitting = ref(false)
// const error = ref('')
const error = ref<string[]>([])
const success = ref('')

const { register } = useAuth()

function validateForm(): boolean {
  // error.value = ''
  error.value = []

  if (!form.email) {
    // error.value = 'Email is required.'
    const errorMessage = 'Email is required.'
    error.value.push(errorMessage)
    // return false
  }

  if (!form.password) {
    const errorMessage = 'Password is required.'
    error.value.push(errorMessage)
  }

  if (form.password.length < 8) {
    const errorMessage = 'Password must be at least 8 characters.'
    error.value.push(errorMessage)
  }

  if (form.password !== form.confirmPassword) {
    const errorMessage = 'Passwords do not match.'
    error.value.push(errorMessage)
  }

  if (!form.givenName) {
    const errorMessage = 'Given name is required.'
    error.value.push(errorMessage)
  }

  if (!form.familyName) {
    const errorMessage = 'Family name is required.';
    error.value.push(errorMessage)
  }

  if (error.value.length > 0) return false;

  return true
}

async function submitRegistration() {
  if (!validateForm()) {
    return
  }

  submitting.value = true;
  error.value = []
  success.value = ''

  try {
    const result = await register({
      email: form.email,
      password: form.password,
      givenName: form.givenName,
      familyName: form.familyName,
    })

    if (result.success) {
      success.value = 'Registration successful. Check your email to confirm.'
      form.email = ''
      form.password = ''
      form.confirmPassword = ''
      form.givenName = ''
      form.familyName = ''
      await navigateTo('/dashboard')
    } else {
      // error.value = result.error ?? 'Registration failed. Please try again.'
      const errorMessage = result.error ?? 'Registration failed. Please try again.'
      error.value.push(errorMessage);
    }
  } catch {
    // error.value = 'Registration failed. Please try again.'
    const errorMessage = 'Registration failed. Please try again.'
    error.value.push(errorMessage);
  } finally {
    submitting.value = false
  }
}

const config = useRuntimeConfig()
console.log('Test:', config.public.cognitoUserPoolId)
</script>

<template>
  <div>{{ config.public.cognitoUserPoolId }}</div>
  <div class="register-page">
    <h1>Register</h1>
    <form @submit.prevent="submitRegistration">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" minlength="8" />
      </div>
      <div class="form-group">
        <label for="confirmPassword">Confirm Password</label>
        <input id="confirmPassword" v-model="form.confirmPassword" type="password" minlength="8" />
      </div>
      <div class="form-group">
        <label for="givenName">Given Name</label>
        <input id="givenName" v-model="form.givenName" type="text" />
      </div>
      <div class="form-group">
        <label for="familyName">Family Name</label>
        <input id="familyName" v-model="form.familyName" type="text" />
      </div>
      <button type="submit" :disabled="submitting">Register</button>
    </form>
    <!-- <p v-if="error" class="error">{{ error }}</p> -->
    <ul v-if="error.length" class="error">
      <li v-for="err in error" :key="err">{{ err }}</li>
    </ul>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>


<style scoped>
.register-page {
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
