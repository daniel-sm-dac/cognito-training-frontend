import { Amplify } from 'aws-amplify'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()

    console.log('🔥 CONFIG VALUES:', {
        userPoolId: config.public.cognitoUserPoolId,
        userPoolClientId: config.public.cognitoClientId,
        identityPoolId: config.public.cognitoIdentityPoolId,
    })
    
    Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: config.public.cognitoUserPoolId as string,
        userPoolClientId: config.public.cognitoClientId as string,
        identityPoolId: config.public.cognitoIdentityPoolId as string, // remove this line if unused
        signUpVerificationMethod: 'code',
      },
    },
  })
  console.log('🔥 AMPLIFY CONFIG RESULT:', Amplify.getConfig())
})

