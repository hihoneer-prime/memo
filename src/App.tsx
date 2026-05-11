import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { ToastProvider } from './contexts/ToastContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SharedMemoPage from './pages/SharedMemoPage';

export default function App() {
  const user = useAuth();

  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/share/:id" element={<SharedMemoPage />} />
          <Route path="*" element={
            user === undefined
              ? <div className="loading-screen"><span>로딩 중...</span></div>
              : user ? <HomePage user={user} /> : <LoginPage />
          } />
        </Routes>
      </BrowserRouter>
    </ToastProvider>
  );
}
