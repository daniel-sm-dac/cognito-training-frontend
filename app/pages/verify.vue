<script setup lang="ts">
import { useAuth } from '../composables/useAuth'

const { verifyEmail, resendVerificationCode } = useAuth()
const route = useRoute()
const router = useRouter()

const email = ref((route.query.email as string) ?? '')
const code = ref('')
const errorMessage = ref('')
const infoMessage = ref('')
const isSubmitting = ref(false)
const isResending = ref(false)

async function handleVerificationCode() {
  errorMessage.value = ''
  infoMessage.value = ''
  isSubmitting.value = true

  const result = await verifyEmail(email.value, code.value)
  isSubmitting.value = false

  if (!result.success) {
    errorMessage.value = result.error ?? 'Verification failed.'
    return
  }

//   router.push({ path: '/login', query: { verified: '1' } })
}

async function handleResend() {
  errorMessage.value = ''
  isResending.value = true
  const result = await resendVerificationCode(email.value)
  isResending.value = false

  infoMessage.value = result.success
    ? 'A new code has been sent to your email.'
    : ''
  if (!result.success) errorMessage.value = result.error ?? 'Could not resend code.'
}

</script>

<template>
  <div class="auth-page">
    <form class="auth-form" @submit.prevent="handleVerificationCode">
      <h1>We Emailed You</h1>
      <p v-if="email">
        Your code is on the way. To log in, enter the code we emailed to {{ email }}. it may take a minute to arrive.</p>
      <p v-else class="info">
      Already registered? Enter your email and the code we sent you.
      Otherwise, <NuxtLink to="/register">create an account</NuxtLink> first.
      </p>
      <div class="form-group">
          <label for="email">Email</label>
          <input v-model="email" type="email" required autocomplete="email" />
      </div>

      <label>
      Verification code
      <input v-model="code" type="text" inputmode="numeric" required autocomplete="one-time-code" />
      </label>

      <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      <p v-if="infoMessage" class="info">{{ infoMessage }}</p>

      <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Verifying...' : 'Verify' }}
      </button>
      |
      <button type="button" class="link-button" :disabled="isResending" @click="handleResend">
      {{ isResending ? 'Sending...' : 'Resend code' }}
      </button>
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