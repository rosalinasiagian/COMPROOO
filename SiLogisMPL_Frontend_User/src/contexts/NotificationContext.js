import React, { createContext, useState, useContext, useEffect } from 'react';
import { api } from '../lib/api';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('mpl_token');
      if (!token) {
        setNotifications([]);
        setLoading(false);
        return;
      }
      const response = await api.get('/user/notifikasi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const resData = response.data?.data || response.data;
      if (Array.isArray(resData)) {
        const uniqueNotifs = resData.filter((v, i, a) => {
          if (!v?.id) return true;
          return a.findIndex(t => t.id === v.id) === i;
        }).sort((a, b) => (b.id || 0) - (a.id || 0));
        setNotifications(uniqueNotifs);
      } else if (resData && typeof resData === 'object') {
        setNotifications([resData]);
      } else {
        setNotifications([]);
      }
    } catch (err) {
      console.error("Gagal menjemput data notifikasi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter(n => !n.sudahDibaca).length;

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('mpl_token');
      if (token) {
        await api.patch('/user/notifikasi/read', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setNotifications(notifications.map(n => ({ ...n, sudahDibaca: true })));
    } catch (err) {
      console.error("Gagal menandai notifikasi dibaca:", err);
    }
  };

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAllAsRead, fetchNotifications, loading }}>
      {children}
    </NotificationContext.Provider>
  );
};
