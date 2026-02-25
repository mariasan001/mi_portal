export type LoginRequest = {
  username: string;
  password: string;
  appCode: string;
};

export type LoginResponse = {
  message: string;
  userId: number;
  username: string;
};