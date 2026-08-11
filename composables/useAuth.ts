import { confirmSignUp, fetchAuthSession, getCurrentUser, resendSignUpCode, signIn, signOut, signUp, type SignUpInput } from 'aws-amplify/auth'


// Shared reactive state across every component that calls useAuth()
const user = useState<{ userId: string; email: string } | null>('auth-user', () => null)
const isAuthenticated = useState<boolean>('auth-is-authenticated', () => false)

export interface RegisterInput {
  email: string
  password: string
  givenName: string
  familyName: string
}

export interface AuthResult {
  success: boolean
  isSignUpComplete?: boolean
  nextStep?: any
  error: string | null
  errorName: string | null
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
      return { success: true, isSignUpComplete, nextStep, error: null, errorName: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      const name = err instanceof Error ? err.name : null
      return { success: false, error: message, errorName: name}
    }
  }

  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password })
      if (isSignedIn) {
        await refreshCurrentUser()
      }
      return { success: isSignedIn, nextStep, error: null, errorName: null }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      const name = err instanceof Error ? err.name : null
      return { success: false, error: message, errorName: name }
    }
  }

  async function logout() {
    await signOut()
    user.value = null
    isAuthenticated.value = false
  }

  // Pull the current ID/Access/refresh token set for API calls. 
  async function getTokens() {
    const session = await fetchAuthSession()
    return {
      idToken : session.tokens?.idToken?.toString() ?? null,
      accessToken : session.tokens?.accessToken?.toString() ?? null
    }
  }

  async function authFetch(url: string, options: RequestInit = {}) {
    const { idToken } = await getTokens()
    
    if (!idToken) {
      throw new Error('Not signed in - no token available for this request.')
    }

    const headerWithToken = {
      ...options.headers,
      Authorization: `Bearer ${idToken}`
    }

    return fetch(url, {
      ...options,
      headers: headerWithToken
    })
  }

  async function refreshCurrentUser(){
    try {
      const current = await getCurrentUser()
      user.value = {
        userId: current.userId,
        email: current.signInDetails?.loginId ?? ''
      }

      isAuthenticated.value = true
    } catch (error) {
      user.value = null
      isAuthenticated.value = false
    }
  }

  async function verifyEmail(email: string, code: string): Promise<AuthResult>{
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

  async function resendVerificationCode(email: string): Promise<AuthResult> {
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
    resendVerificationCode,
    register,
    login,
    logout,
    verifyEmail,
    authFetch,
    getTokens,
    refreshCurrentUser,
    isAuthenticated,
    user
  }
}
