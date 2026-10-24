import { AlertCircle, CheckCircle2, X } from 'lucide-react';

export default function Toast({ toasts, onDismiss }) {
  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-4 z-[100] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const Icon = isError ? AlertCircle : CheckCircle2;
        return (
          <div
            key={toast.id}
            className="glass-strong pointer-events-auto flex max-w-sm animate-slide-up items-center gap-2.5 px-4 py-3 text-sm font-medium"
          >
            <Icon size={18} className={isError ? 'text-rose-500' : 'text-emerald-500'} />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => onDismiss(toast.id)} aria-label="Cerrar aviso" className="opacity-50 hover:opacity-100">
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
