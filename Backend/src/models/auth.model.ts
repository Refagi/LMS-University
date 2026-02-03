export interface LoginBody {
  username: string;
  password: string;
  captcha: string;
  csrfToken: string;
  hiddenFieldName: string;
  hiddenFieldValue: string;
  rememberMe: boolean;
}

export interface ChangePasswordBody {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface SaveCookiesBody {
  username: string;
  password: string
}

export interface SaveCookiesBodyAlt
  extends Omit<SaveCookiesBody, 'username' | 'password'> {
  user: string;
  password?: string;
}
