export interface ICognitoAuthResponse {
  accessToken: string,
  error: string,
  errorCode: string,
  token: string,
}

export interface ICognitoCreateUserResponse {
  error: string,
  errorCode: string,
  cognitoUserId: string,
}

export interface ICognitoResendCodeResponse {
  error: string,
  errorCode: string,
}

export interface ICognitoChangePasswordResponse {
  error: string,
  errorCode: string,
}

export interface ICognitoChangeUsernameResponse {
  error: string,
  errorCode: string,
}

export interface ICognitoForgotPasswordResponse {
  error: string,
  errorCode: string,
}

export interface ICognitoConfirmForgotPasswordResponse {
  error: string,
  errorCode: string,
}

export interface ICognitoConfirmSignUpResponse {
  error: string,
  errorCode: string,
}

export interface ICognitoDeleteUserResponse {
  error: string,
  errorCode: string,
}

export interface ICognitoSetPasswordResponse {
  error: string,
  cognitoUserId: string,
}

export interface ICognitoChangeStatusResponse {
  error: string,
  cognitoUserId: string,
}

export interface ICognitoFindUserResponse {
  error: string,
  found: boolean,
  cognitoUserId: string,
  userStatus: string,
  username: string,
  walletAddress: string,
}

export interface ICognitoUpdateAttribute {
  success: boolean,
  message: string
}
