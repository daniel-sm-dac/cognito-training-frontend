import { Amplify } from 'aws-amplify'
import { confirmSignUp, resendSignUpCode, signIn, signUp, type SignUpInput } from 'aws-amplify/auth'

export interface RegisterInput {
  email: string
  password: string
  givenName: string
  familyName: string
}

export interface AuthResult {
  success: boolean
  isSignUpComplete?: boolean
  nextStep?: unknown
  error: string | null
}

export function useAuth() {
  async function register(input: RegisterInput): Promise<AuthResult> {
    const signUpInput: SignUpInput = {
      username: input.email,
      password: input.password,
      options: {
        userAttributes: {
          email: input.email,
          given_name: input.givenName,
          family_name: input.familyName,
        },
        autoSignIn: false,
      },
    }

    try {
      const { isSignUpComplete, nextStep } = await signUp(signUpInput)
      return { success: true, isSignUpComplete, nextStep, error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      return { success: false, error: message }
    }
  }

  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password })
      return { success: isSignedIn, nextStep, error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      return { success: false, error: message }
    }
  }

  async function verifyEmail(email: string, code: string): Promise<AuthResult>{
    try {
      const { isSignUpComplete, nextStep } = await confirmSignUp({
        username: email,
        confirmationCode: code
      })
      return { success: isSignUpComplete, nextStep ,error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed'
      return { success: false, error: message }
    }
  }

  async function resendVerifcationCode(email: string): Promise<AuthResult> {
    try {
      await resendSignUpCode({ username: email })
      return { success: true, error: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Resend verification failed'
      return { success: false, error: message }
    }
  }

  return {
    resendVerifcationCode,
    register,
    login,
    verifyEmail
  }
}
