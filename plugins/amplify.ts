import { Amplify } from 'aws-amplify'
import outputs from '../amplify_outputs.json'
import { defineNuxtPlugin } from 'nuxt/app'
import { AWS_AUTH } from '../amplify/auth/resource'

const authConfig = {
  Cognito: {
    userPoolId: 'ap-southeast-1_Ln45WX58a',
    userPoolClientId: '24m0c8so19lu71q1dscstrnae9',
    identityPoolId: 'ap-southeast-1:1056eb60-4765-48dc-9dba-9d09186ffe56',
    loginWith: {
      email: true,
    },
  },
}

export default defineNuxtPlugin(() => {
  const outputConfig = (outputs ?? {}) as Record<string, unknown>

  Amplify.configure({
    ...outputConfig,
    Auth: {
      ...(typeof outputConfig.Auth === 'object' && outputConfig.Auth ? outputConfig.Auth : {}),
      ...authConfig,
    },
  } as any)
})

// export default defineNuxtPlugin(() => {
//   Amplify.configure(outputs as any)
// })

// export default defineNuxtPlugin(() => {
//     Amplify.configure(AWS_AUTH as any)
// })
