export type LoginResponse = {
  success: boolean;
  token?: string;
  message?: string;
};

export interface Api {
  login: (username: string, password: string) => Promise<LoginResponse>;
}
