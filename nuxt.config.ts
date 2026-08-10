// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      cognitoUserPoolId: process.env.COGNITO_USER_POOL_ID || 'FALLBACK-NOT-LOADED',
      cognitoClientId: process.env.COGNITO_USER_POOL_CLIENT_ID || '',
      cognitoIdentityPoolId: process.env.COGNITO_IDENTITY_POOL_ID || '',
      cognitoRegion: process.env.COGNITO_REGION || 'ap-southeast-1',
    },
  },
})
