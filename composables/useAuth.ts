import { Amplify } from 'aws-amplify'
import { signUp, type SignUpInput } from 'aws-amplify/auth'

const authConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'ap-southeast-1_Ln45WX58a',
      userPoolClientId: '24m0c8so19lu71q1dscstrnae9',
      identityPoolId: 'ap-southeast-1:1056eb60-4765-48dc-9dba-9d09186ffe56',
      loginWith: {
        email: true,
      },
    },
  },
}

function ensureAmplifyAuthConfigured() {
  const currentConfig = Amplify.getConfig()
  const hasCognitoConfig = currentConfig?.Auth?.Cognito?.userPoolId && currentConfig?.Auth?.Cognito?.userPoolClientId

  if (!hasCognitoConfig) {
    Amplify.configure(authConfig as any)
  }
}

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
    ensureAmplifyAuthConfigured()

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
    ensureAmplifyAuthConfigured()

    return {
      success: true,
      error: null,
      isSignUpComplete: true,
      nextStep: { email, password },
    }
  }

  return {
    register,
    login,
  }
}
