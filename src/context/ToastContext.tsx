import React, { createContext, useContext, useState, useCallback, ReactNode, useRef } from 'react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastConfig {
  id: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

interface ToastContextType {
  toast: ToastConfig | null;
  showToast: (message: string, type?: ToastType, duration?: number) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<ToastConfig | null>(null);
  const timerRef = useRef<any>(null);

  const hideToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'success', duration = 3200) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      const id = Date.now().toString();
      setToast({ id, message, type, duration });

      timerRef.current = setTimeout(() => {
        setToast((current) => (current?.id === id ? null : current));
      }, duration);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ toast, showToast, hideToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextType {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
