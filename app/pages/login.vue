<script setup lang="ts">
  import { P } from 'vue-router/dist/index-BN0B0y8a.js'
import { useAuth } from '../composables/useAuth'

  interface LoginForm {
    email: string
    password: string
    code: string
  }

  const form = reactive<LoginForm>({
    email: '',
    password: '',
    code: ''
  })

  const router = useRouter()
  const submitting = ref(false)
  const error = ref('')
  const success = ref('')
  const { login } = useAuth()
  // const justVerified = computed(() => route.query.verified === '1')

  async function handleSubmit() {
    error.value = ''
    submitting.value = true
    
  
    const result = await login(form.email, form.password)
    submitting.value = false
  
    if (result.success) {
      // Tokens are already stored by Amplify at this point - the dashboard
      // page can read them back via authFetch() whenever it needs to call
      // an API. We just redirect; nothing else to do here.

      router.push('/dashboard')
      return
    }

    if (result.nextStep){
      switch (result.nextStep.signInStep) {
        case 'CONFIRM_SIGN_UP':
            return navigateTo(`/verify?email=${encodeURIComponent(form.email)}`)
        default:
          error.value = 'Additional Verification required'
          break;
      }
    }

    console.log("result :", result)
    switch (result.errorName) {
      case 'UserNotFoundException':
        error.value = 'No account found with that email.'
        break
      case 'NotAuthorizedException':
        error.value = 'Incorrect email or password.'
        break
      case 'UserLambdaValidationException':
        error.value = 'Login failed.'
        break
      default:
        error.value = result.error ?? 'Login failed.'
    }
  }
</script>

<template>
  <div class="auth-page">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label for="email">Email</label>
        <input id="email" v-model="form.email" type="email" required />
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input id="password" v-model="form.password" type="password" required />
      </div>
      <button type="submit" :disabled="submitting">
        {{ submitting ? 'Logging in...' : 'Log in' }}
      </button>
      </form>
    <p v-if="error" class="error">{{ error }}</p>
    <p v-if="success" class="success">{{ success }}</p>
  </div>
</template>



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
