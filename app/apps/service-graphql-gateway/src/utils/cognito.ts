import * as aws from "aws-sdk";
import {CognitoIdentityServiceProvider} from "aws-sdk";

let cognitoClient: CognitoIdentityServiceProvider;

export interface GetCognitoClientInput {
  accessKey: string
  secretAccessKey: string

  cognitoPoolId: string
  cognitoRegion: string
  cognitoClientId: string
  cognitoClientSecret: string

  // Cognito custom fields
  cognitoFieldWallet: string
}
export const getCognitoClient = (input: GetCognitoClientInput, instance: CognitoIdentityServiceProvider = cognitoClient): CognitoIdentityServiceProvider => {
  if (instance) {
    return instance;
  }

  aws.config.update({
    cognitoidentity: {
      credentials: {
        accessKeyId: input.accessKey,
        secretAccessKey: input.secretAccessKey,
      },
    },
    region: input.cognitoRegion,
  });

  const CognitoIdentityServiceProvider = aws.CognitoIdentityServiceProvider;
  cognitoClient =  new CognitoIdentityServiceProvider({apiVersion: '2016-04-19'});
  return cognitoClient;
};

export const getCognitoTmpAccount = (wallet: string): string => {
  return `${wallet}-tmp@starbots.net`;
};
