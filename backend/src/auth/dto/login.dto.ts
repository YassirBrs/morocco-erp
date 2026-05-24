export class LoginDto {
  email!: string;
  password!: string;
  twoFactorCode?: string;
  ip?: string;
  userAgent?: string;
}
