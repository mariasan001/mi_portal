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

export type SesionMe = {
  userId: number;
  username: string;
  email: string;
  spid: string | null;
  status: string;
};
