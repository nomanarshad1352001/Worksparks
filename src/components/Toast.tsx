import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { Store } from '../store/useStore';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const colors = {
  success: 'bg-mint-50 border-mint-200 text-mint-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-ocean-50 border-ocean-200 text-ocean-800',
  warning: 'bg-spark-50 border-spark-200 text-spark-800',
};

const iconColors = {
  success: 'text-mint-500',
  error: 'text-red-500',
  info: 'text-ocean-500',
  warning: 'text-spark-500',
};

export default function ToastContainer({ store }: { store: Store }) {
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
      {store.toasts.map((toast) => {
        const type = (toast.type as keyof typeof icons) || 'info';
        const Icon = icons[type];
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl border shadow-xl min-w-[320px] max-w-[420px] ${colors[type]} ${toast.exiting ? 'anim-toast-out' : 'anim-toast-in'}`}
          >
            <Icon className={`w-5 h-5 flex-shrink-0 ${iconColors[type]}`} />
            <p className="text-sm font-medium flex-1">{toast.message}</p>
            <button
              onClick={() => store.removeToast(toast.id)}
              className="p-1 hover:bg-black/5 rounded-lg transition-colors flex-shrink-0"
            >
              <X className="w-4 h-4 opacity-60" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
