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
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">메모장</h1>
        <p className="login-subtitle">아이디어를 기록하고 공유하세요</p>
        <button className="google-btn" onClick={handleLogin}>
          Google로 계속하기
        </button>
        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
}
