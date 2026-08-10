import { Amplify } from 'aws-amplify'
import { defineNuxtPlugin, useRuntimeConfig } from 'nuxt/app'

// const authConfig = {
//   Cognito: {
//     userPoolId: 'ap-southeast-1_Ln45WX58a',
//     userPoolClientId: '24m0c8so19lu71q1dscstrnae9',
//     identityPoolId: 'ap-southeast-1:1056eb60-4765-48dc-9dba-9d09186ffe56',
//     loginWith: {
//       email: true,
//     },
//   },
// }

// export default defineNuxtPlugin(() => {
//   const outputConfig = (outputs ?? {}) as Record<string, unknown>

//   Amplify.configure({
//     ...outputConfig,
//     Auth: {
//       ...(typeof outputConfig.Auth === 'object' && outputConfig.Auth ? outputConfig.Auth : {}),
//       ...authConfig,
//     },
//   } as any)
// })

// export default defineNuxtPlugin(() => {
//   Amplify.configure(outputs as any)
// })

export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig()
    // console.log('runtime config:', config.public)
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
    // console.log('🔥 PLUGIN TEST — IF YOU SEE THIS, PLUGINS WORK')
})

