<script setup lang="ts">
// import { useAuth } from '../composables/useAuth'
import { useAuthSso } from '#imports'

// const { verifyEmail, resendVerificationCode } = useAuth()
const { verifyEmailSSO, resendVerificationCodeSSO } = useAuthSso()
const route = useRoute()
const router = useRouter()

const email = ref((route.query.email as string) ?? '')
const code = ref('')
const errorMessage = ref('')
const statusMessage = ref('')
const submitting = ref(false)
// const isResending = ref(false)

async function handleVerify() {
  errorMessage.value = ''
  statusMessage.value = ''
  submitting.value = true

  try {
    const result = await verifyEmailSSO(email.value, code.value)

    if (!result.success) {
      errorMessage.value = result.error ?? 'Verification failed.'
      return
    }

    router.push({ path: '/login' })
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Verification failed.'
  } finally {
    submitting.value = false
  }
}

async function handleResend() {
  errorMessage.value = ''
  submitting.value = true

  try {
    const result = await resendVerificationCodeSSO(email.value)

    statusMessage.value = result.success
      ? 'A new code has been sent to your email.'
      : ''
    if (!result.success) errorMessage.value = result.error ?? 'Could not resend code.'
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Could not resend code.'
  } finally {
    submitting.value = false
  }
}

</script>

<template>
  <div class="auth-page">
    <h1>We Emailed You</h1>
      <p v-if="email">
        Your code is on the way. To log in, enter the code we emailed to {{ email }}. it may take a minute to arrive.</p>
      <p v-else class="info">
      Already registered? Enter your email and the code we sent you.
      Otherwise, <NuxtLink to="/register">create an account</NuxtLink> first.
      </p>


    <form @submit.prevent="handleVerify">
      <div class="form-group">
        <label for="email">Email</label>
        <input v-model="email" type="email" placeholder="Email" required />
      </div>
      
      <div class="form-group">
        <label for="code">code</label>
        <input v-model="code" type="text" placeholder="Verification code" required />
      </div>
      
      <button type="submit" :disabled="submitting">Verify</button>&nbsp;
      <button type="button" @click="handleResend" :disabled="submitting">Resend code</button>
      <p v-if="errorMessage">{{ errorMessage }}</p>
      <p v-if="statusMessage">{{ statusMessage }}</p>
    </form>
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