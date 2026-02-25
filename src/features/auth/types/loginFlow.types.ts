export type UseLoginFlowResult = {
  username: string;
  setUsername: (v: string) => void;

  password: string;
  setPassword: (v: string) => void;

  effectiveAppCode: string;
  returnTo: string;

  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;

  loading: boolean;
  error: string | null;
};