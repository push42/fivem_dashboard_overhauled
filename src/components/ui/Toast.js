import { clsx } from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const Toast = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleToast = event => {
      const { type, message, duration = 5000 } = event.detail;
      const id = Date.now() + Math.random();

      setToasts(prev => [...prev, { id, type, message, duration }]);

      setTimeout(() => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
      }, duration);
    };

    window.addEventListener('toast', handleToast);
    return () => window.removeEventListener('toast', handleToast);
  }, []);

  const removeToast = id => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const getIcon = type => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'error':
        return <AlertCircle className="w-5 h-5" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'info':
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getStyles = type => {
    switch (type) {
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'error':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'info':
      default:
        return 'bg-blue-50 text-blue-800 border-blue-200';
    }
  };

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={clsx(
            'flex items-center p-4 rounded-lg border shadow-lg max-w-sm toast-enter',
            getStyles(toast.type)
          )}
        >
          <div className="flex-shrink-0 mr-3">{getIcon(toast.type)}</div>
          <p className="flex-1 text-sm font-medium">{toast.message}</p>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-3 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

// Helper function to trigger toasts
export const showToast = (type, message, duration) => {
  window.dispatchEvent(
    new CustomEvent('toast', {
      detail: { type, message, duration },
    })
  );
};

export default Toast;
