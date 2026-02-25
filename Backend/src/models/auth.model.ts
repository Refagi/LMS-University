 export enum ValidationType {
  BODY = 'body',
  QUERY = 'query',
  PARAM = 'param',
  HEADER = 'header',
  JSON = 'json',
}

export interface LoginType {
  email: string;
  password: string;
}

export interface ActivateUserType extends LoginType {}

export interface ResetPasswordType {
  token: string;
  newPassword: string;
}