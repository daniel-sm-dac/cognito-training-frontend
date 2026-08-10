import { defineAuth, referenceAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
// export const auth = defineAuth({
//   loginWith: {
//     email: true,
//   },
// });

export const AWS_AUTH = referenceAuth({
  userPoolId: 'ap-southeast-1_Ln45WX58a',
  identityPoolId: 'ap-southeast-1:1056eb60-4765-48dc-9dba-9d09186ffe56',
  authRoleArn: 'arn:aws:iam::710318463284:role/dac-uag2-lambda-execution-role-develop',
  unauthRoleArn: 'arn:aws:iam::710318463284:role/smdac-fb-ops-dash-backend-dev-CognitoAuthorizedRole-DbEwkwM9jOS4',
  userPoolClientId: '24m0c8so19lu71q1dscstrnae9',
});
