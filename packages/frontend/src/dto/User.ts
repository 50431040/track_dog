export interface IUserInfoDTO {
  id: string;
  name: string;
  avatar?: string;
  isAdmin: boolean;
  email: string;
  token: string;
}

export interface IInitialUserParams {
  name: string;
  password: string;
  email: string;
}

export interface ILoginParams {
  name: string;
  password: string;
}
