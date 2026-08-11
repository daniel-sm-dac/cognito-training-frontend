<script setup lang="ts">
import { useAuth } from '../../composables/useAuth'

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
  <form class="auth-form" @submit.prevent="handleVerificationCode">
    <h1>We Emailed You</h1>
    <p v-if="email">Your code is on the way. To log in, enter the code we emailed to {{ email }}. it may take a minute to arrive.</p>
    <p v-else class="info">
      Already registered? Enter your email and the code we sent you.
      Otherwise, <NuxtLink to="/register">create an account</NuxtLink> first.
    </p>

    <label>
      Email
      <input v-model="email" type="email" required autocomplete="email" />
    </label>

    <label>
      Verification code
      <input v-model="code" type="text" inputmode="numeric" required autocomplete="one-time-code" />
    </label>

    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
    <p v-if="infoMessage" class="info">{{ infoMessage }}</p>

    <button type="submit" :disabled="isSubmitting">
      {{ isSubmitting ? 'Verifying...' : 'Verify' }}
    </button>

    <button type="button" class="link-button" :disabled="isResending" @click="handleResend">
      {{ isResending ? 'Sending...' : 'Resend code' }}
    </button>
  </form>
</template>

<style scoped>
.auth-form {
  max-width: 360px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.error {
  color: #c0392b;
}
.info {
  color: #2a8a4a;
}
.link-button {
  background: none;
  border: none;
  color: #3468c0;
  cursor: pointer;
  padding: 0;
}
</style>