import crypto from "crypto";

export const getCognitoSecretHash = (username, cognitoClientSecret, cognitoClientId) => {
  return crypto.createHmac('sha256', cognitoClientSecret)
    .update(username + cognitoClientId)
    .digest('base64');
};
