export type User = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export type UserRegisterDto = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export type UserLoginDto = {
  email: string;
  password: string;
}

export type AuthenticatedUserDto = {
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  expirationDate: Date;
}

export type UserList = {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}