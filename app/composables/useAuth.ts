import { confirmSignUp, fetchAuthSession, getCurrentUser, resendSignUpCode, signIn, signOut, signUp, type SignUpInput } from 'aws-amplify/auth'

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
  ssoSessionCreated?: boolean
}

interface TokenSet {
  id_token: string
  access_token: string
  // refresh_token: string
}

const TOKENS_STORAGE_KEY = 'auth-tokens'

export function useAuth() {
  // Shared reactive state across every component that calls useAuth()
  const user = useState<{ userId: string; email: string } | null>('auth-user', () => null)
  const isAuthenticated = useState<boolean>('auth-is-authenticated', () => false)
  const tokens = useState<TokenSet | null>('auth-tokens', () => null)
  const router = useRouter()

  // Creates a new Cognito user via Amplify signUp — no session/token involved yet
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

  // Authenticates with Cognito via Amplify, then creates the SSO session on success
  async function login(email: string, password: string): Promise<AuthResult> {
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password })
      let ssoSessionCreated = false
      if (isSignedIn) {
        // await restoreSession()
        ssoSessionCreated = await createSsoSession()
      }
      return { success: isSignedIn, nextStep, error: null, errorName: null, ssoSessionCreated }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed'
      const name = err instanceof Error ? err.name : null
      return { success: false, error: message, errorName: name }
    }
  }

  // Signs out of Amplify and clears all local/persisted session state
  async function logout() {
    await signOut()
    user.value = null
    isAuthenticated.value = false
    tokens.value = null
    clearPersistedTokens()
  }

  // writes the session to DynamoDB right after Amplify's signIn() succeeds, and mirrors it into local state
  async function createSsoSession(): Promise<boolean> {
    try {
      const session = await fetchAuthSession()
      const id_token = session.tokens?.idToken?.toString()
      const access_token = session.tokens?.accessToken?.toString()

      console.log("CREATED SESSION: ", session)
      if (!id_token || !access_token) return false
      
      const decoded = decodeUserFromIdToken(id_token)
      if (!decoded) return false

      user.value = decoded
      isAuthenticated.value = true

      const response = await fetch('https://8p7gwoln99.execute-api.ap-southeast-1.amazonaws.com/dev/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: user.value?.userId,
          id_token,
          access_token,
          registration_channel: 'test-app-one',
        }),
      })

      if (!response.ok) {
        console.error('SSO session creation failed', await response.text())
        return false
      }

      tokens.value = { id_token, access_token }
      persistTokens(tokens.value)
      return true
    } catch (error) {
      console.error('Failed to create SSO session', error)
      return false
    }
  }

  // called on test-app-two callback route when the user arrives via an SSO redirect (todo functionality)
  async function handleSsoCallback(userId: string) {
    const response = await fetch(`https://8p7gwoln99.execute-api.ap-southeast-1.amazonaws.com/dev/session/${userId}`)

    if (!response.ok) {
      router.push('/login')
      return
    }

    const { id_token, access_token } = await response.json()

    tokens.value = { id_token, access_token }
    user.value = { userId, email: '' } // email not returned by /session — fine as a placeholder, or extend the endpoint to include it
    isAuthenticated.value = true
    persistTokens(tokens.value)

    router.push('/dashboard')
  }

  // Returns the current token set for API calls — prefers Amplify's live session, falls back to our own stored session
  async function getTokens() {
    //  Try Amplify's live session first — only exists if signIn() ran on this app (login)
    const session = await fetchAuthSession()
    const idToken = session.tokens?.idToken?.toString() ?? null
    const accessToken = session.tokens?.accessToken?.toString() ?? null
    if (idToken) {
      return { idToken, accessToken }
    }

    // Fall back to our own stored session — populated via SSO callback or restored from localStorage on reload
    return {
      idToken: tokens.value?.id_token ?? null,
      accessToken: tokens.value?.access_token ?? null,
    }
  }

  // Wraps fetch(), attaching the current access token as a Bearer header
  async function authFetch(url: string, options: RequestInit = {}) {
    const { idToken } = await getTokens()
    if (!idToken) throw new Error('Not signed in - no token available for this request.')

    const finalHeaders = {
      ...options.headers,
      Authorization: `Bearer ${idToken}`
    }

    return fetch(url, { ...options, headers: finalHeaders })
  }

  // Checks Amplify directly for a live session and populates user/isAuthenticated from it — used as a fallback in route middleware
  async function restoreSession(){
    try {
      const current = await getCurrentUser()
      user.value = {
        userId: current.userId,
        email: current.signInDetails?.loginId ?? ''
      }

      isAuthenticated.value = true
    } catch (error) {
      isAuthenticated.value = false
    }
  }

  // Confirms a new user's signup with the verification code they received
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

  // Requests a new signup verification code be sent
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

  // Saves the token set to localStorage so it survives a reload/tab close
  function persistTokens(token: TokenSet) {
    localStorage.setItem(TOKENS_STORAGE_KEY, JSON.stringify(token))
  }

  // Reads the persisted token set back from localStorage, if any
  function loadPersistedTokens(): TokenSet | null {
    const raw = localStorage.getItem(TOKENS_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  }

  // Removes the persisted token set from localStorage
  function clearPersistedTokens() {
    localStorage.removeItem(TOKENS_STORAGE_KEY)
  }

  // Decodes a JWT's payload (no signature check) to see if its exp claim has passed
  function isTokenExpired(token: string): boolean {
    try {
      const payload_split = token.split('.')[1]
      if (!payload_split) return true
      
      const payload = JSON.parse(atob(payload_split))
      return Date.now() >= payload.exp * 1000
    } catch {
      return true // unreadable token — treat as expired, safer default
    }
  }

  // Decodes a JWT's payload to pull out the user's id and email, without a network call
  function decodeUserFromIdToken(idToken: string): { userId: string; email: string } | null {
    try {
      const payload_part = idToken.split('.')[1]
      if (!payload_part) return null

      const payload = JSON.parse(atob(payload_part))
      // console.log("idToken: >>>>>", idToken)
      // console.log("payload: >>>>>", payload)
      return { userId: payload.sub, email: payload.email ?? '' }
    } catch {
      return null
    }
  }

  // Rebuilds session state from localStorage on app boot — the main recovery path after a reload
  async function restorePersistedSession() {
    const stored = loadPersistedTokens()
    // console.log("STORED: ", stored)
    if (!stored || isTokenExpired(stored.id_token)) {
      console.log("no stored token: ", stored)
      clearPersistedTokens()
      isAuthenticated.value = false
      return
    }
    console.log("stored not expired: ", stored)
    tokens.value = stored
    user.value = decodeUserFromIdToken(stored.id_token)
    isAuthenticated.value = true
  }


  return {
    resendVerificationCode,
    register,
    login,
    logout,
    verifyEmail,
    authFetch,
    getTokens,
    restoreSession,
    handleSsoCallback,
    restorePersistedSession,
    isAuthenticated,
    user,
    tokens
  }
}