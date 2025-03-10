import { create } from 'zustand';

interface Notification {
  id: string;
  type: string;
  content: string;
  read: boolean;
  created_at: string;
  sender: {
    id: string;
    username: string;
    avatar: string;
  };
}

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, updates: Partial<Notification>) => void;
  markAllAsRead: () => void;
  setNotifications: (notifications: Notification[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set: any) => ({
  notifications: [],
  unreadCount: 0,

  addNotification: (notification: Notification) => 
    set((state: NotificationStore) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    })),

  updateNotification: (id: string, updates: Partial<Notification>) =>
    set((state: NotificationStore) => ({
      notifications: state.notifications.map((notif: Notification) =>
        notif.id === id ? { ...notif, ...updates } : notif
      ),
      unreadCount: updates.read 
        ? state.unreadCount - 1 
        : state.unreadCount
    })),

  markAllAsRead: () =>
    set((state: NotificationStore) => ({
      notifications: state.notifications.map((n: Notification) => ({ ...n, read: true })),
      unreadCount: 0
    })),

  setNotifications: (notifications: Notification[]) =>
    set({
      notifications,
      unreadCount: notifications.filter((n: Notification) => !n.read).length
    })
}));