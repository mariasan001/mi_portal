// src/features/auth/pages/LoginPage.tsx
'use client';

import LoginForm from '../components/LoginForm';
import { useLoginFlow } from '../hook/useLoginFlow';

import s from './LoginPage.module.css';

export default function LoginPage() {
  const { username, setUsername, password, setPassword, loading, error, onSubmit } = useLoginFlow();

  return (
    <main className={s.page}>
      <LoginForm
        username={username}
        onUsernameChange={setUsername}
        password={password}
        onPasswordChange={setPassword}
        loading={loading}
        error={error}
        onSubmit={onSubmit}
      />
    </main>
  );
}