export type AuthModalSource = 'nav' | 'quick-access';
export type AuthModalView = 'login' | 'register' | 'forgot' | 'otp' | 'reset';

export type OpenAuthModalDetail = {
  source?: AuthModalSource;
  returnTo?: string | null;
  appCode?: string | null;
  initialView?: AuthModalView;
};

export type AuthModalState = {
  open: boolean;
  source: AuthModalSource;
  returnTo: string | null;
  appCode: string | null;
  initialView: AuthModalView;
};