import { useState } from 'react';
import { signInWithGoogle } from '../services/authService';

export default function LoginPage() {
  const [error, setError] = useState('');

  async function handleLogin() {
    setError('');
    try {
      await signInWithGoogle();
    } catch (e) {
      const code = e instanceof Error ? (e as { code?: string }).code : '';
      if (code !== 'auth/popup-closed-by-user') {
        setError('로그인에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f0' }}>
      <div style={{ textAlign: 'center', padding: '48px 32px' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, marginBottom: 8 }}>메모장</h1>
        <p style={{ color: '#888', marginBottom: 32 }}>아이디어를 기록하고 공유하세요</p>
        <button
          onClick={handleLogin}
          style={{ padding: '12px 24px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 10, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
        >
          Google로 계속하기
        </button>
        {error && <p style={{ color: '#e05252', marginTop: 16, fontSize: 13 }}>{error}</p>}
      </div>
    </div>
  );
}
