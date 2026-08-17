<script setup lang="ts">
// import { useAuth } from '../composables/useAuth'
import { useAuthSso } from '../composables/useAuthSso'

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

  // const router = useRouter()
  const route = useRoute()
  const submitting = ref(false)
  const error = ref('')
  const success = ref('')
  // const { login } = useAuth()
  const { loginSSO } = useAuthSso()

  const returnTo = route.query.return_to as string
  const clientAppId = route.query.client_app_id as string
  // const justVerified = computed(() => route.query.verified === '1')
  
  async function handleSubmitSSO() {
    error.value = ''
    submitting.value = true
    const result = await loginSSO(form.email, form.password, clientAppId)

    submitting.value = false
    if (!result.success) {
      mapErrorMessage(result.error as string)
      return
    }

    // send the browser back to the store app that redirected here
    console.log(`${returnTo}?user_id=${result.user_id}`)
    window.location.href = `${returnTo}?user_id=${result.user_id}`
  }

  function mapErrorMessage(code: string) {
    switch (code) {
      case 'invalid_credentials': 
        error.value = 'Incorrect email or password.'
        break
      case 'account_not_verified': 
        return navigateTo(`/verify?email=${encodeURIComponent(form.email)}&${returnTo}&client_app_id=${clientAppId}`)
      default: 
        error.value = 'Something went wrong. Please try again.'
        break
    }
  }

  // async function handleSubmit() {
  //   error.value = ''
  //   submitting.value = true
    
  
  //   const result = await login(form.email, form.password)
  //   submitting.value = false
  
  //   if (result.success) {
  //     // Tokens are already stored by Amplify at this point - the dashboard
  //     // page can read them back via authFetch() whenever it needs to call
  //     // an API. We just redirect; nothing else to do here.

  //     router.push('/dashboard')
  //     return
  //   }

  //   if (result.nextStep){
  //     switch (result.nextStep.signInStep) {
  //       case 'CONFIRM_SIGN_UP':
  //           return navigateTo(`/verify?email=${encodeURIComponent(form.email)}`)
  //       default:
  //         error.value = 'Additional Verification required'
  //         break;
  //     }
  //   }

  //   switch (result.errorName) {
  //     case 'UserNotFoundException':
  //       error.value = 'No account found with that email.'
  //       break
  //     case 'NotAuthorizedException':
  //       error.value = 'Incorrect email or password.'
  //       break
  //     case 'UserLambdaValidationException':
  //       error.value = 'Login failed.'
  //       break
  //     default:
  //       error.value = result.error ?? 'Login failed.'
  //   }
  // }
</script>

<template>
  <div class="auth-page">
    <h1>Login</h1>
    <form @submit.prevent="handleSubmitSSO">
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
