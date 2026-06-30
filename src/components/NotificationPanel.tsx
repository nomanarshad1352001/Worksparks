import { Bell, CheckCircle2, Info, AlertTriangle, AlertCircle, Check, X, Trash2 } from 'lucide-react';
import type { Store } from '../store/useStore';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const dotColors = {
  success: 'bg-mint-500',
  error: 'bg-red-500',
  info: 'bg-ocean-500',
  warning: 'bg-spark-500',
};

interface Props {
  store: Store;
  open: boolean;
  onClose: () => void;
}

export default function NotificationPanel({ store, open, onClose }: Props) {
  if (!open) return null;
  const unread = store.notifications.filter(n => !n.read).length;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 overflow-hidden anim-fade-in-down">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-spark-500" />
            <h3 className="font-semibold text-slate-900">Notifications</h3>
            {unread > 0 && (
              <span className="px-2 py-0.5 bg-spark-100 text-spark-700 text-xs font-bold rounded-full">{unread}</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unread > 0 && (
              <button
                onClick={store.markAllNotificationsRead}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Mark all read"
              >
                <Check className="w-4 h-4" />
              </button>
            )}
            <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {store.notifications.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            store.notifications.map((n) => {
              const Icon = icons[n.type];
              return (
                <div
                  key={n.id}
                  className={`flex items-start gap-3 px-5 py-4 border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group ${!n.read ? 'bg-spark-50/30' : ''}`}
                  onClick={() => store.markNotificationRead(n.id)}
                >
                  <div className="relative mt-0.5">
                    <Icon className={`w-5 h-5 ${n.type === 'success' ? 'text-mint-500' : n.type === 'error' ? 'text-red-500' : n.type === 'warning' ? 'text-spark-500' : 'text-ocean-500'}`} />
                    {!n.read && <div className={`absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full ${dotColors[n.type]}`} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${!n.read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>{n.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-xs text-slate-400 mt-1">{n.time}</p>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); store.deleteNotification(n.id); }}
                    className="p-1 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
