import { Nullable } from '../../../shared/types/nullable';

export type UserType = {
  id?: string;
  login: string;
  email: string;
  createdAt: string;
};

export type CreateUserDTO = { login: string; password: string; email: string };

type EmailConfirmationType = {
  confirmationCode: string;
  expirationDate: Date;
  isConfirmed: boolean;
};
type RecoveryPasswordType = {
  recoveryCode: string;
  expirationDate: Date;
  isRecovery: boolean;
};
export type UserDBType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
  currentRefreshToken: string | null;
  emailConfirmation: Nullable<EmailConfirmationType>;
  recoveryPassword: Nullable<RecoveryPasswordType>;
};

export type UserPaginationSearchesType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};
