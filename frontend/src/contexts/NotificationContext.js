import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [socket] = useState(null); // Pour future intégration Socket.io

  // Charger les notifications depuis le localStorage au démarrage
  useEffect(() => {
    if (isAuthenticated && user) {
      const savedNotifications = localStorage.getItem(`notifications_${user._id}`);
      if (savedNotifications) {
        try {
          const parsed = JSON.parse(savedNotifications);
          setNotifications(parsed);
          setUnreadCount(parsed.filter(n => !n.read).length);
        } catch (error) {
          console.error('Erreur lors du chargement des notifications:', error);
        }
      }
    }
  }, [isAuthenticated, user]);

  // Sauvegarder les notifications dans le localStorage
  useEffect(() => {
    if (isAuthenticated && user && notifications.length > 0) {
      localStorage.setItem(`notifications_${user._id}`, JSON.stringify(notifications));
    }
  }, [notifications, isAuthenticated, user]);

  // Ajouter une nouvelle notification
  const addNotification = useCallback((notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification
    };

    setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Garder max 50 notifications
    setUnreadCount(prev => prev + 1);

    // Afficher une notification navigateur si supporté
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Expérience Tech', {
        body: notification.message,
        icon: '/images/logo.png',
        badge: '/images/logo.png',
        tag: newNotification.id
      });
    }

    // Jouer un son de notification (optionnel)
    playNotificationSound();
  }, []);

  // Marquer une notification comme lue
  const markAsRead = useCallback((notificationId) => {
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  }, []);

  // Marquer toutes les notifications comme lues
  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  }, []);

  // Supprimer une notification
  const deleteNotification = useCallback((notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(c => Math.max(0, c - 1));
      }
      return prev.filter(n => n.id !== notificationId);
    });
  }, []);

  // Supprimer toutes les notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
    setUnreadCount(0);
    if (isAuthenticated && user) {
      localStorage.removeItem(`notifications_${user._id}`);
    }
  }, [isAuthenticated, user]);

  // Jouer un son de notification
  const playNotificationSound = () => {
    try {
      const audio = new Audio('/notification-sound.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignorer les erreurs de lecture (notamment si l'utilisateur n'a pas interagi avec la page)
      });
    } catch (error) {
      // Ignorer les erreurs
    }
  };

  // Demander la permission pour les notifications
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
  }, []);

  // Simuler quelques notifications de test (à retirer en production)
  useEffect(() => {
    if (isAuthenticated && notifications.length === 0) {
      // Ajouter une notification de bienvenue
      setTimeout(() => {
        addNotification({
          type: 'info',
          title: 'Bienvenue !',
          message: 'Bienvenue sur Expérience Tech. Explorez nos services et formations.'
        });
      }, 2000);
    }
  }, [isAuthenticated, notifications.length, addNotification]);

  const value = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    requestNotificationPermission,
    socket
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

