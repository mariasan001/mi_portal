export type SesionMe = {
  userId: number;
  username: string;
  email: string;
  spid: string | null;
  status: string;
  roles?: string[];
};