import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ToastState { message: string; id: number; }
interface ToastContextType { showToast: (message: string) => void; }

export const ToastContext = createContext<ToastContextType>({ showToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = useCallback((message: string) => {
    const id = Date.now();
    setToast({ message, id });
    setTimeout(() => setToast(t => t?.id === id ? null : t), 2500);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && <div className="toast" key={toast.id}>{toast.message}</div>}
    </ToastContext.Provider>
  );
}
