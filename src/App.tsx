import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';

export default function App() {
  const user = useAuth();

  if (user === undefined) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <span>로딩 중...</span>
      </div>
    );
  }

  return user ? <HomePage user={user} /> : <LoginPage />;
}
