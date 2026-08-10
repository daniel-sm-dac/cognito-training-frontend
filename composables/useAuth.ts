import { Amplify } from 'aws-amplify'
import { signIn, signUp, type SignUpInput } from 'aws-amplify/auth'

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
      console.log(message);
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

  return {
    register,
    login,
  }
}
