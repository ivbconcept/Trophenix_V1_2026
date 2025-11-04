import { useState, useEffect, useRef } from 'react';
import { Bell, Check, X, Briefcase, MessageCircle, Heart, UserPlus, Trophy, Clock, CheckCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { notificationService, Notification as NotificationData } from '../../services/notificationService';

interface Notification extends Omit<NotificationData, 'created_at'> {
  time: string;
}

export function NotificationsDropdown() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const getMockNotifications = (): Notification[] => [
    {
      id: '1',
      user_id: user?.id || '',
      type: 'job',
      title: 'Nouvelle offre disponible',
      description: 'Nike recrute un Business Developer - CDI à Paris',
      time: 'Il y a 5 min',
      read: false,
    },
    {
      id: '2',
      user_id: user?.id || '',
      type: 'message',
      title: 'Nouveau message',
      description: 'Accor Hotels vous a envoyé un message',
      time: 'Il y a 15 min',
      read: false,
    },
    {
      id: '3',
      user_id: user?.id || '',
      type: 'connection',
      title: 'Nouvelle connexion',
      description: 'Sophie Martin a accepté votre invitation',
      time: 'Il y a 1h',
      read: false,
    },
    {
      id: '4',
      user_id: user?.id || '',
      type: 'like',
      title: 'Profil consulté',
      description: '3 entreprises ont consulté votre profil',
      time: 'Il y a 2h',
      read: true,
    },
    {
      id: '5',
      user_id: user?.id || '',
      type: 'achievement',
      title: 'Badge débloqué',
      description: 'Vous avez obtenu le badge "Profil Complet"',
      time: 'Il y a 3h',
      read: true,
    },
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.id) {
      loadNotifications();

      const channel = notificationService.subscribeToNotifications(user.id, () => {
        loadNotifications();
      });

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user?.id]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const loadNotifications = async () => {
    if (!user?.id) return;

    setLoading(true);
    const data = await notificationService.getNotifications(user.id);

    const formatted = data.length > 0
      ? data.map(n => ({
          ...n,
          time: formatTime(n.created_at),
          action_url: n.action_url
        }))
      : getMockNotifications();

    setNotifications(formatted);
    setLoading(false);
  };

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    return created.toLocaleDateString('fr-FR');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'job':
        return { Icon: Briefcase, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' };
      case 'message':
        return { Icon: MessageCircle, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-50 dark:bg-green-900/20' };
      case 'like':
        return { Icon: Heart, color: 'text-pink-600 dark:text-pink-400', bg: 'bg-pink-50 dark:bg-pink-900/20' };
      case 'connection':
        return { Icon: UserPlus, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-900/20' };
      case 'achievement':
        return { Icon: Trophy, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-50 dark:bg-yellow-900/20' };
      default:
        return { Icon: Bell, color: 'text-slate-600 dark:text-zinc-400', bg: 'bg-slate-50 dark:bg-zinc-800' };
    }
  };

  const markAsRead = async (id: string) => {
    const success = await notificationService.markAsRead(id);
    if (success) {
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      ));
    }
  };

  const markAllAsRead = async () => {
    if (!user?.id) return;

    const success = await notificationService.markAllAsRead(user.id);
    if (success) {
      setNotifications(notifications.map(n => ({ ...n, read: true })));
    }
  };

  const deleteNotification = async (id: string) => {
    const success = await notificationService.deleteNotification(id);
    if (success) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 md:p-2.5 bg-slate-50 dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl transition-all hover:shadow-sm group"
      >
        <Bell className="w-5 h-5 md:w-6 md:h-6 text-slate-600 dark:text-zinc-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors" strokeWidth={1.5} />
        {unreadCount > 0 && (
          <>
            <span className="absolute top-1 right-1 md:top-1.5 md:right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-4 border-b border-slate-200 dark:border-zinc-800 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-zinc-800 dark:to-zinc-900">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Tout marquer lu
                </button>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-zinc-400">
              {unreadCount > 0
                ? `Vous avez ${unreadCount} nouvelle${unreadCount > 1 ? 's' : ''} notification${unreadCount > 1 ? 's' : ''}`
                : 'Aucune nouvelle notification'
              }
            </p>
          </div>

          <div className="max-h-[480px] overflow-y-auto">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-200 dark:divide-zinc-800">
                {notifications.map((notification) => {
                  const { Icon, color, bg } = getNotificationIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors cursor-pointer group ${
                        !notification.read ? 'bg-blue-50/30 dark:bg-blue-900/5' : ''
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex gap-3">
                        <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5`}>
                          <Icon className={`w-5 h-5 ${color}`} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h4 className={`text-sm font-semibold ${
                              !notification.read
                                ? 'text-slate-900 dark:text-white'
                                : 'text-slate-700 dark:text-zinc-300'
                            }`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5"></div>
                            )}
                          </div>

                          <p className="text-sm text-slate-600 dark:text-zinc-400 mb-2 line-clamp-2">
                            {notification.description}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-500">
                              <Clock className="w-3.5 h-3.5" />
                              {notification.time}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    markAsRead(notification.id);
                                  }}
                                  className="p-1 hover:bg-slate-200 dark:hover:bg-zinc-700 rounded transition-colors"
                                  title="Marquer comme lu"
                                >
                                  <Check className="w-4 h-4 text-slate-600 dark:text-zinc-400" />
                                </button>
                              )}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteNotification(notification.id);
                                }}
                                className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                                title="Supprimer"
                              >
                                <X className="w-4 h-4 text-red-600 dark:text-red-400" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-slate-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Bell className="w-8 h-8 text-slate-400 dark:text-zinc-500" />
                </div>
                <p className="text-slate-600 dark:text-zinc-400 font-medium mb-1">
                  Aucune notification
                </p>
                <p className="text-sm text-slate-500 dark:text-zinc-500">
                  Vous êtes à jour!
                </p>
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900/50">
              <button className="w-full py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                Voir toutes les notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
