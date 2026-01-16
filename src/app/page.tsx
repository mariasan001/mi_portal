import Link from 'next/link';

export default function Home() {
  return (
    <div style={{ padding: 30 }}>
      <h1>Portal público</h1>
      <p>Esta es la parte informativa. El admin vive en /admin.</p>
      <Link href="/login">Ir a login</Link>
    </div>
  );
}
