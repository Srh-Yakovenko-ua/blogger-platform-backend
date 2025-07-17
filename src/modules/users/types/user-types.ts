export type UserType = {
  id?: string;
  login: string;
  email: string;
  createdAt: string;
};

export type CreateUserDTO = { login: string; password: string; email: string };

export type UserDBType = {
  login: string;
  email: string;
  createdAt: string;
  passwordHash: string;
};

export type UserPaginationSearchesType = {
  searchLoginTerm: string | null;
  searchEmailTerm: string | null;
};
