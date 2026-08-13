import { Amplify } from 'aws-amplify'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    
    Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.public.cognitoUserPoolId as string,
        userPoolClientId: config.public.cognitoClientId as string,
        signUpVerificationMethod: 'code',
      },
    },
  })
})

