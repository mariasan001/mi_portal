// src/app/admin/test-register/page.tsx
'use client';

import { useMemo, useState } from 'react';
import { API_RUTAS } from '@/lib/api/api.rutas';
import { api } from '@/lib/api/api.cliente';
import { toErrorMessage } from '@/lib/api/api.errores';

type RegisterPayload = {
  claveSp: string;
  plaza: string;
  puesto: string;
  email: string;
  password: string;
  phone: string;
};

type RegisterResponse = {
  userId: number;
  username: string;
  status: string;
  message?: string;
};

function isNonEmpty(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

function validate(p: RegisterPayload): string | null {
  if (!isNonEmpty(p.claveSp)) return 'Falta claveSp';
  if (!isNonEmpty(p.plaza)) return 'Falta plaza';
  if (!isNonEmpty(p.puesto)) return 'Falta puesto';
  if (!isNonEmpty(p.email)) return 'Falta email';
  if (!isNonEmpty(p.password)) return 'Falta password';
  if (!isNonEmpty(p.phone)) return 'Falta phone';
  return null;
}

export default function TestRegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({
    claveSp: '210048332',
    plaza: '234000000002125',
    puesto: 'ANALISTA ESPECIALIZADO B',
    email: 'hector.talavera@edomex.gob.mx',
    password: 'MiPassword#2026',
    phone: '7221234567',
  });

  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState<RegisterResponse | null>(null);
  const [raw, setRaw] = useState<string>('');

  const pretty = useMemo(() => (ok ? JSON.stringify(ok, null, 2) : ''), [ok]);

  async function onSubmit() {
    setError(null);
    setOk(null);
    setRaw('');

    const v = validate(form);
    if (v) {
      setError(v);
      return;
    }

    setBusy(true);
    try {
      // ✅ Llama a tu BFF interno (Next): /api/auth/register
      const res = await api.post<RegisterResponse>(API_RUTAS.auth.register, form);
      setOk(res);
      setRaw(JSON.stringify(res));
    } catch (e) {
      setError(toErrorMessage(e, 'No se pudo registrar'));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ maxWidth: 720, margin: '40px auto', padding: 16, fontFamily: 'system-ui' }}>
      <h1 style={{ margin: 0 }}>Test Register (BFF)</h1>
      <p style={{ opacity: 0.75, marginTop: 8 }}>
        Endpoint: <code>{API_RUTAS.auth.register}</code>
      </p>

      {error && (
        <div style={{ padding: 12, border: '1px solid #f3b4b4', background: '#fff5f5', borderRadius: 10 }}>
          <b>Error:</b> {error}
        </div>
      )}

      {ok && (
        <div style={{ padding: 12, border: '1px solid #b7f0c2', background: '#f3fff6', borderRadius: 10 }}>
          <b>OK:</b> Registro exitoso
          <pre style={{ marginTop: 10, overflow: 'auto' }}>{pretty}</pre>
        </div>
      )}

      <div style={{ display: 'grid', gap: 10, marginTop: 14 }}>
        <Field label="claveSp" value={form.claveSp} onChange={(v) => setForm((p) => ({ ...p, claveSp: v }))} />
        <Field label="plaza" value={form.plaza} onChange={(v) => setForm((p) => ({ ...p, plaza: v }))} />
        <Field label="puesto" value={form.puesto} onChange={(v) => setForm((p) => ({ ...p, puesto: v }))} />
        <Field label="email" value={form.email} onChange={(v) => setForm((p) => ({ ...p, email: v }))} />
        <Field
          label="password"
          value={form.password}
          type="password"
          onChange={(v) => setForm((p) => ({ ...p, password: v }))}
        />
        <Field label="phone" value={form.phone} onChange={(v) => setForm((p) => ({ ...p, phone: v }))} />

        <button
          onClick={onSubmit}
          disabled={busy}
          style={{
            padding: '12px 14px',
            borderRadius: 12,
            border: '1px solid #ddd',
            cursor: busy ? 'not-allowed' : 'pointer',
            fontWeight: 700,
          }}
        >
          {busy ? 'Registrando…' : 'Probar registro'}
        </button>

        {!!raw && (
          <div style={{ opacity: 0.8 }}>
            <small>Raw:</small>
            <pre style={{ overflow: 'auto' }}>{raw}</pre>
          </div>
        )}
      </div>

      <p style={{ marginTop: 18, opacity: 0.7 }}>
        Tip: si te da <b>404</b>, tu ruta Next no existe. Debe ser:
        <code style={{ marginLeft: 6 }}>src/app/api/auth/register/route.ts</code>
      </p>
    </div>
  );
}

function Field(props: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <label style={{ display: 'grid', gap: 6 }}>
      <span style={{ fontSize: 12, opacity: 0.75 }}>{props.label}</span>
      <input
        value={props.value}
        type={props.type ?? 'text'}
        onChange={(e) => props.onChange(e.target.value)}
        style={{
          padding: '10px 12px',
          borderRadius: 12,
          border: '1px solid #ddd',
          outline: 'none',
        }}
      />
    </label>
  );
}