import { confirmSignUp, fetchAuthSession, getCurrentUser, resendSignUpCode, resetPassword, signIn, signOut, signUp, type SignUpInput } from 'aws-amplify/auth'

export interface AuthResultSSO{
  errorName: string | null
  user_id?: string
  success: boolean
  error: string | null
}
export function useAuthSso() {
  // needed to create LOGIN API to insert tokens in the database and get the refresh token to pass it to the client side
  async function loginSSO(email: string, password: string, clientAppId: string): Promise<AuthResultSSO> {
    try {
      
      const response = await fetch('https://8p7gwoln99.execute-api.ap-southeast-1.amazonaws.com/dev/login', { // TODO API URL move to Config
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: email, password, client_app_id: clientAppId }),
      })

      if (!response.ok) {
        const err = await response.json()
        return { success: false, error: err.error ?? 'Login failed', errorName: null }
      }

      const { user_id } = await response.json()
      return { success: true, user_id: user_id, error: null, errorName: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return { success: false, error: message, errorName: null }
    }
  }

  async function verifyEmailSSO(email: string, code: string): Promise<AuthResult>{
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code
      })
      return { success: isSignUpComplete, nextStep ,error: null, errorName: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed'
      const name = err instanceof Error ? err.name : null
      return { success: false, error: message, errorName: name}
    }
  }

  // Requests a new signup verification code be sent
  async function resendVerificationCodeSSO(email: string): Promise<AuthResult> {
    try {
      await resendSignUpCode({ username: email })
      return { success: true, error: null, errorName: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Resend verification failed'
      const name = err instanceof Error ? err.name : null
      return { success: false, error: message, errorName: name }
    }
  }

  return {
    loginSSO,
    verifyEmailSSO,
    resendVerificationCodeSSO
  }
}